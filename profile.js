/**
 * PROFILE.JS
 * Showcases total products purchased, amount spent, eco-points and displays encouraging messages dynamically.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // Check if we are on the profile page by verifying a specific element exists
    const itemsPurchasedEl = document.getElementById("items-purchased");
    const totalSpentEl = document.getElementById("total-spent");
    const carbonSavedEl = document.getElementById("carbon-saved");
    const energySavedEl = document.getElementById("energy-saved");
    
    if (!itemsPurchasedEl) return; // Exit if not on profile.html

    // 1. Define Sample Static User Data 
    // In a real application, this would be fetched from a backend `/user/profile` endpoint
    const userProfileData = {
        name: "Eco Warrior",
        itemsPurchased: 12,
        totalSpent: 450.00,
        sustainabilityScore: 85,
        carbonSaved: 45, // in kg
        energySaved: 120, // in kWh
        ecoPoints: 450
    };

    // 2. Update the specific DOM IDs injected earlier
    itemsPurchasedEl.textContent = userProfileData.itemsPurchased;
    totalSpentEl.textContent = `$${userProfileData.totalSpent.toFixed(2)}`;
    carbonSavedEl.textContent = `${userProfileData.carbonSaved} kg`;
    energySavedEl.textContent = `${userProfileData.energySaved} kWh`;

    // 3. Inject encouraging dynamic messages into the profile layout
    const bannerContainer = document.querySelector(".welcome-banner");
    
    if (bannerContainer) {
        // Construct an encouraging message based on the carbon saved
        const encouragingMessage = document.createElement("div");
        encouragingMessage.style.background = "#fff9c4";
        encouragingMessage.style.color = "#f57f17";
        encouragingMessage.style.padding = "15px";
        encouragingMessage.style.borderRadius = "8px";
        encouragingMessage.style.marginTop = "20px";
        encouragingMessage.style.fontWeight = "bold";
        encouragingMessage.style.display = "flex";
        encouragingMessage.style.alignItems = "center";
        encouragingMessage.style.gap = "10px";
        
        encouragingMessage.innerHTML = `
            <i class="fa-solid fa-trophy" style="font-size: 1.5rem;"></i>
            <span>Amazing job! You saved ${userProfileData.carbonSaved}kg CO₂ this year. That's equivalent to planting 2 trees!</span>
        `;
        
        // Append it visually inside the banner container
        bannerContainer.appendChild(encouragingMessage);
    }
});
