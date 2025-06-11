
// P2P Marketplace Application
class P2PMarketplace {
    constructor() {
        this.orders = [];
        this.init();
    }

    async init() {
        console.log('🤝 P2P Marketplace initializing...');
        this.loadMockOrders();
        this.setupFilters();
        this.setupForms();
        this.renderOrders();
    }

    loadMockOrders() {
        this.orders = [
            {
                id: 'P2P001',
                trader: 'Dubai Gold Exchange',
                traderRating: 4.8,
                type: 'buy',
                currency: 'USD',
                minAmount: 1000,
                maxAmount: 50000,
                rate: 3.6800,
                location: 'Dubai, UAE',
                paymentMethods: ['Cash', 'Bank Transfer'],
                description: 'Fast processing, reliable trader',
                createdAt: '2024-02-15',
                status: 'active'
            },
            {
                id: 'P2P002',
                trader: 'Tehran Money Exchange',
                traderRating: 4.9,
                type: 'sell',
                currency: 'EUR',
                minAmount: 500,
                maxAmount: 20000,
                rate: 1.0890,
                location: 'Tehran, Iran',
                paymentMethods: ['Bank Transfer', 'Online Payment'],
                description: 'Best rates in Tehran',
                createdAt: '2024-02-15',
                status: 'active'
            },
            {
                id: 'P2P003',
                trader: 'Istanbul FX Center',
                traderRating: 4.7,
                type: 'buy',
                currency: 'AED',
                minAmount: 2000,
                maxAmount: 100000,
                rate: 0.2717,
                location: 'Istanbul, Turkey',
                paymentMethods: ['Cash', 'Bank Transfer', 'Online Payment'],
                description: 'Large volumes welcome',
                createdAt: '2024-02-14',
                status: 'active'
            },
            {
                id: 'P2P004',
                trader: 'Karachi Exchange Hub',
                traderRating: 4.6,
                type: 'sell',
                currency: 'USD',
                minAmount: 800,
                maxAmount: 25000,
                rate: 3.6750,
                location: 'Karachi, Pakistan',
                paymentMethods: ['Bank Transfer'],
                description: 'Competitive rates, quick settlement',
                createdAt: '2024-02-14',
                status: 'active'
            },
            {
                id: 'P2P005',
                trader: 'Sharjah Money Center',
                traderRating: 4.5,
                type: 'buy',
                currency: 'IRR',
                minAmount: 10000000,
                maxAmount: 500000000,
                rate: 0.0000235,
                location: 'Sharjah, UAE',
                paymentMethods: ['Cash', 'Bank Transfer'],
                description: 'Iranian Rial specialist',
                createdAt: '2024-02-13',
                status: 'active'
            }
        ];
    }

    setupFilters() {
        const filters = ['currencyFilter', 'typeFilter', 'locationFilter', 'minAmount'];
        filters.forEach(filterId => {
            const element = document.getElementById(filterId);
            if (element) {
                element.addEventListener('change', () => this.applyFilters());
                if (element.type === 'number') {
                    element.addEventListener('input', () => this.applyFilters());
                }
            }
        });
    }

    setupForms() {
        const createOrderForm = document.getElementById('createOrderForm');
        if (createOrderForm) {
            createOrderForm.addEventListener('submit', (e) => this.handleCreateOrder(e));
        }
    }

    applyFilters() {
        const currency = document.getElementById('currencyFilter').value;
        const type = document.getElementById('typeFilter').value;
        const location = document.getElementById('locationFilter').value;
        const minAmount = document.getElementById('minAmount').value;

        let filteredOrders = this.orders.filter(order => {
            let match = true;

            if (currency && order.currency !== currency) match = false;
            if (type && order.type !== type) match = false;
            if (location && !order.location.toLowerCase().includes(location.toLowerCase())) match = false;
            if (minAmount && order.maxAmount < parseInt(minAmount)) match = false;

            return match;
        });

        this.renderOrders(filteredOrders);
    }

