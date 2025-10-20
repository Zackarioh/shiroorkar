// Wait for the DOM (HTML) to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Sticky Header on Scroll ---
    const header = document.getElementById('main-header');

    // Listen for the 'scroll' event on the window
    window.addEventListener('scroll', function() {
        // window.scrollY is how far down the user has scrolled
        if (window.scrollY > 50) {
            // If scrolled more than 50px, add the 'scrolled' class
            header.classList.add('scrolled');
        } else {
            // Otherwise, remove it
            header.classList.remove('scrolled');
        }
    });


    // --- 2. Simple Contact Form Submission ---
    const form = document.getElementById('contact-form');

    // Listen for the 'submit' event on the form
    form.addEventListener('submit', function(event) {
        // IMPORTANT: Prevent the form's default behavior (which is to reload the page)
        event.preventDefault();

        // Get the values from the form (for a real site, you'd send this to a server)
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        // Give the user feedback
        alert(`Thank you, ${name}! \nYour message has been received.`);

        // Clear the form fields
        form.reset();
    });

});