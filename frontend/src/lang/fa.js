const PERSIAN_TRANSLATIONS = {
    // عمومی
    common: {
        loading: 'در حال بارگذاری...',
        save: 'ذخیره',
        cancel: 'لغو',
        edit: 'ویرایش',
        delete: 'حذف',
        add: 'افزودن',
        search: 'جستجو',
        filter: 'فیلتر',
        export: 'خروجی',
        print: 'چاپ',
        refresh: 'تازه‌سازی',
        close: 'بستن',
        submit: 'ارسال',
        reset: 'تنظیم مجدد',
        confirm: 'تأیید',
        back: 'بازگشت',
        next: 'بعدی',
        previous: 'قبلی',
        yes: 'بله',
        no: 'خیر',
        success: 'موفق',
        error: 'خطا',
        warning: 'هشدار',
        info: 'اطلاعات'
    },

    // احراز هویت
    auth: {
        login: 'ورود',
        logout: 'خروج',
        register: 'ثبت‌نام',
        email: 'ایمیل',
        password: 'رمز عبور',
        confirmPassword: 'تکرار رمز عبور',
        forgotPassword: 'فراموشی رمز عبور',
        rememberMe: 'مرا به خاطر بسپار',
        tenantId: 'شناسه صرافی',
        loginTitle: 'ورود به سامانه',
        welcome: 'خوش آمدید',
        loginSuccess: 'ورود موفقیت‌آمیز',
        loginError: 'خطا در ورود',
        invalidCredentials: 'ایمیل یا رمز عبور اشتباه است'
    },

    // داشبورد
    dashboard: {
        title: 'داشبورد مدیریت',
        overview: 'نمای کلی',
        todayTransactions: 'معاملات امروز',
        totalBalance: 'کل موجودی',
        monthlyProfit: 'سود ماهانه',
        activeCustomers: 'مشتریان فعال',
        recentActivity: 'فعالیت‌های اخیر',
        quickActions: 'عملیات سریع',
        statistics: 'آمار و ارقام',
        performance: 'عملکرد'
    },

    // معاملات
    transactions: {
        title: 'مدیریت معاملات',
        newTransaction: 'معامله جدید',
        transactionHistory: 'تاریخچه معاملات',
        transactionCode: 'کد معامله',
        customerName: 'نام مشتری',
        amount: 'مبلغ',
        currency: 'ارز',
        type: 'نوع معامله',
        status: 'وضعیت',
        date: 'تاریخ',
        buy: 'خرید',
        sell: 'فروش',
        exchange: 'تبدیل',
        transfer: 'انتقال',
        pending: 'در انتظار',
        completed: 'تکمیل شده',
        cancelled: 'لغو شده',
        failed: 'ناموفق',
        profit: 'سود',
        commission: 'کمیسیون',
        rate: 'نرخ',
        notes: 'یادداشت‌ها'
    },

    // مشتریان
    customers: {
        title: 'مدیریت مشتریان',
        newCustomer: 'مشتری جدید',
        customerList: 'لیست مشتریان',
        customerCode: 'کد مشتری',
        name: 'نام',
        phone: 'تلفن',
        email: 'ایمیل',
        address: 'آدرس',
        nationalId: 'کد ملی',
        creditLimit: 'حد اعتبار',
        balance: 'موجودی',
        kycStatus: 'وضعیت احراز هویت',
        vipCustomer: 'مشتری ویژه',
        transactionHistory: 'تاریخچه معاملات',
        customerProfile: 'پروفایل مشتری'
    },

    // همکاران
    partners: {
        title: 'مدیریت همکاران',
        newPartner: 'همکار جدید',
        partnerList: 'لیست همکاران',
        partnerCode: 'کد همکار',
        partnerRate: 'نرخ همکار',
        partnerTransaction: 'معامله همکار',
        currencyExchange: 'تبدیل ارز',
        manualExchange: 'تبدیل دستی',
        partnerProfit: 'سود همکار',
        marginPercentage: 'درصد حاشیه',
        calculationMethod: 'روش محاسبه',
        multiply: 'ضرب',
        divide: 'تقسیم',
        exchangeFormula: 'فرمول تبدیل'
    },

    // نرخ ارز
    rates: {
        title: 'مدیریت نرخ ارز',
        currentRates: 'نرخ‌های فعلی',
        rateHistory: 'تاریخچه نرخ‌ها',
        updateRates: 'به‌روزرسانی نرخ‌ها',
        buyRate: 'نرخ خرید',
        sellRate: 'نرخ فروش',
        lastUpdate: 'آخرین به‌روزرسانی',
        autoUpdate: 'به‌روزرسانی خودکار',
        rateChange: 'تغییر نرخ',
        rateAlert: 'هشدار نرخ'
    },

    // حسابداری
    accounting: {
        title: 'حسابداری و گزارشات',
        profitLoss: 'سود و زیان',
        cashFlow: 'جریان نقدی',
        balance: 'ترازنامه',
        expenses: 'هزینه‌ها',
        revenue: 'درآمد',
        dailyReport: 'گزارش روزانه',
        monthlyReport: 'گزارش ماهانه',
        yearlyReport: 'گزارش سالانه',
        exportExcel: 'خروجی اکسل',
        exportPdf: 'خروجی PDF'
    },

    // تنظیمات
    settings: {
        title: 'تنظیمات سیستم',
        general: 'عمومی',
        security: 'امنیت',
        notifications: 'اطلاع‌رسانی',
        backup: 'پشتیبان‌گیری',
        users: 'کاربران',
        permissions: 'دسترسی‌ها',
        profile: 'پروفایل کاربری',
        changePassword: 'تغییر رمز عبور'
    },

    // ارزها
    currencies: {
        USD: 'دلار آمریکا',
        EUR: 'یورو',
        GBP: 'پوند انگلیس',
        AED: 'درهم امارات',
        SAR: 'ریال عربستان',
        TRY: 'لیر ترکیه',
        IRR: 'ریال ایران',
        BTC: 'بیت‌کوین',
        ETH: 'اتریوم',
        USDT: 'تتر'
    },

    // پیام‌ها
    messages: {
        success: {
            transactionCreated: 'معامله با موفقیت ثبت شد',
            customerCreated: 'مشتری با موفقیت ایجاد شد',
            partnerCreated: 'همکار با موفقیت ایجاد شد',
            ratesUpdated: 'نرخ‌ها با موفقیت به‌روزرسانی شد',
            dataExported: 'داده‌ها با موفقیت خروجی گرفته شد',
            settingsSaved: 'تنظیمات ذخیره شد'
        },
        error: {
            transactionFailed: 'خطا در ثبت معامله',
            customerExists: 'مشتری با این مشخصات وجود دارد',
            insufficientBalance: 'موجودی کافی نیست',
            invalidData: 'داده‌های وارد شده نامعتبر است',
            networkError: 'خطا در ارتباط با سرور',
            accessDenied: 'دسترسی غیرمجاز'
        },
        warning: {
            unsavedChanges: 'تغییرات ذخیره نشده‌ای دارید',
            deleteConfirm: 'آیا از حذف این آیتم مطمئن هستید؟',
            logoutConfirm: 'آیا می‌خواهید از سیستم خارج شوید؟'
        }
    },

    // نقش‌های کاربری
    roles: {
        super_admin: 'مدیر کل سیستم',
        tenant_admin: 'مدیر صرافی',
        manager: 'مدیر',
        employee: 'کارمند',
        accountant: 'حسابدار',
        customer: 'مشتری'
    },

    // وضعیت‌ها
    status: {
        active: 'فعال',
        inactive: 'غیرفعال',
        pending: 'در انتظار',
        completed: 'تکمیل شده',
        cancelled: 'لغو شده',
        processing: 'در حال پردازش',
        failed: 'ناموفق',
        verified: 'تأیید شده',
        rejected: 'رد شده'
    }
};

// Export for global use
window.PERSIAN_TRANSLATIONS = PERSIAN_TRANSLATIONS;
window.t = function(key, defaultValue = '') {
    const keys = key.split('.');
    let value = PERSIAN_TRANSLATIONS;
    
    for (const k of keys) {
        value = value[k];
        if (!value) break;
    }
    
    return value || defaultValue || key;
};