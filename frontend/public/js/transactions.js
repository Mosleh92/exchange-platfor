// Transaction Management System - Complete Implementation
class TransactionManager {
    constructor() {
        this.transactions = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.totalRecords = 0;
        this.filters = {};
        this.charts = {};
        this.currentRates = {};
        this.partnerRates = {};
        this.init();
    }

    async init() {
        console.log('💰 Transaction Manager initializing...');
        
        // Wait for auth system
        await this.waitForAuth();
        
        this.loadCurrentRates();
        this.loadPartnerRates();
        this.setupEventListeners();
        this.loadTransactions();
        this.updateStatistics();
        this.setupCharts();
        this.startRealTimeUpdates();
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

    loadCurrentRates() {
        // نرخ‌های فعلی بازار
        this.currentRates = {
            'AED_USD': 0.2723,
            'USD_AED': 3.6725,
            'EUR_AED': 3.9650,
            'AED_EUR': 0.2522,
            'IRR_AED': 0.0000873,
            'AED_IRR': 11456,
            'USD_EUR': 1.0799,
            'EUR_USD': 0.9260,
            'SAR_AED': 0.9793,
            'AED_SAR': 1.0211,
            'GBP_AED': 4.6240,
            'AED_GBP': 0.2163
        };
    }

    loadPartnerRates() {
        // نرخ‌های ویژه برای محاسبه سود
        this.partnerRates = {
            'AED_USD': 0.2720, // کمی بهتر از بازار
            'USD_AED': 3.6650,
            'EUR_AED': 3.9550,
            'AED_EUR': 0.2527,
            'IRR_AED': 0.0000883,
            'AED_IRR': 11326,
            'USD_EUR': 1.0820,
            'EUR_USD': 0.9242,
            'SAR_AED': 0.9783,
            'AED_SAR': 1.0222,
            'GBP_AED': 4.6140,
            'AED_GBP': 0.2167
        };
    }

    setupEventListeners() {
        // New Transaction Button
        const newTransactionBtn = document.getElementById('newTransactionBtn');
        if (newTransactionBtn) {
            newTransactionBtn.addEventListener('click', () => this.openNewTransactionModal());
        }

        // Modal Controls
        const closeModal = document.getElementById('closeModal');
        const cancelTransaction = document.getElementById('cancelTransaction');
        if (closeModal) closeModal.addEventListener('click', () => this.closeModal());
        if (cancelTransaction) cancelTransaction.addEventListener('click', () => this.closeModal());

        // Form Submission
        const newTransactionForm = document.getElementById('newTransactionForm');
        if (newTransactionForm) {
            newTransactionForm.addEventListener('submit', (e) => this.handleNewTransaction(e));
        }

        // Real-time calculation
        const calculationInputs = ['amount', 'customerRate', 'fromCurrency', 'toCurrency'];
        calculationInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => this.calculateTransaction());
                if (input.tagName === 'SELECT') {
                    input.addEventListener('change', () => this.updateRates());
                }
            }
        });

        // Search and Filters
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        const filters = ['statusFilter', 'currencyFilter', 'fromDate', 'toDate'];
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', () => this.applyFilters());
            }
        });

        // Export Button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportToExcel());
        }

        // Refresh Button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }

        // Pagination
        const prevPage = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');
        if (prevPage) prevPage.addEventListener('click', () => this.previousPage());
        if (nextPage) nextPage.addEventListener('click', () => this.nextPage());
    }

    openNewTransactionModal() {
        const modal = document.getElementById('transactionModal');
        if (modal) {
            modal.classList.remove('hidden');
            this.resetForm();
            this.updateRates();
        }
    }

    closeModal() {
        const modal = document.getElementById('transactionModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    resetForm() {
        const form = document.getElementById('newTransactionForm');
        if (form) {
            form.reset();
            this.clearCalculations();
        }
    }

    updateRates() {
        const fromCurrency = document.getElementById('fromCurrency')?.value;
        const toCurrency = document.getElementById('toCurrency')?.value;
        
        if (fromCurrency && toCurrency && fromCurrency !== toCurrency) {
            const rateKey = `${fromCurrency}_${toCurrency}`;
            const marketRate = this.currentRates[rateKey];
            
            if (marketRate) {
                const marketRateInput = document.getElementById('marketRate');
                const customerRateInput = document.getElementById('customerRate');
                
                if (marketRateInput) {
                    marketRateInput.value = marketRate.toFixed(4);
                }
                
                if (customerRateInput && !customerRateInput.value) {
                    customerRateInput.value = marketRate.toFixed(4);
                }
                
                this.calculateTransaction();
            }
        }
    }

    calculateTransaction() {
        const amount = parseFloat(document.getElementById('amount')?.value) || 0;
        const customerRate = parseFloat(document.getElementById('customerRate')?.value) || 0;
        const marketRate = parseFloat(document.getElementById('marketRate')?.value) || 0;
        const fromCurrency = document.getElementById('fromCurrency')?.value;
        const toCurrency = document.getElementById('toCurrency')?.value;

        if (amount <= 0 || customerRate <= 0 || !fromCurrency || !toCurrency) {
            this.clearCalculations();
            return;
        }

        // محاسبه مبلغ تبدیل شده
        const convertedAmount = amount * customerRate;
        
        // محاسبه سود/ضرر
        const marketConvertedAmount = amount * marketRate;
        const profitLoss = convertedAmount - marketConvertedAmount;
        
        // محاسبه کمیسیون همکار (2% از مبلغ)
        const partnerCommission = convertedAmount * 0.02;
        
        // سود خالص
        const netProfit = profitLoss - partnerCommission;

        // نمایش نتایج
        this.updateCalculationDisplay({
            convertedAmount,
            profitLoss,
            partnerCommission,
            netProfit,
            fromCurrency,
            toCurrency
        });
    }

    updateCalculationDisplay(calculations) {
        const elements = {
            convertedAmount: document.getElementById('convertedAmount'),
            profitLoss: document.getElementById('profitLoss'),
            partnerCommission: document.getElementById('partnerCommission'),
            netProfit: document.getElementById('netProfit')
        };

        if (elements.convertedAmount) {
            elements.convertedAmount.textContent = 
                `${this.formatNumber(calculations.convertedAmount)} ${calculations.toCurrency}`;
        }

        if (elements.profitLoss) {
            elements.profitLoss.textContent = this.formatNumber(calculations.profitLoss);
            elements.profitLoss.className = `font-medium persian-num ${
                calculations.profitLoss >= 0 ? 'profit-positive' : 'profit-negative'
            }`;
        }

        if (elements.partnerCommission) {
            elements.partnerCommission.textContent = this.formatNumber(calculations.partnerCommission);
        }

        if (elements.netProfit) {
            elements.netProfit.textContent = this.formatNumber(calculations.netProfit);
            elements.netProfit.className = `font-medium persian-num ${
                calculations.netProfit >= 0 ? 'profit-positive' : 'profit-negative'
            }`;
        }
    }

    clearCalculations() {
        const elements = ['convertedAmount', 'profitLoss', 'partnerCommission', 'netProfit'];
        elements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = '0';
                element.className = 'font-medium persian-num';
            }
        });
    }

    async handleNewTransaction(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = document.getElementById('saveTransaction');
        const submitBtnText = document.getElementById('saveButtonText');
        const originalText = submitBtnText.innerHTML;
        
        // Disable form and show loading
        submitBtn.disabled = true;
        submitBtnText.innerHTML = '<div class="spinner"></div>در حال ذخیره...';

        try {
            // Collect form data
            const formData = new FormData(form);
            const transactionData = {
                customerName: formData.get('customerName') || document.getElementById('customerName').value,
                customerPhone: formData.get('customerPhone') || document.getElementById('customerPhone').value,
                transactionType: document.getElementById('transactionType').value,
                fromCurrency: document.getElementById('fromCurrency').value,
                toCurrency: document.getElementById('toCurrency').value,
                amount: parseFloat(document.getElementById('amount').value),
                customerRate: parseFloat(document.getElementById('customerRate').value),
                marketRate: parseFloat(document.getElementById('marketRate').value),
                notes: document.getElementById('notes').value
            };

            // Validate required fields
            if (!this.validateTransactionData(transactionData)) {
                throw new Error('لطفاً تمام فیلدهای ضروری را پر کنید');
            }

            // Calculate final values
            const calculations = this.calculateFinalValues(transactionData);
            transactionData.calculations = calculations;

            // Simulate API call
            await this.delay(2000);
            
            // Add to transactions list
            const newTransaction = {
                id: this.generateTransactionId(),
                ...transactionData,
                status: 'completed',
                createdAt: new Date().toISOString(),
                createdBy: window.authSystem.currentUser.name
            };

            this.transactions.unshift(newTransaction);
            
            // Update UI
            this.renderTransactions();
            this.updateStatistics();
            this.updateCharts();
            
            // Show success message
            this.showToast('تراکنش با موفقیت ثبت شد!', 'success');
            
            // Close modal
            this.closeModal();
            
        } catch (error) {
            console.error('Transaction creation error:', error);
            this.showToast(error.message || 'خطا در ثبت تراکنش', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtnText.innerHTML = originalText;
        }
    }

    validateTransactionData(data) {
        const required = ['customerName', 'transactionType', 'fromCurrency', 'toCurrency', 'amount', 'customerRate'];
        return required.every(field => data[field] && data[field] !== '');
    }

    calculateFinalValues(data) {
        const convertedAmount = data.amount * data.customerRate;
        const marketConvertedAmount = data.amount * data.marketRate;
        const profitLoss = convertedAmount - marketConvertedAmount;
        const partnerCommission = convertedAmount * 0.02;
        const netProfit = profitLoss - partnerCommission;

        return {
            convertedAmount,
            profitLoss,
            partnerCommission,
            netProfit
        };
    }

    generateTransactionId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `TXN${timestamp}${random}`;
    }

    loadTransactions() {
        // Mock data for demonstration
        this.transactions = [
            {
                id: 'TXN172850123456',
                customerName: 'احمد رضایی',
                customerPhone: '+971501234567',
                transactionType: 'buy',
                fromCurrency: 'AED',
                toCurrency: 'USD',
                amount: 5000,
                customerRate: 3.6700,
                marketRate: 3.6725,
                calculations: {
                    convertedAmount: 18350,
                    profitLoss: -12.5,
                    partnerCommission: 367,
                    netProfit: -379.5
                },
                status: 'completed',
                createdAt: '2024-02-16T10:30:00Z',
                createdBy: 'علی احمدی',
                notes: 'مشتری VIP'
            },
            {
                id: 'TXN172850123457',
                customerName: 'فاطمه محمدی',
                customerPhone: '+971502345678',
                transactionType: 'sell',
                fromCurrency: 'USD',
                toCurrency: 'AED',
                amount: 2000,
                customerRate: 3.6650,
                marketRate: 3.6725,
                calculations: {
                    convertedAmount: 7330,
                    profitLoss: 15,
                    partnerCommission: 146.6,
                    netProfit: -131.6
                },
                status: 'completed',
                createdAt: '2024-02-16T09:15:00Z',
                createdBy: 'علی احمدی'
            },
            {
                id: 'TXN172850123458',
                customerName: 'محمد علی‌زاده',
                customerPhone: '+971503456789',
                transactionType: 'exchange',
                fromCurrency: 'EUR',
                toCurrency: 'AED',
                amount: 1500,
                customerRate: 3.9600,
                marketRate: 3.9650,
                calculations: {
                    convertedAmount: 5940,
                    profitLoss: -7.5,
                    partnerCommission: 118.8,
                    netProfit: -126.3
                },
                status: 'pending',
                createdAt: '2024-02-16T08:45:00Z',
                createdBy: 'سارا احمدی'
            }
        ];

        this.totalRecords = this.transactions.length;
        this.renderTransactions();
    }

    renderTransactions() {
        const tbody = document.getElementById('transactionsTable');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedTransactions = this.transactions.slice(startIndex, endIndex);

        tbody.innerHTML = paginatedTransactions.map(transaction => `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                    <div class="font-medium text-blue-600">${transaction.id}</div>
                    <div class="text-sm text-gray-500">توسط ${transaction.createdBy}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="font-medium text-gray-900">${transaction.customerName}</div>
                    <div class="text-sm text-gray-500">${transaction.customerPhone || '-'}</div>
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs rounded-full font-semibold ${this.getTransactionTypeClass(transaction.transactionType)}">
                        ${this.getTransactionTypeText(transaction.transactionType)}
                    </span>
                    <div class="text-sm text-gray-500 mt-1">${transaction.fromCurrency} → ${transaction.toCurrency}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="font-medium persian-num">${this.formatNumber(transaction.amount)} ${transaction.fromCurrency}</div>
                    <div class="text-sm text-gray-500 persian-num">${this.formatNumber(transaction.calculations.convertedAmount)} ${transaction.toCurrency}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="font-medium persian-num">${transaction.customerRate}</div>
                    <div class="text-sm text-gray-500 persian-num">بازار: ${transaction.marketRate}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="font-medium persian-num ${transaction.calculations.netProfit >= 0 ? 'profit-positive' : 'profit-negative'}">
                        ${this.formatNumber(transaction.calculations.netProfit)}
                    </div>
                    <div class="text-sm text-gray-500 persian-num">کمیسیون: ${this.formatNumber(transaction.calculations.partnerCommission)}</div>
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs rounded-full font-semibold status-${transaction.status}">
                        ${this.getStatusText(transaction.status)}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm">${this.formatDate(transaction.createdAt)}</div>
                    <div class="text-xs text-gray-500">${this.formatTime(transaction.createdAt)}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="flex space-x-2 space-x-reverse">
                        <button onclick="transactionManager.viewTransaction('${transaction.id}')" 
                                class="text-blue-600 hover:text-blue-800" title="مشاهده">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="transactionManager.editTransaction('${transaction.id}')" 
                                class="text-green-600 hover:text-green-800" title="ویرایش">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="transactionManager.deleteTransaction('${transaction.id}')" 
                                class="text-red-600 hover:text-red-800" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.updatePagination();
        this.updateRecordCount();
    }

    updateStatistics() {
        const today = new Date().toDateString();
        const todayTransactions = this.transactions.filter(t => 
            new Date(t.createdAt).toDateString() === today
        );

        const todayCount = todayTransactions.length;
        const todayVolume = todayTransactions.reduce((sum, t) => sum + t.amount, 0);
        const todayProfit = todayTransactions.reduce((sum, t) => sum + t.calculations.netProfit, 0);
        const pendingCount = this.transactions.filter(t => t.status === 'pending').length;

        // Update DOM
        this.updateElement('todayTransactions', todayCount.toString());
        this.updateElement('todayVolume', this.formatCurrency(todayVolume));
        this.updateElement('todayProfit', this.formatCurrency(todayProfit));
        this.updateElement('pendingTransactions', pendingCount.toString());
    }

    setupCharts() {
        this.setupWeeklyChart();
        this.setupCurrencyChart();
    }

    setupWeeklyChart() {
        const ctx = document.getElementById('weeklyChart');
        if (!ctx) return;

        const weekData = this.getWeeklyData();
        
        this.charts.weekly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
                datasets: [{
                    label: 'تعداد تراکنش',
                    data: weekData.transactions,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'حجم معاملات (هزار درهم)',
                    data: weekData.volume,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
                        beginAtZero: true
                    }
                }
            }
        });
    }

    setupCurrencyChart() {
        const ctx = document.getElementById('currencyChart');
        if (!ctx) return;

        const currencyData = this.getCurrencyDistribution();
        
        this.charts.currency = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: currencyData.labels,
                datasets: [{
                    data: currencyData.values,
                    backgroundColor: [
                        '#3B82F6',
                        '#10B981',
                        '#F59E0B',
                        '#EF4444',
                        '#8B5CF6'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    getWeeklyData() {
        // Mock weekly data
        return {
            transactions: [25, 32, 28, 45, 38, 42, 35],
            volume: [850, 1200, 980, 1500, 1300, 1450, 1100]
        };
    }

    getCurrencyDistribution() {
        const distribution = {};
        this.transactions.forEach(t => {
            distribution[t.fromCurrency] = (distribution[t.fromCurrency] || 0) + 1;
        });

        return {
            labels: Object.keys(distribution),
            values: Object.values(distribution)
        };
    }

    updateCharts() {
        if (this.charts.weekly) {
            const weekData = this.getWeeklyData();
            this.charts.weekly.data.datasets[0].data = weekData.transactions;
            this.charts.weekly.data.datasets[1].data = weekData.volume;
            this.charts.weekly.update();
        }

        if (this.charts.currency) {
            const currencyData = this.getCurrencyDistribution();
            this.charts.currency.data.labels = currencyData.labels;
            this.charts.currency.data.datasets[0].data = currencyData.values;
            this.charts.currency.update();
        }
    }

    // Utility Functions
    formatNumber(number) {
        return new Intl.NumberFormat('fa-IR').format(number);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('fa-IR').format(amount) + ' درهم';
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('fa-IR');
    }

    formatTime(dateString) {
        return new Date(dateString).toLocaleTimeString('fa-IR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    getTransactionTypeClass(type) {
        const classes = {
            buy: 'bg-green-100 text-green-800',
            sell: 'bg-red-100 text-red-800',
            exchange: 'bg-blue-100 text-blue-800'
        };
        return classes[type] || 'bg-gray-100 text-gray-800';
    }

    getTransactionTypeText(type) {
        const texts = {
            buy: 'خرید',
            sell: 'فروش',
            exchange: 'تبدیل'
        };
        return texts[type] || type;
    }

    getStatusText(status) {
        const texts = {
            pending: 'در انتظار',
            completed: 'تکمیل شده',
            failed: 'ناموفق'
        };
        return texts[status] || status;
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = document.getElementById('toastIcon');
        
        if (!toast || !toastMessage || !toastIcon) return;

        // Set message
        toastMessage.textContent = message;
        
        // Set icon and color based on type
        const configs = {
            success: { icon: 'fas fa-check-circle', color: 'border-green-500', bgColor: 'bg-green-50' },
            error: { icon: 'fas fa-exclamation-circle', color: 'border-red-500', bgColor: 'bg-red-50' },
            info: { icon: 'fas fa-info-circle', color: 'border-blue-500', bgColor: 'bg-blue-50' }
        };
        
        const config = configs[type] || configs.info;
        toastIcon.innerHTML = `<i class="${config.icon} text-${type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue'}-600"></i>`;
        toast.className = `fixed top-4 left-4 transform transition-transform duration-300 z-50 ${config.bgColor} ${config.color}`;
        
        // Show toast
        toast.style.transform = 'translateX(0)';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(-100%)';
        }, 5000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    startRealTimeUpdates() {
        // Update rates every 30 seconds
        setInterval(() => {
            this.updateLiveRates();
        }, 30000);
    }

    updateLiveRates() {
        // Simulate rate updates
        Object.keys(this.currentRates).forEach(key => {
            const baseRate = this.currentRates[key];
            const variation = (Math.random() - 0.5) * 0.01; // ±0.5% variation
            this.currentRates[key] = baseRate * (1 + variation);
        });
    }

    // Additional methods for pagination, search, etc.
    handleSearch(query) {
        // Implementation for search functionality
        console.log('Searching for:', query);
    }

    applyFilters() {
        // Implementation for filtering
        console.log('Applying filters...');
    }

    exportToExcel() {
        // Implementation for Excel export
        console.log('Exporting to Excel...');
        this.showToast('خروجی Excel در حال آماده‌سازی...', 'info');
    }

    refreshData() {
        this.loadTransactions();
        this.updateStatistics();
        this.updateCharts();
        this.showToast('اطلاعات بروزرسانی شد', 'success');
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderTransactions();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.totalRecords / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderTransactions();
        }
    }

    updatePagination() {
        const totalPages = Math.ceil(this.totalRecords / this.itemsPerPage);
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages;
    }

    updateRecordCount() {
        const totalRecordsEl = document.getElementById('totalRecords');
        const showingFromEl = document.getElementById('showingFrom');
        const showingToEl = document.getElementById('showingTo');
        const totalResultsEl = document.getElementById('totalResults');
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.totalRecords);
        
        if (totalRecordsEl) totalRecordsEl.textContent = `${this.totalRecords} رکورد`;
        if (showingFromEl) showingFromEl.textContent = startIndex.toString();
        if (showingToEl) showingToEl.textContent = endIndex.toString();
        if (totalResultsEl) totalResultsEl.textContent = this.totalRecords.toString();
    }
}

// Initialize Transaction Manager
let transactionManager;
document.addEventListener('DOMContentLoaded', function() {
    transactionManager = new TransactionManager();
});

// Export for global access
window.transactionManager = transactionManager;