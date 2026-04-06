/**
 * FILTERS.JS
 * Adds filtering options for sustainability tags and sorts existing products.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Sort Dropdown Logic
    const sortSelect = document.querySelector(".sort-select");
    
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            const sortMode = e.target.value;
            
            // Create a copy of the array so we don't permanently mess up the original fetch order
            let sortedProducts = [...allProducts];
            
            if (sortMode === "price-low") {
                sortedProducts.sort((a, b) => a.price - b.price);
            } 
            else if (sortMode === "price-high") {
                sortedProducts.sort((a, b) => b.price - a.price);
            }
            else if (sortMode === "new") {
                // For 'new', we sort by eco score highest first as a proxy, 
                // since our mock data doesn't have an explicit 'date added'
                sortedProducts.sort((a, b) => parseFloat(b.ecoScore) - parseFloat(a.ecoScore));
            }
            
            // Re-render the grid
            renderProducts(sortedProducts);
        });
    }

    // 2. Sidebar Sustainability Links Logic
    const filterLinks = document.querySelectorAll(".filter-group .category-list a");
    
    filterLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Stop the link from jumping the page
            
            // Manage 'active' state styling of the links
            filterLinks.forEach(l => l.classList.remove("active"));
            e.target.classList.add("active");
            
            // Get the text inside the link ignoring the icon HTML
            const rawText = e.target.textContent.trim();
            
            let filteredProducts;
            
            // If the user clicks 'All Products', reset
            if (rawText === "All Products") {
                filteredProducts = [...allProducts];
            } else {
                // Filter where the product's badge or description matches the sidebar text clicked
                filteredProducts = allProducts.filter(product => {
                    const safeBadge = (product.ecoBadge || "").toLowerCase();
                    const safeName = (product.name || "").toLowerCase();
                    const searchTarget = rawText.toLowerCase();
                    
                    return safeBadge.includes(searchTarget) || safeName.includes(searchTarget);
                });
            }
            
            // Re-render the grid based on the filtered results
            renderProducts(filteredProducts);
            
            // Scroll user up to the top of the products grid to clearly see the change
            document.getElementById("products").scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
    
});
