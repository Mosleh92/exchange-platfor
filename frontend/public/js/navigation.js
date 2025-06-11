// Navigation System - Unified Header for All Pages
class NavigationManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    init() {
        this.createUnifiedHeader();
        this.highlightCurrentPage();
        this.setupMobileMenu();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('dashboard')) return 'dashboard';
        if (path.includes('transactions')) return 'transactions';
        if (path.includes('accounting')) return 'accounting';
        if (path.includes('rates')) return 'rates';
        if (path.includes('crypto')) return 'crypto';
        if (path.includes('reports')) return 'reports';
        if (path.includes('settings')) return 'settings';
        return 'dashboard';
    }

    createUnifiedHeader() {
        const headerHTML = `
            <header class="bg-white shadow-sm border-b sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <!-- Logo & Brand -->
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <img class="h-8 w-auto" src="../assets/logo.png" alt="صرافی" onerror="this.style.display='none'">
                                <span class="text-xl font-bold text-blue-600 mr-2">💱 صرافی پیشرو</span>
                            </div>
                        </div>

                        <!-- Main Navigation -->
                        <nav class="hidden md:flex space-x-8 space-x-reverse">
                            <a href="../pages/dashboard.html" class="nav-link" data-page="dashboard">
                                <i class="fas fa-tachometer-alt ml-1"></i>
                                داشبورد
                            </a>
                            <a href="../pages/transactions.html" class="nav-link" data-page="transactions">
                                <i class="fas fa-exchange-alt ml-1"></i>
                                تراکنش‌ها
                            </a>
                            <a href="../pages/accounting.html" class="nav-link" data-page="accounting">
                                <i class="fas fa-calculator ml-1"></i>
                                حسابداری
                            </a>
                            <a href="../pages/rates.html" class="nav-link" data-page="rates">
                                <i class="fas fa-chart-line ml-1"></i>
                                نرخ ارز
                            </a>
                            <a href="../pages/crypto.html" class="nav-link" data-page="crypto">
                                <i class="fab fa-bitcoin ml-1"></i>
                                ارز دیجیتال
                            </a>
                            <a href="../pages/reports.html" class="nav-link" data-page="reports">
                                <i class="fas fa-chart-bar ml-1"></i>
                                گزارشات
                            </a>
                            <a href="../pages/settings.html" class="nav-link" data-page="settings">
                                <i class="fas fa-cogs ml-1"></i>
                                تنظیمات
                            </a>
                        </nav>

                        <!-- User Menu -->
                        <div class="flex items-center space-x-4 space-x-reverse">
                            <div class="relative">
                                <button id="notificationBtn" class="p-2 text-gray-400 hover:text-gray-500 relative">
                                    <i class="fas fa-bell text-lg"></i>
                                    <span id="notificationBadge" class="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-red-400 text-xs text-white text-center leading-4 hidden">3</span>
                                </button>
                            </div>
                            
                            <div class="relative" id="userMenu">
                                <button class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <img class="h-8 w-8 rounded-full" src="https://images.pravatar.cc/150?img=1" alt="User">
                                    <span class="mr-2 font-medium text-gray-700" id="userName">مدیر سیستم</span>
                                    <i class="fas fa-chevron-down mr-1 text-gray-400"></i>
                                </button>
                                
                                <div id="userDropdown" class="hidden absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                                    <a href="../pages/profile.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <i class="fas fa-user ml-2"></i>
                                        پروفایل
                                    </a>
                                    <a href="../pages/settings.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <i class="fas fa-cogs ml-2"></i>
                                        تنظیمات
                                    </a>
                                    <hr class="my-1">
                                    <button onclick="authSystem.logout()" class="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                        <i class="fas fa-sign-out-alt ml-2"></i>
                                        خروج
                                    </button>
                                </div>
                            </div>

                            <!-- Mobile menu button -->
                            <button id="mobileMenuBtn" class="md:hidden p-2 text-gray-400 hover:text-gray-500">
                                <i class="fas fa-bars text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Mobile Navigation Menu -->
                <div id="mobileMenu" class="hidden md:hidden bg-white border-t border-gray-200">
                    <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="../pages/dashboard.html" class="mobile-nav-link" data-page="dashboard">
                            <i class="fas fa-tachometer-alt ml-2"></i>
                            داشبورد
                        </a>
                        <a href="../pages/transactions.html" class="mobile-nav-link" data-page="transactions">
                            <i class="fas fa-exchange-alt ml-2"></i>
                            تراکنش‌ها
                        </a>
                        <a href="../pages/accounting.html" class="mobile-nav-link" data-page="accounting">
                            <i class="fas fa-calculator ml-2"></i>
                            حسابداری
                        </a>
                        <a href="../pages/rates.html" class="mobile-nav-link" data-page="rates">
                            <i class="fas fa-chart-line ml-2"></i>
                            نرخ ارز
                        </a>
                        <a href="../pages/crypto.html" class="mobile-nav-link" data-page="crypto">
                            <i class="fab fa-bitcoin ml-2"></i>
                            ارز دیجیتال
                        </a>
                        <a href="../pages/reports.html" class="mobile-nav-link" data-page="reports">
                            <i class="fas fa-chart-bar ml-2"></i>
                            گزارشات
                        </a>
                        <a href="../pages/settings.html" class="mobile-nav-link" data-page="settings">
                            <i class="fas fa-cogs ml-2"></i>
                            تنظیمات
                        </a>
                    </div>
                </div>
            </header>

            <style>
                .nav-link {
                    @apply px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200;
                }
                .nav-link.active {
                    @apply text-blue-600 bg-blue-50 font-semibold;
                }
                .mobile-nav-link {
                    @apply block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50;
                }
                .mobile-nav-link.active {
                    @apply text-blue-600 bg-blue-50 font-semibold;
                }
            </style>
        `;

        // Insert header at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }

    highlightCurrentPage() {
        // Remove active class from all links
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current page links
        document.querySelectorAll(`[data-page="${this.currentPage}"]`).forEach(link => {
            link.classList.add('active');
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const userMenu = document.getElementById('userMenu');
        const userDropdown = document.getElementById('userDropdown');

        // Mobile menu toggle
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // User dropdown toggle
        if (userMenu && userDropdown) {
            userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('hidden');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                userDropdown.classList.add('hidden');
            });
        }

        // Notification functionality
        this.setupNotifications();
    }

    setupNotifications() {
        const notificationBtn = document.getElementById('notificationBtn');
        const notificationBadge = document.getElementById('notificationBadge');

        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.showNotifications();
                notificationBadge.classList.add('hidden');
            });
        }
    }

    showNotifications() {
        // Create notification dropdown
        const existingDropdown = document.getElementById('notificationDropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }

        const notificationHTML = `
            <div id="notificationDropdown" class="absolute left-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div class="p-4">
                    <h3 class="text-sm font-medium text-gray-900 mb-3">اعلان‌های اخیر</h3>
                    <div class="space-y-2">
                        <div class="flex items-start space-x-3 space-x-reverse p-2 hover:bg-gray-50 rounded">
                            <div class="flex-shrink-0">
                                <i class="fas fa-info-circle text-blue-500"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm text-gray-900">تراکنش جدید ثبت شد</p>
                                <p class="text-xs text-gray-500">5 دقیقه پیش</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3 space-x-reverse p-2 hover:bg-gray-50 rounded">
                            <div class="flex-shrink-0">
                                <i class="fas fa-chart-line text-green-500"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm text-gray-900">نرخ دلار به‌روزرسانی شد</p>
                                <p class="text-xs text-gray-500">10 دقیقه پیش</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3 space-x-reverse p-2 hover:bg-gray-50 rounded">
                            <div class="flex-shrink-0">
                                <i class="fas fa-exclamation-triangle text-orange-500"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm text-gray-900">هشدار تغییر نرخ</p>
                                <p class="text-xs text-gray-500">15 دقیقه پیش</p>
                            </div>
                        </div>
                    </div>
                    <div class="mt-3 pt-3 border-t border-gray-200">
                        <a href="../pages/notifications.html" class="text-sm text-blue-600 hover:text-blue-800">مشاهده همه اعلان‌ها</a>
                    </div>
                </div>
            </div>
        `;

        const notificationBtn = document.getElementById('notificationBtn');
        notificationBtn.style.position = 'relative';
        notificationBtn.insertAdjacentHTML('afterend', notificationHTML);

        // Close notification dropdown after 5 seconds
        setTimeout(() => {
            const dropdown = document.getElementById('notificationDropdown');
            if (dropdown) dropdown.remove();
        }, 5000);
    }

    updateUserInfo(userInfo) {
        const userName = document.getElementById('userName');
        if (userName && userInfo.name) {
            userName.textContent = userInfo.name;
        }
    }
}

// Initialize Navigation
let navigationManager;
document.addEventListener('DOMContentLoaded', function() {
    navigationManager = new NavigationManager();
});

// Make globally accessible
window.navigationManager = navigationManager;
