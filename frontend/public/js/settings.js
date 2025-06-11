// Settings Management System - Clean Implementation
class SettingsManager {
    constructor() {
        this.currentTab = 'general';
        this.settings = {};
        this.init();
    }

    async init() {
        console.log('⚙️ Settings Manager initializing...');
        
        await this.waitForAuth();
        
        this.loadDefaultSettings();
        this.setupEventListeners();
        this.loadSettings();
        
        console.log('✅ Settings Manager initialized successfully');
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

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Save all settings
        const saveBtn = document.getElementById('saveAllSettings');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveAllSettings());
        }

        // Export settings
        const exportBtn = document.getElementById('exportSettings');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportSettings());
        }

        // Backup buttons
        const createBackupBtn = document.getElementById('createBackup');
        const restoreBackupBtn = document.getElementById('restoreBackup');
        
        if (createBackupBtn) {
            createBackupBtn.addEventListener('click', () => this.createBackup());
        }
        
        if (restoreBackupBtn) {
            restoreBackupBtn.addEventListener('click', () => this.restoreBackup());
        }

        // Auto-save on input change
        this.setupAutoSave();
    }

    switchTab(tabName) {
        // Remove active class from all tabs
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Hide all content
        document.querySelectorAll('.settings-content').forEach(content => {
            content.classList.remove('active');
        });

        // Activate selected tab
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        const selectedContent = document.getElementById(`${tabName}Tab`);

        if (selectedTab && selectedContent) {
            selectedTab.classList.add('active');
            selectedContent.classList.add('active');
            this.currentTab = tabName;
        }
    }

    loadDefaultSettings() {
        this.settings = {
            general: {
                companyName: 'صرافی پیشرو',
                companyAddress: 'دبی، امارات متحده عربی',
                companyPhone: '+971-4-1234567',
                companyEmail: 'info@exchange.ae',
                defaultLanguage: 'fa',
                baseCurrency: 'AED',
                timezone: 'Asia/Dubai'
            },
            security: {
                forcePasswordChange: false,
                passwordExpiry: 90,
                enable2FA: true,
                sessionTimeout: 60,
                autoLogout: true
            },
            notifications: {
                emailNewTransactions: true,
                emailSecurity: true,
                smsHighValue: true,
                smsVerification: true
            },
            rates: {
                autoRateUpdate: true,
                updateInterval: 5,
                defaultMargin: 2.5
            },
            limits: {
                dailyLimit: 100000,
                monthlyLimit: 1000000,
                maxUsers: 50
            },
            backup: {
                autoBackup: true,
                backupInterval: 24
            }
        };
    }

    loadSettings() {
        // Load settings from localStorage or API
        const savedSettings = localStorage.getItem('exchangeSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }

        // Apply settings to form elements
        this.applySettingsToForm();
    }

    applySettingsToForm() {
        Object.keys(this.settings).forEach(category => {
            Object.keys(this.settings[category]).forEach(setting => {
                const element = document.getElementById(setting);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = this.settings[category][setting];
                    } else {
                        element.value = this.settings[category][setting];
                    }
                }
            });
        });
    }

    setupAutoSave() {
        // Auto-save when inputs change
        document.querySelectorAll('input, select, textarea').forEach(element => {
            element.addEventListener('change', () => {
                this.saveCurrentTabSettings();
            });
        });
    }

    saveCurrentTabSettings() {
        const currentTabElement = document.getElementById(`${this.currentTab}Tab`);
        if (!currentTabElement) return;

        const inputs = currentTabElement.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            const settingName = input.id;
            if (settingName && this.settings[this.currentTab]) {
                if (input.type === 'checkbox') {
                    this.settings[this.currentTab][settingName] = input.checked;
                } else {
                    this.settings[this.currentTab][settingName] = input.value;
                }
            }
        });

        // Save to localStorage
        localStorage.setItem('exchangeSettings', JSON.stringify(this.settings));
    }

    async saveAllSettings() {
        try {
            this.showToast('در حال ذخیره تنظیمات...', 'info');

            // Save all tabs
            ['general', 'security', 'notifications', 'rates', 'limits', 'backup'].forEach(tab => {
                this.currentTab = tab;
                this.saveCurrentTabSettings();
            });

            // Simulate API call
            await this.delay(1500);

            // Save to localStorage
            localStorage.setItem('exchangeSettings', JSON.stringify(this.settings));

            this.showToast('تمام تنظیمات با موفقیت ذخیره شد!', 'success');
            
        } catch (error) {
            this.showToast('خطا در ذخیره تنظیمات', 'error');
        }
    }

    exportSettings() {
        const data = {
            settings: this.settings,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exchange_settings_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('تنظیمات با موفقیت صادر شد', 'success');
    }

    async createBackup() {
        try {
            this.showToast('در حال ایجاد پشتیبان...', 'info');

            // Simulate backup creation
            await this.delay(2000);

            const backupData = {
                settings: this.settings,
                transactions: [], // Would be loaded from actual data
                customers: [], // Would be loaded from actual data
                rates: {}, // Would be loaded from actual data
                backupDate: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `exchange_backup_${new Date().toISOString().split('T')[0]}.backup`;
            a.click();
            URL.revokeObjectURL(url);

            this.showToast('پشتیبان با موفقیت ایجاد شد!', 'success');

        } catch (error) {
            this.showToast('خطا در ایجاد پشتیبان', 'error');
        }
    }

    async restoreBackup() {
        const fileInput = document.getElementById('restoreFile');
        const file = fileInput.files[0];

        if (!file) {
            this.showToast('لطفاً فایل پشتیبان را انتخاب کنید', 'error');
            return;
        }

        try {
            this.showToast('در حال بازیابی اطلاعات...', 'info');

            const text = await file.text();
            const backupData = JSON.parse(text);

            if (backupData.settings) {
                this.settings = backupData.settings;
                this.applySettingsToForm();
                localStorage.setItem('exchangeSettings', JSON.stringify(this.settings));

                this.showToast('اطلاعات با موفقیت بازیابی شد!', 'success');
            } else {
                throw new Error('Invalid backup file');
            }

        } catch (error) {
            this.showToast('خطا در بازیابی اطلاعات - فایل نامعتبر', 'error');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = document.getElementById('toastIcon');
        
        if (!toast || !toastMessage || !toastIcon) return;

        toastMessage.textContent = message;
        
        const configs = {
            success: { icon: 'fas fa-check-circle text-green-600', border: 'border-r-green-500' },
            error: { icon: 'fas fa-exclamation-circle text-red-600', border: 'border-r-red-500' },
            info: { icon: 'fas fa-info-circle text-blue-600', border: 'border-r-blue-500' }
        };
        
        const config = configs[type] || configs.info;
        toastIcon.innerHTML = `<i class="${config.icon}"></i>`;
        toast.firstElementChild.className = `bg-white rounded-lg shadow-lg ${config.border} border-r-4 p-4 max-w-sm`;
        
        toast.style.transform = 'translateX(0)';
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
        }, 5000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize Settings Manager
let settingsManager;
document.addEventListener('DOMContentLoaded', function() {
    settingsManager = new SettingsManager();
});

// Make globally accessible
window.settingsManager = settingsManager;