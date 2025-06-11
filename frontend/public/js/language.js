
// Multi-language support system
const languages = {
    en: {
        // Navigation & Header
        dashboard: "Dashboard",
        crypto: "Cryptocurrency",
        calculator: "Currency Calculator", 
        p2p: "P2P Marketplace",
        reports: "Reports & Analytics",
        customers: "Customer Portal",
        logout: "Logout",
        
        // Dashboard
        welcome: "Welcome to Exchange Platform",
        quickActions: "Quick Actions",
        newTransaction: "New Transaction",
        newCustomer: "New Customer", 
        viewReports: "View Reports",
        settings: "Settings",
        totalRevenue: "Total Revenue",
        totalTransactions: "Total Transactions",
        activeCustomers: "Active Customers",
        monthlyGrowth: "Monthly Growth",
        
        // Hawala System
        hawalaTransfer: "Hawala Transfer",
        branchNotification: "Branch Notification",
        sendMoney: "Send Money",
        receiveMoney: "Receive Money",
        senderInfo: "Sender Information",
        receiverInfo: "Receiver Information",
        transferAmount: "Transfer Amount",
        exchangeRate: "Exchange Rate",
        fees: "Fees",
        totalAmount: "Total Amount",
        secretCode: "Secret Code",
        notifyBranch: "Notify Branch",
        
        // Currency Exchange
        fromCurrency: "From Currency",
        toCurrency: "To Currency",
        amount: "Amount",
        rate: "Rate",
        calculate: "Calculate",
        
        // Customer Management
        customerName: "Customer Name",
        phoneNumber: "Phone Number",
        idNumber: "ID Number",
        address: "Address",
        kycStatus: "KYC Status",
        
        // Common
        save: "Save",
        cancel: "Cancel",
        submit: "Submit",
        edit: "Edit",
        delete: "Delete",
        search: "Search",
        filter: "Filter",
        export: "Export",
        print: "Print",
        loading: "Loading...",
        success: "Success",
        error: "Error",
        confirm: "Confirm",
        
        // Status
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        completed: "Completed",
        active: "Active",
        inactive: "Inactive"
    },
    
    fa: {
        // ناوبری و هدر
        dashboard: "داشبورد",
        crypto: "ارز دیجیتال",
        calculator: "ماشین حساب ارز",
        p2p: "بازار P2P",
        reports: "گزارشات و تحلیل",
        customers: "پورتال مشتری",
        logout: "خروج",
        
        // داشبورد
        welcome: "به پلتفرم صرافی خوش آمدید",
        quickActions: "اقدامات سریع",
        newTransaction: "تراکنش جدید",
        newCustomer: "مشتری جدید",
        viewReports: "مشاهده گزارشات",
        settings: "تنظیمات",
        totalRevenue: "کل درآمد",
        totalTransactions: "کل تراکنش‌ها",
        activeCustomers: "مشتریان فعال",
        monthlyGrowth: "رشد ماهانه",
        
        // سیستم حواله
        hawalaTransfer: "حواله زیرزمینی",
        branchNotification: "اطلاع‌رسانی شعبه",
        sendMoney: "ارسال پول",
        receiveMoney: "دریافت پول",
        senderInfo: "اطلاعات فرستنده",
        receiverInfo: "اطلاعات گیرنده",
        transferAmount: "مبلغ حواله",
        exchangeRate: "نرخ ارز",
        fees: "کارمزد",
        totalAmount: "مبلغ کل",
        secretCode: "کد مخفی",
        notifyBranch: "اطلاع به شعبه",
        
        // تبدیل ارز
        fromCurrency: "از ارز",
        toCurrency: "به ارز",
        amount: "مبلغ",
        rate: "نرخ",
        calculate: "محاسبه",
        
        // مدیریت مشتری
        customerName: "نام مشتری",
        phoneNumber: "شماره تلفن",
        idNumber: "شماره شناسایی",
        address: "آدرس",
        kycStatus: "وضعیت احراز هویت",
        
        // عمومی
        save: "ذخیره",
        cancel: "لغو",
        submit: "ارسال",
        edit: "ویرایش",
        delete: "حذف",
        search: "جستجو",
        filter: "فیلتر",
        export: "خروجی",
        print: "چاپ",
        loading: "در حال بارگذاری...",
        success: "موفق",
        error: "خطا",
        confirm: "تأیید",
        
        // وضعیت
        pending: "در انتظار",
        approved: "تأیید شده",
        rejected: "رد شده",
        completed: "تکمیل شده",
        active: "فعال",
        inactive: "غیرفعال"
    },
    
    ar: {
        // التنقل والرأس
        dashboard: "لوحة التحكم",
        crypto: "العملة المشفرة",
        calculator: "حاسبة العملة",
        p2p: "سوق P2P",
        reports: "التقارير والتحليلات",
        customers: "بوابة العملاء",
        logout: "تسجيل الخروج",
        
        // لوحة التحكم
        welcome: "مرحباً بك في منصة الصرافة",
        quickActions: "إجراءات سريعة",
        newTransaction: "معاملة جديدة",
        newCustomer: "عميل جديد",
        viewReports: "عرض التقارير",
        settings: "الإعدادات",
        totalRevenue: "إجمالي الإيرادات",
        totalTransactions: "إجمالي المعاملات",
        activeCustomers: "العملاء النشطون",
        monthlyGrowth: "النمو الشهري",
        
        // نظام الحوالة
        hawalaTransfer: "حوالة تحت الأرض",
        branchNotification: "إشعار الفرع",
        sendMoney: "إرسال المال",
        receiveMoney: "استلام المال",
        senderInfo: "معلومات المرسل",
        receiverInfo: "معلومات المستلم",
        transferAmount: "مبلغ التحويل",
        exchangeRate: "سعر الصرف",
        fees: "الرسوم",
        totalAmount: "المبلغ الإجمالي",
        secretCode: "الرمز السري",
        notifyBranch: "إشعار الفرع",
        
        // صرف العملات
        fromCurrency: "من العملة",
        toCurrency: "إلى العملة",
        amount: "المبلغ",
        rate: "السعر",
        calculate: "احسب",
        
        // إدارة العملاء
        customerName: "اسم العميل",
        phoneNumber: "رقم الهاتف",
        idNumber: "رقم الهوية",
        address: "العنوان",
        kycStatus: "حالة التحقق",
        
        // عام
        save: "حفظ",
        cancel: "إلغاء",
        submit: "إرسال",
        edit: "تعديل",
        delete: "حذف",
        search: "بحث",
        filter: "تصفية",
        export: "تصدير",
        print: "طباعة",
        loading: "جاري التحميل...",
        success: "نجح",
        error: "خطأ",
        confirm: "تأكيد",
        
        // الحالة
        pending: "معلق",
        approved: "موافق عليه",
        rejected: "مرفوض",
        completed: "مكتمل",
        active: "نشط",
        inactive: "غير نشط"
    },
    
    ur: {
        // نیویگیشن اور ہیڈر
        dashboard: "ڈیش بورڈ",
        crypto: "کرپٹو کرنسی",
        calculator: "کرنسی کیلکولیٹر",
        p2p: "P2P مارکیٹ",
        reports: "رپورٹس اور تجزیات",
        customers: "کسٹمر پورٹل",
        logout: "لاگ آؤٹ",
        
        // ڈیش بورڈ
        welcome: "ایکسچینج پلیٹ فارم میں خوش آمدید",
        quickActions: "فوری اعمال",
        newTransaction: "نیا لین دین",
        newCustomer: "نیا کسٹمر",
        viewReports: "رپورٹس دیکھیں",
        settings: "سیٹنگز",
        totalRevenue: "کل آمدنی",
        totalTransactions: "کل لین دین",
        activeCustomers: "فعال کسٹمرز",
        monthlyGrowth: "ماہانہ اضافہ",
        
        // حوالہ سسٹم
        hawalaTransfer: "زیر زمین حوالہ",
        branchNotification: "برانچ نوٹیفیکیشن",
        sendMoney: "رقم بھیجیں",
        receiveMoney: "رقم وصول کریں",
        senderInfo: "بھیجنے والے کی معلومات",
        receiverInfo: "وصول کرنے والے کی معلومات",
        transferAmount: "حوالے کی رقم",
        exchangeRate: "تبادلے کی شرح",
        fees: "فیس",
        totalAmount: "کل رقم",
        secretCode: "خفیہ کوڈ",
        notifyBranch: "برانچ کو اطلاع",
        
        // کرنسی ایکسچینج
        fromCurrency: "کرنسی سے",
        toCurrency: "کرنسی میں",
        amount: "رقم",
        rate: "شرح",
        calculate: "حساب لگائیں",
        
        // کسٹمر منیجمنٹ
        customerName: "کسٹمر کا نام",
        phoneNumber: "فون نمبر",
        idNumber: "شناختی نمبر",
        address: "پتہ",
        kycStatus: "KYC سٹیٹس",
        
        // عام
        save: "محفوظ کریں",
        cancel: "منسوخ",
        submit: "جمع کریں",
        edit: "ترمیم",
        delete: "حذف",
        search: "تلاش",
        filter: "فلٹر",
        export: "ایکسپورٹ",
        print: "پرنٹ",
        loading: "لوڈ ہو رہا ہے...",
        success: "کامیاب",
        error: "خرابی",
        confirm: "تصدیق",
        
        // حالت
        pending: "زیر التوا",
        approved: "منظور شدہ",
        rejected: "مسترد",
        completed: "مکمل",
        active: "فعال",
        inactive: "غیر فعال"
    },
    
    hi: {
        // नेवीगेशन और हेडर
        dashboard: "डैशबोर्ड",
        crypto: "क्रिप्टोकरेंसी",
        calculator: "मुद्रा कैलकुलेटर",
        p2p: "P2P मार्केटप्लेस",
        reports: "रिपोर्ट और विश्लेषण",
        customers: "ग्राहक पोर्टल",
        logout: "लॉग आउट",
        
        // डैशबोर्ड
        welcome: "एक्सचेंज प्लेटफॉर्म में आपका स्वागत है",
        quickActions: "त्वरित कार्य",
        newTransaction: "नया लेन-देन",
        newCustomer: "नया ग्राहक",
        viewReports: "रिपोर्ट देखें",
        settings: "सेटिंग्स",
        totalRevenue: "कुल राजस्व",
        totalTransactions: "कुल लेन-देन",
        activeCustomers: "सक्रिय ग्राहक",
        monthlyGrowth: "मासिक वृद्धि",
        
        // हवाला सिस्टम
        hawalaTransfer: "भूमिगत हवाला",
        branchNotification: "शाखा अधिसूचना",
        sendMoney: "पैसे भेजें",
        receiveMoney: "पैसे प्राप्त करें",
        senderInfo: "भेजने वाले की जानकारी",
        receiverInfo: "प्राप्तकर्ता की जानकारी",
        transferAmount: "स्थानांतरण राशि",
        exchangeRate: "विनिमय दर",
        fees: "शुल्क",
        totalAmount: "कुल राशि",
        secretCode: "गुप्त कोड",
        notifyBranch: "शाखा को सूचित करें",
        
        // मुद्रा विनिमय
        fromCurrency: "मुद्रा से",
        toCurrency: "मुद्रा में",
        amount: "राशि",
        rate: "दर",
        calculate: "गणना करें",
        
        // ग्राहक प्रबंधन
        customerName: "ग्राहक का नाम",
        phoneNumber: "फोन नंबर",
        idNumber: "आईडी नंबर",
        address: "पता",
        kycStatus: "KYC स्थिति",
        
        // सामान्य
        save: "सेव करें",
        cancel: "रद्द करें",
        submit: "जमा करें",
        edit: "संपादित करें",
        delete: "हटाएं",
        search: "खोजें",
        filter: "फिल्टर",
        export: "निर्यात",
        print: "प्रिंट",
        loading: "लोड हो रहा है...",
        success: "सफल",
        error: "त्रुटि",
        confirm: "पुष्टि करें",
        
        // स्थिति
        pending: "लंबित",
        approved: "स्वीकृत",
        rejected: "अस्वीकृत",
        completed: "पूर्ण",
        active: "सक्रिय",
        inactive: "निष्क्रिय"
    }
};

