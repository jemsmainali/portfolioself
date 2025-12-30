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