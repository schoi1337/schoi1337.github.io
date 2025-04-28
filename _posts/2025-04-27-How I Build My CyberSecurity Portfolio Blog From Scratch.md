---
layout: post
title: "How I Build My CyberSecurity Portfolio Blog From Scratch"
date: 2025-04-27
categories: PROJECTS
tags: [Cybersecurity Portfolio, Jekyll Blog, GitHub Pages, HackTheBox Writeups, CVE Analysis, Proof of Concept, SEO, Technical Growth]
---

If I don't document what I learn, it fades quickly.

That's why I decided to create a space where I could organize my notes, track my projects, and build something that grows alongside my technical skills.

Through building and maintaining this blog, I ended up learning much more than I initially set out to and found a way to make consistent, small efforts compound into something meaningful.

## Why I Built the Blog

When I first decided to build this blog, my goals were simple:

- To organize and review my **HackTheBox writeups**.
- To share my **CVE analyses** and **Proof of Concept (PoC)** work.
- To structure and consolidate my technical notes.
- To have a clear, continuous record of my technical growth.

Rather than relying on a pre-built service, I chose to build everything myself — from the ground up.

I wanted something lightweight, and fully within my control.

## Choosing the Platform: GitHub Pages + Jekyll

The platform decision was straightforward.

- **GitHub Pages** for free, stable hosting.
- **Jekyll** as a simple and efficient static site generator.

I preferred a setup I could completely understand and manage for the long-term sustainability.

## Customizing the Theme: Dark Poole

I started with the **Dark Poole** Jekyll theme and customized it heavily:

- Updated typography using [Inter](https://rsms.me/inter/) for body text and [JetBrains Mono](https://www.jetbrains.com/lp/mono/) for code blocks.
- Refined the color palette for better focus and readability.
- Adjusted content width for improved desktop experience.
- Simplified the navigation and category structure.
- Refactored the entire code so I can easily make changes if I wanted to.
- Added a floating Table of Contents (TOC) on the side to improve navigation for longer posts.

The goal was to build a site that looks minimal but feels intentional — lightweight without being unfinished.

> The Original Dark Poole Theme
![The Original Dark Poole Theme](/assets/images/Pasted image 20250428152005.png)

> My customized Dark Poole theme
![My Customized Dark Poole Theme](/assets/images/image.png)

## Refactoring the Codebase

While customizing the Dark Poole theme, I realized that cosmetic changes alone weren’t enough.  
To make the blog sustainable and easier to maintain, I decided to refactor the codebase early on.

I focused on modularizing layouts and includes, cleaning up the directory structure, and simplifying the CSS and navigation logic.

A more detailed breakdown of this refactoring process can be found [here](/projects/2025/04/28/Refactoring-My-Blog-for-Long-Term-Growth.md).

## SEO and Visibility

While the blog is primarily for my own learning, making it searchable has additional benefits.

- Structured metadata (title, description, Open Graph, Twitter Card tags) for better indexing.
- A sitemap and robots.txt for search engine crawling.
- **Google Analytics 4 (GA4)** integration to track how the content is being accessed.

Visibility is part of learning — it encourages clearer communication, invites feedback, and creates new opportunities to collaborate or improve.

## Automating the Workflow

When I first started, I had over 80 HackTheBox writeups to organize and upload.

Managing them manually would have been slow and error-prone.

So I created a small automation script that:

- Inserts missing YAML Front Matter.
- Renames files to the **YYYY-MM-DD-title.md** format.
- Automatically categorizes posts.
- Runs git add → commit → push as one flow.

A more detailed breakdown of this automation process will be published in a separate post.

## What I Learned

Building this blog wasn't just about setting up a website — it became a learning project in itself:

- Gained practical knowledge of **Jekyll** and static site structures.
- Improved **Git workflow efficiency** for technical content management.
- Applied **technical SEO** basics to real-world projects.
- Practiced structured, minimalistic technical communication.

Most importantly, it showed me how even small, continuous documentation efforts can create meaningful progress over time.

## Looking Ahead

This blog is not a finished product.

It will grow and evolve, just like my skills.

- Continuing to upload **HackTheBox writeups**.
- Publishing **CVE analyses** and **PoC development processes**.
- Launching and maintaining new **open-source projects**.

Instead of just accumulating certifications or checklists, I'm focusing on building things — and letting those things document my technical journey, one step at a time.
