cat > public/js/tenant.js << 'TENANT_COMPLETE_END'
// Tenant Dashboard Application
class TenantDashboard {
    constructor() {
        this.tenantId = this.getTenantFromUrl();
        this.currentSection = 'overview';
        this.charts = {};
        this.init();
    }

    getTenantFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('tenant') || 'global-exchange';
    }

    async init() {
        console.log(`🏢 Loading tenant dashboard for: ${this.tenantId}`);
        
        // Wait for language manager
        if (window.languageManager) {
            await this.delay(500);
        }
        
        this.loadTenantData();
        this.setupNavigation();
        this.setupCharts();
        this.loadTransactions();
        this.loadCustomers();
        this.startRealTimeUpdates();
    }

    loadTenantData() {
        // Mock tenant data
        this.tenantData = {
            'global-exchange': {
                name: 'Global Exchange LLC',
                subdomain: 'global-exchange',
                country: 'AE',
                stats: {
                    totalCustomers: 15420,
                    todayTransactions: 1247,
                    totalVolume: 2800000,
                    pendingRemittances: 47
                }
            },
            'fast-money': {
                name: 'Fast Money Transfer',
                subdomain: 'fast-money',
                country: 'SA',
                stats: {
                    totalCustomers: 8960,
                    todayTransactions: 856,
                    totalVolume: 1560000,
                    pendingRemittances: 23
                }
            }
        };

        const tenant = this.tenantData[this.tenantId] || this.tenantData['global-exchange'];
        document.getElementById('tenantName').textContent = tenant.name;
        this.updateStats(tenant.stats);
    }

    updateStats(stats) {
        document.getElementById('totalCustomers').textContent = 
            new Intl.NumberFormat().format(stats.totalCustomers);
        document.getElementById('todayTransactions').textContent = 
            new Intl.NumberFormat().format(stats.todayTransactions);
        document.getElementById('totalVolume').textContent = 
            '$' + (stats.totalVolume / 1000000).toFixed(1) + 'M';
        document.getElementById('pendingRemittances').textContent = 
            stats.pendingRemittances.toString();
    }

    setupNavigation() {
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const section = tab.getAttribute('data-section');
                this.showSection(section);
                
                // Update active tab
                navTabs.forEach(t => {
                    t.classList.remove('active', 'border-blue-600', 'text-blue-600');
                    t.classList.add('border-transparent', 'text-gray-500');
                });
                tab.classList.add('active', 'border-blue-600', 'text-blue-600');
                tab.classList.remove('border-transparent', 'text-gray-500');
            });
        });
    }

    showSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.section-content');
        sections.forEach(section => section.classList.remove('active'));

        // Show selected section
        const targetSection = document.getElementById(sectionName + 'Section');
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        // Update navigation
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            const tabSection = tab.getAttribute('data-section');
            if (tabSection === sectionName) {
                tab.classList.add('active', 'border-blue-600', 'text-blue-600');
                tab.classList.remove('border-transparent', 'text-gray-500');
            } else {
                tab.classList.remove('active', 'border-blue-600', 'text-blue-600');
                tab.classList.add('border-transparent', 'text-gray-500');
            }
        });
    }

    setupCharts() {
        // Wait a bit for elements to be ready
        setTimeout(() => {
            this.setupTransactionsChart();
            this.setupRevenueChart();
        }, 100);
    }

    setupTransactionsChart() {
        const ctx = document.getElementById('transactionsChart');
        if (!ctx) return;

        this.charts.transactions = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Transactions',
                    data: [1200, 1350, 1180, 1420, 1380, 1560, 1247],
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f3f4f6'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    setupRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        this.charts.revenue = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Revenue ($)',
                    data: [680000, 720000, 650000, 750000],
                    backgroundColor: [
                        '#10B981',
                        '#059669',
                        '#047857',
                        '#065F46'
                    ],
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f3f4f6'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    loadTransactions() {
        const tbody = document.getElementById('transactionsTable');
        if (!tbody) return;

        // Mock transactions
        const transactions = [
            {
                id: 'TXN001',
                customer: 'Ahmed Mohammed',
                type: 'Currency Exchange',
                amount: 'USD 1,500 → AED 5,520',
                status: 'completed',
                timestamp: new Date(Date.now() - 300000) // 5 minutes ago
            },
            {
                id: 'TXN002',
                customer: 'Sarah Ali',
                type: 'Remittance',
                amount: 'AED 2,000 → INR',
                status: 'processing',
                timestamp: new Date(Date.now() - 600000) // 10 minutes ago
            },
            {
                id: 'TXN003',
                customer: 'Mohammed Hassan',
                type: 'Money Transfer',
                amount: 'USD 750',
                status: 'pending',
                timestamp: new Date(Date.now() - 900000) // 15 minutes ago
            },
            {
                id: 'TXN004',
                customer: 'Fatima Khan',
                type: 'Currency Exchange',
                amount: 'EUR 800 → USD 850',
                status: 'completed',
                timestamp: new Date(Date.now() - 1200000) // 20 minutes ago
            },
            {
                id: 'TXN005',
                customer: 'Ali Reza',
                type: 'Remittance',
                amount: 'USD 1,200 → IRR',
                status: 'processing',
                timestamp: new Date(Date.now() - 1500000) // 25 minutes ago
            }
        ];

        tbody.innerHTML = '';
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors';
            row.innerHTML = `
                <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">${this.formatDateTime(transaction.timestamp)}</div>
                    <div class="text-sm text-gray-500">${transaction.id}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">${transaction.customer}</div>
                </td>
                <td class="px-6 py-4">
                    <span class="text-sm text-gray-600">${transaction.type}</span>
                </td>
                <td class="px-6 py-4 font-medium">
                    ${transaction.amount}
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs rounded-full ${this.getStatusColor(transaction.status)}">
                        ${this.getStatusText(transaction.status)}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="flex space-x-2">
                        <button onclick="viewTransaction('${transaction.id}')" 
                                class="text-blue-600 hover:text-blue-800 p-1" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="printTransaction('${transaction.id}')" 
                                class="text-green-600 hover:text-green-800 p-1" title="Print">
                            <i class="fas fa-print"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    loadCustomers() {
        const tbody = document.getElementById('customersTable');
        if (!tbody) return;

        // Mock customers
        const customers = [
            {
                id: 'CUST001',
                name: 'Ahmed Mohammed',
                phone: '+971501234567',
                country: 'AE',
                balance: 15420,
                status: 'active'
            },
            {
                id: 'CUST002',
                name: 'Sarah Ali',
                phone: '+966501234567',
                country: 'SA',
                balance: 8900,
                status: 'active'
            },
            {
                id: 'CUST003',
                name: 'Mohammed Hassan',
                phone: '+98901234567',
                country: 'IR',
                balance: 12340,
                status: 'pending'
            },
            {
                id: 'CUST004',
                name: 'Fatima Khan',
                phone: '+905401234567',
                country: 'TR',
                balance: 6780,
                status: 'active'
            },
            {
                id: 'CUST005',
                name: 'Li Wei',
                phone: '+8613912345678',
                country: 'CN',
                balance: 23450,
                status: 'active'
            }
        ];

        tbody.innerHTML = '';
        customers.forEach(customer => {
            const flagEmojis = {
                'AE': '🇦🇪',
                'SA': '🇸🇦',
                'IR': '🇮🇷',
                'TR': '🇹🇷',
                'CN': '🇨🇳'
            };

            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors';
            row.innerHTML = `
                <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">${customer.name}</div>
                    <div class="text-sm text-gray-500">${customer.id}</div>
                </td>
                <td class="px-6 py-4">
                    <span class="text-sm text-gray-600">${customer.phone}</span>
                </td>
                <td class="px-6 py-4">
                    <span class="text-lg">${flagEmojis[customer.country]} ${customer.country}</span>
                </td>
                <td class="px-6 py-4 font-medium text-green-600">
                    $${new Intl.NumberFormat().format(customer.balance)}
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs rounded-full ${this.getStatusColor(customer.status)}">
                        ${this.getStatusText(customer.status)}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="flex space-x-2">
                        <button onclick="viewCustomer('${customer.id}')" 
                                class="text-blue-600 hover:text-blue-800 p-1" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="editCustomer('${customer.id}')" 
                                class="text-green-600 hover:text-green-800 p-1" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="suspendCustomer('${customer.id}')" 
                                class="text-red-600 hover:text-red-800 p-1" title="Suspend">
                            <i class="fas fa-ban"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    refreshTransactions() {
        console.log('🔄 Refreshing transactions...');
        this.showMessage('✅ Transactions refreshed!', 'success');
        this.loadTransactions();
    }

    startRealTimeUpdates() {
        // Update data every 30 seconds
        setInterval(() => {
            this.updateRealTimeData();
        }, 30000);
    }

    updateRealTimeData() {
        // Mock real-time updates
        const stats = this.tenantData[this.tenantId]?.stats;
        if (stats) {
            stats.todayTransactions += Math.floor(Math.random() * 5);
            stats.totalVolume += Math.floor(Math.random() * 10000);
            this.updateStats(stats);
        }
    }

    formatDateTime(date) {
        const formatDate = window.languageManager ? 
            (d) => window.languageManager.formatDate(d) :
            (d) => d.toLocaleDateString();
            
        return formatDate(date) + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    getStatusColor(status) {
        const colors = {
            'active': 'bg-green-100 text-green-800',
            'completed': 'bg-green-100 text-green-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'processing': 'bg-blue-100 text-blue-800',
            'suspended': 'bg-red-100 text-red-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    getStatusText(status) {
        // Use translation if available
        if (window.languageManager) {
            return window.languageManager.translate('status.' + status) || status;
        }
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    showMessage(text, type) {
        const notification = document.createElement('div');
        notification.className = `${type}-message fixed top-4 right-4 z-50 fade-in max-w-md`;
        notification.innerHTML = `
            <div class="flex justify-between items-start">
                <div>${text}</div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) notification.remove();
        }, 4000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global functions for button clicks
function viewTransaction(id) {
    console.log('View transaction:', id);
    tenantDashboard.showMessage(`👁 Viewing transaction ${id}`, 'info');
}

function printTransaction(id) {
    console.log('Print transaction:', id);
    tenantDashboard.showMessage(`🖨 Printing transaction ${id}`, 'info');
}

function viewCustomer(id) {
    console.log('View customer:', id);
    tenantDashboard.showMessage(`👁 Viewing customer ${id}`, 'info');
}

function editCustomer(id) {
    console.log('Edit customer:', id);
    tenantDashboard.showMessage(`✏ Editing customer ${id}`, 'info');
}

function suspendCustomer(id) {
    console.log('Suspend customer:', id);
    tenantDashboard.showMessage(`⛔ Customer ${id} suspended`, 'warning');
}

// Initialize when page loads
let tenantDashboard;
document.addEventListener('DOMContentLoaded', () => {
    tenantDashboard = new TenantDashboard();
});
TENANT_COMPLETE_END