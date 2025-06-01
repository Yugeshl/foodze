// Global state
let cart = [];

// Cart-related functions
function updateCartCount() {
    console.log('Updating cart count:', cart.length);
    const cartIcon = document.querySelector('.fa-shopping-cart');
    const count = document.createElement('span');
    count.className = 'badge bg-danger position-absolute top-0 start-100 translate-middle';
    count.textContent = cart.length;
    cartIcon.parentElement.style.position = 'relative';
    const oldCount = cartIcon.parentElement.querySelector('.badge');
    if (oldCount) oldCount.remove();
    cartIcon.parentElement.appendChild(count);
}

function updateCart() {
    console.log('Updating cart with items:', cart);
    const cartItems = document.getElementById('cartItems');
    const subtotalDiv = document.querySelector('.subtotal');
    const discountDiv = document.querySelector('.discount');
    const totalDiv = document.querySelector('.total');

    if (!cartItems) {
        console.error('Cart items container not found');
        return;
    }

    // Update cart items
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-details">
                <div>
                    <strong>${item.name}</strong>
                    ${item.selectedToppings && item.selectedToppings.length > 0 ? `
                        <div class="selected-toppings">
                            ${item.selectedToppings.map(topping => 
                                `<small class="text-muted">+ ${topping.name} (${topping.price})</small>`
                            ).join('<br>')}
                        </div>
                    ` : ''}
                    <div class="cart-item-price">${item.totalPrice}</div>
                </div>
            </div>
            <div class="remove-item" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
            </div>
        </div>
    `).join('');

    // Calculate totals including toppings
    const subtotal = cart.reduce((sum, item) => {
        return sum + parseInt(item.totalPrice.replace('₹', ''));
    }, 0);

    // Apply discounts
    const discounts = [
        { threshold: 500, percentage: 50 },
        { threshold: 300, percentage: 25 },
        { threshold: 100, percentage: 10 }
    ];
    
    let discount = 0;
    let currentOffer = discounts.find(d => subtotal >= d.threshold);
    
    if (currentOffer) {
        discount = (subtotal * currentOffer.percentage) / 100;
    }

    const total = subtotal - discount;

    // Show available offers
    const offersList = document.querySelector('.offers-section ul');
    let offerDisplay;
    let nextOffer = discounts.find(d => subtotal < d.threshold);

    if (currentOffer) {
        offerDisplay = `
            <li class="offer-eligible">
                ${currentOffer.percentage}% off applied on your order
                <span class="offer-status">✅ Saving ₹${(subtotal * currentOffer.percentage / 100).toFixed(0)}</span>
            </li>`;
    } else if (nextOffer) {
        const remaining = nextOffer.threshold - subtotal;
        offerDisplay = `
            <li class="offer-inactive">
                Add ₹${remaining} more to get ${nextOffer.percentage}% off
                <span class="offer-status">🎯 Current: ₹${subtotal} / ₹${nextOffer.threshold}</span>
            </li>`;
    }
    
    if (offersList) {
        offersList.innerHTML = offerDisplay || '';
    }

    // Update summary
    if (subtotalDiv) subtotalDiv.innerHTML = `<span>Subtotal:</span><span>₹${subtotal}</span>`;
    if (discountDiv) discountDiv.innerHTML = discount > 0 ? 
        `<span>Discount:</span><span class="applied-discount">-₹${discount} (${currentOffer.percentage}% off)</span>` : '';
    if (totalDiv) totalDiv.innerHTML = `<span>Total:</span><span>₹${total}</span>`;
}

function addToCart(item) {
    console.log('Adding to cart:', item);

    // Calculate the total price including toppings
    const basePrice = parseInt(item.price.replace('₹', ''));
    const toppingsPrice = item.selectedToppings ? item.selectedToppings.reduce((sum, topping) => 
        sum + parseInt(topping.price.replace('₹', '')), 0) : 0;
    const totalPrice = basePrice + toppingsPrice;

    // Create the cart item with the calculated total price
    const cartItem = {
        ...item,
        totalPrice: `₹${totalPrice}`
    };

    cart.push(cartItem);
    updateCartCount();
    updateCart();

    // Find both modals
    const menuModal = document.getElementById('menuModal');
    const cartModal = document.getElementById('cartModal');

    if (menuModal && cartModal) {
        // First hide menu modal
        menuModal.style.display = 'none';
        // Then show cart modal
        cartModal.style.display = 'block';
    }

    // Show notification
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed top-0 end-0 m-3';
    notification.innerHTML = `Added ${item.name} to cart`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

function removeFromCart(index) {
    console.log('Removing item at index:', index);
    cart.splice(index, 1);
    updateCartCount();
    updateCart();
}

// Add removeFromCart to global scope
window.removeFromCart = removeFromCart;

// Restaurant menus data
const restaurantMenus = {
    'punjab-express': [
        { name: 'Butter Chicken', price: '₹280', image: 'http://rasamalaysia.com/wp-content/uploads/2015/07/butter-chicken2.jpg', description: 'Creamy tomato based curry with tender chicken', toppings: ['Extra Gravy +₹30', 'Extra Butter +₹20', 'Extra Chicken +₹50'] },
        { name: 'Dal Makhani', price: '₹180', image: 'https://www.whiskaffair.com/wp-content/uploads/2020/10/Dal-Makhani-2-3.jpg', description: 'Creamy black lentils cooked overnight', toppings: ['Extra Butter +₹20', 'Extra Cream +₹15'] },
        { name: 'Paneer Tikka', price: '₹220', image: 'https://i1.wp.com/wanderingmatilda.com/wp-content/uploads/2015/12/img_20151201_144511-1.jpg?fit=1080%2C1080&ssl=1', description: 'Grilled cottage cheese with spices', toppings: ['Extra Paneer +₹40', 'Extra Spices +₹10'] }
    ],
    'burger-king': [
        { name: 'Whopper', price: '₹169', image: 'https://people.com/thmb/VY-Z13-YVJk4qX8bpUIZUIVTjzU=/1500x1000/filters:fill(auto,1)/Whoppers-Birthday-PR-Image1-855697cd5f264ec09307d0f349d60a74.jpg', description: 'Signature flame-grilled beef burger', toppings: ['Extra Cheese +₹25', 'Extra Patty +₹45', 'Bacon +₹30'] },
        { name: 'Chicken Royale', price: '₹149', image: 'https://s3.amazonaws.com/ODNUploads/5534e2ead72d6bk_chicken_royale_2_1440x640.jpg', description: 'Crispy chicken breast fillet burger', toppings: ['Extra Cheese +₹25', 'Extra Mayo +₹15', 'Extra Chicken +₹40'] },
        { name: 'Veg Burger', price: '₹89', image: 'https://www.blondelish.com/wp-content/uploads/2019/02/Easy-Veggie-Burger-Recipe-Vegan-Healthy-9.jpg', description: 'Garden fresh vegetable patty burger', toppings: ['Extra Cheese +₹25', 'Extra Veggies +₹20'] }
    ],
    'dosa-corner': [
        { name: 'Masala Dosa', price: '₹120', image: 'https://img.freepik.com/premium-photo/masala-dosa-is-south-indian-meal-served-with-sambhar-coconut-chutney-selective-focus_466689-22958.jpg?w=2000', description: 'Crispy crepe filled with spiced potatoes', toppings: ['Extra Potato +₹30', 'Extra Chutney +₹15', 'Cheese +₹25'] },
        { name: 'Plain Dosa', price: '₹90', image: 'https://thumbs.dreamstime.com/z/homemade-dosa-dhosa-masala-plain-maisuri-ghee-roast-chutney-sambar-banana-leaf-isolated-south-indian-breakfast-205193390.jpg', description: 'Traditional rice and lentil crepe', toppings: ['Butter +₹15', 'Ghee +₹20', 'Podi +₹15'] },
        { name: 'Idli Sambar', price: '₹80', image: 'https://hebbarskitchen.com/wp-content/uploads/2019/02/idli-sambar-recipe-tiffin-sambar-hotel-style-idli-sambar-recipe-1.jpeg', description: 'Steamed rice cakes with lentil soup', toppings: ['Extra Sambar +₹20', 'Extra Chutney +₹15', 'Ghee +₹15'] }
    ],
    'biryani-house': [
        { name: 'Chicken Biryani', price: '₹250', image: 'https://www.whiskaffair.com/wp-content/uploads/2020/07/Chicken-Biryani-2-3.jpg', description: 'Aromatic rice with tender chicken pieces', toppings: ['Extra Chicken +₹50', 'Extra Gravy +₹30', 'Extra Raita +₹20'] },
        { name: 'Mushroom Biryani', price: '₹200', image: 'https://gingerskillet.com/wp-content/uploads/2021/03/mushroombiryani_F.jpg', description: 'Fragrant rice with mushrooms', toppings: ['Extra Mushrooms +₹40', 'Extra Gravy +₹30', 'Extra Raita +₹20'] },
        { name: 'Mutton Biryani', price: '₹300', image: 'https://paattiskitchen.com/wp-content/uploads/2023/03/kmc_20230323_230743.jpg', description: 'Rich biryani with tender mutton', toppings: ['Extra Mutton +₹70', 'Extra Gravy +₹30', 'Extra Raita +₹20'] }
    ],
    'sweet-magic': [
        { name: 'Fruit Cake', price: '₹100', image: 'https://tmbidigitalassetsazure.blob.core.windows.net/rms3-prod/attachments/37/1200x1200/exps187568_SD153320D12_05_1b.jpg', description: 'Fresh fruit cake with cream', toppings: ['Extra Cream +₹20', 'Extra Fruits +₹30', 'Chocolate Sauce +₹15'] },
        { name: 'Gulab Jamun', price: '₹120', image: 'https://th.bing.com/th/id/OIP.xsO4K7RyU47ku2sCedc0KQHaFj?rs=1&pid=ImgDetMain', description: 'Deep-fried milk solids in sugar syrup', toppings: ['Extra Syrup +₹15', 'Extra Pieces +₹30', 'Dry Fruits +₹25'] },
        { name: 'Ice Cream', price: '₹80', image: 'https://static.vecteezy.com/system/resources/previews/024/106/559/original/tasty-colorful-ice-cream-cup-with-syrups-and-fruits-on-transparent-background-png.png', description: 'Various flavors available', toppings: ['Extra Scoop +₹30', 'Hot Chocolate Sauce +₹20', 'Nuts & Sprinkles +₹15'] }
    ]
};

function showMenu(restaurantId) {
    console.log('Showing menu for:', restaurantId);
    
    const menuModal = document.getElementById('menuModal');
    if (!menuModal) {
        console.error('Menu modal not found');
        return;
    }

    const menuContent = menuModal.querySelector('.menu-items-container');
    const restaurantName = menuModal.querySelector('.restaurant-name');
    const menu = restaurantMenus[restaurantId];

    if (!menu) {
        console.error('Menu not found for restaurant:', restaurantId);
        return;
    }

    // Set restaurant name
    restaurantName.textContent = restaurantId.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    // Generate menu items HTML
    menuContent.innerHTML = menu.map(item => `
        <div class="menu-item">
            <img src="${item.image}" alt="${item.name}" class="menu-item-image">
            <div class="menu-item-details">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="toppings-section">
                    <p class="mb-2">Extras:</p>
                    ${item.toppings.map((topping, idx) => `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="${item.name}-${idx}">
                            <label class="form-check-label" for="${item.name}-${idx}">${topping}</label>
                        </div>
                    `).join('')}
                </div>
                <div class="menu-item-footer">
                    <span class="price">${item.price}</span>
                    <button class="btn btn-primary btn-sm add-to-cart-btn" 
                            data-name="${item.name}"
                            data-price="${item.price}">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners to Add to Cart buttons
    menuContent.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add to cart clicked');
            
            const menuItem = this.closest('.menu-item');
            console.log('Menu item:', menuItem);
            
            const selectedToppings = Array.from(menuItem.querySelectorAll('.form-check-input:checked')).map(cb => ({
                name: cb.nextElementSibling.textContent.split(' +')[0],
                price: cb.nextElementSibling.textContent.split(' +')[1]
            }));
            console.log('Selected toppings:', selectedToppings);
            
            const itemData = {
                name: this.dataset.name,
                price: this.dataset.price,
                selectedToppings: selectedToppings
            };
            console.log('Adding item to cart:', itemData);
            
            addToCart(itemData);
        });
    });

    // Show modal
    menuModal.style.display = 'block';
}

