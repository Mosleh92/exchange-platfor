
// Main Application
class ExchangePlatform {
    constructor() {
        this.exchangers = [];
        this.charts = {};
        this.init();
    }

    async init() {
        console.log('🏦 Exchange Platform initializing...');
        
        // Wait for language manager to load
        if (window.languageManager) {
            await this.delay(500);
        }
        
        this.loadData();
        this.setupEventListeners();
        this.loadExchangers();
        
        // Setup charts after DOM is ready
        setTimeout(() => {
            this.setupCharts();
        }, 1000);
        
        this.startRealTimeUpdates();
    }

    loadData() {
        // Mock platform data
        this.platformData = {
            totalExchangers: 2847,
            totalCustomers: 1800000,
            monthlyRevenue: 14200000,
            annualRevenue: 142000000,
            growthRates: {
                exchangers: 12,
                customers: 8,
                revenue: 23
            }
        };

        this.updateStatistics();
    }

    updateStatistics() {
        // Update with currency formatting based on current language
        const formatCurrency = window.languageManager ? 
            (amount, currency) => window.languageManager.formatCurrency(amount, currency) :
            (amount, currency) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);

        document.getElementById('totalExchangers').textContent = 
            new Intl.NumberFormat().format(this.platformData.totalExchangers);
        
        document.getElementById('totalCustomers').textContent = 
            (this.platformData.totalCustomers / 1000000).toFixed(1) + 'M';
        
        document.getElementById('monthlyRevenue').textContent = 
            '$' + (this.platformData.monthlyRevenue / 1000000).toFixed(1) + 'M';
        
