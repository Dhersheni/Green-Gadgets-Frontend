/**
 * CART.JS
 * Manages adding, removing, updating items in the cart using localStorage.
 */

// Global cart array fetched from localStorage (or empty if it doesn't exist)
let cart = JSON.parse(localStorage.getItem('greenGadgetsCart')) || [];

// Function to save the cart back to localStorage and update the navbar badge
function saveCart() {
    localStorage.setItem('greenGadgetsCart', JSON.stringify(cart));
    updateCartCount();
}

// Function to update the navbar cart badge count
function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        // Calculate total quantity of items (not just unique products)
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Ensure the count is updated immediately on every page load
document.addEventListener("DOMContentLoaded", updateCartCount);

/**
 * Add a product to the cart
 * This is designed to be called from products.js when clicking "Add to Cart"
 */
async function addToCart(product) {
    try {
        // 1. Send the POST request to the Spring Boot backend MySQL Database
        // We package the product properties so the backend model maps them easily
        const cartPayload = {
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl || "logo.jpg",
            category: product.category || "Eco",
            quantity: 1
        };

        const response = await fetch("http://localhost:51296/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cartPayload)
        });

        if (!response.ok) {
            throw new Error(`Server returned status: ${response.status}`);
        }
        console.log("Product saved directly to Spring Boot backend database successfully!");

    } catch (error) {
        console.error("Backend Cart Error - Could not sync POST request:", error);
        // We will purposely let the script continue downward to the local state, so
        // the button click visually works even if the server is off during development.
    }

    // 2. Local State Management (UI Cache)
    // Check if product already exists in local cart array using its ID
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        // If it exists, gracefully increment the quantity locally
        existingItem.quantity += 1;
    } else {
        // If not, add brand new product to cart array with local fields extracted from payload
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.imageUrl || "logo.jpg",
            ecoScore: product.ecoScore || "N/A",
            carbonSaved: parseFloat(product.carbonSaved) || 0,
            energySaved: parseFloat(product.energySaving) || 0,
            quantity: 1
        });
    }
    
    saveCart();
    alert(`Added ${product.name} to your cart successfully!\nEco Action!`);
}

/**
 * Update product quantity
 */
function updateQuantity(productId, newQuantity) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity = parseInt(newQuantity);
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCartPage(); // Re-render the cart if we are on the cart page
        }
    }
}

/**
 * Remove a specific product from cart
 */
function removeFromCart(productId) {
    // Filter out the product that matches the ID
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartPage(); // Re-render the cart if we are on the cart page
}

/**
 * Function specifically for rendering items on cart.html page
 */
function renderCartPage() {
    const cartContainer = document.getElementById("cart-items-container");
    
    // Only run this code if we are actually on the cart.html page
    if (!cartContainer) return;
    
    // If cart is empty, show a message
    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your eco-friendly cart is currently empty. Head over to the shop!</p>";
        updateCartSummary(); // Reset summary to 0
        return;
    }

    // Clear loading placeholder
    cartContainer.innerHTML = "";

    // Loop through each item and create the HTML structure dynamically
    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        
        const cartItemHTML = `
            <div class="cart-item">
                <img src="${item.image || 'logo.jpg'}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">₹${item.price.toFixed(2)}</p>
                    <p style="font-size: 0.8rem; color: #2e7d32; display: inline-flex; align-items:center;">
                        <i class="fa-solid fa-leaf" style="margin-right: 5px;"></i> Eco Score: ${item.ecoScore}
                    </p>
                </div>
                <div class="item-quantity">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', this.value)">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <div class="item-total">₹${itemTotal}</div>
                <button class="item-remove" title="Remove Item" onclick="removeFromCart('${item.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        
        cartContainer.insertAdjacentHTML('beforeend', cartItemHTML);
    });

    updateCartSummary();
}

/**
 * Function to calculate totals and update the summary on the cart page
 */
function updateCartSummary() {
    const summaryContainer = document.querySelector(".cart-summary");
    if (!summaryContainer) return;

    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Simple mock logic for eco shipping and tax
    const ecoShipping = subtotal > 0 ? 5.00 : 0;
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + ecoShipping + tax;

    // Calculate total environmental impact
    const totalCarbonOffset = cart.reduce((sum, item) => sum + (parseFloat(item.carbonSaved) * item.quantity), 0);
    const totalEnergySaved = cart.reduce((sum, item) => sum + (parseFloat(item.energySaved) * item.quantity), 0);

    // Rebuild the summary specific to the values
    summaryContainer.innerHTML = `
        <h3>Order Summary</h3>
        <div class="summary-row">
            <span>Subtotal</span>
            <span>₹${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Eco Shipping</span>
            <span>₹${ecoShipping.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Estimated Tax (10%)</span>
            <span>₹${tax.toFixed(2)}</span>
        </div>
        <div class="summary-total">
            <span>Total</span>
            <span>₹${total.toFixed(2)}</span>
        </div>
        
        ${subtotal > 0 ? `
        <div class="eco-message">
            <h4 style="margin-bottom: 5px;"><i class="fa-solid fa-leaf"></i> Great Sustainable Choice!</h4>
            <p style="font-size: 0.85rem; color: #333;">By purchasing these items, you are saving <strong>${totalEnergySaved} kWh of energy</strong> and offsetting <strong>${totalCarbonOffset} kg of carbon emissions</strong>.</p>
        </div>` : ''}
        
        <button class="btn-primary checkout-btn" onclick="alert('Proceeding to Checkout! Thanks for going green.')">Proceed to Checkout <i class="fa-solid fa-lock"></i></button>
        <a href="shop.html" class="continue-shopping">Continue Shopping</a>
    `;
}

// Call render function explicitly once the page loads if we are on the cart page.
document.addEventListener("DOMContentLoaded", renderCartPage);
