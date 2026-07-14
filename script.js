document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Navigation Menu & Accessibility ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  if (navToggle && navLinks) {
    // Toggle menu visibility, hamburger icon, and ARIA state
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      
      if (isOpen) {
        body.classList.add('nav-open');
      } else {
        body.classList.remove('nav-open');
      }
    });

    // Close menu when a link is clicked
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('nav-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('nav-open');
      }
    });

    // Close menu on resize if screen becomes large
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('nav-open');
      }
    });
  }

  // --- Portfolio Filter with GSAP Transition ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Toggle active button state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        // Animate grid items filter transition
        if (typeof gsap !== 'undefined') {
          const toShow = [];
          const toHide = [];

          galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filterValue === 'all' || category === filterValue) {
              toShow.push(item);
            } else {
              toHide.push(item);
            }
          });

          // Animate out items to hide
          if (toHide.length > 0) {
            // Remove ready-transition before animation to prevent paint battles
            toHide.forEach(item => item.classList.remove('ready-transition'));
            gsap.to(toHide, {
              opacity: 0,
              scale: 0.95,
              duration: 0.25,
              ease: 'power2.in',
              onComplete: () => {
                toHide.forEach(item => item.classList.add('hidden'));
              }
            });
          }

          // Animate in items to show
          toShow.forEach(item => {
            item.classList.remove('hidden');
            item.classList.remove('ready-transition');
          });
          if (toShow.length > 0) {
            gsap.fromTo(toShow, 
              { opacity: 0, scale: 0.95 },
              { 
                opacity: 1, 
                scale: 1, 
                duration: 0.45, 
                ease: 'power2.out', 
                stagger: 0.05, 
                delay: toHide.length > 0 ? 0.2 : 0,
                clearProps: 'opacity,transform',
                onComplete: () => {
                  toShow.forEach(item => item.classList.add('ready-transition'));
                }
              }
            );
          }
        } else {
          // Fallback if GSAP is not available
          galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filterValue === 'all' || category === filterValue) {
              item.classList.remove('hidden');
            } else {
              item.classList.add('hidden');
            }
          });
        }
      });
    });
  }

  // --- Premium GSAP Motion Design ---
  if (typeof gsap !== 'undefined') {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero Text Load Animation (Subtle rise of 30px + fade-in)
    const heroElements = document.querySelectorAll('.hero-inner > *, .page-hero .container > *');
    if (heroElements.length > 0) {
      gsap.from(heroElements, {
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.15,
        clearProps: 'opacity,transform'
      });
    }

    // General scroll trigger function for card grids and timelines
    const animateOnScroll = (elementsSelector, triggerSelector, staggerVal = 0.08) => {
      const elements = document.querySelectorAll(elementsSelector);
      if (elements.length === 0) return;

      const trigger = triggerSelector ? document.querySelector(triggerSelector) : elements[0];
      if (!trigger) return;

      gsap.from(elements, {
        scrollTrigger: {
          trigger: trigger,
          start: 'top 92%', // Trigger when the top of the container enters 8% from the bottom of the viewport
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 1.0,
        stagger: staggerVal,
        ease: 'power2.out',
        clearProps: 'opacity,transform', // Completely clears inline style overrides after entrance completes
        onComplete: () => {
          // Activates hover effects smoothly using CSS Transitions
          elements.forEach(el => el.classList.add('ready-transition'));
        }
      });
    };

    // Stagger grids as they scroll into view
    animateOnScroll('.sector-card', '.sector-grid', 0.08);
    animateOnScroll('.continuum-stop', '.continuum-track', 0.06);
    animateOnScroll('.gallery-item', '.gallery-grid', 0.08);
    animateOnScroll('.stat-item', '.stat-band', 0.08);
    animateOnScroll('.feature-card', '.feature-grid', 0.08);
    animateOnScroll('.team-card', '.team-grid', 0.08);
    animateOnScroll('.continuum-item', '.continuum-vert', 0.08);

    // Refresh triggers calculation on window full load (to handle images loading and shifts)
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  // --- Premium Interactive Form Feedback ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show processing feedback
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Enquiry...';
      formStatus.style.color = 'var(--gray)';
      formStatus.textContent = 'Processing your request...';

      // Simulate network request
      setTimeout(() => {
        // Clear form fields
        contactForm.reset();

        // Restore button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;

        // Show premium success notice
        formStatus.style.color = 'var(--gold)';
        formStatus.textContent = 'Thank you! Your enquiry has been received. Our team will get back to you within one business day.';
        
        // GSAP animate success text
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(formStatus, 
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
          );
        }
      }, 1200);
    });
  }
});
