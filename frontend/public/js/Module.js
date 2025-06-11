// Rate Management System - Complete Implementation
class RateManager {
    constructor() {
        this.rates = {};
        this.alerts = [];
        this.viewMode = 'grid';
        this.charts = {};
        this.isLiveMode = true;
        this.updateInterval = null;
        this.init();
    }

    async init() {
        console.log('💱 Rate Manager initializing...');
        
        await this.waitForAuth();
        
        this.setupDefaultRates();
        this.setupEventListeners();
        this.renderRates();
        this.setupCharts();
        this.updateLastUpdateTime();
        this.startLiveUpdates();
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

    setupDefaultRates() {
        this.rates = {
            'USD_AED': {
                pair: 'USD/AED',
                baseCurrency: 'USD',
                quoteCurrency: 'AED',
                buyRate: 3.6725,
                sellRate: 3.6650,
                previousRate: 3.6710,
                change24h: 0.15,
                volume24h: 2847000,
                high24h: 3.6780,
                low24h: 3.6620,
                source: 'api',
                lastUpdate: new Date(),
                flag: '🇺🇸',
                status: 'active'
            },
            'EUR_AED': {
                pair: 'EUR/AED',
                baseCurrency: 'EUR',
                quoteCurrency: 'AED',
                buyRate: 3.9650,
                sellRate: 3.9550,
                previousRate: 3.9560,
                change24h: 0.23,
                volume24h: 1945000,
                high24h: 3.9710,
                low24h: 3.9480,
                source: 'api',
                lastUpdate: new Date(),
                flag: '🇪🇺',
                status: 'active'
            },
            'GBP_AED': {
                pair: 'GBP/AED',
                baseCurrency: 'GBP',
                quoteCurrency: 'AED',
                buyRate: 4.6240,
                sellRate: 4.6140,
                previousRate: 4.6278,
                change24h: -0.08,
                volume24h: 987000,
                high24h: 4.6350,
                low24h: 4.6120,
                source: 'api',
                lastUpdate: new Date(),
                flag: '🇬🇧',
                status: 'active'
            },
            'IRR_AED': {
                pair: 'IRR/AED',
                baseCurrency: 'IRR',
                quoteCurrency: 'AED',
                buyRate: 0.0000873,
                sellRate: 0.0000883,
                previousRate: 0.0000862,
                change24h: 1.25,
                volume24h: 654000,
                high24h: 0.0000890,
                low24h: 0.0000860,
                source: 'manual',
                lastUpdate: new Date(),
                flag: '🇮🇷',
                status: 'active'
            },
            'SAR_AED': {
                pair: 'SAR/AED',
                baseCurrency: 'SAR',
                quoteCurrency: 'AED',
                buyRate: 0.9793,
                sellRate: 0.9783,
                previousRate: 0.9791,
                change24h: 0.02,
                volume24h: 432000,
                high24h: 0.9798,
                low24h: 0.9775,
                source: 'bank',
                lastUpdate: new Date(),
                flag: '🇸🇦',
                status: 'active'
            },
            'JPY_AED': {
                pair: 'JPY/AED',
                baseCurrency: 'JPY',
                quoteCurrency: 'AED',
                buyRate: 0.0245,
                sellRate: 0.0243,
                previousRate: 0.0244,
                change24h: 0.41,
                volume24h: 298000,
                high24h: 0.0246,
                low24h: 0.0242,
                source: 'api',
                lastUpdate: new Date(),
                flag: '🇯🇵',
                status: 'active'
            }
        };
    }

    setupEventListeners() {
        // View mode selector
        const rateView = document.getElementById('rateView');
        if (rateView) {
            rateView.addEventListener('change', (e) => this.switchView(e.target.value));
        }

        // Quick rate form
        const quickRateForm = document.getElementById('quickRateForm');
        if (quickRateForm) {
            quickRateForm.addEventListener('submit', (e) => this.handleQuickRateUpdate(e));
        }

        // Alert form
        const alertForm = document.getElementById('alertForm');
        if (alertForm) {
            alertForm.addEventListener('submit', (e) => this.handleAlertSetup(e));
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshRatesBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshAllRates());
        }

        // Export/Import buttons
        const exportBtn = document.getElementById('exportRatesBtn');
        const importBtn = document.getElementById('importRatesBtn');
        if (exportBtn) exportBtn.addEventListener('click', () => this.exportRates());
        if (importBtn) importBtn.addEventListener('click', () => this.importRates());

        // Modal controls
        const closeModal = document.getElementById('closeRateModal');
        const cancelEdit = document.getElementById('cancelRateEdit');
        if (closeModal) closeModal.addEventListener('click', () => this.closeModal());
        if (cancelEdit) cancelEdit.addEventListener('click', () => this.closeModal());

        // Edit rate form
        const editRateForm = document.getElementById('editRateForm');
        if (editRateForm) {
            editRateForm.addEventListener('submit', (e) => this.handleRateEdit(e));
        }

        // History chart controls
        const historyPair = document.getElementById('historyPair');
        const historyPeriod = document.getElementById('historyPeriod');
        if (historyPair) historyPair.addEventListener('change', () => this.updateHistoryChart());
        if (historyPeriod) historyPeriod.addEventListener('change', () => this.updateHistoryChart());
    }