    renderOrders(ordersToRender = this.orders) {
        const tbody = document.getElementById('ordersTable');
        if (!tbody) return;

        tbody.innerHTML = ordersToRender.map(order => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                    <div class="flex items-center space-x-3">
                        <div class="bg-blue-100 rounded-full p-2">
                            <i class="fas fa-store text-blue-600"></i>
                        </div>
                        <div>
                            <div class="font-medium">${order.trader}</div>
                            <div class="text-sm text-gray-500">
                                ${this.renderStars(order.traderRating)} (${order.traderRating})
                            </div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs rounded-full font-semibold ${
                        order.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }">
                        ${order.type.toUpperCase()}
                    </span>
                </td>
                <td class="px-6 py-4 font-semibold">${order.currency}</td>
                <td class="px-6 py-4">
                    <div class="text-sm">
                        <div>Min: ${this.formatCurrency(order.minAmount, order.currency)}</div>
                        <div>Max: ${this.formatCurrency(order.maxAmount, order.currency)}</div>
                    </div>
                </td>
                <td class="px-6 py-4 font-bold text-blue-600">${order.rate}</td>
                <td class="px-6 py-4">
                    <div class="text-sm">
                        <i class="fas fa-map-marker-alt text-gray-400"></i> ${order.location}
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="flex flex-wrap gap-1">
                        ${order.paymentMethods.map(method => `
                            <span class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                ${method}
                            </span>
                        `).join('')}
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="flex space-x-2">
                        <button onclick="p2p.viewOrder('${order.id}')" 
                                class="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50">
                            View
                        </button>
                        <button onclick="p2p.contactTrader('${order.id}')" 
                                class="text-green-600 hover:text-green-800 px-3 py-1 rounded border border-green-600 hover:bg-green-50">
                            Contact
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star text-yellow-400"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star text-gray-300"></i>';
        }

        return stars;
    }

    formatCurrency(amount, currency) {
        if (currency === 'IRR') {
            return new Intl.NumberFormat('fa-IR').format(amount) + ' ریال';
        }
        return new Intl.NumberFormat('en-US').format(amount) + ' ' + currency;
    }

    showCreateOrderModal() {
        document.getElementById('createOrderModal').classList.remove('hidden');
    }

    hideCreateOrderModal() {
        document.getElementById('createOrderModal').classList.add('hidden');
    }

    async handleCreateOrder(e) {
        e.preventDefault();
        
        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        // Show loading
        btn.innerHTML = '<div class="spinner"></div>Creating...';
        btn.disabled = true;

        try {
            // Simulate API call
            await this.delay(2000);

            // Create new order object
            const newOrder = {
                id: 'P2P' + (Date.now() % 10000).toString().padStart(3, '0'),
                trader: 'Your Exchange', // Would come from logged in user
                traderRating: 4.5,
                type: form.querySelector('select').value,
                currency: form.querySelectorAll('select')[1].value,
                minAmount: parseInt(form.querySelector('input[placeholder="1000"]').value),
                maxAmount: parseInt(form.querySelector('input[placeholder="10000"]').value),
                rate: parseFloat(form.querySelector('input[step="0.0001"]').value),
                location: form.querySelector('input[placeholder="Dubai, UAE"]').value,
                paymentMethods: Array.from(form.querySelectorAll('input[type="checkbox"]:checked'))
                    .map(cb => cb.parentElement.textContent.trim()),
                description: form.querySelector('textarea').value || 'No description',
                createdAt: new Date().toISOString().split('T')[0],
                status: 'active'
            };

            // Add to orders
            this.orders.unshift(newOrder);
            this.renderOrders();

            // Show success
            this.showMessage('✅ Order created successfully!', 'success');
            
            // Reset and hide modal
            form.reset();
            this.hideCreateOrderModal();

        } catch (error) {
            this.showMessage('❌ Failed to create order. Please try again.', 'error');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            alert(`Order Details:
            
Trader: ${order.trader}
Type: ${order.type.toUpperCase()}
Currency: ${order.currency}
Amount: ${this.formatCurrency(order.minAmount, order.currency)} - ${this.formatCurrency(order.maxAmount, order.currency)}
Rate: ${order.rate}
Location: ${order.location}
Payment Methods: ${order.paymentMethods.join(', ')}
Description: ${order.description}`);
        }
    }

    contactTrader(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            this.showMessage(`📞 Contact initiated with ${order.trader}. They will be notified via WhatsApp.`, 'success');
            
            // Simulate WhatsApp notification
            setTimeout(() => {
                this.showMessage(`💬 WhatsApp sent to ${order.trader}: "Hello, I'm interested in your ${order.type} order for ${order.currency}..."`, 'success');
            }, 2000);
        }
    }

    showMessage(text, type) {
        const notification = document.createElement('div');
        notification.className = `${type}-message fixed top-4 right-4 z-50 fade-in max-w-md`;
        notification.innerHTML = `
            <div class="flex justify-between items-start">
                <div>${text}</div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) notification.remove();
        }, 5000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when page loads
let p2p;
document.addEventListener('DOMContentLoaded', () => {
    p2p = new P2PMarketplace();
});
P2P_JS_END