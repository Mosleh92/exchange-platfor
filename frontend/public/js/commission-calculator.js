// Commission Calculator for Partners
class CommissionCalculator {
    constructor() {
        this.commissionRules = {};
        this.partnerTiers = {};
        this.monthlyStats = {};
        this.init();
    }

    init() {
        console.log('💰 Commission Calculator initializing...');
        this.loadCommissionRules();
        this.loadPartnerTiers();
        this.setupEventListeners();
        this.calculateCurrentCommissions();
    }

    loadCommissionRules() {
        // قوانین محاسبه کمیسیون بر اساس حجم معاملات
        this.commissionRules = {
            // کمیسیون بر اساس حجم ماهانه (درهم)
            volume: [
                { min: 0, max: 50000, rate: 0.2 },       // تا ۵۰ هزار: ۰.۲٪
                { min: 50000, max: 100000, rate: 0.3 },   // ۵۰-۱۰۰ هزار: ۰.۳٪
                { min: 100000, max: 250000, rate: 0.5 },  // ۱۰۰-۲۵۰ هزار: ۰.۵٪
                { min: 250000, max: 500000, rate: 0.7 },  // ۲۵۰-۵۰۰ هزار: ۰.۷٪
                { min: 500000, max: Infinity, rate: 1.0 } // بالای ۵۰۰ هزار: ۱٪
            ],
            
            // کمیسیون بر اساس تعداد تراکنش
            transactions: [
                { min: 0, max: 50, rate: 0.1 },      // تا ۵۰ تراکنش: ۰.۱٪
                { min: 50, max: 100, rate: 0.15 },   // ۵۰-۱۰۰: ۰.۱۵٪
                { min: 100, max: 200, rate: 0.2 },   // ۱۰۰-۲۰۰: ۰.۲٪
                { min: 200, max: Infinity, rate: 0.25 } // بالای ۲۰۰: ۰.۲۵٪
            ],

            // کمیسیون ویژه برای ارزهای خاص
            currencies: {
                'IRR': 0.1,  // تومان: ۰.۱٪ اضافی
                'USD': 0.05, // دلار: ۰.۰۵٪ اضافی
                'EUR': 0.05, // یورو: ۰.۰۵٪ اضافی
                'AED': 0.02  // درهم: ۰.۰۲٪ اضافی
            }
        };
    }

    loadPartnerTiers() {
        // سطح‌بندی همکاران
        this.partnerTiers = {
            'bronze': {
                name: 'برنزی',
                minVolume: 0,
                maxVolume: 100000,
                bonusRate: 0,
                benefits: ['دسترسی به ماشین حساب', 'گزارش روزانه']
            },
            'silver': {
                name: 'نقره‌ای',
                minVolume: 100000,
                maxVolume: 300000,
                bonusRate: 0.1,
                benefits: ['همه مزایای برنزی', 'کمیسیون ۰.۱٪ اضافی', 'گزارش هفتگی']
            },
            'gold': {
                name: 'طلایی',
                minVolume: 300000,
                maxVolume: 700000,
                bonusRate: 0.2,
                benefits: ['همه مزایای نقره‌ای', 'کمیسیون ۰.۲٪ اضافی', 'پشتیبانی اولویت‌دار']
            },
            'platinum': {
                name: 'پلاتینی',
                minVolume: 700000,
                maxVolume: Infinity,
                bonusRate: 0.3,
                benefits: ['همه مزایای طلایی', 'کمیسیون ۰.۳٪ اضافی', 'مدیر حساب اختصاصی']
            }
        };
    }