    switchView(mode) {
        this.viewMode = mode;
        
        // Hide all views
        document.getElementById('ratesGrid').classList.add('hidden');
        document.getElementById('ratesList').classList.add('hidden');
        document.getElementById('ratesChart').classList.add('hidden');
        
        // Show selected view
        switch(mode) {
            case 'grid':
                document.getElementById('ratesGrid').classList.remove('hidden');
                this.renderRatesGrid();
                break;
            case 'list':
                document.getElementById('ratesList').classList.remove('hidden');
                this.renderRatesList();
                break;
            case 'chart':
                document.getElementById('ratesChart').classList.remove('hidden');
                this.renderRatesChart();
                break;
        }
    }

    renderRates() {
        this.renderRatesGrid();
        this.updateStatistics();
    }

    renderRatesGrid() {
        const container = document.getElementById('ratesGrid');
        if (!container) return;

        container.innerHTML = Object.entries(this.rates).map(([key, rate]) => `
            <div class="rate-card ${this.getRateCardClass(rate.change24h)} bg-white rounded-lg shadow-lg p-6 cursor-pointer"
                 onclick="rateManager.editRate('${key}')">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center">
                        <span class="currency-flag">${rate.flag}</span>
                        <div>
                            <div class="font-bold text-lg">${rate.pair}</div>
                            <div class="text-sm text-gray-500">${rate.baseCurrency} → ${rate.quoteCurrency}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs px-2 py-1 rounded-full ${this.getSourceBadgeClass(rate.source)}">
                            ${this.getSourceText(rate.source)}
                        </div>
                    </div>
                </div>
                
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">نرخ فروش:</span>
                        <span class="font-bold persian-num text-lg">${this.formatRate(rate.sellRate)}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">نرخ خرید:</span>
                        <span class="font-bold persian-num">${this.formatRate(rate.buyRate)}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">تغییر 24h:</span>
                        <span class="font-bold persian-num ${rate.change24h >= 0 ? 'text-green-600' : 'text-red-600'}">
                            ${rate.change24h >= 0 ? '+' : ''}${rate.change24h.toFixed(2)}%
                        </span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">حجم:</span>
                        <span class="text-sm persian-num text-gray-700">${this.formatVolume(rate.volume24h)}</span>
                    </div>
                </div>
                
                <div class="mt-4 pt-4 border-t border-gray-200">
                    <div class="flex justify-between items-center text-xs text-gray-500">
                        <span>آخرین به‌روزرسانی:</span>
                        <span>${this.formatTime(rate.lastUpdate)}</span>
                    </div>
                </div>
                
                <div class="mt-3 flex space-x-2 space-x-reverse">
                    <button onclick="event.stopPropagation(); rateManager.refreshSingleRate('${key}')" 
                            class="flex-1 bg-blue-50 text-blue-600 py-1 px-3 rounded text-sm hover:bg-blue-100">
                        <i class="fas fa-sync text-xs"></i> به‌روزرسانی
                    </button>
                    <button onclick="event.stopPropagation(); rateManager.toggleRateAlert('${key}')" 
                            class="flex-1 bg-orange-50 text-orange-600 py-1 px-3 rounded text-sm hover:bg-orange-100">
                        <i class="fas fa-bell text-xs"></i> هشدار
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderRatesList() {
        const tbody = document.getElementById('ratesTableBody');
        if (!tbody) return;

        tbody.innerHTML = Object.entries(this.rates).map(([key, rate]) => `
            <tr class="hover:bg-gray-50 cursor-pointer" onclick="rateManager.editRate('${key}')">
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        <span class="currency-flag">${rate.flag}</span>
                        <div>
                            <div class="font-medium">${rate.pair}</div>
                            <div class="text-sm text-gray-500">${rate.baseCurrency}/${rate.quoteCurrency}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 font-bold persian-num">${this.formatRate(rate.sellRate)}</td>
                <td class="px-6 py-4 font-bold persian-num">${this.formatRate(rate.buyRate)}</td>
                <td class="px-6 py-4">
                    <span class="font-bold persian-num ${rate.change24h >= 0 ? 'text-green-600' : 'text-red-600'}">
                        ${rate.change24h >= 0 ? '+' : ''}${rate.change24h.toFixed(2)}%
                    </span>
                </td>
                <td class="px-6 py-4 persian-num">${this.formatVolume(rate.volume24h)}</td>
                <td class="px-6 py-4">
                    <div class="flex space-x-2 space-x-reverse">
                        <button onclick="event.stopPropagation(); rateManager.refreshSingleRate('${key}')" 
                                class="text-blue-600 hover:text-blue-800" title="به‌روزرسانی">
                            <i class="fas fa-sync"></i>
                        </button>
                        <button onclick="event.stopPropagation(); rateManager.toggleRateAlert('${key}')" 
                                class="text-orange-600 hover:text-orange-800" title="هشدار">
                            <i class="fas fa-bell"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateStatistics() {
        const totalPairs = Object.keys(this.rates).length;
        const pairsUp = Object.values(this.rates).filter(rate => rate.change24h > 0).length;
        const pairsDown = Object.values(this.rates).filter(rate => rate.change24h < 0).length;
        
        this.updateElement('totalPairs', totalPairs);
        this.updateElement('pairsUp', pairsUp);
        this.updateElement('pairsDown', pairsDown);
        
        // Calculate statistics
        const changes = Object.values(this.rates).map(rate => rate.change24h);
        const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
        const maxGain = Math.max(...changes);
        const maxLoss = Math.min(...changes);
        
        this.updateElement('rateChanges', Object.keys(this.rates).length * 5); // Mock: 5 updates per pair
        this.updateElement('avgChange', (avgChange >= 0 ? '+' : '') + avgChange.toFixed(2) + '%');
        
        // Find currencies with max gain/loss
        const maxGainPair = Object.values(this.rates).find(rate => rate.change24h === maxGain);
        const maxLossPair = Object.values(this.rates).find(rate => rate.change24h === maxLoss);
        
        this.updateElement('maxGain', `${maxGainPair.baseCurrency} +${maxGain.toFixed(2)}%`);
        this.updateElement('maxLoss', `${maxLossPair.baseCurrency} ${maxLoss.toFixed(2)}%`);
    }

    async handleQuickRateUpdate(e) {
        e.preventDefault();
        
        const currency = document.getElementById('quickCurrency').value;
        const newRate = parseFloat(document.getElementById('quickRate').value);
        
        if (!currency || !newRate) {
            this.showToast('لطفاً ارز و نرخ جدید را انتخاب کنید', 'error');
            return;
        }

        const rateKey = `${currency}_AED`;
        if (this.rates[rateKey]) {
            const oldRate = this.rates[rateKey].sellRate;
            this.rates[rateKey].sellRate = newRate;
            this.rates[rateKey].buyRate = newRate * 0.998; // 0.2% spread
            this.rates[rateKey].previousRate = oldRate;
            this.rates[rateKey].change24h = ((newRate - oldRate) / oldRate) * 100;
            this.rates[rateKey].lastUpdate = new Date();
            
            this.renderRates();
            this.showToast(`نرخ ${currency} با موفقیت به‌روزرسانی شد`, 'success');
            
            // Reset form
            document.getElementById('quickRateForm').reset();
        }
    }

    setupCharts() {
        this.setupHistoryChart();
    }

    setupHistoryChart() {
        const ctx = document.getElementById('historyChart');
        if (!ctx) return;

        // Mock historical data
        const historyData = this.generateHistoryData('USD_AED', '1W');
        
        this.charts.history = new Chart(ctx, {
            type: 'line',
            data: {
                labels: historyData.labels,
                datasets: [{
                    label: 'USD/AED',
                    data: historyData.values,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(4);
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    generateHistoryData(pair, period) {
        const rate = this.rates[pair];
        const baseRate = rate.sellRate;
        const data = [];
        const labels = [];
        
        let periods = 7; // Default for 1W
        let labelFormat = 'MM/DD';
        
        switch(period) {
            case '1D': periods = 24; labelFormat = 'HH:mm'; break;
            case '1W': periods = 7; labelFormat = 'MM/DD'; break;
            case '1M': periods = 30; labelFormat = 'MM/DD'; break;
            case '3M': periods = 90; labelFormat = 'MM/DD'; break;
            case '1Y': periods = 365; labelFormat = 'MM/DD'; break;
        }
        
        for (let i = periods; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Generate realistic price movement
            const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
            const price = baseRate * (1 + variation);
            
            data.push(price);
            labels.push(this.formatDateForChart(date, labelFormat));
        }
        
        return { labels, values: data };
    }

    updateHistoryChart() {
        const pair = document.getElementById('historyPair').value;
        const period = document.getElementById('historyPeriod').value;
        
        if (this.charts.history && pair && period) {
            const historyData = this.generateHistoryData(pair, period);
            this.charts.history.data.labels = historyData.labels;
            this.charts.history.data.datasets[0].data = historyData.values;
            this.charts.history.data.datasets[0].label = pair.replace('_', '/');
            this.charts.history.update();
        }
    }

    editRate(rateKey) {
        const rate = this.rates[rateKey];
        if (!rate) return;

        // Populate modal
        document.getElementById('editCurrencyPair').value = rate.pair;
        document.getElementById('editBuyRate').value = rate.buyRate;
        document.getElementById('editSellRate').value = rate.sellRate;
        document.getElementById('editRateSource').value = rate.source;
        
        // Store current rate key for saving
        this.currentEditKey = rateKey;
        
        // Show modal
        document.getElementById('rateEditModal').classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('rateEditModal').classList.add('hidden');
        this.currentEditKey = null;
    }

    async handleRateEdit(e) {
        e.preventDefault();
        
        if (!this.currentEditKey) return;
        
        const buyRate = parseFloat(document.getElementById('editBuyRate').value);
        const sellRate = parseFloat(document.getElementById('editSellRate').value);
        const source = document.getElementById('editRateSource').value;
        const notes = document.getElementById('editRateNotes').value;
        
        if (!buyRate || !sellRate) {
            this.showToast('لطفاً نرخ خرید و فروش را وارد کنید', 'error');
            return;
        }
        
        if (buyRate >= sellRate) {
            this.showToast('نرخ خرید باید کمتر از نرخ فروش باشد', 'error');
            return;
        }
        
        // Update rate
        const rate = this.rates[this.currentEditKey];
        const oldSellRate = rate.sellRate;
        
        rate.buyRate = buyRate;
        rate.sellRate = sellRate;
        rate.source = source;
        rate.notes = notes;
        rate.change24h = ((sellRate - oldSellRate) / oldSellRate) * 100;
        rate.lastUpdate = new Date();
        
        this.renderRates();
        this.closeModal();
        this.showToast('نرخ با موفقیت به‌روزرسانی شد', 'success');
    }

    async refreshSingleRate(rateKey) {
        const rate = this.rates[rateKey];
        if (!rate) return;
        
        this.showToast(`در حال به‌روزرسانی ${rate.baseCurrency}...`, 'info');
        
        // Simulate API call
        await this.delay(1000);
        
        // Simulate rate update
        const variation = (Math.random() - 0.5) * 0.01; // ±0.5% variation
        const oldRate = rate.sellRate;
        const newRate = oldRate * (1 + variation);
        
        rate.previousRate = oldRate;
        rate.sellRate = newRate;
        rate.buyRate = newRate * 0.998;
        rate.change24h = ((newRate - oldRate) / oldRate) * 100;
        rate.lastUpdate = new Date();
        
        this.renderRates();
        this.showToast(`نرخ ${rate.baseCurrency} به‌روزرسانی شد`, 'success');
    }

    async refreshAllRates() {
        this.showToast('در حال به‌روزرسانی همه نرخ‌ها...', 'info');
        
        // Simulate API call
        await this.delay(2000);
        
        // Update all rates with small variations
        Object.values(this.rates).forEach(rate => {
            const variation = (Math.random() - 0.5) * 0.01;
            const oldRate = rate.sellRate;
            const newRate = oldRate * (1 + variation);
            
            rate.previousRate = oldRate;
            rate.sellRate = newRate;
            rate.buyRate = newRate * 0.998;
            rate.change24h = ((newRate - oldRate) / oldRate) * 100;
            rate.lastUpdate = new Date();
        });
        
        this.renderRates();
        this.updateLastUpdateTime();
        this.showToast('همه نرخ‌ها به‌روزرسانی شدند', 'success');
    }

    startLiveUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        // Update rates every 30 seconds
        this.updateInterval = setInterval(() => {
            if (this.isLiveMode) {
                this.simulateLiveUpdate();
            }
        }, 30000);
    }

    simulateLiveUpdate() {
        // Randomly update 1-2 rates
        const rateKeys = Object.keys(this.rates);
        const updateCount = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < updateCount; i++) {
            const randomKey = rateKeys[Math.floor(Math.random() * rateKeys.length)];
            const rate = this.rates[randomKey];
            
            const variation = (Math.random() - 0.5) * 0.005; // ±0.25% variation
            const oldRate = rate.sellRate;
            const newRate = oldRate * (1 + variation);
            
            rate.previousRate = oldRate;
            rate.sellRate = newRate;
            rate.buyRate = newRate * 0.998;
            rate.change24h = ((newRate - rate.previousRate) / rate.previousRate) * 100;
            rate.lastUpdate = new Date();
        }
        
        this.renderRates();
        this.updateLastUpdateTime();
    }

    // Utility methods
    getRateCardClass(change) {
        if (change > 0) return 'rate-up';
        if (change < 0) return 'rate-down';
        return 'rate-stable';
    }

    getSourceBadgeClass(source) {
        const classes = {
            api: 'bg-blue-100 text-blue-800',
            manual: 'bg-gray-100 text-gray-800',
            bank: 'bg-green-100 text-green-800'
        };
        return classes[source] || 'bg-gray-100 text-gray-800';
    }

    getSourceText(source) {
        const texts = {
            api: 'API',
            manual: 'دستی',
            bank: 'بانک'
        };
        return texts[source] || source;
    }

    formatRate(rate) {
        return new Intl.NumberFormat('fa-IR', { 
            minimumFractionDigits: 4,
            maximumFractionDigits: 4 
        }).format(rate);
    }

    formatVolume(volume) {
        if (volume >= 1000000) {
            return (volume / 1000000).toFixed(1) + 'M';
        } else if (volume >= 1000) {
            return (volume / 1000).toFixed(0) + 'K';
        }
        return volume.toString();
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString('fa-IR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    formatDateForChart(date, format) {
        if (format === 'HH:mm') {
            return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString('fa-IR', { month: '2-digit', day: '2-digit' });
    }

    updateLastUpdateTime() {
        const element = document.getElementById('lastUpdate');
        if (element) {
            element.textContent = new Date().toLocaleTimeString('fa-IR');
        }
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `fixed top-4 left-4 bg-white rounded-lg shadow-lg border-l-4 p-4 max-w-sm z-50 transform transition-transform duration-300`;
        
        const colors = {
            success: 'border-green-500',
            error: 'border-red-500',
            info: 'border-blue-500'
        };
        
        const icons = {
            success: 'fas fa-check-circle text-green-600',
            error: 'fas fa-exclamation-circle text-red-600',
            info: 'fas fa-info-circle text-blue-600'
        };
        
        toast.classList.add(colors[type] || colors.info);
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="${icons[type] || icons.info} ml-3"></i>
                <p class="text-sm font-medium text-gray-900">${message}</p>
                <button onclick="this.parentElement.parentElement.remove()" class="mr-auto text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Export/Import functionality
    exportRates() {
        const data = {
            rates: this.rates,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rates_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('نرخ‌ها با موفقیت صادر شدند', 'success');
    }

    importRates() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (data.rates) {
                            this.rates = { ...this.rates, ...data.rates };
                            this.renderRates();
                            this.showToast('نرخ‌ها با موفقیت وارد شدند', 'success');
                        }
                    } catch (error) {
                        this.showToast('خطا در خواندن فایل', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
}

// Initialize the rate manager
let rateManager;
document.addEventListener('DOMContentLoaded', function() {
    rateManager = new RateManager();
});

// Make it globally accessible
window.rateManager = rateManager;