// Partner Management System
class PartnerManager {
    constructor() {
        this.partners = [];
        this.currentPartner = null;
        this.init();
    }

    async init() {
        console.log('🤝 Partner Management System initializing...');
        this.loadMockPartners();
        this.setupEventListeners();
        this.renderPartners();
        this.updateStatistics();
    }

    loadMockPartners() {
        this.partners = [
            {
                id: 'PART001',
                name: 'احمد رضایی',
                phone: '+971501234567',
                email: 'ahmad@example.com',
                nationalId: '1234567890',
                commissionRate: 0.5, // 0.5% کمیسیون
                discountRate: 2.0, // 2% تخفیف از نرخ مشتری
                status: 'active',
                joinDate: '2024-01-15',
                totalTransactions: 245,
                totalVolume: 1250000,
                monthlyVolume: 85000,
                lastTransaction: '2024-02-16',
                currencies: ['AED', 'USD', 'IRR', 'EUR'],
                maxLimit: 50000,
                bankAccount: 'ADCB - 1234567890'
            },
            {
                id: 'PART002',
                name: 'فاطمه محمدی',
                phone: '+971502345678',
                email: 'fateme@example.com',
                nationalId: '0987654321',
                commissionRate: 0.3,
                discountRate: 1.5,
                status: 'active',
                joinDate: '2024-01-20',
                totalTransactions: 189,
                totalVolume: 980000,
                monthlyVolume: 62000,
                lastTransaction: '2024-02-15',
                currencies: ['AED', 'USD', 'IRR'],
                maxLimit: 30000,
                bankAccount: 'ENBD - 0987654321'
            },
            {
                id: 'PART003',
                name: 'علی احمدی',
                phone: '+971503456789',
                email: 'ali@example.com',
                nationalId: '5678901234',
                commissionRate: 0.7,
                discountRate: 2.5,
                status: 'pending',
                joinDate: '2024-02-10',
                totalTransactions: 45,
                totalVolume: 230000,
                monthlyVolume: 23000,
                lastTransaction: '2024-02-14',
                currencies: ['AED', 'IRR'],
                maxLimit: 20000,
                bankAccount: 'CBD - 5678901234'
            }
        ];
    }

    setupEventListeners() {
        // فرم اضافه کردن همکار جدید
        const addPartnerForm = document.getElementById('addPartnerForm');
        if (addPartnerForm) {
            addPartnerForm.addEventListener('submit', (e) => this.handleAddPartner(e));
        }

        // جستجو و فیلتر
        const searchInput = document.getElementById('partnerSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => this.handleFilterChange());
        }
    }

