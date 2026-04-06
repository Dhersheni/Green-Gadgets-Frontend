import os

files = [
    "index.html", "shop.html", "about.html", 
    "contact.html", "cart.html", "profile.html", "product-details.html"
]

base_dir = r"c:\Users\Admin\Downloads\Green-Gadgets-main"

for f in files:
    path = os.path.join(base_dir, f)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as file:
            content = file.read()
        
        # Replace cart badge
        content = content.replace('<span class="cart-badge">2</span>', '<span class="cart-badge" id="cart-count">0</span>')
        
        # Inject standard scripts before body
        if "main.js" not in content:
            script_injection = '    <script src="main.js"></script>\n    <script src="cart.js"></script>\n</body>'
            content = content.replace('</body>', script_injection)
        
        with open(path, "w", encoding="utf-8") as file:
            file.write(content)

print("Updated HTML files with cart IDs and base scripts.")