// Current language state
let currentLanguage = localStorage.getItem('language') || 'en';

// RTL languages
const rtlLanguages = ['fa', 'ar', 'ur'];

// Language management functions
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update HTML direction
    document.documentElement.dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Update all text elements
    updatePageText();
    
    // Update language selector
    updateLanguageSelector();
    
    // Show notification
    showNotification(getText('languageChanged') || 'Language updated successfully', 'success');
}

function getText(key) {
    return languages[currentLanguage]?.[key] || languages.en[key] || key;
}

function updatePageText() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = getText(key);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else {
            element.textContent = text;
        }
    });
    
    // Update title if exists
    const titleElement = document.querySelector('title');
    if (titleElement && titleElement.getAttribute('data-i18n')) {
        titleElement.textContent = getText(titleElement.getAttribute('data-i18n'));
    }
}

function updateLanguageSelector() {
    const selector = document.getElementById('languageSelector');
    if (selector) {
        selector.value = currentLanguage;
    }
}

// Initialize language system
function initializeLanguage() {
    // Set initial direction
    document.documentElement.dir = rtlLanguages.includes(currentLanguage) ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    
    // Update text
    updatePageText();
    updateLanguageSelector();
    
    // Add language selector if it doesn't exist
    addLanguageSelector();
}

function addLanguageSelector() {
    // Check if selector already exists
    if (document.getElementById('languageSelector')) return;
    
    // Find header or create one
    let header = document.querySelector('header .container .flex');
    if (!header) return;
    
    // Create language selector
    const languageSelector = document.createElement('div');
    languageSelector.className = 'flex items-center space-x-2';
    languageSelector.innerHTML = `
        <i class="fas fa-globe text-white"></i>
        <select id="languageSelector" onchange="setLanguage(this.value)" 
                class="bg-transparent text-white border border-white/30 rounded px-2 py-1 text-sm">
            <option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>🇺🇸 English</option>
            <option value="fa" ${currentLanguage === 'fa' ? 'selected' : ''}>🇮🇷 فارسی</option>
            <option value="ar" ${currentLanguage === 'ar' ? 'selected' : ''}>🇸🇦 العربية</option>
            <option value="ur" ${currentLanguage === 'ur' ? 'selected' : ''}>🇵🇰 اردو</option>
            <option value="hi" ${currentLanguage === 'hi' ? 'selected' : ''}>🇮🇳 हिंदी</option>
        </select>
    `;
    
    // Insert before logout button
    const rightSection = header.querySelector('.flex.items-center.space-x-4');
    if (rightSection) {
        rightSection.insertBefore(languageSelector, rightSection.lastElementChild);
    }
}

