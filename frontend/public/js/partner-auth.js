// Partner Authentication System
class PartnerAuth {
    constructor() {
        this.currentPartner = null;
        this.sessionTimeout = 30 * 60 * 1000; // 30 دقیقه
        this.init();
    }

    init() {
        console.log('🔐 Partner Auth System initializing...');
        this.checkExistingSession();
        this.setupEventListeners();
        this.startSessionTimer();
    }

    setupEventListeners() {
        // فرم ورود همکار
        const loginForm = document.getElementById('partnerLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // دکمه خروج
        const logoutButton = document.getElementById('partnerLogout');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => this.logout());
        }

        // تغییر رمز عبور
        const changePasswordForm = document.getElementById('changePasswordForm');
        if (changePasswordForm) {
            changePasswordForm.addEventListener('submit', (e) => this.handleChangePassword(e));
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        const username = form.querySelector('#username').value;
        const password = form.querySelector('#password').value;

        if (!username || !password) {
            this.showError('لطفاً نام کاربری و رمز عبور را وارد کنید');
            return;
        }

        btn.innerHTML = '<div class="spinner"></div>در حال ورود...';
        btn.disabled = true;

        try {
            // شبیه‌سازی API call
            await this.delay(2000);
            
            const partner = await this.authenticatePartner(username, password);
            
            if (partner) {
                this.setCurrentPartner(partner);
                this.showSuccess('ورود موفقیت‌آمیز بود!');
                
                // انتقال به داشبورد همکار
                setTimeout(() => {
                    window.location.href = 'partner-dashboard.html';
                }, 1500);
                
            } else {
                this.showError('نام کاربری یا رمز عبور اشتباه است');
            }

        } catch (error) {
            this.showError('خطا در برقراری ارتباط با سرور');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    async authenticatePartner(username, password) {
        // شبیه‌سازی احراز هویت با دیتابیس
        const mockPartners = [
            {
                id: 'PART001',
                username: 'ahmad.rezaei',
                password: 'partner123', // در واقعیت hash شده
                name: 'احمد رضایی',
                phone: '+971501234567',
                email: 'ahmad@example.com',
                status: 'active',
                permissions: {
                    calculator: true,
                    transactions: true,
                    reports: true,
                    customers: false
                },
                commissionRate: 0.5,
                discountRate: 2.0,
                maxLimit: 50000,
                lastLogin: null
            },
            {
                id: 'PART002',
                username: 'fateme.mohammadi',
                password: 'partner456',
                name: 'فاطمه محمدی',
                phone: '+971502345678',
                email: 'fateme@example.com',
                status: 'active',
                permissions: {
                    calculator: true,
                    transactions: true,
                    reports: false,
                    customers: false
                },
                commissionRate: 0.3,
                discountRate: 1.5,
                maxLimit: 30000,
                lastLogin: null
            }
        ];

        const partner = mockPartners.find(p => 
            p.username === username && p.password === password && p.status === 'active'
        );

        if (partner) {
            // بروزرسانی آخرین ورود
            partner.lastLogin = new Date().toISOString();
            // حذف رمز عبور از session
            const { password, ...partnerWithoutPassword } = partner;
            return partnerWithoutPassword;
        }

        return null;
    }

    setCurrentPartner(partner) {
        this.currentPartner = partner;
        
        // ذخیره در localStorage
        localStorage.setItem('currentPartner', JSON.stringify(partner));
        localStorage.setItem('partnerLoginTime', Date.now().toString());
        
        // بروزرسانی UI
        this.updatePartnerInterface();
    }

    checkExistingSession() {
        const storedPartner = localStorage.getItem('currentPartner');
        const loginTime = localStorage.getItem('partnerLoginTime');
        
        if (storedPartner && loginTime) {
            const timeDiff = Date.now() - parseInt(loginTime);
            
            if (timeDiff < this.sessionTimeout) {
                this.currentPartner = JSON.parse(storedPartner);
                this.updatePartnerInterface();
                console.log('✅ Partner session restored:', this.currentPartner.name);
            } else {
                this.logout();
                this.showWarning('جلسه کاری شما منقضی شده است. لطفاً دوباره وارد شوید.');
            }
        }
    }

    updatePartnerInterface() {
        if (!this.currentPartner) return;

        // بروزرسانی نام همکار
        const nameElements = document.querySelectorAll('[data-partner-name]');
        nameElements.forEach(el => {
            el.textContent = this.currentPartner.name;
        });

        // بروزرسانی ID همکار
        const idElements = document.querySelectorAll('[data-partner-id]');
        idElements.forEach(el => {
            el.textContent = this.currentPartner.id;
        });

        // نمایش/مخفی کردن المان‌ها بر اساس دسترسی
        this.updatePermissionBasedElements();
        
        // بروزرسانی آمار شخصی
        this.updatePersonalStats();
    }

    updatePermissionBasedElements() {
        if (!this.currentPartner) return;

        const permissionElements = document.querySelectorAll('[data-permission]');
        permissionElements.forEach(el => {
            const requiredPermission = el.getAttribute('data-permission');
            const hasPermission = this.currentPartner.permissions[requiredPermission];
            
            if (hasPermission) {
                el.style.display = 'block';
                el.classList.remove('hidden');
            } else {
                el.style.display = 'none';
                el.classList.add('hidden');
            }
        });
    }

    updatePersonalStats() {
        if (!this.currentPartner) return;

        // نمایش نرخ‌های شخصی
        const commissionElement = document.getElementById('partnerCommissionRate');
        if (commissionElement) {
            commissionElement.textContent = `%${this.currentPartner.commissionRate}`;
        }

        const discountElement = document.getElementById('partnerDiscountRate');
        if (discountElement) {
            discountElement.textContent = `%${this.currentPartner.discountRate}`;
        }

        const limitElement = document.getElementById('partnerMaxLimit');
        if (limitElement) {
            limitElement.textContent = new Intl.NumberFormat('fa-IR').format(this.currentPartner.maxLimit) + ' درهم';
        }
    }

    async handleChangePassword(e) {
        e.preventDefault();
        
        const form = e.target;
        const currentPassword = form.querySelector('#currentPassword').value;
        const newPassword = form.querySelector('#newPassword').value;
        const confirmPassword = form.querySelector('#confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showError('لطفاً تمام فیلدها را پر کنید');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showError('رمز عبور جدید و تکرار آن مطابقت ندارند');
            return;
        }

        if (newPassword.length < 6) {
            this.showError('رمز عبور جدید باید حداقل ۶ کاراکتر باشد');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<div class="spinner"></div>در حال تغییر...';
        btn.disabled = true;

        try {
            // شبیه‌سازی API call
            await this.delay(2000);
            
            // در واقعیت باید با سرور چک کنیم
            const isCurrentPasswordValid = await this.validateCurrentPassword(currentPassword);
            
            if (!isCurrentPasswordValid) {
                this.showError('رمز عبور فعلی اشتباه است');
                return;
            }

            // تغییر رمز عبور
            await this.updatePassword(newPassword);
            
            this.showSuccess('رمز عبور با موفقیت تغییر یافت');
            form.reset();
            
            // بستن modal اگر وجود دارد
            const modal = form.closest('.modal, .fixed');
            if (modal) {
                modal.remove();
            }

        } catch (error) {
            this.showError('خطا در تغییر رمز عبور');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    async validateCurrentPassword(password) {
        // شبیه‌سازی اعتبارسنجی رمز فعلی
        return new Promise(resolve => {
            setTimeout(() => {
                // در این مثال همیشه true برمی‌گرداند
                resolve(true);
            }, 1000);
        });
    }

    async updatePassword(newPassword) {
        // شبیه‌سازی بروزرسانی رمز عبور
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('Password updated for partner:', this.currentPartner.id);
                resolve(true);
            }, 1000);
        });
    }

    startSessionTimer() {
        // تایمر برای تمدید خودکار session
        setInterval(() => {
            if (this.currentPartner) {
                const loginTime = localStorage.getItem('partnerLoginTime');
                if (loginTime) {
                    const timeDiff = Date.now() - parseInt(loginTime);
                    
                    if (timeDiff >= this.sessionTimeout) {
                        this.logout();
                        this.showWarning('جلسه کاری شما به دلیل عدم فعالیت منقضی شد');
                        window.location.href = 'index.html';
                    }
                }
            }
        }, 60000); // هر دقیقه چک کن
    }

    refreshSession() {
        if (this.currentPartner) {
            localStorage.setItem('partnerLoginTime', Date.now().toString());
        }
    }

    logout() {
        this.currentPartner = null;
        localStorage.removeItem('currentPartner');
        localStorage.removeItem('partnerLoginTime');
        
        this.showInfo('با موفقیت خارج شدید');
        
        // پاک کردن interface
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    hasPermission(permission) {
        return this.currentPartner?.permissions?.[permission] === true;
    }

    isLoggedIn() {
        return this.currentPartner !== null;
    }

    getPartner() {
        return this.currentPartner;
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showWarning(message) {
        this.showNotification(message, 'warning');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
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
                <button onclick="this.parentElement.parentElement.remove()" class="mr-4 text-white hover:text-gray-200">
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
let partnerAuth;
document.addEventListener('DOMContentLoaded', () => {
    partnerAuth = new PartnerAuth();
});

// Global functions برای دسترسی آسان
window.partnerAuth = partnerAuth;
window.isPartnerLoggedIn = () => partnerAuth?.isLoggedIn() || false;
window.getCurrentPartner = () => partnerAuth?.getPartner() || null;
window.hasPartnerPermission = (permission) => partnerAuth?.hasPermission(permission) || false;