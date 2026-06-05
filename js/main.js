// Header shadow on scroll
window.addEventListener('scroll', () => {
  const header = document.getElementById('site-header');
  if (window.scrollY > 10) {
    header.classList.add('ds-fixed-header');
  } else {
    header.classList.remove('ds-fixed-header');
  }
});