    renderPartners(partnersToRender = this.partners) {
        const tbody = document.getElementById('partnersTable');
        if (!tbody) return;

        tbody.innerHTML = partnersToRender.map(partner => `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                    <div class="flex items-center space-x-3">
                        <div class="bg-blue-100 rounded-full p-2">
                            <i class="fas fa-user text-blue-600"></i>
                        </div>
                        <div>
                            <div class="font-medium text-gray-900">${partner.name}</div>
                            <div class="text-sm text-gray-500">${partner.phone}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs rounded-full font-semibold ${
                        partner.status === 'active' ? 'bg-green-100 text-green-800' : 
                        partner.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                    }">
                        ${this.getStatusText(partner.status)}
                    </span>
                </td>
                <td class="px-6 py-4 font-medium">%${partner.discountRate}</td>
                <td class="px-6 py-4 font-medium">%${partner.commissionRate}</td>
                <td class="px-6 py-4">${this.formatCurrency(partner.monthlyVolume)}</td>
                <td class="px-6 py-4">${partner.totalTransactions}</td>
                <td class="px-6 py-4">
                    <div class="flex space-x-2">
                        <button onclick="partnerManager.viewPartner('${partner.id}')" 
                                class="text-blue-600 hover:text-blue-800 text-sm">
                            <i class="fas fa-eye"></i> مشاهده
                        </button>
                        <button onclick="partnerManager.editPartner('${partner.id}')" 
                                class="text-green-600 hover:text-green-800 text-sm">
                            <i class="fas fa-edit"></i> ویرایش
                        </button>
                        <button onclick="partnerManager.togglePartnerStatus('${partner.id}')" 
                                class="text-orange-600 hover:text-orange-800 text-sm">
                            <i class="fas fa-toggle-on"></i> تغییر وضعیت
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateStatistics() {
        const activePartners = this.partners.filter(p => p.status === 'active').length;
        const pendingPartners = this.partners.filter(p => p.status === 'pending').length;
        const totalVolume = this.partners.reduce((sum, p) => sum + p.monthlyVolume, 0);
        const avgCommission = this.partners.reduce((sum, p) => sum + p.commissionRate, 0) / this.partners.length;

        if (document.getElementById('activePartnersCount')) {
            document.getElementById('activePartnersCount').textContent = activePartners;
        }
        if (document.getElementById('pendingPartnersCount')) {
            document.getElementById('pendingPartnersCount').textContent = pendingPartners;
        }
        if (document.getElementById('totalPartnersVolume')) {
            document.getElementById('totalPartnersVolume').textContent = this.formatCurrency(totalVolume);
        }
        if (document.getElementById('avgCommissionRate')) {
            document.getElementById('avgCommissionRate').textContent = `%${avgCommission.toFixed(1)}`;
        }
    }

    async handleAddPartner(e) {
        e.preventDefault();
        
        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<div class="spinner"></div>در حال ذخیره...';
        btn.disabled = true;

        try {
            const formData = new FormData(form);
            const newPartner = {
                id: 'PART' + String(this.partners.length + 1).padStart(3, '0'),
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                nationalId: formData.get('nationalId'),
                commissionRate: parseFloat(formData.get('commissionRate')),
                discountRate: parseFloat(formData.get('discountRate')),
                maxLimit: parseInt(formData.get('maxLimit')),
                bankAccount: formData.get('bankAccount'),
                status: 'pending',
                joinDate: new Date().toISOString().split('T')[0],
                totalTransactions: 0,
                totalVolume: 0,
                monthlyVolume: 0,
                lastTransaction: null,
                currencies: ['AED', 'USD', 'IRR']
            };

            // شبیه‌سازی API call
            await this.delay(2000);

            this.partners.push(newPartner);
            this.renderPartners();
            this.updateStatistics();
            form.reset();
            
            this.showNotification('✅ همکار جدید با موفقیت اضافه شد!', 'success');

        } catch (error) {
            this.showNotification('❌ خطا در اضافه کردن همکار', 'error');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    viewPartner(partnerId) {
        const partner = this.partners.find(p => p.id === partnerId);
        if (!partner) return;

        // نمایش جزئیات همکار در modal
        this.showPartnerDetails(partner);
    }

    showPartnerDetails(partner) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold">جزئیات همکار</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">نام همکار</label>
                            <p class="mt-1 text-sm text-gray-900">${partner.name}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">شماره تلفن</label>
                            <p class="mt-1 text-sm text-gray-900">${partner.phone}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">ایمیل</label>
                            <p class="mt-1 text-sm text-gray-900">${partner.email}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">کد ملی</label>
                            <p class="mt-1 text-sm text-gray-900">${partner.nationalId}</p>
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">نرخ تخفیف</label>
                            <p class="mt-1 text-sm text-gray-900 font-semibold text-green-600">%${partner.discountRate}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">نرخ کمیسیون</label>
                            <p class="mt-1 text-sm text-gray-900 font-semibold text-blue-600">%${partner.commissionRate}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">حد مجاز معامله</label>
                            <p class="mt-1 text-sm text-gray-900">${this.formatCurrency(partner.maxLimit)}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">حساب بانکی</label>
                            <p class="mt-1 text-sm text-gray-900">${partner.bankAccount}</p>
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 pt-6 border-t border-gray-200">
                    <h3 class="font-medium text-gray-900 mb-4">آمار عملکرد</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <div class="text-sm text-blue-600">کل تراکنش‌ها</div>
                            <div class="text-xl font-bold text-blue-800">${partner.totalTransactions}</div>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg">
                            <div class="text-sm text-green-600">حجم ماهانه</div>
                            <div class="text-xl font-bold text-green-800">${this.formatCurrency(partner.monthlyVolume)}</div>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <div class="text-sm text-purple-600">کل حجم</div>
                            <div class="text-xl font-bold text-purple-800">${this.formatCurrency(partner.totalVolume)}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    editPartner(partnerId) {
        const partner = this.partners.find(p => p.id === partnerId);
        if (!partner) return;

        // پر کردن فرم با اطلاعات همکار
        if (document.getElementById('partnerName')) {
            document.getElementById('partnerName').value = partner.name;
        }
        if (document.getElementById('partnerPhone')) {
            document.getElementById('partnerPhone').value = partner.phone;
        }
        if (document.getElementById('partnerEmail')) {
            document.getElementById('partnerEmail').value = partner.email;
        }
        if (document.getElementById('partnerNationalId')) {
            document.getElementById('partnerNationalId').value = partner.nationalId;
        }
        if (document.getElementById('discountRate')) {
            document.getElementById('discountRate').value = partner.discountRate;
        }
        if (document.getElementById('commissionRate')) {
            document.getElementById('commissionRate').value = partner.commissionRate;
        }
        if (document.getElementById('maxLimit')) {
            document.getElementById('maxLimit').value = partner.maxLimit;
        }
        if (document.getElementById('bankAccount')) {
            document.getElementById('bankAccount').value = partner.bankAccount;
        }

        // تغییر عنوان فرم
        const formTitle = document.querySelector('#addPartnerForm h3');
        if (formTitle) {
            formTitle.textContent = 'ویرایش همکار';
        }
        
        this.currentPartner = partnerId;
    }

    togglePartnerStatus(partnerId) {
        const partner = this.partners.find(p => p.id === partnerId);
        if (!partner) return;

        const newStatus = partner.status === 'active' ? 'inactive' : 'active';
        partner.status = newStatus;
        
        this.renderPartners();
        this.updateStatistics();
        
        this.showNotification(`وضعیت همکار ${partner.name} به ${this.getStatusText(newStatus)} تغییر یافت`, 'info');
    }

    handleSearch(query) {
        const filtered = this.partners.filter(partner =>
            partner.name.includes(query) ||
            partner.phone.includes(query) ||
            partner.email.includes(query)
        );
        this.renderPartners(filtered);
    }

    handleFilterChange() {
        const statusSelect = document.getElementById('statusFilter');
        if (!statusSelect) return;
        
        const status = statusSelect.value;
        const filtered = status ? this.partners.filter(p => p.status === status) : this.partners;
        this.renderPartners(filtered);
    }

    getStatusText(status) {
        const statusMap = {
            'active': 'فعال',
            'inactive': 'غیرفعال',
            'pending': 'در انتظار تأیید',
            'suspended': 'تعلیق شده'
        };
        return statusMap[status] || status;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('fa-IR').format(amount) + ' درهم';
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

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when page loads
let partnerManager;
document.addEventListener('DOMContentLoaded', () => {
    partnerManager = new PartnerManager();
});