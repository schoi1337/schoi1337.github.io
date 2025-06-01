---
layout: post
title: "Bluetooth Risk Scanner: Revealing the Invisible Risks of Everyday BLE Devices"
date: 2025-06-01
categories: PROJECTS
tags: [ble, bluetooth, privacy, awareness, osint, tracking, recon, security]
featured: true
---

## Introduction

Bluetooth Low Energy (BLE) is everywhere—built into our phones, watches, earbuds, fitness trackers, even medical implants. It’s what lets your smartwatch sync to your phone, or your wireless headphones auto-connect when you open the case. But behind this convenience is a largely invisible layer of **constantly broadcasting signals**—many of which leak identifying information that can be exploited for tracking, profiling, or worse.

Unlike Wi-Fi or mobile networks, BLE devices don’t require a connection to be useful. They simply **advertise their presence** to nearby listeners. And in doing so, many devices unintentionally share details like static MAC addresses, vendor identifiers, and even health telemetry UUIDs—often unencrypted and unrotated.

While these emissions are mostly harmless in isolation, their combination can form a digital fingerprint. When left unmonitored, they expose individuals and organizations to real-world risks; from stalkerware and corporate surveillance to passive reconnaissance in secure zones.

## Why I Built This

I developed [Bluetooth Risk Scanner](https://github.com/schoi1337/bluetooth-risk-scanner) to make these hidden signals visible; not just for security professionals, but for anyone who wants to understand what their environment is silently broadcasting.

Existing BLE tools often focus on developer debugging or protocol fuzzing. They require complex setups or generate active traffic that interferes with devices. There was a need for something simpler: a passive, privacy-focused scanner that could show **who’s around you**, **what they’re leaking**, and **how risky it is**.

This tool doesn’t pair, probe, or interfere. It listens, interprets, and classifies what’s already in the air.

## Technical Overview

- **Language**: Python 3.11+
- **Core Library**: [`bleak`](https://github.com/hbldh/bleak) for asynchronous BLE scanning (supports macOS and Linux)
- **Scan Method**: Passive scanning of BLE advertisement packets (no pairing or GATT interaction)
- **Vendor Detection**: Offline IEEE OUI resolution via locally cached registry
- **Risk Scoring**: Based on:
  - Signal proximity (RSSI thresholds)
  - MAC address type (static vs randomized)
  - Vendor classification (e.g., known tracker manufacturers)
- **CVE Correlation**: CVE lookup by matching vendor or product keywords against a local BLE-specific CVE dataset (2002–2018+)
- **Anomaly Detection**: Logs and compares historical MAC addresses and device names to identify rotation and renaming behavior
- **Output Formats**:
  - Interactive, color-coded HTML report
  - Machine-readable JSON report for offline processing

The tool is fully operational without root or special permissions. It runs on consumer-grade devices and is suitable for both security research and real-world privacy audits.

## What It Detects

Bluetooth Risk Scanner identifies and scores nearby BLE devices based on observable characteristics from their advertisement packets:

| Signal Characteristic           | Risk Level |
|--------------------------------|------------|
| Static MAC address             | High       |
| Known tracker vendor (Apple, Tile) | High   |
| High signal strength (close proximity) | High |
| Unknown vendor (no OUI match)  | Medium     |
| Repeated devices with rotating MAC or name | Medium |
| Unusual advertising behavior   | Medium     |

The tool does not perform active GATT scans or service discovery, and therefore does not detect UUID-based health or biometric services directly. However, it highlights devices with strong signals and identifiable vendor traits that may pose privacy risks in sensitive environments.

Each detected device includes risk factors and signal context to help users assess whether a MAC address should be considered random, reused, or statically assigned.

## Everyday Applications

- **Personal Privacy**: See what your phone, watch, or earbuds are broadcasting in public spaces.
- **Workplace Security**: Audit office environments for rogue BLE beacons or unmanaged devices.
- **Educational Settings**: Use in classrooms or workshops to demonstrate real-world privacy risks.
- **Digital Hygiene**: Promote better awareness of always-on protocols and what they reveal about us.

You don't need to be a hacker to care about BLE. You just need to know it's talking—and to whom.

## Example Scenario: Real-World Stalking with BLE Trackers

Apple AirTags have been used in multiple stalking cases, often without the victim’s knowledge. These devices silently broadcast their presence and can remain undetected for hours—especially on Android devices lacking early alert features.

Bluetooth Risk Scanner was built to uncover these passive threats. In testing, it flagged intermittent AirTag beacons using only static MACs, Apple vendor OUIs, and proximity-based signal strength—often before system alerts appeared.

While not a replacement for safety tools, it helps surface hidden BLE trackers operating below the radar.

## Limitations and Future Work

- Currently CLI-based (command line); a GUI frontend would improve accessibility for non-technical users.
- No Android/iOS support due to platform and library limitations.
- Supports vendor-to-CVE mapping using a locally enriched BLE CVE database.
- Tracks MAC address and device name changes across scans to detect rotation or evasion patterns.

Planned enhancements include:
- Time-series correlation of emitters across multiple sessions
- Behavioral clustering and anomaly scoring based on advertisement entropy or frequency
- Integration of signal patterns with CVE severity to prioritize known-vulnerable emitters

## Conclusion

BLE is part of modern life—but it wasn't designed with privacy in mind.  
Bluetooth Risk Scanner helps bridge that gap by making invisible broadcasts visible and actionable.

Whether you're a security engineer, a journalist, or just someone curious about what your devices are saying when you're not looking—this tool gives you the ability to listen.

> → GitHub: [schoi1337/bluetooth-risk-scanner](https://github.com/schoi1337/bluetooth-risk-scanner)  