    setupEventListeners() {
        // محاسبه کمیسیون برای تراکنش جدید
        const calculateButton = document.getElementById('calculateCommission');
        if (calculateButton) {
            calculateButton.addEventListener('click', () => this.calculateTransactionCommission());
        }

        // فیلدهای ورودی
        const inputs = ['transactionAmount', 'transactionCurrency', 'transactionType'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => this.updateCommissionPreview());
            }
        });

        // گزارش کمیسیون ماهانه
        const monthlyReportButton = document.getElementById('generateMonthlyReport');
        if (monthlyReportButton) {
            monthlyReportButton.addEventListener('click', () => this.generateMonthlyReport());
        }
    }

    calculateTransactionCommission() {
        const amount = parseFloat(document.getElementById('transactionAmount')?.value) || 0;
        const currency = document.getElementById('transactionCurrency')?.value || 'AED';
        const type = document.getElementById('transactionType')?.value || 'exchange';

        if (amount <= 0) {
            this.showError('لطفاً مبلغ معامله را وارد کنید');
            return;
        }

        const commission = this.calculateCommission(amount, currency, type);
        this.displayCommissionResult(amount, currency, commission);
    }

    calculateCommission(amount, currency, type, partnerData = null) {
        let baseCommission = 0;
        let volumeBonus = 0;
        let transactionBonus = 0;
        let currencyBonus = 0;
        let tierBonus = 0;

        // دریافت اطلاعات همکار
        const partner = partnerData || this.getCurrentPartnerData();
        
        // محاسبه کمیسیون پایه بر اساس حجم ماهانه
        const monthlyVolume = partner?.monthlyVolume || 0;
        const volumeRule = this.commissionRules.volume.find(rule => 
            monthlyVolume >= rule.min && monthlyVolume < rule.max
        );
        if (volumeRule) {
            baseCommission = amount * (volumeRule.rate / 100);
        }

        // محاسبه بونوس بر اساس تعداد تراکنش
        const monthlyTransactions = partner?.monthlyTransactions || 0;
        const transactionRule = this.commissionRules.transactions.find(rule => 
            monthlyTransactions >= rule.min && monthlyTransactions < rule.max
        );
        if (transactionRule) {
            transactionBonus = amount * (transactionRule.rate / 100);
        }

        // محاسبه بونوس ارز
        const currencyRate = this.commissionRules.currencies[currency] || 0;
        currencyBonus = amount * (currencyRate / 100);

        // محاسبه بونوس سطح همکار
        const tier = this.getPartnerTier(monthlyVolume);
        if (tier) {
            tierBonus = amount * (tier.bonusRate / 100);
        }

        const totalCommission = baseCommission + volumeBonus + transactionBonus + currencyBonus + tierBonus;

        return {
            total: totalCommission,
            breakdown: {
                base: baseCommission,
                volume: volumeBonus,
                transactions: transactionBonus,
                currency: currencyBonus,
                tier: tierBonus
            },
            rate: (totalCommission / amount) * 100,
            tier: tier?.name || 'نامشخص'
        };
    }

    displayCommissionResult(amount, currency, commission) {
        const resultContainer = document.getElementById('commissionResult');
        if (!resultContainer) return;

        resultContainer.innerHTML = `
            <div class="bg-white rounded-lg p-6 shadow-lg border-2 border-green-200">
                <h3 class="text-lg font-bold mb-4 text-center text-green-700">
                    <i class="fas fa-coins ml-2"></i>محاسبه کمیسیون
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- اطلاعات معامله -->
                    <div class="space-y-3">
                        <h4 class="font-medium text-gray-700 border-b pb-2">اطلاعات معامله</h4>
                        <div class="bg-blue-50 p-3 rounded">
                            <div class="text-sm text-blue-600">مبلغ معامله</div>
                            <div class="font-bold text-blue-800">${this.formatCurrency(amount, currency)}</div>
                        </div>
                        <div class="bg-purple-50 p-3 rounded">
                            <div class="text-sm text-purple-600">نرخ کمیسیون</div>
                            <div class="font-bold text-purple-800">%${commission.rate.toFixed(3)}</div>
                        </div>
                        <div class="bg-yellow-50 p-3 rounded">
                            <div class="text-sm text-yellow-600">سطح همکار</div>
                            <div class="font-bold text-yellow-800">${commission.tier}</div>
                        </div>
                    </div>
                    
                    <!-- تفکیک کمیسیون -->
                    <div class="space-y-3">
                        <h4 class="font-medium text-gray-700 border-b pb-2">تفکیک کمیسیون</h4>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-600">کمیسیون پایه:</span>
                                <span class="font-medium">${this.formatCurrency(commission.breakdown.base, currency)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-600">بونوس تراکنش:</span>
                                <span class="font-medium">${this.formatCurrency(commission.breakdown.transactions, currency)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-600">بونوس ارز:</span>
                                <span class="font-medium">${this.formatCurrency(commission.breakdown.currency, currency)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-600">بونوس سطح:</span>
                                <span class="font-medium">${this.formatCurrency(commission.breakdown.tier, currency)}</span>
                            </div>
                            <hr class="my-2">
                            <div class="flex justify-between text-lg font-bold">
                                <span class="text-green-700">کل کمیسیون:</span>
                                <span class="text-green-800">${this.formatCurrency(commission.total, currency)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- دکمه‌های عمل -->
                <div class="flex justify-center gap-3 mt-6 pt-4 border-t border-gray-200">
                    <button onclick="commissionCalculator.saveCommissionRecord()" 
                            class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                        <i class="fas fa-save ml-2"></i>ذخیره رکورد
                    </button>
                    <button onclick="commissionCalculator.printCommission()" 
                            class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
                        <i class="fas fa-print ml-2"></i>چاپ
                    </button>
                </div>
            </div>
        `;
    }

    updateCommissionPreview() {
        const amount = parseFloat(document.getElementById('transactionAmount')?.value) || 0;
        const currency = document.getElementById('transactionCurrency')?.value || 'AED';
        const type = document.getElementById('transactionType')?.value || 'exchange';

        if (amount > 0) {
            const commission = this.calculateCommission(amount, currency, type);
            
            const previewElement = document.getElementById('commissionPreview');
            if (previewElement) {
                previewElement.innerHTML = `
                    <div class="text-center p-3 bg-green-50 rounded border">
                        <div class="text-sm text-green-600">کمیسیون تخمینی</div>
                        <div class="text-lg font-bold text-green-800">${this.formatCurrency(commission.total, currency)}</div>
                        <div class="text-xs text-green-600">(%${commission.rate.toFixed(3)})</div>
                    </div>
                `;
            }
        }
    }

    getCurrentPartnerData() {
        // دریافت اطلاعات همکار فعلی
        if (window.partnerAuth && window.partnerAuth.isLoggedIn()) {
            const partner = window.partnerAuth.getPartner();
            return {
                id: partner.id,
                monthlyVolume: 150000, // مثال - باید از API بیاید
                monthlyTransactions: 85,
                tier: this.getPartnerTier(150000)
            };
        }
        
        // داده‌های پیش‌فرض برای تست
        return {
            id: 'PART001',
            monthlyVolume: 150000,
            monthlyTransactions: 85,
            tier: this.getPartnerTier(150000)
        };
    }

    getPartnerTier(monthlyVolume) {
        for (const [key, tier] of Object.entries(this.partnerTiers)) {
            if (monthlyVolume >= tier.minVolume && monthlyVolume < tier.maxVolume) {
                return { ...tier, key };
            }
        }
        return this.partnerTiers.bronze;
    }

    calculateCurrentCommissions() {
        const partner = this.getCurrentPartnerData();
        
        // محاسبه کمیسیون ماهانه
        const monthlyCommission = this.calculateMonthlyCommission(partner);
        
        // نمایش در dashboard
        this.updateCommissionDisplay(monthlyCommission);
    }

    calculateMonthlyCommission(partnerData) {
        // شبیه‌سازی تراکنش‌های ماهانه
        const mockTransactions = [
            { amount: 5000, currency: 'USD', type: 'exchange' },
            { amount: 15000, currency: 'AED', type: 'transfer' },
            { amount: 3500, currency: 'EUR', type: 'exchange' },
            { amount: 25000, currency: 'IRR', type: 'exchange' },
            { amount: 8000, currency: 'USD', type: 'transfer' }
        ];

        let totalCommission = 0;
        const commissionDetails = [];

        mockTransactions.forEach(transaction => {
            const commission = this.calculateCommission(
                transaction.amount, 
                transaction.currency, 
                transaction.type, 
                partnerData
            );
            
            totalCommission += commission.total;
            commissionDetails.push({
                ...transaction,
                commission: commission.total,
                rate: commission.rate
            });
        });

        return {
            total: totalCommission,
            transactions: commissionDetails,
            averageRate: commissionDetails.length > 0 ? 
                commissionDetails.reduce((sum, t) => sum + t.rate, 0) / commissionDetails.length : 0
        };
    }

    updateCommissionDisplay(monthlyData) {
        // بروزرسانی آمار کمیسیون در dashboard
        const elements = {
            'monthlyCommission': this.formatCurrency(monthlyData.total, 'AED'),
            'averageCommissionRate': `%${monthlyData.averageRate.toFixed(2)}`,
            'totalTransactions': monthlyData.transactions.length.toString()
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    generateMonthlyReport() {
        const partner = this.getCurrentPartnerData();
        const monthlyData = this.calculateMonthlyCommission(partner);
        
        const reportHtml = `
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-bold text-gray-800">گزارش کمیسیون ماهانه</h2>
                    <p class="text-gray-600">همکار: ${partner.id} | ${new Date().toLocaleDateString('fa-IR')}</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-green-50 p-4 rounded border-l-4 border-green-400">
                        <div class="text-sm text-green-600">کل کمیسیون</div>
                        <div class="text-xl font-bold text-green-800">${this.formatCurrency(monthlyData.total, 'AED')}</div>
                    </div>
                    <div class="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
                        <div class="text-sm text-blue-600">تعداد تراکنش</div>
                        <div class="text-xl font-bold text-blue-800">${monthlyData.transactions.length}</div>
                    </div>
                    <div class="bg-purple-50 p-4 rounded border-l-4 border-purple-400">
                        <div class="text-sm text-purple-600">نرخ متوسط</div>
                        <div class="text-xl font-bold text-purple-800">%${monthlyData.averageRate.toFixed(2)}</div>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full border-collapse border border-gray-300">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="border border-gray-300 px-4 py-2 text-right">مبلغ</th>
                                <th class="border border-gray-300 px-4 py-2 text-right">ارز</th>
                                <th class="border border-gray-300 px-4 py-2 text-right">نوع</th>
                                <th class="border border-gray-300 px-4 py-2 text-right">نرخ کمیسیون</th>
                                <th class="border border-gray-300 px-4 py-2 text-right">کمیسیون</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${monthlyData.transactions.map(t => `
                                <tr>
                                    <td class="border border-gray-300 px-4 py-2">${this.formatCurrency(t.amount, t.currency)}</td>
                                    <td class="border border-gray-300 px-4 py-2">${t.currency}</td>
                                    <td class="border border-gray-300 px-4 py-2">${this.getTypeText(t.type)}</td>
                                    <td class="border border-gray-300 px-4 py-2">%${t.rate.toFixed(3)}</td>
                                    <td class="border border-gray-300 px-4 py-2 font-bold">${this.formatCurrency(t.commission, t.currency)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // نمایش گزارش در modal جدید
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center p-4 border-b">
                    <h3 class="text-lg font-bold">گزارش کمیسیون ماهانه</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="p-4">${reportHtml}</div>
                <div class="flex justify-center gap-3 p-4 border-t">
                    <button onclick="commissionCalculator.printReport()" class="bg-blue-500 text-white px-6 py-2 rounded-lg">
                        <i class="fas fa-print ml-2"></i>چاپ گزارش
                    </button>
                    <button onclick="commissionCalculator.exportReport()" class="bg-green-500 text-white px-6 py-2 rounded-lg">
                        <i class="fas fa-file-excel ml-2"></i>خروجی Excel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    saveCommissionRecord() {
        // ذخیره رکورد کمیسیون
        const records = JSON.parse(localStorage.getItem('commissionRecords') || '[]');
        const newRecord = {
            id: Date.now(),
            partnerId: this.getCurrentPartnerData().id,
            timestamp: new Date().toISOString(),
            amount: parseFloat(document.getElementById('transactionAmount')?.value) || 0,
            currency: document.getElementById('transactionCurrency')?.value || 'AED',
            commission: this.calculateCommission(
                parseFloat(document.getElementById('transactionAmount')?.value) || 0,
                document.getElementById('transactionCurrency')?.value || 'AED',
                document.getElementById('transactionType')?.value || 'exchange'
            )
        };

        records.unshift(newRecord);
        localStorage.setItem('commissionRecords', JSON.stringify(records.slice(0, 100))); // حداکثر ۱۰۰ رکورد

        this.showSuccess('رکورد کمیسیون ذخیره شد');
    }

    printCommission() {
        const content = document.getElementById('commissionResult').innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>محاسبه کمیسیون</title>
                    <style>
                        body { font-family: Arial, sans-serif; direction: rtl; }
                        .no-print { display: none; }
                    </style>
                </head>
                <body>
                    ${content}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    printReport() {
        window.print();
    }

    exportReport() {
        // شبیه‌سازی خروجی Excel
        this.showInfo('قابلیت خروجی Excel در نسخه کامل فعال می‌شود');
    }

    getTypeText(type) {
        const types = {
            'exchange': 'تبدیل ارز',
            'transfer': 'حواله',
            'deposit': 'واریز',
            'withdrawal': 'برداشت'
        };
        return types[type] || type;
    }

    formatCurrency(amount, currency) {
        return new Intl.NumberFormat('fa-IR').format(amount) + ' ' + currency;
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white max-w-md ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        notification.innerHTML = `
            <div class="flex justify-between items-start">
                <div>${message}</div>
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
}

// Initialize when page loads
let commissionCalculator;
document.addEventListener('DOMContentLoaded', () => {
    commissionCalculator = new CommissionCalculator();
});