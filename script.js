// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Intersection Observer for fade-in animations on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section, article').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Basic form submission (alert for demo; replace with real backend)
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Message sent! (This is a demo. Integrate with a service like Formspree for real functionality.)');
    this.reset();
});

// Handle form submission with Fetch for better UX
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission

    const form = e.target;
    const formData = new FormData(form);

    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Message sent successfully! Thank you.');
            form.reset(); // Clear the form
        } else {
            alert('Oops! Something went wrong. Please try again.');
        }
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
});


// Mobile menu toggle with debugging and UX improvements
document.addEventListener('DOMContentLoaded', () => {  // Ensure DOM is loaded
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!mobileMenuButton || !mobileMenu) {
        console.error('Mobile menu elements not found. Check IDs in HTML.');
        return;
    }

    console.log('Mobile menu initialized.');

    mobileMenuButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Menu button clicked.');
        mobileMenu.classList.toggle('hidden');
        // Optional: Change button text/icon on toggle
        const isOpen = !mobileMenu.classList.contains('hidden');
        mobileMenuButton.innerHTML = isOpen ? '<i class="fas fa-times"></i> Close' : '<i class="fas fa-bars"></i> Menu';
    });

    // Close menu when a link is clicked (improved UX)
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            console.log('Menu link clicked. Closing menu.');
            mobileMenu.classList.add('hidden');
            mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i> Menu';  // Reset button
        });
    });

    // Optional: Close menu on outside click (for better UX)
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i> Menu';
        }
    });
});