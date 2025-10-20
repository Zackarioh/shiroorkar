// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", () => {

    // --- Image Gallery Logic ---
    const mainImage = document.getElementById("main-image");
    const thumbnails = document.querySelectorAll(".thumbnail");

    thumbnails.forEach(thumb => {
        thumb.addEventListener("click", () => {
            // Get the 'src' of the clicked thumbnail
            // Use .replace() to get the high-res version from the placeholder URL
            const newImageSrc = thumb.src.replace("100x100", "600x600");
            
            // Set the main image src to the new one
            mainImage.src = newImageSrc;
            mainImage.alt = thumb.alt;

            // Update the active thumbnail styling
            document.querySelector(".thumbnail.active-thumb").classList.remove("active-thumb");
            thumb.classList.add("active-thumb");
        });
    });

    // --- Size Selector Logic ---
    const sizeSelector = document.getElementById("size-selector");
    const sizeButtons = sizeSelector.querySelectorAll(".size-btn");

    sizeButtons.forEach(button => {
        // Check if the button is not disabled
        if (!button.disabled) {
            button.addEventListener("click", () => {
                // Remove 'active-size' from the currently active button
                const currentActive = sizeSelector.querySelector(".active-size");
                if (currentActive) {
                    currentActive.classList.remove("active-size");
                }
                
                // Add 'active-size' to the clicked button
                button.classList.add("active-size");
            });
        }
    });

    // --- Accordion Logic ---
    const accordionTitles = document.querySelectorAll(".accordion-title");

    accordionTitles.forEach(title => {
        title.addEventListener("click", () => {
            const content = title.nextElementSibling;
            
            // Toggle the content display
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    });
    
    // Default open the first accordion
    const firstAccordionContent = document.querySelector(".accordion-content");
    if(firstAccordionContent) {
        firstAccordionContent.style.display = "block";
    }

});