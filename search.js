/**
 * SEARCH.JS
 * Adds functionality for the product search bar dynamically updating visible products.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // Find all search inputs on the page (mobile and desktop navigation might have different ones)
    const searchInputs = document.querySelectorAll(".search-bar input");
    
    searchInputs.forEach(input => {
        // Listen to every key typed into the search bar
        input.addEventListener("keyup", (event) => {
            
            // Get the text typed, normalize to lowercase for easy matching
            const searchTerm = event.target.value.toLowerCase().trim();
            
            // Filter the global 'allProducts' array (which is loaded in products.js)
            const filteredProducts = allProducts.filter(product => {
                
                // Safely convert properties to lowercase for comparison
                const safeName = (product.name || "").toLowerCase();
                const safeDesc = (product.description || "").toLowerCase();
                const safeBadge = (product.ecoBadge || "").toLowerCase();
                
                // Check if the search term exists in Name, Description, or Eco Badge strings
                return safeName.includes(searchTerm) || 
                       safeDesc.includes(searchTerm) || 
                       safeBadge.includes(searchTerm);
            });
            
            // Check if we are on a page that actually has the products grid to render into
            const productsContainer = document.getElementById("products");
            if (productsContainer) {
                // Rely on the renderProducts function built inside products.js
                renderProducts(filteredProducts);
            } else {
                // If the user searches from index.html or another page, redirect them to shop
                if (event.key === "Enter" && searchTerm.length > 0) {
                    // For a basic implementation, we just redirect. 
                    // Advanced implementation would pass query params: window.location.href = `shop.html?search=${searchTerm}`;
                    alert("Searching across the store! Redirecting to shop...");
                    window.location.href = "shop.html";
                }
            }
        });
    });
});
