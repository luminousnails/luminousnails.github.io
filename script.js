document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu functionality
  function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");

    function toggleMenu() {
      navMenu.classList.toggle("active");
      mobileMenuToggle.classList.toggle("active");
    }

    mobileMenuToggle.addEventListener("click", toggleMenu);

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
    const requiredFields = document.querySelectorAll('.ff-el-form-control:required');
    
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

  // Call all setup functions
  setupMobileMenu();
  populateServiceDropdown();
  handleRequiredFields();
});