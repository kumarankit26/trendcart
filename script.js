// ================= 1. ADMINS & 210+ PRODUCTS GENERATOR =================
const ADMINS = [
    { email: 'motoiitiann@gmail.com', password: 'Ankit@2009' },
    { email: 'ankitk08538@gmail.com', password: 'Ankit@2009' }
];

if (!localStorage.getItem('usersDB')) localStorage.setItem('usersDB', JSON.stringify([]));
if (!localStorage.getItem('ordersDB')) localStorage.setItem('ordersDB', JSON.stringify([]));

// Function to generate 35+ items per category (Total 210+ Products)
function generate210Products() {
    const categoriesData = [
        { cat: "Electronics", prefix: "EL", subcats: ["Audio", "Wearables", "Computer", "Power", "Video"], brands: ["boAt", "Noise", "Realme", "Mi", "JBL", "Logitech", "Zebronics", "Portronics", "Samsung", "Sony"] },
        { cat: "Fashion", prefix: "FA", subcats: ["Apparel", "Ethnic", "Outerwear", "Formal", "Western"], brands: ["Roadster", "Mitera", "Levis", "Anubhutee", "Killer", "Puma", "Zara", "U.S. Polo", "FabIndia", "Raymond"] },
        { cat: "Beauty", prefix: "BE", subcats: ["Makeup", "Skincare", "Haircare", "Fragrance", "Appliances"], brands: ["Maybelline", "Mamaearth", "Derma Co", "Garnier", "St. Botanica", "Lakme", "Pond's", "Philips", "Beardo", "Plum"] },
        { cat: "Home & Living", prefix: "HO", subcats: ["Kitchenware", "Lighting", "Furnishing", "Decor", "Storage"], brands: ["Milton", "Prestige", "Wipro", "Bombay Dyeing", "IRIS", "Signoraware", "Scotch-Brite", "Solimo", "Kraft", "Pigeon"] },
        { cat: "Sports", prefix: "SP", subcats: ["Cricket", "Football", "Fitness", "Badminton", "Basketball"], brands: ["SS", "Nivia", "Cosco", "Cockatoo", "Yonex", "Kobo", "Spalding", "Boldfit", "Puma", "Nike"] },
        { cat: "Accessories", prefix: "AC", subcats: ["Bags", "Eyewear", "Belts", "Watches", "Wallets"], brands: ["American Tourister", "Fastrack", "Hidesign", "Titan", "Urban Forest", "Wildcraft", "Nike", "Peter England", "DailyObjects", "Lenskart"] }
    ];

    const sampleImages = [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80",
        "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=500&q=80"
    ];

    let allProds = [];
    let globalCounter = 1;

    categoriesData.forEach(item => {
        for (let i = 1; i <= 36; i++) { // 36 items per category * 6 = 216 products
            let idNum = globalCounter < 10 ? `00${globalCounter}` : globalCounter < 100 ? `0${globalCounter}` : `${globalCounter}`;
            let id = `${item.prefix}${idNum}`;
            let brand = item.brands[i % item.brands.length];
            let subcat = item.subcats[i % item.subcats.length];
            let price = Math.floor(Math.random() * 4500) + 299;
            let originalPrice = price + Math.floor(Math.random() * 2000) + 500;
            let rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
            let reviews = Math.floor(Math.random() * 500) + 30;
            let stock = Math.floor(Math.random() * 50) + 10;
            let badge = i % 5 === 0 ? "Best Seller" : i % 7 === 0 ? "Trending" : "Hot";

            allProds.push({
                id: id,
                name: `${brand} Pro ${item.cat.slice(0,4)} Model ${i}`,
                category: item.cat,
                subcategory: subcat,
                brand: brand,
                price: price,
                originalPrice: originalPrice,
                rating: parseFloat(rating),
                reviews: reviews,
                badge: badge,
                stock: stock,
                image: sampleImages[i % sampleImages.length],
                description: `High quality genuine ${brand} ${item.cat.toLowerCase()} item designed for daily elite performance and long durability.`,
                features: ["Premium Build Quality", "1 Year Brand Warranty", "Fast Delivery Eligible", "Easy 7-Day Return"]
            });
            globalCounter++;
        }
    });

    return allProds;
}

