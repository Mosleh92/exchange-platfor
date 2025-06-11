// Partner Calculator System - Manual Currency Exchange for Partners
class PartnerCalculator {
    constructor() {
        this.currentRates = {};
        this.partnerRates = {};
        this.calculationHistory = [];
        this.init();
    }

    async init() {
        console.log('🧮 Partner Calculator initializing...');
        this.loadCurrentRates();
        this.loadPartnerRates();
        this.setupEventListeners();
        this.updateRateDisplay();
        this.loadCalculationHistory();
    }

    loadCurrentRates() {
        // نرخ‌های فعلی بازار (نرخ مشتری)
        this.currentRates = {
            'USD_AED': 3.6725,
            'EUR_AED': 3.9650,
            'GBP_AED': 4.6240,
            'IRR_AED': 0.0000873, // تومان به درهم
            'AED_IRR': 11456, // درهم به تومان
            'SAR_AED': 0.9793,
            'KWD_AED': 12.0150,
            'QAR_AED': 1.0084,
            'INR_AED': 0.0442,
            'PKR_AED': 0.0132,
            'BDT_AED': 0.0335
        };
    }

    loadPartnerRates() {
        // نرخ‌های ویژه همکاران (بهتر از نرخ مشتری)
        this.partnerRates = {
            'USD_AED': 3.6625, // 0.01 درهم کمتر - سود همکار
            'EUR_AED': 3.9550,
            'GBP_AED': 4.6140,
            'IRR_AED': 0.0000883, // بهتر برای همکار
            'AED_IRR': 11326, // کمتر برای همکار - سود همکار
            'SAR_AED': 0.9783,
            'KWD_AED': 12.0050,
            'QAR_AED': 1.0074,
            'INR_AED': 0.0440,
            'PKR_AED': 0.0131,
            'BDT_AED': 0.0333
        };
    }

    setupEventListeners() {
        // انتخاب ارز مبدأ
        const fromCurrency = document.getElementById('fromCurrency');
        if (fromCurrency) {
            fromCurrency.addEventListener('change', () => this.updateCalculation());
        }

        // انتخاب ارز مقصد
        const toCurrency = document.getElementById('toCurrency');
        if (toCurrency) {
            toCurrency.addEventListener('change', () => this.updateCalculation());
        }

        // مبلغ ورودی
        const amountInput = document.getElementById('amountInput');
        if (amountInput) {
            amountInput.addEventListener('input', () => this.updateCalculation());
        }

        // نوع محاسبه (ضرب/تقسیم)
        const calculationType = document.getElementById('calculationType');
        if (calculationType) {
            calculationType.addEventListener('change', () => this.updateCalculation());
        }

        // دکمه تعویض ارزها
        const switchButton = document.getElementById('switchCurrencies');
        if (switchButton) {
            switchButton.addEventListener('click', () => this.switchCurrencies());
        }

        // دکمه محاسبه دستی
        const manualCalcButton = document.getElementById('manualCalculate');
        if (manualCalcButton) {
            manualCalcButton.addEventListener('click', () => this.performManualCalculation());
        }

        // دکمه پاک کردن
        const clearButton = document.getElementById('clearCalculation');
        if (clearButton) {
            clearButton.addEventListener('click', () => this.clearCalculation());
        }
    }

    updateCalculation() {
        const fromCurrency = document.getElementById('fromCurrency')?.value;
        const toCurrency = document.getElementById('toCurrency')?.value;
        const amount = parseFloat(document.getElementById('amountInput')?.value) || 0;
        const calculationType = document.getElementById('calculationType')?.value || 'multiply';

        if (!fromCurrency || !toCurrency || amount <= 0) {
            this.clearResults();
            return;
        }

        const rateKey = `${fromCurrency}_${toCurrency}`;
        const reverseRateKey = `${toCurrency}_${fromCurrency}`;
        
        let marketRate = this.currentRates[rateKey];
        let partnerRate = this.partnerRates[rateKey];

        // اگر نرخ مستقیم نداشتیم، از نرخ معکوس استفاده کنیم
        if (!marketRate && this.currentRates[reverseRateKey]) {
            marketRate = 1 / this.currentRates[reverseRateKey];
            partnerRate = 1 / this.partnerRates[reverseRateKey];
        }

        if (!marketRate || !partnerRate) {
            this.showError('نرخ برای این جفت ارز موجود نیست');
            return;
        }

        let result;
        if (calculationType === 'multiply') {
            // ضرب: مبلغ × نرخ
            result = amount * partnerRate;
        } else {
            // تقسیم: مبلغ ÷ نرخ
            result = amount / partnerRate;
        }

        this.displayResults(amount, result, fromCurrency, toCurrency, marketRate, partnerRate, calculationType);
    }

