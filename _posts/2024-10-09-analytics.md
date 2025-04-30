---
title: "Analytics"
date: 2024-10-09
categories: HTB
tags: ["htb walkthrough", "ctf", "cybersecurity", "hackthebox", "htb writeup", "penetration testing", "analytics", "writeup", "htb"]
---

# Analytics

# Analytics

## Summary
# Enumeration
- Login page on the website leads to login portal for metabase.
# Initial Access
- Public exploit found on metabase gives initial access
# Lateral Movement
- `env` shows `metalytics` credentials.
- SSH as metalytics user.
# Privilege Escalation
- Searching for kernel version results in numerous kernel exploits.
- Run the exploit to gain access as root.

# Enumeration
## Nmap

# TCP
```sh
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-01 15:28 AEST
Nmap scan report for 10.10.11.233
Host is up (0.018s latency).
Not shown: 999 closed tcp ports (conn-refused)
PORT   STATE SERVICE VERSION
80/tcp open  http    nginx 1.18.0 (Ubuntu)
|_http-title: Did not follow redirect to http://analytical.htb/
|_http-server-header: nginx/1.18.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

# UDP
```sh
└─$ sudo nmap -sU --top-ports 20 -sV 10.10.11.233                                                         
[sudo] password for kali: 
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-01 15:29 AEST
Nmap scan report for 10.10.11.233
Host is up (0.015s latency).

PORT      STATE         SERVICE      VERSION
53/udp    open|filtered domain
67/udp    closed        dhcps
68/udp    open|filtered dhcpc
69/udp    closed        tftp
123/udp   closed        ntp
135/udp   open|filtered msrpc
137/udp   closed        netbios-ns
138/udp   closed        netbios-dgm
139/udp   open|filtered netbios-ssn
161/udp   closed        snmp
162/udp   closed        snmptrap
445/udp   closed        microsoft-ds
500/udp   closed        isakmp
514/udp   closed        syslog
520/udp   closed        route
631/udp   closed        ipp
1434/udp  closed        ms-sql-m
1900/udp  open|filtered upnp
4500/udp  closed        nat-t-ike
49152/udp closed        unknown
```
## 80-HTTP
### Screenshots
![[/assets/images/analytics1.png]]

Clicking on Login leads to:
![[/assets/images/analytics2.png]]
-> add to `/etc/hosts`

http://data.analytical.htb/
![[/assets/images/analytics3.png]]

Source code
![[/assets/images/analytics5.png]]

### Gobuster

![[/assets/images/analytics4.png]]

# Initial Access
https://github.com/m3m0o/metabase-pre-auth-rce-poc

```text
setup-token : 249fa03d-fd94-4d5b-b94f-b4ebf3df681f
```

![[/assets/images/analytics6.png]]

![[/assets/images/analytics7.png]]
![[/assets/images/analytics8.png]]

# Lateral Movment

ssh as metalytics
![[/assets/images/analytics9.png]]

# Privilege Escalation
# linpeas
![[/assets/images/analytics10.png]]![[/assets/images/analytics11.png]]
![[/assets/images/analytics12.png]]
![[/assets/images/analytics13.png]]

https://github.com/g1vi/CVE-2023-2640-CVE-2023-32629
![[/assets/images/analytics14.png]]

![[/assets/images/analytics15.png]]