if (!localStorage.getItem('appProducts')) {
    localStorage.setItem('appProducts', JSON.stringify(generate210Products()));
}

let products = JSON.parse(localStorage.getItem('appProducts'));
let usersDB = JSON.parse(localStorage.getItem('usersDB'));
let ordersDB = JSON.parse(localStorage.getItem('ordersDB'));
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let cart = [];

// ================= 2. GATEWAY & AUTH LOGIC =================
window.onload = () => {
    if (currentUser) {
        if (currentUser.role === 'admin') showAdminDashboard();
        else showUserStore();
    } else {
        document.getElementById('authPage').style.display = 'flex';
    }
};

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    if(tab === 'login') {
        document.querySelector('.auth-tab-btn:nth-child(1)').classList.add('active');
        document.getElementById('gatewayLoginForm').classList.add('active');
    } else if(tab === 'register') {
        document.querySelector('.auth-tab-btn:nth-child(2)').classList.add('active');
        document.getElementById('gatewayRegisterForm').classList.add('active');
    } else if(tab === 'reset') {
        document.getElementById('gatewayResetForm').classList.add('active');
    }
}

// Strict Login
document.getElementById('gatewayLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const loginVal = document.getElementById('lUser').value.trim();
    const pass = document.getElementById('lPassword').value;

    const isAdmin = ADMINS.find(a => a.email === loginVal && a.password === pass);
    if (isAdmin) {
        currentUser = { email: loginVal, role: 'admin', name: 'Super Admin' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return showAdminDashboard();
    }

    const user = usersDB.find(u => (u.email === loginVal || u.phone === loginVal) && u.password === pass);
    if (user) {
        currentUser = { email: user.email, phone: user.phone, role: 'user', name: user.name };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showUserStore();
    } else {
        alert('Invalid Credentials! Please register first.');
    }
});

// Strict Registration
document.getElementById('gatewayRegisterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rName').value;
    const email = document.getElementById('rEmail').value;
    const phone = document.getElementById('rPhone').value;
    const gender = document.getElementById('rGender').value;
    const pass = document.getElementById('rPassword').value;
    
    if(ADMINS.some(a => a.email === email)) return alert('Email reserved for Admin!');
    if(usersDB.some(u => u.email === email || u.phone === phone)) return alert('Email or Phone already registered!');

    usersDB.push({ name, email, phone, gender, password: pass, date: new Date().toLocaleDateString() });
    localStorage.setItem('usersDB', JSON.stringify(usersDB));
    
    alert('Registration Successful! Please login now.');
    switchAuthTab('login');
});

// Password Reset
document.getElementById('gatewayResetForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = document.getElementById('resetUser').value.trim();
    const newPass = document.getElementById('resetNewPass').value;

    const userIndex = usersDB.findIndex(u => u.email === val || u.phone === val);
    if(userIndex !== -1) {
        usersDB[userIndex].password = newPass;
        localStorage.setItem('usersDB', JSON.stringify(usersDB));
        alert('Password Reset Successfully! You can now login.');
        switchAuthTab('login');
    } else {
        alert('User not found!');
    }
});

function logout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}

// ================= 3. VIEWS ROUTING =================
function showUserStore() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('mainStore').style.display = 'block';
    document.getElementById('userNameDisplay').innerHTML = `<i class="fa fa-user-circle"></i> ${currentUser.name}`;
    renderUserCategories();
    renderUserProducts(products);
}

function showAdminDashboard() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('mainStore').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
    document.getElementById('adminNameDisplay').innerText = currentUser.email;
    renderAdminProducts();
    renderAdminOrders();
}

// ================= 4. USER STORE & FILTERS =================
function renderUserCategories() {
    const cats = ['All', 'Electronics', 'Fashion', 'Beauty', 'Home & Living', 'Sports', 'Accessories'];
    document.getElementById('categoryButtons').innerHTML = cats.map(c => 
        `<button class="cat-btn ${c==='All'?'active':''}" onclick="filterProds('${c}', this)">${c}</button>`
    ).join('');
}