    displayResults(amount, result, fromCurrency, toCurrency, marketRate, partnerRate, operation) {
        const resultContainer = document.getElementById('calculationResult');
        if (!resultContainer) return;

        // محاسبه سود همکار
        const profitPerUnit = Math.abs(marketRate - partnerRate);
        const totalProfit = profitPerUnit * amount;

        resultContainer.innerHTML = `
            <div class="bg-white rounded-lg p-6 shadow-lg border-2 border-green-200">
                <h3 class="text-lg font-bold mb-4 text-center text-green-700">
                    <i class="fas fa-calculator ml-2"></i>نتیجه محاسبه همکار
                </h3>
                
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- نرخ‌ها -->
                    <div class="space-y-3">
                        <h4 class="font-medium text-gray-700 border-b pb-2">مقایسه نرخ‌ها</h4>
                        <div class="bg-red-50 p-3 rounded border-l-4 border-red-400">
                            <div class="text-sm text-red-600">نرخ مشتری (بازار)</div>
                            <div class="font-bold text-red-800">${this.formatRate(marketRate)}</div>
                        </div>
                        <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                            <div class="text-sm text-green-600">نرخ همکار (شما)</div>
                            <div class="font-bold text-green-800">${this.formatRate(partnerRate)}</div>
                        </div>
                        <div class="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                            <div class="text-sm text-blue-600">سود در هر واحد</div>
                            <div class="font-bold text-blue-800">${this.formatRate(profitPerUnit)}</div>
                        </div>
                    </div>
                    
                    <!-- نتیجه محاسبه -->
                    <div class="space-y-3">
                        <h4 class="font-medium text-gray-700 border-b pb-2">نتیجه تبدیل</h4>
                        <div class="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200 text-center">
                            <div class="text-lg font-bold text-gray-800 mb-2">
                                ${this.formatNumber(amount)} ${fromCurrency}
                            </div>
                            <div class="text-2xl text-yellow-600 my-2">
                                ${operation === 'multiply' ? '×' : '÷'} ${this.formatRate(partnerRate)}
                            </div>
                            <div class="text-xl font-bold text-green-600">
                                ${this.formatNumber(result)} ${toCurrency}
                            </div>
                        </div>
                        <div class="text-center text-xs text-gray-500">
                            محاسبه: ${operation === 'multiply' ? 'ضرب' : 'تقسیم'}
                        </div>
                    </div>
                    
                    <!-- سود همکار -->
                    <div class="space-y-3">
                        <h4 class="font-medium text-gray-700 border-b pb-2">سود شما</h4>
                        <div class="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-green-600 mb-2">
                                    ${this.formatNumber(totalProfit)} ${toCurrency}
                                </div>
                                <div class="text-sm text-green-700">سود کل از این معامله</div>
                            </div>
                        </div>
                        <div class="bg-blue-50 p-3 rounded">
                            <div class="text-sm text-blue-600">درصد سود</div>
                            <div class="font-bold text-blue-800">
                                %${((totalProfit / result) * 100).toFixed(2)}
                            </div>
                        </div>
                        <div class="bg-purple-50 p-3 rounded">
                            <div class="text-sm text-purple-600">نرخ بازگشت</div>
                            <div class="font-bold text-purple-800">
                                ${this.formatRate(1/partnerRate)}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- دکمه‌های عمل -->
                <div class="flex flex-wrap justify-center gap-3 mt-6 pt-4 border-t border-gray-200">
                    <button onclick="partnerCalculator.saveCalculation()" 
                            class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fas fa-save ml-2"></i>ذخیره محاسبه
                    </button>
                    <button onclick="partnerCalculator.printResult()" 
                            class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                        <i class="fas fa-print ml-2"></i>چاپ
                    </button>
                    <button onclick="partnerCalculator.createTransaction()" 
                            class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        <i class="fas fa-plus ml-2"></i>ثبت تراکنش
                    </button>
                    <button onclick="partnerCalculator.shareResult()" 
                            class="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                        <i class="fas fa-share ml-2"></i>اشتراک
                    </button>
                </div>
            </div>
        `;
    }

