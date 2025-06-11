// rates.js - Complete Rate Management System
class RateManager {
    constructor() {
        this.rates = {};
        this.alerts = [];
        this.viewMode = 'grid';
        this.charts = {};
        this.isLiveMode = true;
        this.updateInterval = null;
        this.currencies = [
            { code: 'USD', name: 'دلار آمریکا', flag: '🇺🇸' },
            { code: 'EUR', name: 'یورو', flag: '🇪🇺' },
            { code: 'GBP', name: 'پاند انگلیس', flag: '🇬🇧' },
            { code: 'IRR', name: 'تومان ایران', flag: '🇮🇷' },
            { code: 'SAR', name: 'ریال سعودی', flag: '🇸🇦' },
            { code: 'JPY', name: 'ین ژاپن', flag: '🇯🇵' },
            { code: 'CNY', name: 'یوان چین', flag: '🇨🇳' },
            { code: 'TRY', name: 'لیره ترکیه', flag: '🇹🇷' }
        ];
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
        this.updateStatistics();
        
        console.log('✅ Rate Manager initialized successfully');
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
            },
            'CNY_AED': {
                pair: 'CNY/AED',
                baseCurrency: 'CNY',
                quoteCurrency: 'AED',
                buyRate: 0.5089,
                sellRate: 0.5079,
                previousRate: 0.5083,
                change24h: 0.12,
                volume24h: 189000,
                high24h: 0.5095,
                low24h: 0.5075,
                source: 'api',
                lastUpdate: new Date(),
                flag: '🇨🇳',
                status: 'active'
            },
            'TRY_AED': {
                pair: 'TRY/AED',
                baseCurrency: 'TRY',
                quoteCurrency: 'AED',
                buyRate: 0.1203,
                sellRate: 0.1198,
                previousRate: 0.1205,
                change24h: -0.17,
                volume24h: 156000,
                high24h: 0.1210,
                low24h: 0.1195,
                source: 'api',
                lastUpdate: new Date(),
                flag: '🇹🇷',
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

        // Add custom rate button
        const addCustomRateBtn = document.getElementById('addCustomRateBtn');
        if (addCustomRateBtn) {
            addCustomRateBtn.addEventListener('click', () => this.openAddRateModal());
        }

        // History selectors
        const historyPair = document.getElementById('historyPair');
        const historyPeriod = document.getElementById('historyPeriod');
        if (historyPair) historyPair.addEventListener('change', () => this.updateHistoryChart());
        if (historyPeriod) historyPeriod.addEventListener('change', () => this.updateHistoryChart());

        // Modal event listeners
        this.setupModalListeners();
    }

    setupModalListeners() {
        const modal = document.getElementById('rateEditModal');
        const closeBtn = document.getElementById('closeRateModal');
        const cancelBtn = document.getElementById('cancelRateEdit');
        const editForm = document.getElementById('editRateForm');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        if (editForm) {
            editForm.addEventListener('submit', (e) => this.handleRateEdit(e));
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }
    }

    renderRates() {
        const gridContainer = document.getElementById('ratesGrid');
        const listContainer = document.getElementById('ratesList');
        const chartContainer = document.getElementById('ratesChart');

        if (!gridContainer) return;

        // Clear existing content
        gridContainer.innerHTML = '';

        // Render rate cards
        Object.entries(this.rates).forEach(([key, rate]) => {
            const card = this.createRateCard(rate);
            gridContainer.appendChild(card);
        });

        // Update table if in list view
        if (this.viewMode === 'list') {
            this.renderRateTable();
        }

        // Update chart if in chart view
        if (this.viewMode === 'chart') {
            this.renderRateChart();
        }
    }

