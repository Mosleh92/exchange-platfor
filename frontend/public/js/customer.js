

// Customer Portal Application
class CustomerPortal {
    constructor() {
        this.customerId = this.getCustomerFromUrl();
        this.currentSection = 'balance';
        this.init();
    }

    getCustomerFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('customer') || 'CUST001';
    }

    async init() {
        console.log(`👤 Loading customer portal for: ${this.customerId}`);
        this.loadCustomerData();
        this.setupNavigation();
        this.setupForms();
        this.showSection('balance');
    }

    loadCustomerData() {
        // Mock customer data
        this.customerData = {
            'CUST001': {
                name: 'احمد محمدی',
                id: 'CUST001',
                phone: '+971501234567',
                balance: {
                    USD: { available: 5000, frozen: 0 },
                    AED: { available: 18000, frozen: 500 },
                    EUR: { available: 2300, frozen: 0 },
                    IRR: { available: 0, frozen: 0 }
                },
                lastLogin: '۱۴۰۳/۱۱/۲۶ - ۱۰:۳۰'
            }
        };

        const customer = this.customerData[this.customerId];
        if (customer) {
            document.getElementById('customerName').textContent = customer.name;
            this.updateBalanceDisplay();
        }
    }

    setupNavigation() {
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                this.showSection(action);
                
                // Update active state
                actionButtons.forEach(b => b.classList.remove('ring-2', 'ring-blue-500'));
                btn.classList.add('ring-2', 'ring-blue-500');
            });
        });
    }

    setupForms() {
        // Transfer form
        const transferForm = document.getElementById('transferForm');
        if (transferForm) {
            transferForm.addEventListener('submit', (e) => this.handleTransfer(e));
        }

        // Exchange form
        const exchangeForm = document.getElementById('exchangeForm');
        if (exchangeForm) {
            exchangeForm.addEventListener('submit', (e) => this.handleExchange(e));
        }
    }

    showSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.section-content');
        sections.forEach(section => section.classList.remove('active'));

        // Show selected section
        const targetSection = document.getElementById(sectionName + 'Section');
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }
    }

    updateBalanceDisplay() {
        const customer = this.customerData[this.customerId];
        if (!customer) return;

        const usdEl = document.getElementById('usdBalance');
        const aedEl = document.getElementById('aedBalance');
        const eurEl = document.getElementById('eurBalance');
        const irrEl = document.getElementById('irrBalance');

        if (usdEl) usdEl.textContent = `$${this.formatNumber(customer.balance.USD.available)}`;
        if (aedEl) aedEl.textContent = `AED ${this.formatNumber(customer.balance.AED.available)}`;
        if (eurEl) eurEl.textContent = `€${this.formatNumber(customer.balance.EUR.available)}`;
        if (irrEl) irrEl.textContent = `${this.formatPersianNumber(customer.balance.IRR.available)} ریال`;
    }

    async handleTransfer(e) {
        e.preventDefault();
        
        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        // Show loading
        btn.innerHTML = '<div class="spinner"></div>در حال پردازش...';
        btn.disabled = true;

        try {
            // Simulate API call
            await this.delay(3000);

            // Show success message
            this.showMessage('✅ حواله شما با موفقیت ثبت شد! کد پیگیری: TR' + Date.now(), 'success');
            
            // Reset form
            form.reset();
            
            // Show in history
            this.addToHistory('حواله پول', '$500 → تهران', 'در حال پردازش');

        } catch (error) {
            this.showMessage('❌ خطا در ثبت حواله. لطفاً دوباره تلاش کنید.', 'error');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    async handleExchange(e) {
        e.preventDefault();
        
        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        // Show loading
        btn.innerHTML = '<div class="spinner"></div>در حال تبدیل...';
        btn.disabled = true;

        try {
            // Simulate API call
            await this.delay(2000);

            // Show success message
            this.showMessage('✅ تبدیل ارز با موفقیت انجام شد!', 'success');
            
            // Reset form
            form.reset();
            
            // Update balance (mock)
            this.updateBalanceAfterExchange();
            
            // Show in history
            this.addToHistory('تبدیل ارز', '$1,000 → AED 3,680', 'تکمیل شده');

        } catch (error) {
            this.showMessage('❌ خطا در تبدیل ارز. لطفاً دوباره تلاش کنید.', 'error');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    updateBalanceAfterExchange() {
        // Mock balance update
        const customer = this.customerData[this.customerId];
        if (customer) {
            customer.balance.USD.available -= 1000;
            customer.balance.AED.available += 3680;
            this.updateBalanceDisplay();
        }
    }

    addToHistory(type, amount, status) {
        const tbody = document.getElementById('historyTable');
        if (!tbody) return;

        const today = new Date();
        const persianDate = this.toPersianDate(today);
        
        const newRow = document.createElement('tr');
        newRow.className = 'hover:bg-gray-50 fade-in';
        newRow.innerHTML = `
            <td class="px-6 py-4">${persianDate}</td>
            <td class="px-6 py-4">${type}</td>
            <td class="px-6 py-4 font-medium">${amount}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs rounded-full ${this.getStatusColor(status)}">
                    ${status}
                </span>
            </td>
            <td class="px-6 py-4">
                <button class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-eye"></i> مشاهده
                </button>
            </td>
        `;
        
        tbody.insertBefore(newRow, tbody.firstChild);
    }

    formatNumber(num) {
        return new Intl.NumberFormat('en-US').format(num);
    }

    formatPersianNumber(num) {
        return new Intl.NumberFormat('fa-IR').format(num);
    }

    toPersianDate(date) {
        return new Intl.DateTimeFormat('fa-IR').format(date);
    }

    getStatusColor(status) {
        const colors = {
            'تکمیل شده': 'bg-green-100 text-green-800',
            'در حال پردازش': 'bg-blue-100 text-blue-800',
            'لغو شده': 'bg-red-100 text-red-800',
            'در انتظار': 'bg-yellow-100 text-yellow-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    showMessage(text, type) {
        const notification = document.createElement('div');
        notification.className = `${type}-message fixed top-4 right-4 z-50 fade-in max-w-md`;
        notification.innerHTML = `
            <div class="flex justify-between items-start">
                <div>${text}</div>
                <button onclick="this.parentElement.parentElement.remove()" class="mr-4 text-white">
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
let customerPortal;
document.addEventListener('DOMContentLoaded', () => {
    customerPortal = new CustomerPortal();
});
CUSTOMER_FIXED_END