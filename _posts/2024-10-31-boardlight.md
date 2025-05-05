---
title: "Boardlight"
date: 2024-10-31
categories: HTB
tags: ["ctf", "boardlight", "penetration testing", "htb", "cybersecurity", "htb writeup", "htb walkthrough", "hackthebox", "writeup"]
---

## Credentials
| Username      | Password          | Hash | Source           |
| ------------- | ----------------- | ---- | ---------------- |
| dolibarrowner | serverfun2$2023!! |      | dolibarr main db |

## Enumeration

>  Brute forcing subdomains reveals crm.board.htb which is running Dolibarr 17.0.0.

### Nmap

```sh
PORT   STATE SERVICE REASON         VERSION
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 8.2p1 Ubuntu 4ubuntu0.11 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 06:2d:3b:85:10:59:ff:73:66:27:7f:0e:ae:03:ea:f4 (RSA)
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDH0dV4gtJNo8ixEEBDxhUId6Pc/8iNLX16+zpUCIgmxxl5TivDMLg2JvXorp4F2r8ci44CESUlnMHRSYNtlLttiIZHpTML7ktFHbNexvOAJqE1lIlQlGjWBU1hWq6Y6n1tuUANOd5U+Yc0/h53gKu5nXTQTy1c9CLbQfaYvFjnzrR3NQ6Hw7ih5u3mEjJngP+Sq+dpzUcnFe1BekvBPrxdAJwN6w+MSpGFyQSAkUthrOE4JRnpa6jSsTjXODDjioNkp2NLkKa73Yc2DHk3evNUXfa+P8oWFBk8ZXSHFyeOoNkcqkPCrkevB71NdFtn3Fd/Ar07co0ygw90Vb2q34cu1Jo/1oPV1UFsvcwaKJuxBKozH+VA0F9hyriPKjsvTRCbkFjweLxCib5phagHu6K5KEYC+VmWbCUnWyvYZauJ1/t5xQqqi9UWssRjbE1mI0Krq2Zb97qnONhzcclAPVpvEVdCCcl0rYZjQt6VI1PzHha56JepZCFCNvX3FVxYzEk=
|   256 59:03:dc:52:87:3a:35:99:34:44:74:33:78:31:35:fb (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBK7G5PgPkbp1awVqM5uOpMJ/xVrNirmwIT21bMG/+jihUY8rOXxSbidRfC9KgvSDC4flMsPZUrWziSuBDJAra5g=
|   256 ab:13:38:e4:3e:e0:24:b4:69:38:a9:63:82:38:dd:f4 (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILHj/lr3X40pR3k9+uYJk4oSjdULCK0DlOxbiL66ZRWg
80/tcp open  http    syn-ack ttl 63 Apache httpd 2.4.41
Aggressive OS guesses: Linux 5.0 (97%), Linux 4.15 - 5.8 (96%), Linux 5.3 - 5.4 (95%), Linux 2.6.32 (95%), Linux 5.0 - 5.5 (95%), Linux 3.1 (95%), Linux 3.2 (95%), AXIS 210A or 211 Network Camera (Linux 2.6.17) (95%), ASUS RT-N56U WAP (Linux 3.4) (93%), Linux 3.16 (93%)
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.94SVN%E=4%D=10/7%OT=22%CT=1%CU=34201%PV=Y%DS=2%DC=T%G=Y%TM=6702
OS:EC3F%P=x86_64-pc-linux-gnu)SEQ(SP=102%GCD=1%ISR=107%TI=Z%CI=Z%TS=A)SEQ(S
OS:P=105%GCD=1%ISR=109%TI=Z%CI=Z%II=I%TS=A)OPS(O1=M53CST11NW7%O2=M53CST11NW
OS:7%O3=M53CNNT11NW7%O4=M53CST11NW7%O5=M53CST11NW7%O6=M53CST11)WIN(W1=FE88%
OS:W2=FE88%W3=FE88%W4=FE88%W5=FE88%W6=FE88)ECN(R=Y%DF=Y%T=40%W=FAF0%O=M53CN
OS:NSNW7%CC=Y%Q=)T1(R=Y%DF=Y%T=40%S=O%A=S+%F=AS%RD=0%Q=)T2(R=N)T3(R=N)T4(R=
OS:Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=0%Q=)T5(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=A
OS:R%O=%RD=0%Q=)T6(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=0%Q=)T7(R=Y%DF=Y%T=4
OS:0%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)U1(R=Y%DF=N%T=40%IPL=164%UN=0%RIPL=G%RID=
OS:G%RIPCK=G%RUCK=G%RUD=G)IE(R=Y%DFI=N%T=40%CD=S)

```

### 80-HTTP

#### Gobuster

```sh
http://board.htb/images/
http://board.htb/js/
http://board.htb/css/
```

![screenshot](/assets/images/boardlight3.png)

```sh
# sub-domain fuzzing (vhost)
ffuf -u http://10.10.11.11 -H "Host: FUZZ.board.htb" -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-20000.txt -mc all -ac
```

![screenshot](/assets/images/boardlight6.png)

![screenshot](/assets/images/boardlight7.png)

#### Web

![screenshot](/assets/images/boardlight1.png)

http://10.10.11.11/contact.php

![screenshot](/assets/images/boardlight2.png)

## Initial Access

> public exploit to gain initial access as www-data

### LFI

![screenshot](/assets/images/boardlight4.png)

![screenshot](/assets/images/boardlight5.png)

### crm.board.htb

Dolibarr 17.0.0

![screenshot](/assets/images/boardlight8.png)

`admin : admin`

![screenshot](/assets/images/boardlight9.png)

https://github.com/nikn0laty/Exploit-for-Dolibarr-17.0.0-CVE-2023-30253

![screenshot](/assets/images/boardlight10.png)

![screenshot](/assets/images/boardlight11.png)

### Lateral Movement

>- Dolibarr config contains credentials for dolibarr main db. 
- Password reuse to sign in as larissa.

## Privilege Escalation

>- Linpeas and SUID3NUM reveals that custom SUID is set for enlightenment. 
- Public exploit to gain access as root.

### LSE

![screenshot](/assets/images/boardlight12.png)

### Linpeas

![screenshot](/assets/images/boardlight13.png)

![screenshot](/assets/images/boardlight14.png)

![screenshot](/assets/images/boardlight15.png)

![screenshot](/assets/images/boardlight16.png)

![screenshot](/assets/images/boardlight17.png)

![screenshot](/assets/images/boardlight18.png)

### SUID3NUM

![screenshot](/assets/images/boardlight19.png)

The Dolibarr configuration file [is located at](https://wiki.dolibarr.org/index.php?title=Configuration_file) `/var/www/html/crm.board.htb/htdocs/conf/conf.php`:

![screenshot](/assets/images/boardlight20.png)

```text
dolibarrowner | serverfun2$2023!! 
```

![screenshot](/assets/images/boardlight21.png)

### Larissa

https://github.com/MaherAzzouzi/CVE-2022-37706-LPE-exploit/blob/main/exploit.sh

![screenshot](/assets/images/boardlight22.png)
