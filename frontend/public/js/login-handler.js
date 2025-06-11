// Secure Login Handler
document.addEventListener('DOMContentLoaded', function() {
    const roleCards = document.querySelectorAll('.role-card');
    const roleInfo = document.getElementById('roleInfo');
    const roleInfoContent = document.getElementById('roleInfoContent');
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const loginButtonText = document.getElementById('loginButtonText');
    
    let selectedRole = null;
    let selectedRedirect = null;
    // اطلاعات نقش‌ها
    const roleDetails = {
        admin: {
            title: 'مدیر صرافی',
            description: 'دسترسی کامل به مدیریت صرافی، همکاران، مشتریان، گزارشات مالی و تنظیمات سیستم',
            features: ['مدیریت همکاران', 'گزارشات مالی', 'مدیریت مشتریان', 'تنظیمات نرخ', 'آمار و تحلیل']
        },
        partner: {
            title: 'همکار صرافی',
            description: 'دسترسی به ابزارهای تخصصی همکاران شامل ماشین حساب، محاسبه کمیسیون و ثبت معاملات',
            features: ['ماشین حساب پیشرفته', 'محاسبه کمیسیون', 'ثبت معاملات', 'گزارش عملکرد شخصی']
        },
        customer: {
            title: 'مشتری',
            description: 'پیگیری معاملات شخصی، مشاهده تاریخچه و دسترسی به اطلاعات حساب کاربری',
            features: ['پیگیری معاملات', 'تاریخچه تراکنش‌ها', 'اطلاعات حساب', 'درخواست پشتیبانی']
        },
        system: {
            title: 'مدیر سیستم',
            description: 'مدیریت کل پلتفرم، صرافی‌های عضو، تنظیمات عمومی و نظارت بر سیستم',
            features: ['مدیریت صرافی‌ها', 'نظارت سیستم', 'تنظیمات عمومی', 'گزارشات کلی']
        }
    };
    // مدیریت انتخاب نقش
    roleCards.forEach(card => {
        card.addEventListener('click', function() {
            roleCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            selectedRole = this.dataset.role;
            selectedRedirect = this.dataset.redirect;
            const details = roleDetails[selectedRole];
            roleInfoContent.innerHTML = `
                <h3 class="font-bold mb-2">${details.title}</h3>
                <p class="text-sm mb-3">${details.description}</p>
                <div class="text-xs">
                    <strong>امکانات:</strong>
                    <ul class="mr-4 mt-1">
                        ${details.features.map(feature => `<li>• ${feature}</li>`).join('')}
                    </ul>
                </div>
            `;
            roleInfo.style.display = 'block';
        });
    });
    // مدیریت فرم ورود
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (!selectedRole) {
            showNotification('لطفاً ابتدا نقش کاربری خود را انتخاب کنید', 'warning');
            return;
        }
        const formData = new FormData(this);
        const credentials = {
            tenantId: formData.get('tenantId'),
            username: formData.get('username'),
            password: formData.get('password'),
            role: selectedRole
        };
        if (!credentials.tenantId || !credentials.username || !credentials.password) {
            showNotification('لطفاً تمام فیلدها را پر کنید', 'error');
            return;
        }
        // نمایش loading
        loginButton.disabled = true;
        loginButtonText.innerHTML = '<div class="spinner"></div>در حال ورود...';
        try {
            const result = await authSystem.login(credentials);
            if (result.success) {
                showNotification('ورود موفقیت‌آمیز! در حال انتقال...', 'success');
                
                setTimeout(() => {
                    window.location.href = selectedRedirect;
                }, 1500);
            } else {
                showNotification(result.message || 'خطا در ورود به سیستم', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification('خطا در ارتباط با سرور', 'error');
        } finally {
            loginButton.disabled = false;
            loginButtonText.innerHTML = '<i class="fas fa-sign-in-alt ml-2"></i>ورود به سیستم';
        }
    });
    // نمایش/مخفی کردن رمز عبور
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
    // تابع نمایش نوتیفیکیشن
    function showNotification(message, type) {
        const notification = document.createElement('div');
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        notification.innerHTML = `
            <div class="fixed top-4 right-4 z-50 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg max-w-md">
                <div class="flex items-center justify-between">
                    <span>${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" class="mr-4 text-white hover:text-gray-200">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentElement) notification.remove();
        }, 5000);
    }
});