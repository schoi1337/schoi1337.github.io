---
title: "Pilgrimage"
date: 2024-11-01
categories: HTB
description: "HTB Pilgrimage walkthrough featuring SVG upload and OCR exploitation to gain initial access, followed by crafting a malicious .deb package for root access via sudo apt."
tags: [svg, ocr, debian, apt-abuse, privilege-escalation]
---

Pilgrimage is a minimalist Linux target with a stealthy injection vector hidden in a PDF generation module.

Initial RCE was achieved by injecting LaTeX commands that were unsafely rendered into server-side PDF templates.

The foothold required deep inspection of application behavior and trial-and-error with file-based payloads.

Escalated to root by crafting a malicious `.deb` package and installing it using `sudo apt` access granted to the low-privileged user.

## Why I Chose This Machine

I chose Pilgrimage because it showcases a realistic Debian/Ubuntu privilege escalation path involving `apt` abuse — something that's often misconfigured in development or automation environments.  
It also includes a fun initial foothold through SVG injection and OCR-based text recovery.

## Attack Flow Overview

1. Discovered an image upload feature that stored files in an accessible location  
2. Uploaded a malicious SVG that embedded text recognized by OCR to extract credentials  
3. Gained initial shell access using SSH  
4. Escalated to root by creating a custom `.deb` package and installing it via `sudo apt` with a `postinst` reverse shell

This box replicates how seemingly harmless sudo permissions (like `apt install`) can lead to full compromise when abused cleverly.

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


## Alternative Paths Explored

Before discovering the OCR trick, I attempted to brute-force the image processing endpoint and inject XSS payloads, which failed.  
I also searched for cron jobs or SUID binaries to escalate but found nothing viable.  
The turning point came from analyzing how user privileges could affect package installation logic.

## Blue Team Perspective

Pilgrimage illustrates the risk of giving `apt` install rights to non-root users.  
Defenders should:

- Avoid granting `sudo apt` access unless absolutely required  
- Inspect `.deb` package behavior using tools like `dpkg-deb` before installing from untrusted sources  
- Monitor `/var/log/apt/term.log` and `auth.log` for signs of malicious post-install scripts
