/**
 * AuraStore - E-Commerce Front Page Application Script
 */

const PRODUCTS_DATA = [
    {
        id: 1,
        title: "AuraSound Studio Pro Wireless Headphones",
        category: "audio",
        price: 229.00,
        originalPrice: 349.00,
        rating: 4.9,
        reviews: 324,
        badge: "sale",
        badgeText: "35% OFF",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        description: "Flagship active noise-cancelling over-ear headphones with custom 40mm beryllium drivers, spatial audio tracking, and 40-hour playtime."
    },
    {
        id: 2,
        title: "Apex Horizon Smartwatch Ultra Series",
        category: "wearables",
        price: 189.50,
        originalPrice: 249.00,
        rating: 4.8,
        reviews: 189,
        badge: "hot",
        badgeText: "Hot Seller",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        description: "Titanium case smartwatch featuring dual-frequency GPS, health metrics tracking, AMOLED Retina display, and 100m water resistance."
    },
    {
        id: 3,
        title: "Vortex Pro Ergonomic Wireless Gaming Mouse",
        category: "electronics",
        price: 79.99,
        originalPrice: 110.00,
        rating: 4.7,
        reviews: 95,
        badge: "new",
        badgeText: "New",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
        description: "Ultra-lightweight 58g wireless gaming mouse with 26,000 DPI optical sensor and 80-hour continuous battery lifespan."
    },
    {
        id: 4,
        title: "Lumina Minimalist Acetate Sunglasses",
        category: "accessories",
        price: 125.00,
        originalPrice: 160.00,
        rating: 4.6,
        reviews: 78,
        badge: "",
        badgeText: "",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
        description: "Handcrafted Italian acetate frames with polarized UV400 protective lenses for modern elegance and comfort."
    },
    {
        id: 5,
        title: "AuraBook M2 Ultra Ultra-Slim Laptop",
        category: "electronics",
        price: 1199.00,
        originalPrice: 1399.00,
        rating: 5.0,
        reviews: 412,
        badge: "hot",
        badgeText: "Best Rated",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
        description: "Next-gen laptop with 14-inch XDR Liquid display, 16-core GPU, 32GB unified memory, and lightweight aluminum chassis."
    },
    {
        id: 6,
        title: "SonicPulse ANC True Wireless Earbuds",
        category: "audio",
        price: 139.00,
        originalPrice: 179.00,
        rating: 4.7,
        reviews: 215,
        badge: "sale",
        badgeText: "22% OFF",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
        description: "Compact wireless earbuds featuring adaptive ANC, IPX7 water resistance, wireless charging case, and crystal-clear microphone calls."
    },
    {
        id: 7,
        title: "UrbanTech Waterproof Commuter Backpack",
        category: "accessories",
        price: 89.00,
        originalPrice: 120.00,
        rating: 4.8,
        reviews: 164,
        badge: "",
        badgeText: "",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
        description: "Sleek 22L laptop backpack built from weather-proof Cordura fabric with anti-theft RFID hidden pockets and USB charging port."
    },
    {
        id: 8,
        title: "AuraFit Smart Health Tracker Band",
        category: "wearables",
        price: 59.99,
        originalPrice: 79.99,
        rating: 4.5,
        reviews: 130,
        badge: "sale",
        badgeText: "Sale",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80",
        description: "Continuous heart rate, SpO2, sleep monitor, and stress tracker with a vibrant color touch screen and 14-day battery life."
    }
];

class ECommerceApp {
    constructor() {
        this.products = [...PRODUCTS_DATA];
        this.cart = [];
        this.wishlist = new Set();
        this.currentCategory = 'all';
        this.currentSearch = '';
        this.currentSort = 'featured';

        this.init();
    }

    init() {
        this.loadState();
        this.bindEvents();
        this.renderProducts();
        this.updateHeaderCart();
        this.updateWishlistBadge();
        this.startCountdownTimer();
    }

