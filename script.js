// This 'DOMContentLoaded' event makes sure the HTML is fully loaded
// before the script tries to find elements.
document.addEventListener('DOMContentLoaded', function() {

    // 1. Find the button and the heading elements in the HTML
    const button = document.getElementById('colorButton');
    const heading = document.getElementById('myHeading');

    // 2. Add an "event listener" to the button that waits for a 'click'
    button.addEventListener('click', function() {
        // 3. When the button is clicked, run this code:
        heading.textContent = 'You clicked the button!';
        heading.style.color = '#dc3545'; // Changes the text color
    });

});