function filterProds(cat, btnElement) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
    if(cat === 'All') renderUserProducts(products);
    else renderUserProducts(products.filter(p => p.category === cat));
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    renderUserProducts(products.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)));
});

function renderUserProducts(prodArray = products) {
    const grid = document.getElementById('productGrid');
    if(prodArray.length === 0) return grid.innerHTML = '<h3 style="grid-column:1/-1;text-align:center;">No Products Found</h3>';
    
    grid.innerHTML = prodArray.map(p => {
        let discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
        return `
        <div class="card" onclick="openProductDetail('${p.id}')">
            ${p.badge ? `<span class="card-badge">${p.badge}</span>` : ''}
            <img src="${p.image}" alt="${p.name}">
            <div class="card-title">${p.name}</div>
            <div class="brand-sub">${p.brand} • ${p.subcategory}</div>
            <div class="rating-row">
                <span class="rating-star">★ ${p.rating}</span>
                <span>(${p.reviews})</span>
            </div>
            <div class="price-row">
                <span class="mrp">₹${p.originalPrice.toLocaleString('en-IN')}</span>
                <span class="discount">${discount}% off</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="price">₹${p.price.toLocaleString('en-IN')}</span>
                <button class="glow-btn" style="width:auto; padding:6px 12px; font-size:12px;" onclick="event.stopPropagation(); addToCart('${p.id}')"><i class="fa fa-cart-plus"></i></button>
            </div>
        </div>
    `}).join('');
}

// Product Detail Modal View
function openProductDetail(id) {
    const p = products.find(x => x.id === id);
    if(!p) return;
    let discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);

    document.getElementById('productDetailContent').innerHTML = `
        <div style="display:flex; gap:20px; flex-wrap:wrap;">
            <div style="flex:1; min-width:200px; text-align:center;">
                <img src="${p.image}" style="max-height:220px; width:100%; object-fit:contain;">
            </div>
            <div style="flex:1.5; min-width:250px;">
                <span style="background:#eee; font-size:11px; padding:3px 8px; border-radius:4px; font-weight:bold;">ID: ${p.id}</span>
                <h2 style="font-size:18px; margin:8px 0 4px 0;">${p.name}</h2>
                <p style="color:#666; font-size:13px; margin-bottom:8px;">Brand: <b>${p.brand}</b> | Category: ${p.category} (${p.subcategory})</p>
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
                    <span class="rating-star">★ ${p.rating}</span>
                    <span style="font-size:12px; color:#666;">${p.reviews} Ratings & Reviews</span>
                </div>
                <div style="display:flex; align-items:baseline; gap:10px; margin-bottom:12px;">
                    <span style="font-size:22px; font-weight:800; color:var(--primary);">₹${p.price.toLocaleString('en-IN')}</span>
                    <span style="text-decoration:line-through; color:#888;">₹${p.originalPrice.toLocaleString('en-IN')}</span>
                    <span style="color:#388e3c; font-weight:bold;">${discount}% off</span>
                </div>
                <p style="font-size:12px; color:var(--success); font-weight:bold; margin-bottom:10px;">In Stock: ${p.stock} units available</p>
                <p style="font-size:13px; color:#444; margin-bottom:12px; line-height:1.4;">${p.description}</p>
                <h4 style="font-size:13px; margin-bottom:5px;">Key Features:</h4>
                <ul style="font-size:12px; padding-left:18px; color:#555; margin-bottom:15px;">
                    ${p.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
                <button class="glow-btn" onclick="addToCart('${p.id}'); closeModal('productDetailModal');"><i class="fa fa-cart-plus"></i> Add to Cart</button>
            </div>
        </div>
    `;
    document.getElementById('productDetailModal').classList.add('active');
}

// ================= 5. CART & CHECKOUT LOGIC =================
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

document.getElementById('openCartBtn').addEventListener('click', () => document.getElementById('cartOverlay').classList.add('active'));
function closeCart() { document.getElementById('cartOverlay').classList.remove('active'); }
document.getElementById('cartOverlay').addEventListener('click', closeCart);

function addToCart(id) {
    const item = products.find(p => p.id === id);
    const exist = cart.find(c => c.id === id);
    if(exist) exist.qty++; else cart.push({...item, qty:1});
    updateCartUI();
    alert('Item Added to Cart!');
}

function updateQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if(item) {
        item.qty += delta;
        if(item.qty <= 0) cart = cart.filter(c => c.id !== id);
    }
    updateCartUI();
}

function delFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    updateCartUI();
}

function updateCartUI() {
    document.getElementById('cartCount').innerText = cart.reduce((s,c)=>s+c.qty, 0);
    const totalAmt = cart.reduce((s,c)=>s+(c.price*c.qty), 0);
    document.getElementById('totalPrice').innerText = '₹' + totalAmt.toLocaleString('en-IN');
    
    const container = document.getElementById('cartItems');
    if(cart.length === 0) return container.innerHTML = '<p style="text-align:center; color:#888;">Cart is empty.</p>';
    
    container.innerHTML = cart.map(c => `
        <div class="cart-item">
            <img src="${c.image}" alt="${c.name}">
            <div style="flex:1;">
                <h4 style="font-size:13px;">${c.name}</h4>
                <p style="font-size:12px; color:var(--primary); font-weight:bold;">₹${c.price}</p>
                <div class="qty-ctrl">
                    <button class="qty-btn" onclick="updateQty('${c.id}', -1)">-</button>
                    <span style="font-size:12px; font-weight:bold;">${c.qty}</span>
                    <button class="qty-btn" onclick="updateQty('${c.id}', 1)">+</button>
                </div>
            </div>
            <button class="action-btn del-btn" onclick="delFromCart('${c.id}')">&times;</button>
        </div>
    `).join('');
}

function openCheckout() {
    if(cart.length === 0) return alert('Cart is empty!');
    closeCart();
    document.getElementById('chkName').value = currentUser.name;
    document.getElementById('chkPhone').value = currentUser.phone || '';
    document.getElementById('checkoutModal').classList.add('active');
}

// Checkout Submit & UPI Redirect
document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('chkName').value;
    const phone = document.getElementById('chkPhone').value;
    const address = `${document.getElementById('chkAddress').value}, ${document.getElementById('chkCity').value} - ${document.getElementById('chkPincode').value}`;
    const payment = document.querySelector('input[name="payMethod"]:checked').value;
    const totalAmount = cart.reduce((s,c)=>s+(c.price*c.qty), 0);

    const orderObj = {
        date: new Date().toLocaleDateString(),
        customer: name, phone: phone, address: address,
        payment: payment, total: totalAmount,
        items: cart.map(c => `${c.name} (x${c.qty})`).join(' | ')
    };
    ordersDB.push(orderObj);
    localStorage.setItem('ordersDB', JSON.stringify(ordersDB));

    closeModal('checkoutModal');
    cart = []; updateCartUI();

    if(payment === 'UPI') {
        alert("Redirecting to UPI App for payment to 8002716612@upi ...");
        window.location.href = `upi://pay?pa=8002716612@upi&pn=TrendCart&am=${totalAmount}&cu=INR`;
    } else {
        alert('Order Placed Successfully! (Cash on Delivery)');
    }
});

