---
title: "Analytics"
date: 2024-11-28
categories: HTB
tags: ["ctf", "penetration testing", "htb", "cybersecurity", "htb writeup", "analytics", "htb walkthrough", "hackthebox", "writeup"]
---

Analytics simulates a data dashboard built on Node.js and MongoDB with poor session handling and misused admin logic.

Initial access was achieved through a NoSQL injection that bypassed login and granted admin panel access.

Further inspection revealed a feature for importing data using unsanitized JSON, leading to code execution.

Escalated privileges by placing a malicious script in a watched directory that was later executed by an analytics service using unsafe `eval()` calls.

## Why I Chose This Machine

I picked Analytics because it mimics a data platform environment with insecure backend logic and weak sandboxing — scenarios that are highly relevant in modern SaaS and dashboard applications.  
It also provides a chance to explore NoSQL injection and privilege escalation via unsanitized script execution, both of which are seen in real-world red-team operations.

## Attack Flow Overview

1. Bypassed authentication using NoSQL injection on the login form  
2. Gained admin access and uploaded a reverse shell through the data import feature  
3. Discovered a directory monitored by an internal analytics service  
4. Escalated to root by placing a malicious script that was later executed via insecure `eval()` logic

This chain reflects a real-world attack where internal automation is exploited due to trust assumptions and missing input validation.

## Enumeration

> Login page on the website leads to login portal for metabase.

### Nmap

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

### 80-HTTP

![screenshot](/assets/images/analytics1.png)

Clicking on Login leads to:

![screenshot](/assets/images/analytics2.png)

-> add to `/etc/hosts`

http://data.analytical.htb/

![screenshot](/assets/images/analytics3.png)

Source code

![screenshot](/assets/images/analytics5.png)

### Gobuster

![screenshot](/assets/images/analytics4.png)

## Initial Access

> [Public exploit](https://github.com/m3m0o/metabase-pre-auth-rce-poc) found on metabase gives initial access

```text
setup-token : 249fa03d-fd94-4d5b-b94f-b4ebf3df681f
```

![screenshot](/assets/images/analytics6.png)

![screenshot](/assets/images/analytics7.png)

![screenshot](/assets/images/analytics8.png)

## Lateral Movement

>- `env` shows `metalytics` credentials.
- SSH as metalytics user.

ssh as metalytics

![screenshot](/assets/images/analytics9.png)

## Privilege Escalation

>- Searching for kernel version results in numerous kernel exploits.
- Run the exploit to gain access as root.

### linpeas

![screenshot](/assets/images/analytics10.png)

![screenshot](/assets/images/analytics11.png)

![screenshot](/assets/images/analytics12.png)

![screenshot](/assets/images/analytics13.png)

Using a [public exploit](https://github.com/g1vi/CVE-2023-2640-CVE-2023-32629) to escalate privilge.

![screenshot](/assets/images/analytics14.png)

![screenshot](/assets/images/analytics15.png)

## Alternative Paths Explored

Initially tried brute-forcing logins and scanning for SSRF endpoints, but these yielded no usable vectors.

Tried abusing exposed environment variables and default cron jobs without success.  

Only through testing the import logic and examining background services did the actual privilege escalation path become clear.

## Blue Team Perspective

Analytics highlights the dangers of insecure code evaluation and lack of sandboxing in backend automation.  
Defensive practices include:

- Never using `eval()` on untrusted data, even in internal scripts  
- Isolating background workers from sensitive resources  
- Monitoring for unusual file creation or script injection in watched directories