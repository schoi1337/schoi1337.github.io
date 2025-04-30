---
title: "Monteverde"
date: 2024-06-19
categories: HTB
tags: ["ctf", "penetration testing", "htb", "cybersecurity", "htb writeup", "monteverde", "htb walkthrough", "hackthebox", "writeup"]
---

# Monteverde

---
OS: Windows(AD)
Difficulty: Medium
Date: 2025-04-01
Note: User owned in previous attempt
---
# Summary


# Credentials
```text
SABatchJobs : SABatchJobs
mhope : 4n0therD4y@n0th3r$
```
# Enumeration
## Nmap
```sh
PORT      STATE SERVICE       REASON          VERSION
53/tcp    open  domain        syn-ack ttl 127 (generic dns response: SERVFAIL)
| fingerprint-strings: 
|   DNS-SD-TCP: 
|     _services
|     _dns-sd
|     _udp
|_    local
88/tcp    open  kerberos-sec  syn-ack ttl 127 Microsoft Windows Kerberos (server time: 2025-03-31 21:45:49Z)
135/tcp   open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
139/tcp   open  netbios-ssn   syn-ack ttl 127 Microsoft Windows netbios-ssn
389/tcp   open  ldap          syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: MEGABANK.LOCAL0., Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds? syn-ack ttl 127
464/tcp   open  kpasswd5?     syn-ack ttl 127
593/tcp   open  ncacn_http    syn-ack ttl 127 Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped    syn-ack ttl 127
3268/tcp  open  ldap          syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: MEGABANK.LOCAL0., Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped    syn-ack ttl 127
5985/tcp  open  http          syn-ack ttl 127 Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
9389/tcp  open  mc-nmf        syn-ack ttl 127 .NET Message Framing
49667/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
49673/tcp open  ncacn_http    syn-ack ttl 127 Microsoft Windows RPC over HTTP 1.0
49674/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
49676/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
49693/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
49749/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
```

# Todo 
- [ ] 5985 - HTTP
- [x] SMB
- [x] LDAP
- [ ] 9389

- add `megabank.local` to `/etc/hosts`

## SMB
- Enum4linux result showed a bunch of usernames
- password spraying SMB with username.txt as username and username.txt as password did not return any hits
- 

```sh
nxc smb megabank.local -u username.txt -p username.txt --shares
```

![screenshot](/assets/images/monteverde2.png)
![screenshot](/assets/images/monteverde3.png)

```sh
nxc smb megabank.local -u SABatchJobs -p SABatchJobs -M spider_plus

# download a single file
smbclient -U SABatchJobs //10.10.10.172/users$ SABatchJobs -c 'get mhope/azure.xml azure.xml'
```

![screenshot](/assets/images/monteverde4.png)

azure.xml
![screenshot](/assets/images/monteverde5.png)

```sh
nxc winrm megabank.local -u username.txt -p password.txt --continue-on-success
```

![screenshot](/assets/images/monteverde6.png)

## HTTP-5985
- raft-medium-lowercase did not return any results.

# Foothold
![screenshot](/assets/images/monteverde8.png)

# Privilege Escalation
## WinPEAS
- AV enabled
![screenshot](/assets/images/monteverde9.png)
## Manual Enumeration
mhope
![screenshot](/assets/images/monteverde10.png)

![screenshot](/assets/images/monteverde11.png)

https://github.com/Azure/azure-powershell/issues/9649

https://www.lares.com/blog/hunting-azure-admins-for-vertical-escalation/