    performManualCalculation() {
        const manualAmount = parseFloat(document.getElementById('manualAmount')?.value);
        const manualRate = parseFloat(document.getElementById('manualRate')?.value);
        const operation = document.getElementById('manualOperation')?.value || 'multiply';

        if (!manualAmount || !manualRate) {
            this.showError('لطفاً مبلغ و نرخ را وارد کنید');
            return;
        }

        let result;
        if (operation === 'multiply') {
            result = manualAmount * manualRate;
        } else {
            result = manualAmount / manualRate;
        }

        const resultContainer = document.getElementById('manualResult');
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="text-center">
                        <h4 class="text-lg font-medium text-gray-700 mb-3">نتیجه محاسبه دستی</h4>
                        <div class="text-3xl font-bold text-green-600 mb-2">
                            ${this.formatNumber(result)}
                        </div>
                        <div class="text-sm text-gray-600">
                            ${this.formatNumber(manualAmount)} ${operation === 'multiply' ? '×' : '÷'} ${this.formatNumber(manualRate)}
                        </div>
                        <div class="mt-4">
                            <button onclick="partnerCalculator.saveManualCalculation(${manualAmount}, ${manualRate}, ${result}, '${operation}')" 
                                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">
                                <i class="fas fa-save ml-1"></i>ذخیره
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    switchCurrencies() {
        const fromCurrency = document.getElementById('fromCurrency');
        const toCurrency = document.getElementById('toCurrency');
        
        if (fromCurrency && toCurrency) {
            const temp = fromCurrency.value;
            fromCurrency.value = toCurrency.value;
            toCurrency.value = temp;
            
            this.updateCalculation();
        }
    }

    clearCalculation() {
        // پاک کردن همه فیلدها
        const inputs = ['amountInput', 'manualAmount', 'manualRate'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });

        // پاک کردن نتایج
        this.clearResults();
        
        const manualResult = document.getElementById('manualResult');
        if (manualResult) manualResult.innerHTML = '';
    }

