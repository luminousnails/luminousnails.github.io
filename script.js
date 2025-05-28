document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu functionality
  function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");

    if (!mobileMenuToggle || !navMenu) {
      console.error("Mobile menu elements not found");
      return;
    }

    function toggleMenu() {
      navMenu.classList.toggle("active");
      mobileMenuToggle.classList.toggle("active");

      // Toggle aria-expanded attribute
      const isExpanded = mobileMenuToggle.getAttribute("aria-expanded") === "true" || false;
      mobileMenuToggle.setAttribute("aria-expanded", !isExpanded);

      // Toggle body scroll
      document.body.style.overflow = isExpanded ? "auto" : "hidden";
    }

    mobileMenuToggle.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleMenu();
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768) {
          toggleMenu();
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      const isClickInsideMenu = navMenu.contains(e.target);
      const isClickOnToggle = mobileMenuToggle.contains(e.target);

      if (
        !isClickInsideMenu &&
        !isClickOnToggle &&
        navMenu.classList.contains("active")
      ) {
        toggleMenu();
      }
    });

    // Reset menu state on window resize
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        navMenu.classList.remove("active");
        mobileMenuToggle.classList.remove("active");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "auto";
      }
    });
  }

  // Populate service dropdown
  function populateServiceDropdown() {
    const serviceDropdown = document.getElementById("service");
    const serviceCategories = document.querySelectorAll(
      "#services .service-category"
    );

    // Clear existing options
    serviceDropdown.innerHTML = '<option value="">- Select -</option>';

    serviceCategories.forEach((category) => {
      const categoryName = category.querySelector("h3").textContent.trim();

      // Add non-selectable category header
      const groupHeader = document.createElement("option");
      groupHeader.textContent = categoryName;
      groupHeader.disabled = true;
      groupHeader.style.fontWeight = "bold";
      groupHeader.style.backgroundColor = "#f0f0f0";
      serviceDropdown.appendChild(groupHeader);

      // Add services under this category
      const services = category.querySelectorAll(
        ".service-item .service-name"
      );
      services.forEach((service) => {
        const option = document.createElement("option");
        option.value = service.textContent.trim();
        option.textContent = "  " + service.textContent.trim(); // Add indentation
        serviceDropdown.appendChild(option);
      });
    });
  }

  // Handle required fields
  function handleRequiredFields() {
    const requiredFields = document.querySelectorAll('.form-control:required');

    requiredFields.forEach(field => {
      function checkField() {
        if (field.value.trim() !== '') {
          field.classList.add('filled');
        } else {
          field.classList.remove('filled');
        }
      }

      field.addEventListener('input', checkField);

      // Initial check in case fields are pre-filled
      checkField();
    });
  }

  // Validate preferred date
  function setupDateValidation() {
    const dateInput = document.getElementById('preferredDate');
    if (!dateInput) return;

    // Set min attribute to today's date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`;
    dateInput.min = todayString;

    dateInput.addEventListener('change', function () {
      const selectedDate = new Date(this.value);
      const todayDate = new Date(todayString);

      if (selectedDate < todayDate) {
        alert('Please select today or a future date.');
        this.value = ''; // Clear the invalid date
      }
    });
  }

  function setupFullScreenImage() {
    document.querySelectorAll('.thumbnail-image').forEach(thumbnail => {
      thumbnail.addEventListener('click', function () {
        const fullScreenImage = document.getElementById('fullScreenImage');
        const fullScreenImgTag = fullScreenImage.querySelector('img');
        fullScreenImgTag.src = this.getAttribute('data-full');
        fullScreenImage.style.display = 'flex';
      });
    });

    document.getElementById('fullScreenImage').addEventListener('click', function () {
      this.style.display = 'none';
    });
  }

  // Setup interactive map functionality
  function setupInteractiveMap() {
    const mapContainer = document.querySelector('.map-container iframe');
    const mapLinks = document.querySelectorAll('.map-link');
    const locationDropdown = document.getElementById('location');

    // Debug logging
    console.log('Setting up interactive map...');
    console.log('Map container found:', !!mapContainer);
    console.log('Map links found:', mapLinks.length);
    console.log('Location dropdown found:', !!locationDropdown);

    // If essential elements are missing, exit early
    if (!mapContainer) {
      console.error('Map container not found');
      return;
    }

    // Map URLs for different locations (no API key required)
    const mapUrls = {
      'palmview': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10769.234833108465!2d153.03785045974269!3d-26.750823725913754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b9377f4cbe999a7%3A0x8746d9fa8e02533!2sLuminous%20Nails%20Sunshine%20Coast!5e0!3m2!1sen!2sau!4v1724069961704!5m2!1sen!2sau',
      'halo': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.5!2d152.9785!3d-27.3017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b93ef123456789a%3A0x123456789abcdef0!2s11%20Halo%20Ct%2C%20Bray%20Park%20QLD%204500!5e0!3m2!1sen!2sau!4v1624069961704!5m2!1sen!2sau'
    };

    // Direct Google Maps URLs for opening in new tab
    const directMapUrls = {
      'palmview': 'https://www.google.com/maps/place/85+Palmview+Forest+Drive,+Palmview+QLD+4553',
      'halo': 'https://www.google.com/maps/place/11+Halo+Ct,+Bray+Park+QLD+4500'
    };

    // Function to update map and visual state
    function updateMapAndState(locationKey) {
      console.log('Updating map to:', locationKey);
      
      // Update embedded map
      if (mapContainer && mapUrls[locationKey]) {
        const newSrc = mapUrls[locationKey];
        console.log('Setting map src to:', newSrc);
        mapContainer.src = newSrc;
      }

      // Update address link highlighting
      mapLinks.forEach(l => l.classList.remove('active'));
      const targetLink = document.querySelector(`[data-address*="${locationKey === 'palmview' ? 'Palmview Forest Drive' : 'Halo Ct'}"]`);
      console.log('Target link found:', !!targetLink);
      if (targetLink) {
        targetLink.classList.add('active');
      }

      // Update dropdown selection
      if (locationDropdown && locationDropdown.value !== locationKey) {
        console.log('Updating dropdown to:', locationKey);
        locationDropdown.value = locationKey;
        // Trigger change event for form handling
        locationDropdown.dispatchEvent(new Event('change'));
      }
    }

    // Set default map to show Palmview location
    console.log('Setting default map...');
    if (mapContainer) {
      mapContainer.src = mapUrls.palmview;
    }

    // Add change event listener to location dropdown
    if (locationDropdown) {
      console.log('Adding dropdown event listener...');
      locationDropdown.addEventListener('change', function() {
        const selectedLocation = this.value;
        console.log('Dropdown changed to:', selectedLocation);
        if (selectedLocation && mapUrls[selectedLocation]) {
          updateMapAndState(selectedLocation);
        }
      });
    } else {
      console.warn('Location dropdown not found');
    }

    // Add click event listeners to map links
    console.log('Adding click event listeners to', mapLinks.length, 'map links...');
    mapLinks.forEach((link, index) => {
      console.log('Setting up link', index, ':', link.getAttribute('data-address'));
      link.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Map link clicked:', this.getAttribute('data-address'));
        
        const address = this.getAttribute('data-address');
        let mapKey = 'palmview'; // default
        
        if (address && address.includes('Palmview Forest Drive')) {
          mapKey = 'palmview';
        } else if (address && address.includes('Halo Ct')) {
          mapKey = 'halo';
        }
        
        console.log('Determined mapKey:', mapKey);
        
        // Check if this location is already active (showing in the map)
        const isAlreadyActive = this.classList.contains('active');
        console.log('Is already active:', isAlreadyActive);
        
        if (isAlreadyActive) {
          // Second click - open in new tab
          console.log('Second click - opening in new tab');
          if (directMapUrls[mapKey]) {
            window.open(directMapUrls[mapKey], '_blank');
          }
        } else {
          // First click - update map and sync with dropdown
          console.log('First click - updating map');
          updateMapAndState(mapKey);
        }
      });
    });

    if (mapLinks.length === 0) {
      console.warn('No map links found with class "map-link"');
    }
  }

  // Call all setup functions
  setupMobileMenu();
  populateServiceDropdown();
  handleRequiredFields();
  setupDateValidation();
  setupFullScreenImage();
  setupInteractiveMap();
  
  // Fallback initialization for map functionality
  setTimeout(() => {
    const mapContainer = document.querySelector('.map-container iframe');
    const mapLinks = document.querySelectorAll('.map-link');
    const locationDropdown = document.getElementById('location');
    
    if (!mapContainer || mapLinks.length === 0 || !locationDropdown) {
      console.warn('Retrying map setup due to missing elements...');
      console.log('Map container:', !!mapContainer);
      console.log('Map links:', mapLinks.length);
      console.log('Location dropdown:', !!locationDropdown);
      setupInteractiveMap();
    }
  }, 1000);
});