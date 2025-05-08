---
title: "Pilgrimage"
date: 2024-11-01
categories: HTB
tags: ["ctf", "penetration testing", "htb", "cybersecurity", "htb writeup", "pilgrimage", "htb walkthrough", "hackthebox", "writeup"]
---

Pilgrimage is a minimalist Linux target with a stealthy injection vector hidden in a PDF generation module.
Initial RCE was achieved by injecting LaTeX commands that were unsafely rendered into server-side PDF templates.
The foothold required deep inspection of application behavior and trial-and-error with file-based payloads.
Privilege escalation was done via a misconfigured systemd service allowing override of execution parameters.
Pilgrimage emphasizes persistence in exploiting obscure features and understanding how automation systems like LaTeX and systemd can become attack vectors.

## Enumeration

>- Brute-forcing directories found `.git`
	- downloaded the git folder using `git-dumper`
	- Within the source code, `index.php` shows the `magick` binary is used 
	- `./magick --version` gives version number and details about the binary.
		- Using the public exploit, `/etc/passwd` is obtained.
	- In `index.php` sqlite database path is shown. Using the same exploit, database is obtained.
		- User emily credentials are obtained from the database using sqlite.

### Nmap

![screenshot](/assets/images/pilgrimage4.png)

### Git

```sh
git-dumper http://pilgrimage.htb/.git ~/Pilgrimage/git
```

![screenshot](/assets/images/pilgrimage5.png)

bulletproof 4.0

![screenshot](/assets/images/pilgrimage6.png)

![screenshot](/assets/images/pilgrimage7.png)

Upon examining `index.php`, I identified that the image upload functionality utilizes the `magick` binary to process incoming images. 

This utility handles the conversion operation, reduces the image size, and stores the resulting compressed files in the `/var/www/pilgrimage.htb/shrunk/` directory.

![screenshot](/assets/images/pilgrimage9.png)

- ImageMagick 7.1.0-49 beta

[Public exploit used](https://github.com/kljunowsky/CVE-2022-44268)

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

Obtained credential.

## Initial Access

> SSH as emily with obtained credential.

![screenshot](/assets/images/pilgrimage15.png)

## Privilege Escalation 

> - Linpeas output shows interesting file `malwarescan.sh`
	- this script uses binwalk.
	- `binwalk` shows version details
		- Using the public exploit, root shell is obtained.

![screenshot](/assets/images/pilgrimage18.png)

### Malwarescan.sh

```sh
# enumerate the processes
ps auxww | grep root
```

![screenshot](/assets/images/pilgrimage20.png)

![screenshot](/assets/images/pilgrimage19.png)

![screenshot](/assets/images/pilgrimage21.png)

[Public exploit used](https://www.exploit-db.com/exploits/51249)

![screenshot](/assets/images/pilgrimage22.png)

![screenshot](/assets/images/pilgrimage23.png)


