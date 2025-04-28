---
layout: post
title: "Refactoring My Blog for Long-Term Growth"
date: 2025-04-28
categories: PROJECTS
tags: [Portfolio, Refactoring, Web Optimization, Jekyll, GitHub Pages, Clean Code, Modularization, CSS Optimization, JavaScript, Table of Contents, Frontend, Technical Writing]
---
# Refactoring My Blog for Long-Term Growth

When I first customized the Dark Poole theme for my cybersecurity blog, I quickly realized that small cosmetic changes would not be enough.  

If I wanted a space that could grow alongside my technical journey — with more posts, categories, and features — the underlying structure needed to be clean and manageable.

I decided to refactor the blog early, focusing on building a stable foundation.

## Why I Chose to Refactor

As a blog expands, even minor edits can become tedious without a clear modular system.  
By reorganizing the structure from the start, I aimed to create a lightweight, scalable, and maintainable environment.

The goals were simple:
- Ensure modular separation of `_layouts` and `_includes`.
- Standardize file naming and directory structures.
- Optimize CSS and JavaScript to reduce technical debt.
- Enable future extensibility without impacting performance.

## Changes Made During Refactoring

I started by modularizing the core layouts.  
Instead of embedding navigation and metadata directly inside page templates, I moved them into reusable includes.

>Example of a modularized header
```html
<!-- _includes/header.html -->
<header>
  <h1><a href="{{ site.baseurl }}/">{{ site.title }}</a></h1>
  <nav>
    <ul>
      {% for page in site.pages %}
        {% if page.nav %}
          <li><a href="{{ page.url }}">{{ page.title }}</a></li>
        {% endif %}
      {% endfor %}
    </ul>
  </nav>
</header>
```

For CSS, I consolidated multiple scattered stylesheets and removed unnecessary SCSS complexity.  

Instead of deep Sass nesting and partial imports, I adopted a flatter structure with consistent class naming conventions.

>Example of optimized CSS
```css
/* assets/css/style.css */
body {
  font-family: 'JetBrains Mono', monospace;
  background-color: #1e1e1e;
  color: #d4d4d4;
  margin: 0;
  padding: 0;
}

h1, h2, h3 {
  color: #d4d4d4;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

a {
  color: #4ea1d3;
  text-decoration: none;
}
```

To improve usability for longer posts, I developed a lightweight Table of Contents (TOC) script.  
The script dynamically parses all `h2` and `h3` headings inside a post, generates anchor links, highlights the active section while scrolling, and enables smooth scrolling with an offset for fixed headers.

>Key part of the TOC script
```javascript
// assets/js/toc.js
document.addEventListener("DOMContentLoaded", function () {
  const toc = document.getElementById('toc');
  const headings = document.querySelectorAll('.post-content h2, .post-content h3');

  if (!toc || headings.length === 0) return;

  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = 'heading-' + index;
    }
    const link = document.createElement('a');
    link.href = '#' + heading.id;
    link.textContent = heading.textContent;
    link.dataset.depth = heading.tagName[1];
    toc.appendChild(link);
  });

  const tocLinks = toc.querySelectorAll('a');

  window.addEventListener('scroll', () => {
    let current = 0;
    headings.forEach((heading, index) => {
      if (heading.getBoundingClientRect().top <= 150) {
        current = index;
      }
    });
    tocLinks.forEach(link => link.classList.remove('active'));
    if (tocLinks[current]) {
      tocLinks[current].classList.add('active');
    }
  });

  tocLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});
```

Finally, I cleaned up the repository:  
removing unused includes, organizing assets, and simplifying the file structure to maintain a clean development environment.

## Looking Ahead

Refactoring at an early stage saved significant time and reduced potential technical debt.  
It also aligned the structure of the blog with core engineering principles: modular design, separation of concerns, and maintainability.

A good system — whether a security solution or a personal project — starts with a clear, resilient foundation.