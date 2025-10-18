// This code runs after the entire HTML document has been loaded
document.addEventListener('DOMContentLoaded', () => {

    // 1. Find the button and the message paragraph in the HTML
    const myButton = document.getElementById('myButton');
    const message = document.getElementById('message');

    // 2. Add an "event listener" to the button.
    // This tells the button to "listen" for a click.
    myButton.addEventListener('click', () => {
        
        // 3. When the button is clicked, change the text of the paragraph.
        message.textContent = 'You clicked the button! 🎉';
    });
    
});