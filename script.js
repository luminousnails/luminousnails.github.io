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

  // Call all setup functions
  setupMobileMenu();
  populateServiceDropdown();
  handleRequiredFields();
  setupDateValidation();
  setupFullScreenImage();
});