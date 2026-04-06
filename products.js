/**
 * PRODUCTS.JS
 * Fetches products from backend API and renders them inside the products container.
 */

// Global array to store products so that search.js and filters.js can access them
let allProducts = [];

// The defined API endpoint
const API_URL = "http://localhost:51296/products";

/**
 * Fetch products from the backend API
 */
async function fetchProducts() {
    const productsContainer = document.getElementById("products");
    if (!productsContainer) return; // Only execute if we are on a page with products container (like shop.html)

    productsContainer.innerHTML = '<p style="text-align:center; width:100%; color: var(--primary-color);">Loading green gadgets...</p>';

    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        allProducts = data; // Store data globally for filtering and searching
        
        // Render the fetched products
        renderProducts(allProducts);
        
    } catch (error) {
        console.error("Failed to fetch products from backend API:", error);
        
        // Beginner-friendly error handling: If the API is not running, let's load some mock data 
        // so the page doesn't look broken during development.
        console.warn("Falling back to sample mock data because the local API server doesn't seem to be running.");
        loadMockProducts();
    }
}

/**
 * Renders an array of products into the HTML DOM using the agreed upon card structure.
 * Takes an array of products so it can be reused by filters/search functions.
 */
function renderProducts(productsToRender) {
    const productsContainer = document.getElementById("products");
    if (!productsContainer) return;

    productsContainer.innerHTML = ""; // Clear existing contents

    if (productsToRender.length === 0) {
        productsContainer.innerHTML = "<p style='text-align:center; grid-column: 1 / -1;'>No eco-friendly gadgets match your criteria. Keep hunting!</p>";
        return;
    }

    productsToRender.forEach(product => {
        // Fallbacks if data properties are missing from the API
        const safeName = product.name || "Eco Gadget";
        const safePrice = product.price ? product.price.toFixed(2) : "0.00";
        const safeImage = product.imageUrl || "logo.jpg";
        const safeDesc = product.description || "A wonderful sustainable product.";
        const safeScore = product.ecoScore || "9.0/10";
        const safeCarbon = product.carbonSaved || "5kg/year";
        const safeCategory = product.category || "Eco Friendly";
        const safeEnergy = product.energySaving || "10%";
        
        // Note: product logic must stringify an entire object so addToCart knows specifics
        // For simplicity, we turn the object into a JSON string and escape quotes
        const stringifiedProduct = JSON.stringify(product).replace(/"/g, '&quot;');

        const cardHTML = `
            <div class="product-box">
                <img src="${safeImage}" alt="${safeName}">
                ${product.highlight ? `<span class="product-tag" style="background:#fbc02d; color:#333;">${product.highlight}</span>` : ''}
                <div class="product-content">
                    <div class="eco-badges">
                        <span class="eco-badge-small">
                            <i class="fa-solid fa-leaf"></i> ${safeCategory}
                        </span>
                        <span class="eco-score-badge">Eco Score: ${safeScore}</span>
                    </div>

                    <h2>${safeName}</h2>
                    <div class="product-price">$${safePrice}</div>
                    <p style="font-size: 0.9rem;">${safeDesc}</p>

                    <p style="font-size: 0.85rem; margin-top: 10px; margin-bottom: 2px;"><strong>Carbon Saved:</strong> ${safeCarbon}</p>
                    <p style="font-size: 0.85rem;"><strong>Energy Saving:</strong> ${safeEnergy}</p>

                    <div class="product-actions" style="margin-top: auto; padding-top: 15px;">
                        <!-- On click, call the addToCart function located in cart.js, passing the product object -->
                        <button class="btn-primary" onclick='addToCart(${stringifiedProduct})'>
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                        <a href="product-details.html" class="btn-secondary">View Details</a>
                    </div>
                </div>
            </div>
        `;
        
        productsContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}

/**
 * Helper function containing static mock data used when the actual backend API fails.
 */
function loadMockProducts() {
    allProducts = [
        {
            id: "101",
            name: "Solar Charger",
            price: 59.00,
            imageUrl: "waterproof charger.jpg",
            description: "High-efficiency waterproof solar charger perfect for outdoor adventures.",
            ecoScore: "9.9/10",
            carbonSaved: "10kg/year",
            energySaving: "20%",
            category: "Solar Powered",
            highlight: "Best Sustainable Choice"
        },
        {
            id: "102",
            name: "Eco Phone Case",
            price: 25.00,
            imageUrl: "wooden case.jpg",
            description: "Durable and stylish phone case crafted from sustainable bamboo wood.",
            ecoScore: "9.4/10",
            carbonSaved: "2kg/year",
            energySaving: "0%",
            category: "Biodegradable"
        },
        {
            id: "103",
            name: "Smart Thermostat",
            price: 120.00,
            imageUrl: "smart thermostat.jpg",
            description: "Optimize your home heating and cooling, saving energy automatically.",
            ecoScore: "9.5/10",
            carbonSaved: "25kg/year",
            energySaving: "30%",
            category: "Energy Efficient",
            highlight: "Smart Living"
        },
        {
            id: "104",
            name: "Rechargeable Batteries",
            price: 35.00,
            imageUrl: "battery.jpg",
            description: "Long-lasting rechargeable battery pack that reduces toxic waste.",
            ecoScore: "8.8/10",
            carbonSaved: "5kg/year",
            energySaving: "10%",
            category: "Recycled Materials"
        }
    ];

    renderProducts(allProducts);
}

// Initial fetch when the document is ready
document.addEventListener("DOMContentLoaded", fetchProducts);
