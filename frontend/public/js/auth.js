// Secure Authentication System - Annual Subscription Model
class AuthSystem {
    constructor() {
        this.sessionTimeout = 2 * 60 * 60 * 1000; // 2 ساعت
        this.currentUser = null;
        this.apiUrl = '/api/auth'; // آدرس API واقعی
        this.init();
    }
    init() {
        console.log('🔐 Secure Auth System initializing...');
        this.checkSession();
        this.setupGlobalEventListeners();
    }
    setupGlobalEventListeners() {
        // تمدید خودکار session در صورت فعالیت
        document.addEventListener('click', () => this.refreshSession());
        document.addEventListener('keypress', () => this.refreshSession());
        
        // بررسی دوره‌ای session
        setInterval(() => this.validateSession(), 60000); // هر دقیقه
    }
    checkSession() {
        const sessionToken = localStorage.getItem('sessionToken');
        const loginTime = localStorage.getItem('loginTime');
        
        if (sessionToken && loginTime) {
            const timeDiff = Date.now() - parseInt(loginTime);
            
            if (timeDiff < this.sessionTimeout) {
                this.validateTokenWithServer(sessionToken);
            } else {
                this.logout('جلسه کاری شما منقضی شده است');
            }
        }
    }
    async validateTokenWithServer(token) {
        try {
            const response = await fetch(`${this.apiUrl}/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                this.currentUser = userData.user;
                this.updateUserInterface();
            } else {
                this.logout('جلسه نامعتبر است');
            }
        } catch (error) {
            console.error('Token validation error:', error);
            this.logout('خطا در اعتبارسنجی');
        }
    }
    async login(credentials) {
        try {
            const response = await fetch(`${this.apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tenantId: credentials.tenantId,
                    username: credentials.username,
                    password: credentials.password, // رمزگذاری شده در سمت کلاینت
                    role: credentials.role
                })
            });
            const result = await response.json();
            
            if (response.ok && result.success) {
                // ذخیره توکن امن (بدون اطلاعات کاربر)
                localStorage.setItem('sessionToken', result.token);
                localStorage.setItem('loginTime', Date.now().toString());
                
                this.currentUser = result.user;
                this.updateUserInterface();
                
                return { success: true, user: result.user };
            } else {
                return { success: false, message: result.message || 'خطا در ورود' };
            }
            
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'خطا در ارتباط با سرور' };
        }
    }
    async logout(message = 'خروج موفقیت‌آمیز') {
        try {
            const token = localStorage.getItem('sessionToken');
            if (token) {
                // اطلاع به سرور برای logout
                await fetch(`${this.apiUrl}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // پاک کردن اطلاعات محلی
            this.currentUser = null;
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('loginTime');
            
            if (message) {
                this.showNotification(message, 'info');
            }
            
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1000);
        }
    }
    refreshSession() {
        const token = localStorage.getItem('sessionToken');
        if (token && this.currentUser) {
            localStorage.setItem('loginTime', Date.now().toString());
        }
    }
    validateSession() {
        const loginTime = localStorage.getItem('loginTime');
        
        if (this.currentUser && loginTime) {
            const timeDiff = Date.now() - parseInt(loginTime);
            
            if (timeDiff >= this.sessionTimeout) {
                this.logout('جلسه کاری شما منقضی شده است');
            }
        }
    }
    updateUserInterface() {
        if (!this.currentUser) return;
        // بروزرسانی نام کاربر (بدون اطلاعات حساس)
        const userNameElements = document.querySelectorAll('[data-user-name]');
        userNameElements.forEach(el => {
            el.textContent = this.currentUser.displayName || 'کاربر';
        });
        // بروزرسانی نقش کاربر
        const userRoleElements = document.querySelectorAll('[data-user-role]');
        userRoleElements.forEach(el => {
            el.textContent = this.getRoleDisplayName(this.currentUser.role);
        });
        // بروزرسانی نام صرافی
        const tenantNameElements = document.querySelectorAll('[data-tenant-name]');
        tenantNameElements.forEach(el => {
            el.textContent = this.currentUser.tenantName || 'صرافی';
        });
    }
    getRoleDisplayName(role) {
        const roleNames = {
            'admin': 'مدیر صرافی',
            'partner': 'همکار',
            'customer': 'مشتری',
            'system': 'مدیر سیستم'
        };
        return roleNames[role] || role;
    }
    hasPermission(permission) {
        return this.currentUser?.permissions?.includes(permission) || 
               this.currentUser?.permissions?.includes('all') || false;
    }
    isLoggedIn() {
        return this.currentUser !== null && localStorage.getItem('sessionToken') !== null;
    }
    getCurrentUser() {
        return this.currentUser;
    }
    getTenantId() {
        return this.currentUser?.tenantId || null;
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
}
// Initialize when page loads
let authSystem;
document.addEventListener('DOMContentLoaded', () => {
    authSystem = new AuthSystem();
});
// Global functions
window.authSystem = authSystem;
window.isLoggedIn = () => authSystem?.isLoggedIn() || false;
window.getCurrentUser = () => authSystem?.getCurrentUser() || null;
window.hasPermission = (permission) => authSystem?.hasPermission(permission) || false;
window.logout = (message) => authSystem?.logout(message);