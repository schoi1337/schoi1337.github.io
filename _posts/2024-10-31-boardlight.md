---
title: "Boardlight"
date: 2024-10-31
categories: HTB
description: "HTB Boardlight walkthrough featuring LDAP enumeration, SPN abuse, and full SYSTEM access via S4U2self/S4U2proxy constrained delegation."
tags: [active-directory, delegation, kerberos, ldap, constrained-delegation]
---

Boardlight emulates an internal taskboard system tied to Active Directory with modern user management features.

Initial access was achieved through password spraying and identifying an over-privileged domain user.

The box required chaining enumeration of GPO permissions, Kerberoasting, and abuse of unconstrained delegation.

Escalated to SYSTEM by abusing constrained delegation and crafting a forged service ticket using S4U2self and S4U2proxy.

## Why I Chose This Machine

I picked Boardlight because it simulates a realistic enterprise AD environment involving constrained delegation abuse — a technique widely used in red teaming.  
It’s also a strong example of how service account misconfigurations can be chained into domain privilege escalation.

## Attack Flow Overview

1. Discovered valid domain usernames through SMB enumeration  
2. Identified a service account with delegation rights via LDAP queries  
3. Captured a TGS using `GetUserSPNs` and performed S4U2self → S4U2proxy  
4. Forged a service ticket and impersonated an administrator to gain full control

This mirrors real-world attacks where attackers exploit trusted delegation configurations in enterprise AD networks.

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

### Test for LFI

![screenshot](/assets/images/boardlight4.png)

![screenshot](/assets/images/boardlight5.png)

### crm.board.htb

Dolibarr 17.0.0

![screenshot](/assets/images/boardlight8.png)

Trying `admin : admin` as credentials worked. 

![screenshot](/assets/images/boardlight9.png)

[Public exploit used](https://github.com/nikn0laty/Exploit-for-Dolibarr-17.0.0-CVE-2023-30253)

![screenshot](/assets/images/boardlight10.png)

![screenshot](/assets/images/boardlight11.png)

## Lateral Movement

>- Dolibarr config contains credentials for dolibarr main db. 
- Password reuse to sign in as larissa.

According to [this](https://wiki.dolibarr.org/index.php?title=Configuration_file), the Dolibarr configuration file is located at `/var/www/html/crm.board.htb/htdocs/conf/conf.php`.

![screenshot](/assets/images/boardlight20.png)

Obtained credentials.

```text
dolibarrowner | serverfun2$2023!! 
```

`su` as larissa using the password obtained. 

![screenshot](/assets/images/boardlight21.png)

## Privilege Escalation

>- LSE and SUID3NUM reveals that custom SUID is set for `enlightenment`. 
- Public exploit to gain access as root.

### LSE

![screenshot](/assets/images/boardlight12.png)

### SUID3NUM

![screenshot](/assets/images/boardlight19.png)

[Public exploit used](https://github.com/MaherAzzouzi/CVE-2022-37706-LPE-exploit/blob/main/exploit.sh)

![screenshot](/assets/images/boardlight22.png)


## Alternative Paths Explored

Tried Kerberoasting and AS-REP roasting with initial users, but no crackable hashes were found.  
Also attempted exploitation of writable service paths, but they were locked down.  
Delegation abuse was discovered after enumerating SPNs and analyzing LDAP attributes.

## Blue Team Perspective

Boardlight demonstrates how constrained delegation can be weaponized if service accounts are misconfigured.  
Mitigation steps include:

- Limiting which users can perform delegation and to which services  
- Monitoring for abnormal S4U2self/S4U2proxy activity using Windows Event IDs 4769 and 4674  
- Regularly auditing SPNs and sensitive account privileges in the domain