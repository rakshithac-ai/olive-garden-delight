import {db, collection, getDocs} from './firebase.js'

let menuItems = [];

// --- Fetch Menu Items from Firebase ---
async function fetchMenuItems() {
    try {
        if (!db || typeof db !== 'object') {
            throw new Error('Firestore db is not initialized.')
        }
        const querySnapshot = await getDocs(collection(db, "menuItems"));
        menuItems = [];
        querySnapshot.forEach((doc) => {
            menuItems.push(doc.data());
        });
        console.log("Menu items loaded:", menuItems);
        updateCartCount();
        if (document.getElementById('menu-grid')) renderMenu(menuItems);
        if (document.getElementById('cart-items')) renderCart();
    } catch (error) {
        console.error("Error fetching menu items:", error);
        showToast("Error loading menu. Please refresh.");
    }
}

// --- Cart Initialization ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// --- Global Functions ---
function updateCartCount() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cart-count').innerText = count;
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// --- Menu Rendering ---
function renderMenu(items) {
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid) return;
    
    menuGrid.innerHTML = items.map(item => `
        <div class="food-card">
            <img src="${item.img}" alt="${item.name}">
            <div class="food-info">
                <h3>${item.name}</h3>
                <p class="price">₹${item.price}</p>
                <button class="btn btn-primary" onclick="addToCart(${item.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// --- Cart Functionality ---
function addToCart(id) {
    const item = menuItems.find(p => p.id === id);
    const existing = cart.find(p => p.id === id);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${item.name} added to cart!`);
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<tr><td colspan="5" style="text-align:center">Your cart is empty.</td></tr>';
        cartTotal.innerText = '0';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>
                <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                ${item.quantity}
                <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
            </td>
            <td>₹${item.price * item.quantity}</td>
            <td><button class="btn" style="background:red; color:white;" onclick="removeItem(${item.id})">Remove</button></td>
        </tr>
    `).join('');

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    cartTotal.innerText = total;
}

function updateQty(id, change) {
    const item = cart.find(p => p.id === id);
    item.quantity += change;
    if (item.quantity <= 0) return removeItem(id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function removeItem(id) {
    cart = cart.filter(p => p.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// --- Filtering & Search ---
function filterMenu(category) {
    const btns = document.querySelectorAll('.filter-btns .btn');
    btns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        renderMenu(menuItems);
    } else {
        const filtered = menuItems.filter(item => item.category === category);
        renderMenu(filtered);
    }
}

function searchMenu() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const filtered = menuItems.filter(item => item.name.toLowerCase().includes(query));
    renderMenu(filtered);
}

// --- Mobile Nav ---
function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('active');
}

// --- On Load ---
window.onload = () => {
    fetchMenuItems();
};

// Expose handlers used by inline onclick attributes
window.addToCart = addToCart;
window.updateQty = updateQty;
window.removeItem = removeItem;
window.filterMenu = filterMenu;
window.searchMenu = searchMenu;
window.toggleMenu = toggleMenu;