        document.getElementById('annualRevenue').textContent = 
            '$' + (this.platformData.annualRevenue / 1000000).toFixed(0) + 'M';
    }

    setupCharts() {
        console.log('📊 Setting up charts...');
        this.setupRevenueChart();
        this.setupCustomerChart();
    }

    setupRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) {
            console.log('❌ Revenue chart canvas not found');
            return;
        }

        // Destroy existing chart if it exists
        if (this.charts.revenue) {
            this.charts.revenue.destroy();
        }

        try {
            this.charts.revenue = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Revenue (Millions USD)',
                        data: [8.2, 9.1, 10.5, 11.8, 12.3, 13.1, 14.2, 15.8, 16.9, 18.2, 19.5, 20.8],
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#3B82F6',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#f3f4f6'
                            },
                            ticks: {
                                callback: function(value) {
                                    return '$' + value + 'M';
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    }
                }
            });
            console.log('✅ Revenue chart created successfully');
        } catch (error) {
            console.error('❌ Error creating revenue chart:', error);
        }
    }

    setupCustomerChart() {
        const ctx = document.getElementById('customerChart');
        if (!ctx) {
            console.log('❌ Customer chart canvas not found');
            return;
        }

        // Destroy existing chart if it exists
        if (this.charts.customer) {
            this.charts.customer.destroy();
        }

        try {
            this.charts.customer = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
                    datasets: [{
                        label: 'New Customers (Thousands)',
                        data: [420, 380, 450, 550],
                        backgroundColor: [
                            '#10B981',
                            '#059669',
                            '#047857',
                            '#065F46'
                        ],
                        borderRadius: 8,
                        borderSkipped: false,
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.parsed.y + 'K customers';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#f3f4f6'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value + 'K';
                                }
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
            console.log('✅ Customer chart created successfully');
        } catch (error) {
            console.error('❌ Error creating customer chart:', error);
        }
    }

    setupEventListeners() {
        // Create Exchanger Form
        const form = document.getElementById('createExchangerForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleCreateExchanger(e));
        }

        // Real-time updates
        setInterval(() => this.updateRealTimeData(), 30000); // Every 30 seconds
    }

    loadExchangers() {
        // Mock exchangers data
        this.exchangers = [
            {
                id: 'EXC001',
                company: 'Global Exchange LLC',
                subdomain: 'global-exchange',
                country: 'AE',
                status: 'active',
                customers: 15420,
                revenue: 284500,
                joinDate: '2024-01-15'
            },
            {
                id: 'EXC002',
                company: 'Fast Money Transfer',
                subdomain: 'fast-money',
                country: 'SA',
                status: 'active',
                customers: 8960,
                revenue: 156800,
                joinDate: '2024-01-20'
            },
            {
                id: 'EXC003',
                company: 'Tehran Exchange Co',
                subdomain: 'tehran-exchange',
                country: 'IR',
                status: 'pending',
                customers: 12340,
                revenue: 198700,
                joinDate: '2024-02-01'
            },
            {
                id: 'EXC004',
                company: 'Istanbul Money Services',
                subdomain: 'istanbul-money',
                country: 'TR',
                status: 'active',
                customers: 6780,
                revenue: 89500,
                joinDate: '2024-02-05'
            },
            {
                id: 'EXC005',
                company: 'Shanghai Currency Hub',
                subdomain: 'shanghai-currency',
                country: 'CN',
                status: 'active',
                customers: 23450,
                revenue: 345600,
                joinDate: '2024-02-10'
            }
        ];

        this.renderExchangersTable();
    }

    renderExchangersTable() {
        const tbody = document.getElementById('exchangersTable');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.exchangers.forEach(exchanger => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors';
            
            const flagEmojis = {
                'AE': '🇦🇪',
                'SA': '🇸🇦',
                'IR': '🇮🇷',
                'TR': '🇹🇷',
                'CN': '🇨🇳',
                'IN': '🇮🇳',
                'PK': '🇵🇰',
                'BD': '🇧🇩'
            };

            row.innerHTML = `
                <td class="px-6 py-4">
                    <div>
                        <div class="font-medium text-gray-900">${exchanger.company}</div>
                        <div class="text-sm text-gray-500">ID: ${exchanger.id}</div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">${exchanger.subdomain}</span>
                </td>
                <td class="px-6 py-4">
                    <span class="text-lg">${flagEmojis[exchanger.country]} ${exchanger.country}</span>
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs rounded-full ${this.getStatusColor(exchanger.status)}">
                        ${this.getStatusText(exchanger.status)}
                    </span>
                </td>
                <td class="px-6 py-4 font-medium">
                    ${new Intl.NumberFormat().format(exchanger.customers)}
                </td>
                <td class="px-6 py-4 font-medium text-green-600">
                    $${new Intl.NumberFormat().format(exchanger.revenue)}
                </td>
                <td class="px-6 py-4">
                    <div class="flex space-x-2">
                        <button onclick="viewExchanger('${exchanger.id}')" 
                                class="text-blue-600 hover:text-blue-800 p-1" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="editExchanger('${exchanger.id}')" 
                                class="text-green-600 hover:text-green-800 p-1" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteExchanger('${exchanger.id}')" 
                                class="text-red-600 hover:text-red-800 p-1" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

            tbody.appendChild(row);
        });
    }

    getStatusColor(status) {
        const colors = {
            'active': 'bg-green-100 text-green-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'suspended': 'bg-red-100 text-red-800',
            'maintenance': 'bg-blue-100 text-blue-800'
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

    async handleCreateExchanger(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        // Show loading
        btn.innerHTML = '<div class="spinner"></div>Creating...';
        btn.disabled = true;

        try {
            // Simulate API call
            await this.delay(2000);

            // Create new exchanger
            const newExchanger = {
                id: 'EXC' + (this.exchangers.length + 1).toString().padStart(3, '0'),
                company: form.querySelector('input[placeholder*="ABC"]').value,
                subdomain: form.querySelector('input[placeholder*="abc"]').value,
                country: form.querySelector('select').value,
                status: 'pending',
                customers: 0,
                revenue: 0,
                joinDate: new Date().toISOString().split('T')[0]
            };

            this.exchangers.unshift(newExchanger);
            this.renderExchangersTable();
            
            // Update stats
            this.platformData.totalExchangers++;
            this.updateStatistics();

            // Show success message
            this.showMessage('✅ New exchanger created successfully!', 'success');
            
            // Hide modal and reset form
            this.hideCreateExchangerModal();
            form.reset();

        } catch (error) {
            this.showMessage('❌ Error creating exchanger. Please try again.', 'error');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    showCreateExchangerModal() {
        document.getElementById('createExchangerModal').classList.remove('hidden');
    }

    hideCreateExchangerModal() {
        document.getElementById('createExchangerModal').classList.add('hidden');
    }

    refreshExchangers() {
        this.showMessage('🔄 Refreshing data...', 'info');
        setTimeout(() => {
            this.loadExchangers();
            this.showMessage('✅ Data refreshed successfully!', 'success');
        }, 1000);
    }

    generateReports() {
        this.showMessage('📊 Generating reports...', 'info');
        setTimeout(() => {
            this.showMessage('✅ Reports generated! Check your downloads.', 'success');
        }, 2000);
    }

    updateRealTimeData() {
        // Simulate real-time updates
        const randomUpdate = Math.floor(Math.random() * 100);
        
        // Update some stats randomly
        if (randomUpdate > 50) {
            this.platformData.totalCustomers += Math.floor(Math.random() * 10);
            this.updateStatistics();
        }
    }

    startRealTimeUpdates() {
        // Update charts periodically
        setInterval(() => {
            if (this.charts.revenue && this.charts.customer) {
                // Add some animation to charts
                this.charts.revenue.update('none');
                this.charts.customer.update('none');
            }
        }, 60000); // Every minute
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
        }, 5000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when page loads
let exchangePlatform;
document.addEventListener('DOMContentLoaded', () => {
    exchangePlatform = new ExchangePlatform();
});

// Global functions for buttons
function showCreateExchangerModal() {
    if (exchangePlatform) {
        exchangePlatform.showCreateExchangerModal();
    }
}

function hideCreateExchangerModal() {
    if (exchangePlatform) {
        exchangePlatform.hideCreateExchangerModal();
    }
}

function refreshExchangers() {
    if (exchangePlatform) {
        exchangePlatform.refreshExchangers();
    }
}

function generateReports() {
    if (exchangePlatform) {
        exchangePlatform.generateReports();
    }
}

function viewExchanger(id) {
    console.log('Viewing exchanger:', id);
    if (exchangePlatform) {
        exchangePlatform.showMessage(`👁️ Viewing details for exchanger ${id}`, 'info');
    }
}

function editExchanger(id) {
    console.log('Editing exchanger:', id);
    if (exchangePlatform) {
        exchangePlatform.showMessage(`✏️ Editing exchanger ${id}`, 'info');
    }
}

function deleteExchanger(id) {
    if (confirm('Are you sure you want to delete this exchanger?')) {
        console.log('Deleting exchanger:', id);
        if (exchangePlatform) {
            exchangePlatform.showMessage(`🗑️ Exchanger ${id} deleted`, 'error');
        }
    }
}

// Global Functions for buttons
function showCreateExchangerModal() {
    document.getElementById('createExchangerModal').classList.remove('hidden');
}

function hideCreateExchangerModal() {
    document.getElementById('createExchangerModal').classList.add('hidden');
}

function generateReports() {
    window.open('pages/reports.html', '_blank');
}

function refreshExchangers() {
    if (window.exchangePlatform) {
        window.exchangePlatform.loadExchangers();
        window.exchangePlatform.showMessage('🔄 Exchangers data refreshed!', 'success');
    }
}

function viewExchanger(id) {
    window.open(`pages/dashboard.html?tenant=${id}`, '_blank');
}

function editExchanger(id) {
    alert(`Editing exchanger: ${id}\n(Feature coming soon!)`);
}

function deleteExchanger(id) {
    if (confirm('Are you sure you want to delete this exchanger?')) {
        alert(`Exchanger ${id} would be deleted\n(Feature coming soon!)`);
    }
}
