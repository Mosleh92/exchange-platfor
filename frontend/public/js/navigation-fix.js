
// Enhanced Demo Controls with Fixed Links
function createDemoControls() {
    // Remove existing demo controls
    const existingDemo = document.getElementById('demoControls');
    if (existingDemo) {
        existingDemo.remove();
    }

    const demoControls = document.createElement('div');
    demoControls.id = 'demoControls';
    demoControls.className = 'fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border-2 border-gray-200 z-50';
    demoControls.style.width = '280px';
    
    demoControls.innerHTML = `
        <div class="mb-3">
            <h3 class="text-sm font-bold text-gray-800 mb-2">🎭 Demo Controls</h3>
            <p class="text-xs text-gray-600 mb-3">Test different user roles</p>
        </div>
        
        <div class="space-y-2">
            <button onclick="switchRole('super_admin')" class="w-full text-left px-3 py-2 rounded bg-red-100 hover:bg-red-200 text-red-800 text-sm">
                🔴 Super Admin
            </button>
            <button onclick="switchRole('exchanger_admin')" class="w-full text-left px-3 py-2 rounded bg-purple-100 hover:bg-purple-200 text-purple-800 text-sm">
                🟣 Exchanger Admin  
            </button>
            <button onclick="switchRole('manager')" class="w-full text-left px-3 py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm">
                🔵 Manager
            </button>
            <button onclick="switchRole('agent')" class="w-full text-left px-3 py-2 rounded bg-green-100 hover:bg-green-200 text-green-800 text-sm">
                🟢 Agent
            </button>
            <button onclick="switchRole('customer')" class="w-full text-left px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm">
                ⚫ Customer
            </button>
        </div>
        
        <div class="mt-4 pt-3 border-t border-gray-200">
            <div class="text-xs text-gray-600 mb-2">Quick Navigation:</div>
            <div class="grid grid-cols-2 gap-1">
                <button onclick="goToPage('dashboard.html')" class="px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded text-xs">
                    🏠 Dashboard
                </button>
                <button onclick="goToPage('tenant-management.html')" class="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 rounded text-xs">
                    🏢 Tenants
                </button>
                <button onclick="goToPage('p2p-marketplace.html')" class="px-2 py-1 bg-purple-50 hover:bg-purple-100 rounded text-xs">
                    🤝 P2P
                </button>
                <button onclick="goToPage('customer-portal.html')" class="px-2 py-1 bg-teal-50 hover:bg-teal-100 rounded text-xs">
                    👥 Customers
                </button>
            </div>
        </div>
        
        <div class="mt-3 text-center">
            <div class="text-xs text-gray-500">Current: <span id="currentRoleDisplay" class="font-semibold">${currentUser.role}</span></div>
        </div>
    `;
    
    document.body.appendChild(demoControls);
}

function switchRole(role) {
    const roles = {
        super_admin: {
            name: 'Super Admin',
            role: 'super_admin',
            permissions: {
                dashboard: true,
                tenant_management: true,
                p2p: true,
                crypto: true,
                calculator: true,
                hawala: true,
                reports: true,
                customers: true,
                settings: true
            }
        },
        exchanger_admin: {
            name: 'Exchanger Admin',
            role: 'exchanger_admin',
            permissions: {
                dashboard: true,
                tenant_management: true,
                p2p: true,
                crypto: true,
                calculator: true,
                hawala: true,
                reports: true,
                customers: true
            }
        },
        manager: {
            name: 'Manager',
            role: 'manager',
            permissions: {
                dashboard: true,
                p2p: true,
                crypto: true,
                calculator: true,
                hawala: true,
                reports: true,
                customers: true
            }
        },
        agent: {
            name: 'Agent',
            role: 'agent',
            permissions: {
                dashboard: true,
                calculator: true,
                customers: true,
                reports: false
            }
        },
        customer: {
            name: 'Customer',
            role: 'customer',
            permissions: {
                dashboard: true,
                calculator: true,
                p2p: false,
                crypto: false,
                hawala: false,
                reports: false,
                customers: false,
                tenant_management: false
            }
        }
    };
    
    currentUser = roles[role];
    
    // Update display
    document.getElementById('currentRoleDisplay').textContent = currentUser.role;
    
    // Show notification
    showNotification(`🎭 Switched to: ${currentUser.name}`, 'info');
    
    // Update interface
    setTimeout(() => {
        updateUserInterface();
        updateHeaderNavigation();
        if (typeof fixDashboardLinks === 'function') {
            fixDashboardLinks();
        }
        updateWidgetVisibility();
    }, 300);
}

function goToPage(page) {
    // نمایش notification قبل از redirect
    showNotification(`🔗 Navigating to ${page}...`, 'info');
    
    // Redirect بعد از یک تاخیر کوتاه
    setTimeout(() => {
        window.location.href = page;
    }, 500);
}

function updateWidgetVisibility() {
    // P2P Widget
    const p2pWidget = document.getElementById('p2pWidget');
    if (p2pWidget) {
        p2pWidget.style.display = hasPermission('p2p') ? 'block' : 'none';
    }
    
    // Customer Widget
    const customerWidget = document.getElementById('customerWidget');
    if (customerWidget) {
        customerWidget.style.display = (currentUser.role === 'customer') ? 'block' : 'none';
    }
    
    // Role-based elements
    const roleElements = document.querySelectorAll('[data-role-required]');
    roleElements.forEach(element => {
        const requiredRole = element.getAttribute('data-role-required');
        element.style.display = (currentUser.role === requiredRole) ? 'block' : 'none';
    });
}

// Initialize demo controls when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        createDemoControls();
    }, 1000);
});

window.switchRole = switchRole;
window.goToPage = goToPage;
window.updateWidgetVisibility = updateWidgetVisibility;
DEMO_CONTROLS_FIXED_END