// ================= 6. ADMIN DASHBOARD =================
function switchAdminTab(tab) {
    document.querySelectorAll('.admin-menu li').forEach(li => li.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    document.getElementById('adminProductsTab').style.display = 'none';
    document.getElementById('adminOrdersTab').style.display = 'none';
    document.getElementById('adminAdminsTab').style.display = 'none';

    if(tab === 'products') document.getElementById('adminProductsTab').style.display = 'block';
    if(tab === 'orders') { document.getElementById('adminOrdersTab').style.display = 'block'; renderAdminOrders(); }
    if(tab === 'admins') document.getElementById('adminAdminsTab').style.display = 'block';
}

function renderAdminProducts() {
    document.getElementById('adminProductTableBody').innerHTML = products.map(p => `
        <tr>
            <td><b>${p.id}</b></td>
            <td><img src="${p.image}"></td>
            <td><b>${p.name}</b><br><small>${p.brand} • ${p.category}</small></td>
            <td>${p.category}</td>
            <td style="color:var(--success); font-weight:bold;">₹${p.price}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editProduct('${p.id}')">Edit</button>
                <button class="action-btn del-btn" onclick="deleteProduct('${p.id}')">Del</button>
            </td>
        </tr>
    `).join('');
}

function renderAdminOrders() {
    document.getElementById('adminOrdersTableBody').innerHTML = ordersDB.map(o => `
        <tr>
            <td>${o.date}</td>
            <td><b>${o.customer}</b><br><small>${o.address}</small></td>
            <td>${o.phone}</td>
            <td><span style="background:${o.payment==='UPI'?'#8f94fb':'#f1c40f'}; padding:3px 8px; border-radius:5px; color:white; font-size:11px;">${o.payment}</span></td>
            <td><b>₹${o.total.toLocaleString('en-IN')}</b></td>
        </tr>
    `).join('');
}

function openProductModal() {
    document.getElementById('productForm').reset();
    document.getElementById('editProductId').value = '';
    document.getElementById('modalTitle').innerText = 'Add New Product';
    document.getElementById('productModal').classList.add('active');
}

function editProduct(id) {
    const p = products.find(x => x.id === id);
    document.getElementById('editProductId').value = p.id;
    document.getElementById('pId').value = p.id;
    document.getElementById('pId').disabled = true;
    document.getElementById('pName').value = p.name;
    document.getElementById('pCategory').value = p.category;
    document.getElementById('pSubcat').value = p.subcategory;
    document.getElementById('pBrand').value = p.brand;
    document.getElementById('pStock').value = p.stock;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pOrigPrice').value = p.originalPrice;
    document.getElementById('pImage').value = p.image;
    document.getElementById('pDesc').value = p.description;
    
    document.getElementById('modalTitle').innerText = 'Edit Product';
    document.getElementById('productModal').classList.add('active');
}

document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = document.getElementById('editProductId').value;
    const newProd = {
        id: editId ? editId : document.getElementById('pId').value,
        name: document.getElementById('pName').value,
        category: document.getElementById('pCategory').value,
        subcategory: document.getElementById('pSubcat').value,
        brand: document.getElementById('pBrand').value,
        stock: parseInt(document.getElementById('pStock').value),
        price: parseInt(document.getElementById('pPrice').value),
        originalPrice: parseInt(document.getElementById('pOrigPrice').value),
        image: document.getElementById('pImage').value,
        description: document.getElementById('pDesc').value,
        rating: 4.5,
        reviews: 50,
        badge: "New",
        features: ["Standard Warranty", "High Quality", "Reliable Performance"]
    };

    if(editId) {
        products = products.map(p => p.id === editId ? newProd : p);
    } else {
        if(products.some(p => p.id === newProd.id)) return alert('Product ID already exists!');
        products.unshift(newProd);
    }

    localStorage.setItem('appProducts', JSON.stringify(products));
    renderAdminProducts();
    closeModal('productModal');
    alert(editId ? 'Product Updated Successfully!' : 'New Product Added Successfully!');
});

function deleteProduct(id) {
    if(confirm('Delete this product permanently?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('appProducts', JSON.stringify(products));
        renderAdminProducts();
    }
}

// Excel Export Functions
function downloadUsersExcel() {
    let csv = "data:text/csv;charset=utf-8,Date,Name,Email,Phone,Gender\n";
    usersDB.forEach(u => csv += `${u.date},${u.name},${u.email},${u.phone},${u.gender}\n`);
    triggerDownload(csv, "TrendCart_Users.csv");
}

function downloadOrdersExcel() {
    let csv = "data:text/csv;charset=utf-8,Date,Customer,Phone,Payment Mode,Total Amount,Items Ordered\n";
    ordersDB.forEach(o => csv += `${o.date},${o.customer},${o.phone},${o.payment},${o.total},${o.items}\n`);
    triggerDownload(csv, "TrendCart_Orders.csv");
}

function triggerDownload(csvContent, fileName) {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

// Add Admin Form
document.getElementById('addAdminForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newAdminEmail').value;
    const pass = document.getElementById('newAdminPassword').value;
    if(ADMINS.some(a => a.email === email)) return alert('Admin already exists!');
    ADMINS.push({email: email, password: pass});
    alert(`Success! ${email} is now an Admin.`);
    document.getElementById('addAdminForm').reset();
});