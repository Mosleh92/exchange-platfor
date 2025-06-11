// Crypto Trading System - Complete Implementation
class CryptoManager {
    constructor() {
        this.cryptos = {};
        this.portfolio = {};
        this.activeOrders = [];
        this.orderHistory = [];
        this.watchlist = [];
        this.selectedPair = 'BTC_AED';
        this.tradeType = 'buy';
        this.charts = {};
        this.updateInterval = null;
        this.init();
    }

    async init() {
        console.log('₿ Crypto Manager initializing...');
        
        await this.waitForAuth();
        
        this.setupDefaultCryptos();
        this.setupDefaultPortfolio();
        this.setupEventListeners();
        this.renderCryptoTable();
        this.renderTradingPairs();
        this.renderPortfolio();
        this.setupCharts();
        this.updateMarketStats();
        this.startLiveUpdates();
        
        console.log('✅ Crypto Manager initialized successfully');
    }

    async waitForAuth() {
        return new Promise((resolve) => {
            const checkAuth = () => {
                if (window.authSystem && window.authSystem.currentUser) {
                    resolve();
                } else {
                    setTimeout(checkAuth, 100);
                }
            };
            checkAuth();
        });
    }

    setupDefaultCryptos() {
        this.cryptos = {
            'BTC': {
                symbol: 'BTC',
                name: 'بیت‌کوین',
                price: 67245.50,
                priceAED: 246808.76,
                change24h: 3.24,
                volume24h: 28470000000,
                marketCap: 1320000000000,
                icon: '₿',
                color: '#f7931e',
                sparkline: this.generateSparkline(67245.50, 24)
            },
            'ETH': {
                symbol: 'ETH',
                name: 'اتریوم',
                price: 3456.78,
                priceAED: 12688.55,
                change24h: 5.67,
                volume24h: 15680000000,
                marketCap: 415000000000,
                icon: 'Ξ',
                color: '#627eea',
                sparkline: this.generateSparkline(3456.78, 24)
            },
            'BNB': {
                symbol: 'BNB',
                name: 'بایننس کوین',
                price: 589.23,
                priceAED: 2164.58,
                change24h: -1.23,
                volume24h: 2890000000,
                marketCap: 87600000000,
                icon: '⚡',
                color: '#f3ba2f',
                sparkline: this.generateSparkline(589.23, 24)
            },
            'USDT': {
                symbol: 'USDT',
                name: 'تتر',
                price: 1.00,
                priceAED: 3.67,
                change24h: 0.01,
                volume24h: 45670000000,
                marketCap: 92800000000,
                icon: '💎',
                color: '#26a17b',
                sparkline: this.generateSparkline(1.00, 24)
            },
            'ADA': {
                symbol: 'ADA',
                name: 'کاردانو',
                price: 0.78,
                priceAED: 2.86,
                change24h: 4.32,
                volume24h: 890000000,
                marketCap: 27400000000,
                icon: '🔷',
                color: '#0033ad',
                sparkline: this.generateSparkline(0.78, 24)
            },
            'DOT': {
                symbol: 'DOT',
                name: 'پولکادات',
                price: 12.45,
                priceAED: 45.69,
                change24h: -2.15,
                volume24h: 567000000,
                marketCap: 15600000000,
                icon: '⚫',
                color: '#e6007a',
                sparkline: this.generateSparkline(12.45, 24)
            }
        };
    }

    setupDefaultPortfolio() {
        this.portfolio = {
            'BTC': { balance: 0.05, value: 12340.44 },
            'ETH': { balance: 1.2, value: 15226.26 },
            'USDT': { balance: 5000, value: 18350.00 },
            'BNB': { balance: 10, value: 21645.80 }
        };
    }

    setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refreshCryptoBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshAllCryptos());
        }

        // Trading button
        const tradingBtn = document.getElementById('tradingBtn');
        if (tradingBtn) {
            tradingBtn.addEventListener('click', () => this.openTradingModal());
        }

        // Portfolio button
        const portfolioBtn = document.getElementById('portfolioBtn');
        if (portfolioBtn) {
            portfolioBtn.addEventListener('click', () => this.showPortfolioDetails());
        }

        // Quick trade form
        const quickTradeForm = document.getElementById('quickTradeForm');
        if (quickTradeForm) {
            quickTradeForm.addEventListener('submit', (e) => this.handleQuickTrade(e));
        }

        // Buy/Sell buttons
        const buyBtn = document.getElementById('buyBtn');
        const sellBtn = document.getElementById('sellBtn');
        if (buyBtn) buyBtn.addEventListener('click', () => this.setTradeType('buy'));
        if (sellBtn) sellBtn.addEventListener('click', () => this.setTradeType('sell'));

        // Amount and price inputs
        const tradeAmount = document.getElementById('tradeAmount');
        const tradePrice = document.getElementById('tradePrice');
        if (tradeAmount) tradeAmount.addEventListener('input', () => this.calculateTotal());
        if (tradePrice) tradePrice.addEventListener('input', () => this.calculateTotal());

        // Crypto filter
        const cryptoFilter = document.getElementById('cryptoFilter');
        if (cryptoFilter) {
            cryptoFilter.addEventListener('change', (e) => this.filterCryptos(e.target.value));
        }

        // Chart selectors
        const chartPair = document.getElementById('chartPair');
        const chartTimeframe = document.getElementById('chartTimeframe');
        if (chartPair) chartPair.addEventListener('change', () => this.updatePriceChart());
        if (chartTimeframe) chartTimeframe.addEventListener('change', () => this.updatePriceChart());

        // Modal event listeners
        this.setupModalListeners();
    }

    setupModalListeners() {
        const modal = document.getElementById('tradingModal');
        const closeBtn = document.getElementById('closeTradingModal');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeTradingModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeTradingModal();
            });
        }
    }

    renderCryptoTable() {
        const tbody = document.getElementById('cryptoTableBody');
        if (!tbody) return;

        tbody.innerHTML = Object.entries(this.cryptos).map(([symbol, crypto]) => {
            const changeClass = crypto.change24h > 0 ? 'text-green-600' : crypto.change24h < 0 ? 'text-red-600' : 'text-gray-600';
            const changeIcon = crypto.change24h > 0 ? 'fa-arrow-up' : crypto.change24h < 0 ? 'fa-arrow-down' : 'fa-minus';

            return `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3" 
                                 style="background-color: ${crypto.color}">
                                ${crypto.icon}
                            </div>
                            <div>
                                <div class="text-sm font-medium text-gray-900">${crypto.symbol}</div>
                                <div class="text-sm text-gray-500">${crypto.name}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-semibold persian-num text-gray-900">${this.formatPrice(crypto.priceAED)}</div>
                        <div class="text-xs text-gray-500 persian-num">$${this.formatPrice(crypto.price)}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm ${changeClass}">
                        <div class="flex items-center">
                            <i class="fas ${changeIcon} ml-1"></i>
                            <span class="persian-num">${crypto.change24h > 0 ? '+' : ''}${crypto.change24h.toFixed(2)}%</span>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm persian-num text-gray-900">${this.formatVolume(crypto.volume24h)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm persian-num text-gray-900">${this.formatVolume(crypto.marketCap)}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="price-sparkline">
                            <canvas id="sparkline_${symbol}" width="80" height="40"></canvas>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <div class="flex space-x-2 space-x-reverse">
                            <button onclick="cryptoManager.quickBuy('${symbol}')" 
                                    class="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                                خرید
                            </button>
                            <button onclick="cryptoManager.quickSell('${symbol}')" 
                                    class="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">
                                فروش
                            </button>
                            <button onclick="cryptoManager.addToWatchlist('${symbol}')" 
                                    class="text-orange-600 hover:text-orange-800">
                                <i class="fas fa-star"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Render sparklines
        Object.entries(this.cryptos).forEach(([symbol, crypto]) => {
            this.renderSparkline(symbol, crypto.sparkline);
        });
    }

    renderTradingPairs() {
        const container = document.getElementById('tradingPairs');
        if (!container) return;

        const pairs = [
            { pair: 'BTC/AED', price: '246,808', change: '+3.24%', volume: '28.4B', changeClass: 'text-green-600' },
            { pair: 'ETH/AED', price: '12,688', change: '+5.67%', volume: '15.7B', changeClass: 'text-green-600' },
            { pair: 'BNB/AED', price: '2,164', change: '-1.23%', volume: '2.9B', changeClass: 'text-red-600' },
            { pair: 'USDT/AED', price: '3.67', change: '+0.01%', volume: '45.7B', changeClass: 'text-green-600' },
            { pair: 'ADA/AED', price: '2.86', change: '+4.32%', volume: '890M', changeClass: 'text-green-600' }
        ];

        container.innerHTML = pairs.map(pair => `
            <div class="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer border"
                 onclick="cryptoManager.selectTradingPair('${pair.pair}')">
                <div>
                    <div class="font-semibold text-sm">${pair.pair}</div>
                    <div class="text-xs text-gray-500">Vol: ${pair.volume}</div>
                </div>
                <div class="text-right">
                    <div class="font-semibold text-sm persian-num">${pair.price}</div>
                    <div class="text-xs ${pair.changeClass} persian-num">${pair.change}</div>
                </div>
            </div>
        `).join('');
    }

    renderPortfolio() {
        const container = document.getElementById('portfolioBalance');
        if (!container) return;

        let totalValue = 0;
        const portfolioItems = Object.entries(this.portfolio).map(([symbol, holding]) => {
            totalValue += holding.value;
            const crypto = this.cryptos[symbol];
            const changeClass = crypto && crypto.change24h > 0 ? 'text-green-600' : 'text-red-600';
            
            return `
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center">
                        <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2" 
                             style="background-color: ${crypto ? crypto.color : '#666'}">
                            ${crypto ? crypto.icon : symbol[0]}
                        </div>
                        <div>
                            <div class="font-semibold text-sm">${symbol}</div>
                            <div class="text-xs text-gray-500 persian-num">${holding.balance}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-semibold text-sm persian-num">${this.formatPrice(holding.value)} AED</div>
                        <div class="text-xs ${changeClass} persian-num">
                            ${crypto ? (crypto.change24h > 0 ? '+' : '') + crypto.change24h.toFixed(2) + '%' : '--'}
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = portfolioItems.join('');
        
        // Update total portfolio value
        const totalElement = document.getElementById('totalPortfolioValue');
        if (totalElement) {
            totalElement.textContent = this.formatPrice(totalValue) + ' AED';
        }
    }

    setTradeType(type) {
        this.tradeType = type;
        const buyBtn = document.getElementById('buyBtn');
        const sellBtn = document.getElementById('sellBtn');
        
        if (type === 'buy') {
            buyBtn.classList.add('bg-green-600');
            buyBtn.classList.remove('bg-gray-300');
            sellBtn.classList.add('bg-gray-300');
            sellBtn.classList.remove('bg-red-600');
        } else {
            sellBtn.classList.add('bg-red-600');
            sellBtn.classList.remove('bg-gray-300');
            buyBtn.classList.add('bg-gray-300');
            buyBtn.classList.remove('bg-green-600');
        }
        
        this.calculateTotal();
    }

    calculateTotal() {
        const amount = parseFloat(document.getElementById('tradeAmount').value) || 0;
        const price = parseFloat(document.getElementById('tradePrice').value) || 0;
        const total = amount * price;
        
        const totalElement = document.getElementById('totalAmount');
        if (totalElement) {
            totalElement.textContent = this.formatPrice(total) + ' AED';
        }
    }

    async handleQuickTrade(e) {
        e.preventDefault();
        
        const crypto = document.getElementById('tradeCrypto').value;
        const amount = parseFloat(document.getElementById('tradeAmount').value);
        const price = parseFloat(document.getElementById('tradePrice').value);
        
        if (!crypto || !amount || !price) {
            this.showToast('لطفاً تمام فیلدها را پر کنید', 'error');
            return;
        }

        try {
            const order = {
                id: 'ORD' + Date.now(),
                type: this.tradeType,
                symbol: crypto,
                amount: amount,
                price: price,
                total: amount * price,
                status: 'pending',
                timestamp: new Date()
            };

            this.activeOrders.push(order);
            
            // Simulate order processing
            setTimeout(() => {
                order.status = 'completed';
                this.orderHistory.push(order);
                this.activeOrders = this.activeOrders.filter(o => o.id !== order.id);
                
                // Update portfolio
                if (this.tradeType === 'buy') {
                    if (this.portfolio[crypto]) {
                        this.portfolio[crypto].balance += amount;
                        this.portfolio[crypto].value += order.total;
                    } else {
                        this.portfolio[crypto] = { balance: amount, value: order.total };
                    }
                }
                
                this.renderPortfolio();
                this.showToast(`سفارش ${this.tradeType === 'buy' ? 'خرید' : 'فروش'} با موفقیت انجام شد`, 'success');
            }, 2000);
            
            this.showToast('سفارش ثبت شد و در حال پردازش است...', 'info');
            document.getElementById('quickTradeForm').reset();
            this.calculateTotal();
            
        } catch (error) {
            this.showToast('خطا در ثبت سفارش', 'error');
        }
    }

    setupCharts() {
        this.setupPriceChart();
    }

    setupPriceChart() {
        const ctx = document.getElementById('cryptoPriceChart');
        if (!ctx) return;

        // Generate mock price data
        const days = 30;
        const labels = [];
        const data = [];
        const basePrice = 67245;

        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('fa-IR'));
            
            const price = basePrice + (Math.random() - 0.5) * 5000;
            data.push(price);
        }

        this.charts.price = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'BTC/AED',
                    data: data,
                    borderColor: '#f7931e',
                    backgroundColor: 'rgba(247, 147, 30, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    renderSparkline(symbol, data) {
        const canvas = document.getElementById(`sparkline_${symbol}`);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);
        
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;
        
        ctx.strokeStyle = data[data.length - 1] > data[0] ? '#10b981' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }

    generateSparkline(basePrice, points) {
        const data = [];
        let currentPrice = basePrice;
        
        for (let i = 0; i < points; i++) {
            const change = (Math.random() - 0.5) * 0.05; // ±2.5% change
            currentPrice = currentPrice * (1 + change);
            data.push(currentPrice);
        }
        
        return data;
    }

    updateMarketStats() {
        const cryptos = Object.values(this.cryptos);
        const totalMarketCap = cryptos.reduce((sum, crypto) => sum + crypto.marketCap, 0);
        const avgChange = cryptos.reduce((sum, crypto) => sum + crypto.change24h, 0) / cryptos.length;
        const btcDominance = (this.cryptos.BTC.marketCap / totalMarketCap) * 100;
        
        this.updateElement('totalMarketCap', this.formatVolume(totalMarketCap));
        this.updateElement('marketChange24h', (avgChange > 0 ? '+' : '') + avgChange.toFixed(2) + '%');
        this.updateElement('btcDominance', btcDominance.toFixed(1) + '%');
        
        // Update last update time
        const now = new Date();
        this.updateElement('cryptoLastUpdate', now.toLocaleTimeString('fa-IR'));
        
        // Update analysis sections
        this.updateTopGainers();
        this.updateTopLosers();
        this.updateGeneralStats();
    }

    updateTopGainers() {
        const container = document.getElementById('topGainers');
        if (!container) return;

        const gainers = Object.entries(this.cryptos)
            .sort(([,a], [,b]) => b.change24h - a.change24h)
            .slice(0, 3);

        container.innerHTML = gainers.map(([symbol, crypto]) => `
            <div class="flex justify-between items-center">
                <span class="font-medium">${crypto.symbol}</span>
                <span class="text-green-600 persian-num">+${crypto.change24h.toFixed(2)}%</span>
            </div>
        `).join('');
    }

    updateTopLosers() {
        const container = document.getElementById('topLosers');
        if (!container) return;

        const losers = Object.entries(this.cryptos)
            .sort(([,a], [,b]) => a.change24h - b.change24h)
            .slice(0, 3);

        container.innerHTML = losers.map(([symbol, crypto]) => `
            <div class="flex justify-between items-center">
                <span class="font-medium">${crypto.symbol}</span>
                <span class="text-red-600 persian-num">${crypto.change24h.toFixed(2)}%</span>
            </div>
        `).join('');
    }

    updateGeneralStats() {
        const totalCryptos = Object.keys(this.cryptos).length;
        const totalVolume = Object.values(this.cryptos).reduce((sum, crypto) => sum + crypto.volume24h, 0);
        const avgChange = Object.values(this.cryptos).reduce((sum, crypto) => sum + crypto.change24h, 0) / totalCryptos;
        
        this.updateElement('totalCryptos', totalCryptos);
        this.updateElement('totalVolume', this.formatVolume(totalVolume));
        this.updateElement('avgCryptoChange', (avgChange > 0 ? '+' : '') + avgChange.toFixed(2) + '%');
        this.updateElement('fearGreedIndex', Math.floor(Math.random() * 100)); // Mock fear & greed index
    }

    startLiveUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            this.simulatePriceUpdates();
        }, 3000); // Update every 3 seconds
    }

    simulatePriceUpdates() {
        // Simulate small price changes
        Object.keys(this.cryptos).forEach(symbol => {
            const crypto = this.cryptos[symbol];
            const change = (Math.random() - 0.5) * 0.02; // ±1% change
            
            crypto.price = crypto.price * (1 + change);
            crypto.priceAED = crypto.price * 3.67; // Mock USD to AED conversion
            crypto.sparkline.shift();
            crypto.sparkline.push(crypto.price);
        });
        
        this.renderCryptoTable();
        this.updateMarketStats();
    }

    // Trading functions
    quickBuy(symbol) {
        document.getElementById('tradeCrypto').value = symbol;
        document.getElementById('tradePrice').value = this.cryptos[symbol].priceAED.toFixed(2);
        this.setTradeType('buy');
        this.calculateTotal();
        this.showToast(`آماده خرید ${symbol}`, 'info');
    }

    quickSell(symbol) {
        document.getElementById('tradeCrypto').value = symbol;
        document.getElementById('tradePrice').value = this.cryptos[symbol].priceAED.toFixed(2);
        this.setTradeType('sell');
        this.calculateTotal();
        this.showToast(`آماده فروش ${symbol}`, 'info');
    }

    addToWatchlist(symbol) {
        if (!this.watchlist.includes(symbol)) {
            this.watchlist.push(symbol);
            this.showToast(`${symbol} به لیست مشاهده اضافه شد`, 'success');
        } else {
            this.showToast(`${symbol} قبلاً در لیست مشاهده است`, 'info');
        }
    }

    filterCryptos(filter) {
        // Implementation for filtering crypto table
        console.log('Filtering cryptos by:', filter);
    }

    selectTradingPair(pair) {
        this.selectedPair = pair;
        console.log('Selected trading pair:', pair);
    }

    openTradingModal() {
        document.getElementById('tradingModal').classList.remove('hidden');
        this.renderActiveOrders();
        this.renderOrderHistory();
    }

    closeTradingModal() {
        document.getElementById('tradingModal').classList.add('hidden');
    }

    renderActiveOrders() {
        const container = document.getElementById('activeOrders');
        if (!container) return;

        if (this.activeOrders.length === 0) {
            container.innerHTML = '<div class="text-gray-500 text-sm">سفارش فعالی وجود ندارد</div>';
            return;
        }

        container.innerHTML = this.activeOrders.map(order => `
            <div class="border rounded-lg p-3 ${order.type === 'buy' ? 'order-buy' : 'order-sell'}">
                <div class="flex justify-between items-center">
                    <div>
                        <span class="font-semibold">${order.type === 'buy' ? 'خرید' : 'فروش'} ${order.symbol}</span>
                        <div class="text-sm text-gray-600 persian-num">${order.amount} @ ${order.price}</div>
                    </div>
                    <div class="text-right">
                        <div class="font-semibold persian-num">${this.formatPrice(order.total)} AED</div>
                        <div class="text-xs text-orange-600">${order.status}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderOrderHistory() {
        const container = document.getElementById('orderHistory');
        if (!container) return;

        if (this.orderHistory.length === 0) {
            container.innerHTML = '<div class="text-gray-500 text-sm">تاریخچه سفارشی وجود ندارد</div>';
            return;
        }

        container.innerHTML = this.orderHistory.slice(-5).map(order => `
            <div class="border rounded-lg p-3">
                <div class="flex justify-between items-center">
                    <div>
                        <span class="font-semibold ${order.type === 'buy' ? 'text-green-600' : 'text-red-600'}">
                            ${order.type === 'buy' ? 'خرید' : 'فروش'} ${order.symbol}
                        </span>
                        <div class="text-xs text-gray-500">${this.formatTime(order.timestamp)}</div>
                    </div>
                    <div class="text-right">
                        <div class="font-semibold persian-num">${this.formatPrice(order.total)} AED</div>
                        <div class="text-xs text-green-600">تکمیل شده</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async refreshAllCryptos() {
        this.showToast('در حال به‌روزرسانی قیمت‌ها...', 'info');
        
        try {
            await this.delay(1500);
            this.simulatePriceUpdates();
            this.showToast('تمام قیمت‌ها به‌روزرسانی شدند', 'success');
        } catch (error) {
            this.showToast('خطا در به‌روزرسانی', 'error');
        }
    }

    showPortfolioDetails() {
        this.showToast('جزئیات کیف پول در پنل بالا نمایش داده شده', 'info');
    }

    // Utility methods
    formatPrice(price) {
        return new Intl.NumberFormat('fa-IR', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        }).format(price);
    }

    formatVolume(volume) {
        if (volume >= 1e12) {
            return (volume / 1e12).toFixed(1) + 'T';
        } else if (volume >= 1e9) {
            return (volume / 1e9).toFixed(1) + 'B';
        } else if (volume >= 1e6) {
            return (volume / 1e6).toFixed(1) + 'M';
        } else if (volume >= 1e3) {
            return (volume / 1e3).toFixed(1) + 'K';
        }
        return volume.toString();
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString('fa-IR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    showToast(message, type = 'info') {
        // Create toast if doesn't exist
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'fixed top-4 right-4 z-50 transform translate-x-full transition-transform duration-300';
            toast.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg border-r-4 p-4 max-w-sm">
                    <div class="flex items-center">
                        <div id="toastIcon" class="mr-3"></div>
                        <div id="toastMessage" class="text-sm text-gray-700"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(toast);
        }

        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = document.getElementById('toastIcon');
        
        toastMessage.textContent = message;
        
        const configs = {
            success: { icon: 'fas fa-check-circle text-green-600', border: 'border-r-green-500' },
            error: { icon: 'fas fa-exclamation-circle text-red-600', border: 'border-r-red-500' },
            info: { icon: 'fas fa-info-circle text-blue-600', border: 'border-r-blue-500' }
        };
        
        const config = configs[type] || configs.info;
        toastIcon.innerHTML = `<i class="${config.icon}"></i>`;
        toast.firstElementChild.className = `bg-white rounded-lg shadow-lg ${config.border} border-r-4 p-4 max-w-sm`;
        
        toast.style.transform = 'translateX(0)';
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
        }, 5000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize Crypto Manager
let cryptoManager;
document.addEventListener('DOMContentLoaded', function() {
    cryptoManager = new CryptoManager();
});

// Make globally accessible
window.cryptoManager = cryptoManager;