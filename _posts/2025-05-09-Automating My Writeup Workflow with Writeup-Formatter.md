---
title: Automating My Writeup Workflow with Writeup-Formatter
date: 2025-05-09
categories: PROJECTS
description: A utility script to convert Obsidian-style HTB writeups into Jekyll-compatible Markdown files with SEO metadata and image optimization.
tags: [HTB, automation, markdown, python, writeup, Jekyll]
---

## Background

I had over 80 Hack The Box writeups stored in Obsidian.  

They were inconsistent — missing front matter, unoptimized images, and unstructured headings.  

To publish them on my Jekyll-based blog, I needed a way to standardize formatting, generate metadata, and handle images automatically.

This led to the creation of **Writeup-Formatter**.

## Purpose

The goal was to simplify the migration of raw `.md` files into clean, blog-ready posts without manual edits.  

The script handles structure, images, and SEO formatting to reduce repetition and enforce consistency.

## Features

- Converts Obsidian-style `.md` files into `_posts/YYYY-MM-DD-boxname.md`
- Randomly assigns a publish date within the past 1.5 years
- Generates front matter (`title`, `date`, `tags`, `description`)
- Normalizes image handling:
  - Renames, resizes, and compresses screenshots
  - Moves them to `/assets/images/`
  - Rewrites image links inside Markdown

## Folder Structure

### Before

```yaml
htb_writeups/
├── forest/
│   ├── forest.md
│   └── Attachments/
│       ├── screen1.png
├── monteverde/
│   ├── monteverde.md
│   └── Attachments/
│       └── screenshot.jpg
```

### After Running the Script

```yaml
_posts/
├── 2024-10-01-forest.md
├── 2024-09-12-monteverde.md

assets/images/
├── forest1.png
├── monteverde1.jpg
```

If `forest.md` is missing, the script creates a minimal template automatically.

## Front Matter Example

```yaml
---
title: "Forest"
date: 2024-08-21
tags: ["htb", "hackthebox", "forest", "writeup", "ctf", "cybersecurity"]
description: "Structured walkthrough of Forest on Hack The Box."
---
```

## Usage
1. Prepare folders under `htb_writeups/`, one per box:
- boxname.md (optional)
- `Attachments/` for screenshots
2. Install dependencies:

```bash
python -m venv venv
source venv/bin/activate
pip install pillow
```

## Result

The script outputs a clean, Jekyll-compatible post with structured content and image links.
This saves time when publishing multiple writeups and ensures consistency across posts.

## Repository

>Available here👉 [Writeup-formatter](github.com/schoi1337/writeup-formatter)

