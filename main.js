/**
 * MAIN.JS
 * This file handles global UI interactions like animations, active links, and mobile navigation.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Navbar Active Link Highlight
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll("nav ul li a");
    
    navLinks.forEach(link => {
        // Remove active class from all links first
        link.classList.remove("active");
        
        // If the link's href matches the current page URL, make it active
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
        
        // Default to Home if root path
        if ((currentPage === "" || currentPage === "/") && link.getAttribute("href") === "index.html") {
            link.classList.add("active");
        }
    });

    // 2. Mobile Navbar Toggle (Creates a hamburger menu if on small screens)
    const navbar = document.querySelector(".navbar");
    const navMenu = document.querySelector("nav ul");
    
    if (window.innerWidth <= 900) {
        // Create hamburger button dynamically
        const mobileToggle = document.createElement("button");
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        mobileToggle.style.background = "none";
        mobileToggle.style.border = "none";
        mobileToggle.style.fontSize = "1.5rem";
        mobileToggle.style.color = "var(--primary-color)";
        mobileToggle.style.cursor = "pointer";
        
        // Hide nav menu initially on mobile
        navMenu.style.display = "none";
        navMenu.style.flexDirection = "column";
        navMenu.style.width = "100%";
        
        // Insert it before the nav-icons block
        const navIcons = document.querySelector(".nav-icons");
        navbar.insertBefore(mobileToggle, navIcons);
        
        mobileToggle.addEventListener("click", () => {
            if (navMenu.style.display === "none") {
                navMenu.style.display = "flex";
            } else {
                navMenu.style.display = "none";
            }
        });
    }

    // 3. Smooth Scrolling for internal anchor links (like Hero buttons)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            if(targetId === "#") return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    // 4. Simple animations on scroll using IntersectionObserver
    // We target product boxes and feature cards to fade them in when visible
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a simple inline animation style instantly
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                entry.target.style.transition = "opacity 0.6s ease, transform 0.6s ease";
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(".feature-card, .product-box, .impact-stat");
    
    // Set initial state for elements to be animated
    elementsToAnimate.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        animateOnScroll.observe(el);
    });
    
    // 5. Hero button interactions (Subtle click effect)
    const heroButtons = document.querySelectorAll(".btn-primary, .btn-secondary");
    heroButtons.forEach(btn => {
        btn.addEventListener("mousedown", () => {
            btn.style.transform = "scale(0.95)";
        });
        btn.addEventListener("mouseup", () => {
            btn.style.transform = "scale(1)";
        });
    });
});