    createRateCard(rate) {
        const card = document.createElement('div');
        const changeClass = rate.change24h > 0 ? 'rate-up' : rate.change24h < 0 ? 'rate-down' : 'rate-stable';
        const changeIcon = rate.change24h > 0 ? 'fa-arrow-up' : rate.change24h < 0 ? 'fa-arrow-down' : 'fa-minus';
        const changeColor = rate.change24h > 0 ? 'text-green-600' : rate.change24h < 0 ? 'text-red-600' : 'text-gray-600';

        card.className = `rate-card ${changeClass} bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-300`;
        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="flex items-center">
                    <span class="currency-flag">${rate.flag}</span>
                    <div>
                        <h3 class="font-bold text-lg">${rate.pair}</h3>
                        <p class="text-sm text-gray-600">${rate.baseCurrency} → ${rate.quoteCurrency}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2 space-x-reverse">
                    <i class="fas ${changeIcon} ${changeColor}"></i>
                    <span class="text-xs ${changeColor} font-semibold">${rate.change24h > 0 ? '+' : ''}${rate.change24h.toFixed(2)}%</span>
                </div>
            </div>

            <div class="space-y-2 mb-4">
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">نرخ خرید:</span>
                    <span class="font-semibold persian-num text-green-600">${this.formatRate(rate.buyRate)}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">نرخ فروش:</span>
                    <span class="font-semibold persian-num text-red-600">${this.formatRate(rate.sellRate)}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">حجم 24 ساعت:</span>
                    <span class="font-semibold persian-num text-blue-600">${this.formatVolume(rate.volume24h)}</span>
                </div>
            </div>

            <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                <div class="flex items-center space-x-2 space-x-reverse">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">${this.getSourceText(rate.source)}</span>
                    <span class="text-xs text-gray-500">${this.formatTime(rate.lastUpdate)}</span>
                </div>
                <div class="flex space-x-2 space-x-reverse">
                    <button onclick="rateManager.editRate('${rate.pair}')" class="text-blue-600 hover:text-blue-800 text-sm">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="rateManager.showRateHistory('${rate.pair}')" class="text-purple-600 hover:text-purple-800 text-sm">
                        <i class="fas fa-chart-line"></i>
                    </button>
                    <button onclick="rateManager.toggleRateAlert('${rate.pair}')" class="text-orange-600 hover:text-orange-800 text-sm">
                        <i class="fas fa-bell"></i>
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    renderRateTable() {
        const tbody = document.getElementById('ratesTableBody');
        if (!tbody) return;

        tbody.innerHTML = Object.entries(this.rates).map(([key, rate]) => {
            const changeClass = rate.change24h > 0 ? 'text-green-600' : rate.change24h < 0 ? 'text-red-600' : 'text-gray-600';
            const changeIcon = rate.change24h > 0 ? 'fa-arrow-up' : rate.change24h < 0 ? 'fa-arrow-down' : 'fa-minus';

            return `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <span class="currency-flag">${rate.flag}</span>
                            <div>
                                <div class="text-sm font-medium text-gray-900">${rate.pair}</div>
                                <div class="text-sm text-gray-500">${rate.baseCurrency}/${rate.quoteCurrency}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm persian-num font-semibold text-red-600">${this.formatRate(rate.sellRate)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm persian-num font-semibold text-green-600">${this.formatRate(rate.buyRate)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm ${changeClass}">
                        <div class="flex items-center">
                            <i class="fas ${changeIcon} ml-1"></i>
                            <span class="persian-num">${rate.change24h > 0 ? '+' : ''}${rate.change24h.toFixed(2)}%</span>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm persian-num text-gray-900">${this.formatVolume(rate.volume24h)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <div class="flex space-x-2 space-x-reverse">
                            <button onclick="rateManager.editRate('${rate.pair}')" class="text-blue-600 hover:text-blue-800">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="rateManager.showRateHistory('${rate.pair}')" class="text-purple-600 hover:text-purple-800">
                                <i class="fas fa-chart-line"></i>
                            </button>
                            <button onclick="rateManager.toggleRateAlert('${rate.pair}')" class="text-orange-600 hover:text-orange-800">
                                <i class="fas fa-bell"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderRateChart() {
        const canvas = document.getElementById('ratesChartCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.charts.rates) {
            this.charts.rates.destroy();
        }

        const labels = Object.values(this.rates).map(rate => rate.pair);
        const buyRates = Object.values(this.rates).map(rate => rate.buyRate);
        const sellRates = Object.values(this.rates).map(rate => rate.sellRate);

        this.charts.rates = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'نرخ خرید',
                    data: buyRates,
                    backgroundColor: 'rgba(34, 197, 94, 0.7)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 1
                }, {
                    label: 'نرخ فروش',
                    data: sellRates,
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 1
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
                        beginAtZero: true
                    }
                }
            }
        });
    }

    switchView(mode) {
        this.viewMode = mode;
        
        const gridDiv = document.getElementById('ratesGrid');
        const listDiv = document.getElementById('ratesList');
        const chartDiv = document.getElementById('ratesChart');

        // Hide all views
        if (gridDiv) gridDiv.style.display = 'none';
        if (listDiv) listDiv.style.display = 'none';
        if (chartDiv) chartDiv.style.display = 'none';

        // Show selected view
        switch (mode) {
            case 'grid':
                if (gridDiv) gridDiv.style.display = 'grid';
                break;
            case 'list':
                if (listDiv) listDiv.style.display = 'block';
                this.renderRateTable();
                break;
            case 'chart':
                if (chartDiv) chartDiv.style.display = 'block';
                this.renderRateChart();
                break;
        }
    }

    async handleQuickRateUpdate(e) {
        e.preventDefault();
        
        const currency = document.getElementById('quickCurrency').value;
        const newRate = parseFloat(document.getElementById('quickRate').value);
        
        if (!currency || !newRate) {
            this.showToast('لطفاً ارز و نرخ جدید را انتخاب کنید', 'error');
            return;
        }

        try {
            const pairKey = `${currency}_AED`;
            if (this.rates[pairKey]) {
                const oldRate = this.rates[pairKey].sellRate;
                this.rates[pairKey].sellRate = newRate;
                this.rates[pairKey].buyRate = newRate * 0.998; // 0.2% spread
                this.rates[pairKey].change24h = ((newRate - oldRate) / oldRate) * 100;
                this.rates[pairKey].lastUpdate = new Date();
                
                this.renderRates();
                this.updateStatistics();
                this.showToast(`نرخ ${currency} با موفقیت به‌روزرسانی شد`, 'success');
                
                // Reset form
                document.getElementById('quickRateForm').reset();
            }
        } catch (error) {
            this.showToast('خطا در به‌روزرسانی نرخ', 'error');
        }
    }

    async handleAlertSetup(e) {
        e.preventDefault();
        
        const currency = document.getElementById('alertCurrency').value;
        const lowAlert = parseFloat(document.getElementById('alertLow').value);
        const highAlert = parseFloat(document.getElementById('alertHigh').value);
        
        if (!currency || (!lowAlert && !highAlert)) {
            this.showToast('لطفاً اطلاعات هشدار را کامل کنید', 'error');
            return;
        }

        const alert = {
            id: Date.now(),
            currency: currency,
            lowThreshold: lowAlert,
            highThreshold: highAlert,
            isActive: true,
            createdAt: new Date()
        };

        this.alerts.push(alert);
        this.updateAlertCount();
        this.showToast('هشدار با موفقیت تنظیم شد', 'success');
        
        // Reset form
        document.getElementById('alertForm').reset();
    }

    async refreshAllRates() {
        this.showToast('در حال به‌روزرسانی نرخ‌ها...', 'info');
        
        try {
            // Simulate API calls
            await this.delay(1500);
            
            // Update rates with random fluctuations
            Object.keys(this.rates).forEach(key => {
                const rate = this.rates[key];
                const fluctuation = (Math.random() - 0.5) * 0.02; // ±1% fluctuation
                const oldRate = rate.sellRate;
                
                rate.sellRate = oldRate * (1 + fluctuation);
                rate.buyRate = rate.sellRate * 0.998;
                rate.change24h = ((rate.sellRate - rate.previousRate) / rate.previousRate) * 100;
                rate.lastUpdate = new Date();
            });
            
            this.renderRates();
            this.updateStatistics();
            this.updateLastUpdateTime();
            this.showToast('تمام نرخ‌ها با موفقیت به‌روزرسانی شدند', 'success');
            
        } catch (error) {
            this.showToast('خطا در به‌روزرسانی نرخ‌ها', 'error');
        }
    }

    editRate(pair) {
        const rate = Object.values(this.rates).find(r => r.pair === pair);
        if (!rate) return;

        // Populate modal
        document.getElementById('editCurrencyPair').value = pair;
        document.getElementById('editBuyRate').value = rate.buyRate;
        document.getElementById('editSellRate').value = rate.sellRate;
        document.getElementById('editRateSource').value = rate.source;

        // Show modal
        document.getElementById('rateEditModal').classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('rateEditModal').classList.add('hidden');
    }

    async handleRateEdit(e) {
        e.preventDefault();
        
        const pair = document.getElementById('editCurrencyPair').value;
        const buyRate = parseFloat(document.getElementById('editBuyRate').value);
        const sellRate = parseFloat(document.getElementById('editSellRate').value);
        const source = document.getElementById('editRateSource').value;
        const notes = document.getElementById('editRateNotes').value;

        try {
            const rateKey = Object.keys(this.rates).find(key => this.rates[key].pair === pair);
            if (rateKey) {
                this.rates[rateKey].buyRate = buyRate;
                this.rates[rateKey].sellRate = sellRate;
                this.rates[rateKey].source = source;
                this.rates[rateKey].notes = notes;
                this.rates[rateKey].lastUpdate = new Date();
                
                this.renderRates();
                this.closeModal();
                this.showToast('نرخ با موفقیت ویرایش شد', 'success');
            }
        } catch (error) {
            this.showToast('خطا در ویرایش نرخ', 'error');
        }
    }

    setupCharts() {
        this.setupHistoryChart();
    }

    setupHistoryChart() {
        const ctx = document.getElementById('historyChart');
        if (!ctx) return;

        // Generate mock historical data
        const days = 30;
        const labels = [];
        const data = [];
        const baseRate = 3.67;

        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('fa-IR'));
            
            const rate = baseRate + (Math.random() - 0.5) * 0.1;
            data.push(rate);
        }

        this.charts.history = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'USD/AED',
                    data: data,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
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

    updateHistoryChart() {
        const pair = document.getElementById('historyPair').value;
        const period = document.getElementById('historyPeriod').value;
        
        if (this.charts.history) {
            // Update chart with new data based on selected pair and period
            this.charts.history.data.datasets[0].label = pair.replace('_', '/');
            this.charts.history.update();
        }
    }

    startLiveUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            if (this.isLiveMode) {
                this.simulateLiveUpdates();
            }
        }, 5000); // Update every 5 seconds
    }

    simulateLiveUpdates() {
        // Simulate small rate changes
        const randomPair = Object.keys(this.rates)[Math.floor(Math.random() * Object.keys(this.rates).length)];
        const rate = this.rates[randomPair];
        const change = (Math.random() - 0.5) * 0.001; // ±0.05% change
        
        rate.sellRate = rate.sellRate * (1 + change);
        rate.buyRate = rate.sellRate * 0.998;
        rate.lastUpdate = new Date();
        
        // Update only the changed card
        this.renderRates();
        this.updateLastUpdateTime();
    }

    updateStatistics() {
        const rates = Object.values(this.rates);
        const upRates = rates.filter(r => r.change24h > 0).length;
        const downRates = rates.filter(r => r.change24h < 0).length;
        
        this.updateElement('totalPairs', rates.length);
        this.updateElement('pairsUp', upRates);
        this.updateElement('pairsDown', downRates);
        
        // Update daily stats
        const totalChanges = Math.floor(Math.random() * 50) + 30;
        const avgChange = rates.reduce((sum, r) => sum + r.change24h, 0) / rates.length;
        const maxGain = Math.max(...rates.map(r => r.change24h));
        const maxLoss = Math.min(...rates.map(r => r.change24h));
        
        this.updateElement('rateChanges', totalChanges);
        this.updateElement('avgChange', (avgChange > 0 ? '+' : '') + avgChange.toFixed(2) + '%');
        this.updateElement('maxGain', '+' + maxGain.toFixed(2) + '%');
        this.updateElement('maxLoss', maxLoss.toFixed(2) + '%');
    }

    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fa-IR');
        this.updateElement('lastUpdate', timeString);
    }

    updateAlertCount() {
        const activeAlerts = this.alerts.filter(alert => alert.isActive).length;
        this.updateElement('activeAlerts', activeAlerts);
    }

    // Utility methods
    formatRate(rate) {
        if (rate < 0.001) {
            return rate.toFixed(7);
        } else if (rate < 1) {
            return rate.toFixed(4);
        } else {
            return rate.toFixed(4);
        }
    }

    formatVolume(volume) {
        if (volume >= 1000000) {
            return (volume / 1000000).toFixed(1) + 'M';
        } else if (volume >= 1000) {
            return (volume / 1000).toFixed(1) + 'K';
        }
        return volume.toString();
    }

    formatTime(date) {
        return date.toLocaleTimeString('fa-IR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    getSourceText(source) {
        const sources = {
            'api': 'API',
            'manual': 'دستی',
            'bank': 'بانک'
        };
        return sources[source] || source;
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    showToast(message, type = 'info') {
        // Create toast element if it doesn't exist
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'fixed top-4 right-4 z-50 transform translate-x-full transition-transform duration-300';
            toast.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg border-l-4 p-4 max-w-sm">
                    <div class="flex items-center">
                        <div id="toastIcon" class="ml-3"></div>
                        <div id="toastMessage" class="text-sm font-medium"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(toast);
        }

        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = document.getElementById('toastIcon');
        
        if (!toastMessage || !toastIcon) return;

        toastMessage.textContent = message;
        
        const configs = {
            success: { icon: 'fas fa-check-circle text-green-600', border: 'border-green-500' },
            error: { icon: 'fas fa-exclamation-circle text-red-600', border: 'border-red-500' },
            info: { icon: 'fas fa-info-circle text-blue-600', border: 'border-blue-500' }
        };
        
        const config = configs[type] || configs.info;
        toastIcon.innerHTML = `<i class="${config.icon}"></i>`;
        toast.firstElementChild.className = `bg-white rounded-lg shadow-lg border-l-4 ${config.border} p-4 max-w-sm`;
        
        toast.style.transform = 'translateX(0)';
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
        }, 5000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Export/Import methods
    exportRates() {
        const dataStr = JSON.stringify(this.rates, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'exchange_rates.json';
        link.click();
        URL.revokeObjectURL(url);
        
        this.showToast('نرخ‌ها با موفقیت خروجی گرفته شد', 'success');
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
                        const importedRates = JSON.parse(e.target.result);
                        this.rates = { ...this.rates, ...importedRates };
                        this.renderRates();
                        this.showToast('نرخ‌ها با موفقیت وارد شدند', 'success');
                    } catch (error) {
                        this.showToast('خطا در خواندن فایل', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // Additional methods
    showRateHistory(pair) {
        console.log('Showing history for:', pair);
        // Implementation for showing detailed rate history
    }

    toggleRateAlert(pair) {
        console.log('Toggling alert for:', pair);
        // Implementation for toggling rate alerts
    }

    openAddRateModal() {
        console.log('Opening add rate modal');
        // Implementation for adding new currency pairs
    }
}

// Initialize the rate manager
let rateManager;
document.addEventListener('DOMContentLoaded', function() {
    rateManager = new RateManager();
});

// Make it globally accessible
window.rateManager = rateManager;