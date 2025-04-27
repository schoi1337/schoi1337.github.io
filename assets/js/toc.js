document.addEventListener("DOMContentLoaded", function () {
    const toc = document.getElementById('toc');
    const headings = document.querySelectorAll('main h2, main h3');
  
    if (!toc || headings.length === 0) return;
  
    // Generate TOC based on headings
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = 'heading-' + index;
      }
      const link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;
      link.dataset.depth = heading.tagName[1]; // Save depth (2 or 3)
      toc.appendChild(link);
    });
  
    const tocLinks = toc.querySelectorAll('a');
  
    // Highlight current section
    window.addEventListener('scroll', () => {
      let current = 0;
      headings.forEach((heading, index) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 150) {
          current = index;
        }
      });
  
      tocLinks.forEach(link => link.classList.remove('active'));
      if (tocLinks[current]) {
        tocLinks[current].classList.add('active');
      }
    });
  
    // Smooth scroll to the section when clicking TOC link
    document.querySelectorAll('#toc a').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80, // Adjust for fixed header if needed
            behavior: 'smooth'
          });
        }
      });
    });
  
    // TOC Toggle Button for mobile
    const tocToggleBtn = document.getElementById('toc-toggle-btn');
    const tocWrapper = document.getElementById('toc-wrapper');
  
    if (tocToggleBtn && tocWrapper) {
      tocToggleBtn.addEventListener('click', function () {
        if (tocWrapper.style.display === 'block') {
          tocWrapper.style.display = 'none';
        } else {
          tocWrapper.style.display = 'block';
        }
      });
    }
  });
  