    /* ----------------------------------------------------------------------
       State & Local Storage Management
       ---------------------------------------------------------------------- */
    loadState() {
        try {
            const savedCart = localStorage.getItem('aura_cart');
            if (savedCart) this.cart = JSON.parse(savedCart);

            const savedWishlist = localStorage.getItem('aura_wishlist');
            if (savedWishlist) this.wishlist = new Set(JSON.parse(savedWishlist));

            const savedTheme = localStorage.getItem('aura_theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            this.updateThemeUI(savedTheme);
        } catch (e) {
            console.error("Failed to load local storage state:", e);
        }
    }

    saveState() {
        try {
            localStorage.setItem('aura_cart', JSON.stringify(this.cart));
            localStorage.setItem('aura_wishlist', JSON.stringify(Array.from(this.wishlist)));
        } catch (e) {
            console.error("Failed to save state:", e);
        }
    }

    /* ----------------------------------------------------------------------
       Event Bindings
       ---------------------------------------------------------------------- */
    bindEvents() {
        // Theme Toggle
        document.getElementById('themeToggleBtn')?.addEventListener('click', () => this.toggleTheme());

        // Category Filter Nav & Pills
        document.querySelectorAll('.nav-link, .pill, .category-card').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = btn.dataset.category;
                if (category) {
                    this.filterByCategory(category);
                }
            });
        });

        // Search Input
        const searchInput = document.getElementById('searchInput');
        const clearBtn = document.getElementById('clearSearchBtn');

        searchInput?.addEventListener('input', (e) => {
            this.currentSearch = e.target.value.trim().toLowerCase();
            clearBtn.hidden = !this.currentSearch;
            this.handleSearchDropdown();
            this.renderProducts();
        });

        clearBtn?.addEventListener('click', () => {
            searchInput.value = '';
            this.currentSearch = '';
            clearBtn.hidden = true;
            document.getElementById('searchResultsDropdown').classList.remove('active');
            this.renderProducts();
        });

        // Sort Select
        document.getElementById('sortSelect')?.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderProducts();
        });

        // Cart Drawer Toggles
        document.getElementById('cartBtn')?.addEventListener('click', () => this.openCartDrawer());
        document.getElementById('closeCartBtn')?.addEventListener('click', () => this.closeCartDrawer());
        document.getElementById('cartOverlay')?.addEventListener('click', () => this.closeCartDrawer());
        document.getElementById('continueShoppingBtn')?.addEventListener('click', () => this.closeCartDrawer());
        document.getElementById('checkoutBtn')?.addEventListener('click', () => this.handleCheckout());

        // Quick View Modal Toggles
        document.getElementById('closeQuickViewBtn')?.addEventListener('click', () => this.closeQuickView());
        document.getElementById('quickViewOverlay')?.addEventListener('click', () => this.closeQuickView());

        // Newsletter Form
        document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            document.getElementById('newsletterForm').hidden = true;
            document.getElementById('newsletterSuccess').hidden = false;
            this.showToast('Coupon WELCOME15 unlocked!', 'success');
        });
    }

    /* ----------------------------------------------------------------------
       Theme Switcher
       ---------------------------------------------------------------------- */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('aura_theme', newTheme);
        this.updateThemeUI(newTheme);
    }

    updateThemeUI(theme) {
        const label = document.getElementById('themeLabel');
        const btn = document.getElementById('themeToggleBtn');
        if (!label || !btn) return;

        if (theme === 'dark') {
            label.textContent = 'Light Mode';
            btn.innerHTML = `<i class="fa-solid fa-sun"></i> <span id="themeLabel">Light Mode</span>`;
        } else {
            label.textContent = 'Dark Mode';
            btn.innerHTML = `<i class="fa-solid fa-moon"></i> <span id="themeLabel">Dark Mode</span>`;
        }
    }

    /* ----------------------------------------------------------------------
       Product Filtering & Rendering
       ---------------------------------------------------------------------- */
    filterByCategory(category) {
        this.currentCategory = category;

        // Update active classes on pills and subnav links
        document.querySelectorAll('.pill').forEach(p => {
            p.classList.toggle('active', p.dataset.category === category);
        });

        document.querySelectorAll('.nav-link').forEach(l => {
            l.classList.toggle('active', l.dataset.category === category);
        });

        this.renderProducts();
    }

    resetFilters() {
        this.currentCategory = 'all';
        this.currentSearch = '';
        this.currentSort = 'featured';

        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        const clearBtn = document.getElementById('clearSearchBtn');
        if (clearBtn) clearBtn.hidden = true;

        this.filterByCategory('all');
    }

    getFilteredProducts() {
        return this.products.filter(p => {
            const matchesCategory = (this.currentCategory === 'all' || p.category === this.currentCategory);
            const matchesSearch = !this.currentSearch || 
                p.title.toLowerCase().includes(this.currentSearch) ||
                p.category.toLowerCase().includes(this.currentSearch) ||
                p.description.toLowerCase().includes(this.currentSearch);
            return matchesCategory && matchesSearch;
        }).sort((a, b) => {
            if (this.currentSort === 'price-low') return a.price - b.price;
            if (this.currentSort === 'price-high') return b.price - a.price;
            if (this.currentSort === 'rating') return b.rating - a.rating;
            return a.id - b.id; // featured default
        });
    }

    renderProducts() {
        const grid = document.getElementById('productsGrid');
        const emptyState = document.getElementById('emptyState');
        if (!grid) return;

        const filtered = this.getFilteredProducts();

        if (filtered.length === 0) {
            grid.innerHTML = '';
            if (emptyState) emptyState.hidden = false;
            return;
        }

        if (emptyState) emptyState.hidden = true;

        grid.innerHTML = filtered.map(p => {
            const isWishlisted = this.wishlist.has(p.id);
            return `
                <div class="product-card">
                    ${p.badgeText ? `<span class="product-badge badge-${p.badge}">${p.badgeText}</span>` : ''}
                    
                    <button class="wishlist-toggle-btn ${isWishlisted ? 'active' : ''}" 
                            onclick="app.toggleWishlist(${p.id})" 
                            aria-label="Save to Wishlist">
                        <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>

                    <div class="product-img-wrapper">
                        <img src="${p.image}" alt="${p.title}" loading="lazy">
                        <button class="quick-view-btn" onclick="app.quickView(${p.id})">
                            <i class="fa-regular fa-eye"></i> Quick View
                        </button>
                    </div>

                    <div class="product-info">
                        <span class="product-category">${p.category}</span>
                        <h3 class="product-title">${p.title}</h3>
                        <div class="product-rating">
                            <i class="fa-solid fa-star"></i>
                            <strong>${p.rating}</strong>
                            <span class="rating-count">(${p.reviews})</span>
                        </div>
                        <div class="product-bottom">
                            <div class="price-wrap">
                                <span class="price-current">$${p.price.toFixed(2)}</span>
                                ${p.originalPrice ? `<span class="price-original">$${p.originalPrice.toFixed(2)}</span>` : ''}
                            </div>
                            <button class="add-cart-btn" onclick="app.addToCart(${p.id})" title="Add to Cart">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* ----------------------------------------------------------------------
       Search Bar Suggestions Dropdown
       ---------------------------------------------------------------------- */
    handleSearchDropdown() {
        const dropdown = document.getElementById('searchResultsDropdown');
        if (!dropdown) return;

        if (!this.currentSearch) {
            dropdown.classList.remove('active');
            dropdown.innerHTML = '';
            return;
        }

        const matches = this.products.filter(p => p.title.toLowerCase().includes(this.currentSearch)).slice(0, 4);

        if (matches.length === 0) {
            dropdown.classList.remove('active');
            return;
        }

        dropdown.innerHTML = matches.map(p => `
            <div class="search-item" onclick="app.quickView(${p.id})">
                <img src="${p.image}" alt="${p.title}">
                <div class="search-item-info">
                    <strong>${p.title}</strong>
                    <span>$${p.price.toFixed(2)}</span>
                </div>
            </div>
        `).join('');

        dropdown.classList.add('active');
    }

    /* ----------------------------------------------------------------------
       Wishlist Management
       ---------------------------------------------------------------------- */
    toggleWishlist(productId) {
        if (this.wishlist.has(productId)) {
            this.wishlist.delete(productId);
            this.showToast('Item removed from wishlist', 'info');
        } else {
            this.wishlist.add(productId);
            this.showToast('Item saved to wishlist!', 'success');
        }

        this.saveState();
        this.updateWishlistBadge();
        this.renderProducts();
    }

    updateWishlistBadge() {
        const countEl = document.getElementById('wishlistCount');
        if (countEl) countEl.textContent = this.wishlist.size;
    }

    /* ----------------------------------------------------------------------
       Cart Drawer Management
       ---------------------------------------------------------------------- */
    addToCart(productId, qty = 1) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existing = this.cart.find(item => item.id === productId);
        if (existing) {
            existing.quantity += qty;
        } else {
            this.cart.push({ ...product, quantity: qty });
        }

        this.saveState();
        this.updateHeaderCart();
        this.renderCartDrawer();
        this.showToast(`Added "${product.title}" to cart!`, 'success');
    }

    updateCartQty(productId, delta) {
        const item = this.cart.find(i => i.id === productId);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            this.cart = this.cart.filter(i => i.id !== productId);
        }

        this.saveState();
        this.updateHeaderCart();
        this.renderCartDrawer();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(i => i.id !== productId);
        this.saveState();
        this.updateHeaderCart();
        this.renderCartDrawer();
        this.showToast('Item removed from cart', 'info');
    }

    updateHeaderCart() {
        const totalCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const countBadge = document.getElementById('cartCount');
        const drawerCount = document.getElementById('drawerCartCount');
        const headerSubtotal = document.getElementById('headerCartSubtotal');

        if (countBadge) countBadge.textContent = totalCount;
        if (drawerCount) drawerCount.textContent = totalCount;
        if (headerSubtotal) headerSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    }

    renderCartDrawer() {
        const cartBody = document.getElementById('cartItemsList');
        const subtotalEl = document.getElementById('cartSubtotal');
        const totalEl = document.getElementById('cartTotal');

        if (!cartBody) return;

        if (this.cart.length === 0) {
            cartBody.innerHTML = `
                <div class="cart-empty-msg">
                    <i class="fa-solid fa-cart-flatbed"></i>
                    <p>Your shopping cart is empty.</p>
                </div>
            `;
            if (subtotalEl) subtotalEl.textContent = '$0.00';
            if (totalEl) totalEl.textContent = '$0.00';
            return;
        }

        const subtotal = this.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

        cartBody.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="app.updateCartQty(${item.id}, -1)"><i class="fa-solid fa-minus"></i></button>
                        <span class="qty-num">${item.quantity}</span>
                        <button class="qty-btn" onclick="app.updateCartQty(${item.id}, 1)"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
                <button class="remove-cart-item" onclick="app.removeFromCart(${item.id})" title="Remove">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `).join('');

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
    }

    openCartDrawer() {
        this.renderCartDrawer();
        document.getElementById('cartDrawer')?.classList.add('active');
        document.getElementById('cartOverlay')?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeCartDrawer() {
        document.getElementById('cartDrawer')?.classList.remove('active');
        document.getElementById('cartOverlay')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleCheckout() {
        if (this.cart.length === 0) {
            this.showToast('Your cart is empty!', 'info');
            return;
        }

        alert('🎉 Order placed successfully! Thank you for testing AuraStore.');
        this.cart = [];
        this.saveState();
        this.updateHeaderCart();
        this.renderCartDrawer();
        this.closeCartDrawer();
    }

    /* ----------------------------------------------------------------------
       Quick View Modal
       ---------------------------------------------------------------------- */
    quickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const content = document.getElementById('quickViewContent');
        if (!content) return;

        content.innerHTML = `
            <div class="modal-grid">
                <div class="modal-img-wrap">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="modal-details">
                    <span class="product-category">${product.category}</span>
                    <h2 class="product-title">${product.title}</h2>
                    <div class="product-rating" style="margin-bottom: 1rem;">
                        <i class="fa-solid fa-star"></i>
                        <strong>${product.rating}</strong>
                        <span class="rating-count">(${product.reviews} customer reviews)</span>
                    </div>
                    <div class="price-wrap" style="margin-bottom: 1rem;">
                        <span class="price-current" style="font-size: 1.6rem;">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="price-original" style="font-size: 1.1rem;">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <p class="product-desc">${product.description}</p>
                    <div style="display: flex; gap: 1rem;">
                        <button class="btn btn-primary btn-lg" onclick="app.addToCart(${product.id}); app.closeQuickView();">
                            <i class="fa-solid fa-bag-shopping"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline btn-lg" onclick="app.toggleWishlist(${product.id})">
                            <i class="fa-regular fa-heart"></i> Save
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('quickViewModal')?.classList.add('active');
        document.getElementById('quickViewOverlay')?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeQuickView() {
        document.getElementById('quickViewModal')?.classList.remove('active');
        document.getElementById('quickViewOverlay')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* ----------------------------------------------------------------------
       Flash Sale Timer
       ---------------------------------------------------------------------- */
    startCountdownTimer() {
        let totalSeconds = 8 * 3600 + 42 * 60 + 19;

        setInterval(() => {
            if (totalSeconds <= 0) return;
            totalSeconds--;

            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            const cdH = document.getElementById('cdHours');
            const cdM = document.getElementById('cdMinutes');
            const cdS = document.getElementById('cdSeconds');

            if (cdH) cdH.textContent = String(hours).padStart(2, '0');
            if (cdM) cdM.textContent = String(minutes).padStart(2, '0');
            if (cdS) cdS.textContent = String(seconds).padStart(2, '0');
        }, 1000);
    }

    /* ----------------------------------------------------------------------
       Toast Notifications
       ---------------------------------------------------------------------- */
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Global instantiation
const app = new ECommerceApp();