    clearResults() {
        const resultContainer = document.getElementById('calculationResult');
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                    <i class="fas fa-calculator text-4xl mb-4"></i>
                    <p>نتیجه محاسبه اینجا نمایش داده می‌شود</p>
                </div>
            `;
        }
    }

    updateRateDisplay() {
        const ratesContainer = document.getElementById('currentRates');
        if (!ratesContainer) return;

        const majorPairs = ['USD_AED', 'EUR_AED', 'AED_IRR', 'IRR_AED', 'SAR_AED', 'INR_AED'];
        
        ratesContainer.innerHTML = majorPairs.map(pair => {
            const [from, to] = pair.split('_');
            const marketRate = this.currentRates[pair];
            const partnerRate = this.partnerRates[pair];
            const difference = marketRate - partnerRate;
            
            return `
                <div class="bg-white rounded-lg p-4 shadow border hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-medium text-lg">${from}/${to}</span>
                        <span class="text-sm px-2 py-1 rounded ${difference > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}">
                            ${difference > 0 ? '+' : ''}${this.formatRate(difference)}
                        </span>
                    </div>
                    <div class="space-y-1">
                        <div class="text-sm text-gray-600">
                            مشتری: <span class="font-medium">${this.formatRate(marketRate)}</span>
                        </div>
                        <div class="text-sm text-blue-600">
                            همکار: <span class="font-medium">${this.formatRate(partnerRate)}</span>
                        </div>
                    </div>
                    <div class="mt-2 pt-2 border-t border-gray-100">
                        <button onclick="partnerCalculator.setQuickCalculation('${from}', '${to}')" 
                                class="text-xs text-blue-600 hover:text-blue-800">
                            محاسبه سریع
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    setQuickCalculation(from, to) {
        const fromSelect = document.getElementById('fromCurrency');
        const toSelect = document.getElementById('toCurrency');
        
        if (fromSelect) fromSelect.value = from;
        if (toSelect) toSelect.value = to;
        
        this.updateCalculation();
        
        // اسکرول به بخش محاسبه
        const calculatorSection = document.getElementById('calculatorSection');
        if (calculatorSection) {
            calculatorSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    saveCalculation() {
        const fromCurrency = document.getElementById('fromCurrency')?.value;
        const toCurrency = document.getElementById('toCurrency')?.value;
        const amount = document.getElementById('amountInput')?.value;
        const resultElement = document.querySelector('#calculationResult .text-xl.font-bold.text-green-600');
        
        if (!fromCurrency || !toCurrency || !amount || !resultElement) {
            this.showError('اطلاعات کافی برای ذخیره وجود ندارد');
            return;
        }

        const calculation = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            from: fromCurrency,
            to: toCurrency,
            amount: parseFloat(amount),
            result: resultElement.textContent,
            type: 'partner_calculation',
            rates: {
                market: this.currentRates[`${fromCurrency}_${toCurrency}`],
                partner: this.partnerRates[`${fromCurrency}_${toCurrency}`]
            }
        };

        this.calculationHistory.unshift(calculation);
        this.saveCalculationHistory();
        this.showNotification('محاسبه ذخیره شد', 'success');
    }

    saveManualCalculation(amount, rate, result, operation) {
        const calculation = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            amount: amount,
            rate: rate,
            result: result,
            operation: operation,
            type: 'manual_calculation'
        };

        this.calculationHistory.unshift(calculation);
        this.saveCalculationHistory();
        this.showNotification('محاسبه دستی ذخیره شد', 'success');
    }

    loadCalculationHistory() {
        const saved = localStorage.getItem('partnerCalculationHistory');
        if (saved) {
            this.calculationHistory = JSON.parse(saved);
        }
    }

    saveCalculationHistory() {
        // نگه داشتن فقط 100 محاسبه آخر
        this.calculationHistory = this.calculationHistory.slice(0, 100);
        localStorage.setItem('partnerCalculationHistory', JSON.stringify(this.calculationHistory));
    }

    printResult() {
        const resultContent = document.getElementById('calculationResult')?.innerHTML;
        if (!resultContent) {
            this.showError('نتیجه‌ای برای چاپ وجود ندارد');
            return;
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>نتیجه محاسبه ارز - همکار</title>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: 'Tahoma', sans-serif; direction: rtl; margin: 20px; }
                        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                        .content { margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                        @media print { button { display: none; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>سیستم محاسبه ارز همکاران</h1>
                        <p>تاریخ: ${new Date().toLocaleDateString('fa-IR')}</p>
                    </div>
                    <div class="content">
                        ${resultContent}
                    </div>
                    <div class="footer">
                        <p>این محاسبه توسط سیستم همکاران صرافی تولید شده است</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    createTransaction() {
        this.showNotification('قابلیت ثبت تراکنش در حال توسعه است', 'info');
        // TODO: پیاده‌سازی ثبت تراکنش
    }

    shareResult() {
        const resultText = document.querySelector('#calculationResult .text-xl.font-bold.text-green-600')?.textContent;
        if (!resultText) {
            this.showError('نتیجه‌ای برای اشتراک وجود ندارد');
            return;
        }

        if (navigator.share) {
            navigator.share({
                title: 'نتیجه محاسبه ارز',
                text: `نتیجه محاسبه: ${resultText}`,
                url: window.location.href
            });
        } else {
            // کپی به کلیپ بورد
            navigator.clipboard.writeText(resultText).then(() => {
                this.showNotification('نتیجه کپی شد', 'success');
            });
        }
    }

    formatNumber(num) {
        return new Intl.NumberFormat('fa-IR').format(num);
    }

    formatRate(rate) {
        if (rate < 0.01) {
            return rate.toFixed(8);
        } else if (rate < 1) {
            return rate.toFixed(6);
        } else {
            return rate.toFixed(4);
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white max-w-md ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
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
let partnerCalculator;
document.addEventListener('DOMContentLoaded', () => {
    partnerCalculator = new PartnerCalculator();
});