// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Leaflet map
    initMap();
    
    // Initialize navigation menu toggle
    initNavMenu();
    
    // Initialize smooth scrolling - FIXED VERSION
    initSmoothScroll();
    
    // Add up button to the page
    addUpButton();
  });
  
  // Initialize Leaflet map
  function initMap() {
    // Target the map container
    const mapContainer = document.querySelector('.map-placeholder');
    
    if (mapContainer) {
      // Clear placeholder text
      mapContainer.innerHTML = '';
      
      // Create a div with id for the map
      const mapDiv = document.createElement('div');
      mapDiv.id = 'map';
      mapDiv.style.height = '100%';
      mapDiv.style.width = '100%';
      mapContainer.appendChild(mapDiv);
      
      // Initialize the map centered on Litoměřice
      const map = L.map('map').setView([50.5335, 14.1317], 13);
      
      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Add a marker for Litoměřice city center
      const marker = L.marker([50.5335, 14.1317]).addTo(map);
      marker.bindPopup('<b>Litoměřice</b><br>Okresní město').openPopup();
    }
  }
  
  // Mobile navigation menu toggle
  function initNavMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuButton && navList) {
      mobileMenuButton.addEventListener('click', function() {
        navList.classList.toggle('active');
        
        // Toggle hamburger icon to X
        const hamburgerIcon = mobileMenuButton.querySelector('.hamburger-icon');
        if (hamburgerIcon) {
          hamburgerIcon.classList.toggle('active');
        }
      });
      
      // Close menu when clicking a nav link on mobile
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', function() {
          if (window.innerWidth <= 768) {
            navList.classList.remove('active');
            
            const hamburgerIcon = mobileMenuButton.querySelector('.hamburger-icon');
            if (hamburgerIcon) {
              hamburgerIcon.classList.remove('active');
            }
          }
        });
      });
    }
  }
  
  // FIXED: Smooth scrolling for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Get header height for offset
          const headerHeight = document.querySelector('.main-header').offsetHeight;
          
          // Set active class in navigation
          document.querySelectorAll('.nav-link').forEach(navLink => {
            navLink.classList.remove('active');
            if (navLink.getAttribute('href') === targetId) {
              navLink.classList.add('active');
            }
          });
          
          // Use scrollIntoView with smooth behavior for better compatibility
          const scrollOptions = {
            behavior: 'smooth',
            block: 'start'
          };
          
          // Calculate target position manually and apply scroll
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Disable the default HTML smooth scrolling to avoid conflicts
    if ('scrollBehavior' in document.documentElement.style) {
      // Only if browser supports scroll-behavior
      document.documentElement.style.scrollBehavior = 'auto';
    }
  }
  
  // Add "Back to Top" button
  function addUpButton() {
    // Create the button element
    const upButton = document.createElement('button');
    upButton.className = 'up-button';
    upButton.innerHTML = '&#8679;'; // Up arrow character
    upButton.title = 'Zpět nahoru';
    document.body.appendChild(upButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.scrollY > 500) {
        upButton.classList.add('visible');
      } else {
        upButton.classList.remove('visible');
      }
    });
    
    // Scroll to top when clicked
    upButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Update active nav link based on scroll position
  window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Get current scroll position
    const scrollPosition = window.scrollY;
    
    // Calculate the position of each section
    sections.forEach(section => {
      const sectionTop = section.offsetTop - document.querySelector('.main-header').offsetHeight - 10;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        const currentId = '#' + section.getAttribute('id');
        
        // Remove active class from all links
        navLinks.forEach(link => {
          link.classList.remove('active');
        });
        
        // Add active class to corresponding nav link
        const activeLink = document.querySelector(`.nav-link[href="${currentId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  });
  
  // Add polyfill for smooth scrolling for browsers that don't support it
  if (!('scrollBehavior' in document.documentElement.style)) {
    // Simple polyfill for smooth scrolling
    function smoothScroll(target, duration) {
      const targetElement = document.querySelector(target);
      if (!targetElement) return;
      
      const headerHeight = document.querySelector('.main-header').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime = null;
      
      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }
      
      function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }
      
      requestAnimationFrame(animation);
    }
  }