// Notification function
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : type === 'warning' ? 'exclamation' : 'info'}-circle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white/80 hover:text-white">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Currency formatting by language
function formatCurrency(amount, currency, language = currentLanguage) {
    const locale = {
        'en': 'en-US',
        'fa': 'fa-IR',
        'ar': 'ar-SA',
        'ur': 'ur-PK',
        'hi': 'hi-IN'
    }[language] || 'en-US';
    
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount);
    } catch (e) {
        return `${amount.toLocaleString()} ${currency}`;
    }
}

// Number formatting by language
function formatNumber(number, language = currentLanguage) {
    const locale = {
        'en': 'en-US',
        'fa': 'fa-IR',
        'ar': 'ar-SA',
        'ur': 'ur-PK',
        'hi': 'hi-IN'
    }[language] || 'en-US';
    
    return new Intl.NumberFormat(locale).format(number);
}

// Date formatting by language
function formatDate(date, language = currentLanguage) {
    const locale = {
        'en': 'en-US',
        'fa': 'fa-IR',
        'ar': 'ar-SA',
        'ur': 'ur-PK',
        'hi': 'hi-IN'
    }[language] || 'en-US';
    
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeLanguage);

// Export functions for use in other scripts
window.setLanguage = setLanguage;
window.getText = getText;
window.formatCurrency = formatCurrency;
window.formatNumber = formatNumber;
window.formatDate = formatDate;
window.showNotification = showNotification;
