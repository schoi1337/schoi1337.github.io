---
title: "Pilgrimage"
date: 2024-11-01
categories: HTB
tags: ["ctf", "penetration testing", "htb", "cybersecurity", "htb writeup", "pilgrimage", "htb walkthrough", "hackthebox", "writeup"]
---

# Pilgrimage

# Pilgrimage

# Credentials
| Username | Password         | Hash | Source |
| -------- | ---------------- | ---- | ------ |
| emily    | abigchonkyboi123 |      |        |
|          |                  |      |        |
|          |                  |      |        |
|          |                  |      |        |
# Enumeration
- Brute-forcing directories found `.git`
	- downloaded the git folder using `git-dumper`
	- Within the source code, `index.php` shows the `magick` binary is used 
	- `./magick --version` gives version number and details about the binary.
		- Using the public exploit, `/etc/passwd` is obtained.
	- In `index.php` sqlite database path is shown. Using the same exploit, database is obtained.
		- User emily credentails are obtained from the database using sqlite.

## Nmap
# TCP
![screenshot](/assets/images/pilgrimage4.png)

## Git
```sh
git-dumper http://pilgrimage.htb/.git ~/Pilgrimage/git
```

![screenshot](/assets/images/pilgrimage5.png)

bulletproof 4.0
![screenshot](/assets/images/pilgrimage6.png)

![screenshot](/assets/images/pilgrimage7.png)
In `index.php`, when uploading an image it uses `magick` binary to covert an image, shrink its size, and save to `/var/www/pilgrimage.htb/shrunk/`.

![screenshot](/assets/images/pilgrimage9.png)
- ImageMagick 7.1.0-49 beta


https://github.com/kljunowsky/CVE-2022-44268

`/etc/passwd`
![screenshot](/assets/images/pilgrimage10.png)
- run the exploit
- upload the image
- run the exploit to read the data

![screenshot](/assets/images/pilgrimage11.png)
`sqlite:/var/db/pilgrimage`

![screenshot](/assets/images/pilgrimage12.png)
-> didn't work

```sh
identify -verbose 66807ecc5142b.png | grep -Pn "^( |Image)" | xxd -r -p > pilgrimage.sqlite
```

![screenshot](/assets/images/pilgrimage13.png)
![screenshot](/assets/images/pilgrimage14.png)



# Initial Access
- SSH as emily with obtained credential.

# Emily
ssh as emily with the obtained credentials

![screenshot](/assets/images/pilgrimage15.png)
# Privilege Escalation 
- Linpeas output shows interesting file `malwarescan.sh`
	- the script uses binwalk.
	- `binwalk` shows version details
		- Using the public exploit, root shell is obtained.

![screenshot](/assets/images/pilgrimage16.png)
![screenshot](/assets/images/pilgrimage17.png)
![screenshot](/assets/images/pilgrimage18.png)
# Malwarescan.sh
```sh
# enumerate the processes
ps auxww | grep root
```

![screenshot](/assets/images/pilgrimage20.png)

![screenshot](/assets/images/pilgrimage19.png)

![screenshot](/assets/images/pilgrimage21.png)

https://www.exploit-db.com/exploits/51249

![screenshot](/assets/images/pilgrimage22.png)

![screenshot](/assets/images/pilgrimage23.png)


