document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Navigation Menu ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  if (navToggle && navLinks) {
    // Toggle menu visibility and hamburger icon animation
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open');
      
      if (isOpen) {
        body.classList.add('nav-open');
      } else {
        body.classList.remove('nav-open');
      }
    });

    // Close menu when a link is clicked (useful for single page navigation or anchors)
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        body.classList.remove('nav-open');
      });
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        body.classList.remove('nav-open');
      }
    });

    // Close menu on window resize if view becomes desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        body.classList.remove('nav-open');
      }
    });
  }

  // --- Portfolio Filter ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Toggle active button state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          
          if (filterValue === 'all' || category === filterValue) {
            item.classList.remove('hidden');
            // Retrigger transition/animation
            item.style.animation = 'none';
            item.offsetHeight; // Trigger reflow
            item.style.animation = '';
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }
});