// Function to fetch data from Flask backend
async function fetchFromBackend() {
    try {
        // Fetch from Node.js server which proxies to Flask
        const [flaskResponse, nodeResponse] = await Promise.all([
            fetch('http://localhost:3000/api/flask-data'),
            fetch('http://localhost:3000/api/node-status')
        ]);

        const flaskData = await flaskResponse.json();
        const nodeData = await nodeResponse.json();

        console.log('Flask backend data:', flaskData);
        console.log('Node.js status:', nodeData);

        // Show notifications for both services
        if (flaskData.status === 'success') {
            showNotification(flaskData.message);
        }

        showNotification(`Node.js Server: ${nodeData.status} at ${new Date(nodeData.timestamp).toLocaleTimeString()}`);
    } catch (error) {
        console.error('Error fetching from backend:', error);
        showNotification('Error connecting to backend services', 'error');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    notification.innerHTML = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from backend
    fetchFromBackend();
    
    // Setup menu modal close button
    document.querySelectorAll('.close-menu').forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.menu-modal').style.display = 'none';
        });
    });

    // Setup view menu buttons
    document.querySelectorAll('.view-menu-btn').forEach(button => {
        button.addEventListener('click', () => {
            const restaurantId = button.dataset.restaurant;
            showMenu(restaurantId);
        });
    });

    // Setup cart button
    document.getElementById('cartButton').addEventListener('click', () => {
        document.getElementById('cartModal').style.display = 'block';
    });

    // Initialize cart displays
    updateCart();
    updateCartCount();
});
