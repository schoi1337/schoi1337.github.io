<script>
document.addEventListener('DOMContentLoaded', function() {
  const copyButtons = document.querySelectorAll('.copy-button');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const codeBlock = button.nextElementSibling.querySelector('pre, code');
      if (!codeBlock) return;
      
      const text = codeBlock.innerText;
      navigator.clipboard.writeText(text).then(() => {
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 1500);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    });
  });
});
</script>
