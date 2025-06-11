
// Simple Demo Controls
console.log('🎭 Demo Controls loading...');

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(createDemoControls, 1000);
});

function createDemoControls() {
    console.log('🎭 Creating demo controls...');
    
    // Remove existing
    const existing = document.getElementById('demoControls');
    if (existing) existing.remove();
    
    const demo = document.createElement('div');
    demo.id = 'demoControls';
    demo.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        padding: 16px;
        width: 260px;
        z-index: 1000;
        border: 2px solid #e5e7eb;
    `;
    
    demo.innerHTML = `
        <div style="margin-bottom: 12px;">
            <h3 style="font-size: 14px; font-weight: bold; color: #374151; margin-bottom: 8px;">🎭 Demo Controls</h3>
            <p style="font-size: 12px; color: #6b7280;">Switch roles & test pages</p>
        </div>
        
        <div style="display: grid; gap: 8px; margin-bottom: 16px;">
            <button onclick="switchRole('super_admin')" style="background: #fee2e2; color: #991b1b; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; text-align: left;">
                🔴 Super Admin
            </button>
            <button onclick="switchRole('exchanger_admin')" style="background: #ede9fe; color: #6b21a8; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; text-align: left;">
                🏢 Exchanger Admin
            </button>
            <button onclick="switchRole('manager')" style="background: #dbeafe; color: #1e40af; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; text-align: left;">
                👨‍💼 Manager
            </button>
            <button onclick="switchRole('agent')" style="background: #dcfce7; color: #166534; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; text-align: left;">
                🟢 Agent
            </button>
            <button onclick="switchRole('customer')" style="background: #f3f4f6; color: #374151; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; text-align: left;">
                👤 Customer
            </button>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 12px;">
            <div style="font-size: 11px; color: #6b7280; margin-bottom: 8px;">Quick Pages:</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                <button onclick="navigateToPage('dashboard.html')" style="background: #eff6ff; color: #1e40af; border: none; padding: 6px 8px; border-radius: 4px; font-size: 10px; cursor: pointer;">
                    🏠 Dashboard
                </button>
                <button onclick="navigateToPage('tenant-management.html')" style="background: #f3e8ff; color: #6b21a8; border: none; padding: 6px 8px; border-radius: 4px; font-size: 10px; cursor: pointer;">
                    🏢 Tenants
                </button>
                <button onclick="navigateToPage('p2p-marketplace.html')" style="background: #fce7f3; color: #be185d; border: none; padding: 6px 8px; border-radius: 4px; font-size: 10px; cursor: pointer;">
                    🤝 P2P
                </button>
                <button onclick="navigateToPage('customer-portal.html')" style="background: #f0fdfa; color: #115e59; border: none; padding: 6px 8px; border-radius: 4px; font-size: 10px; cursor: pointer;">
                    👥 Customers
                </button>
            </div>
        </div>
        
        <div style="margin-top: 12px; text-align: center; font-size: 10px; color: #6b7280;">
            Role: <span id="currentRoleDisplay">${window.currentUser?.role || 'loading'}</span>
        </div>
    `;
    
    document.body.appendChild(demo);
    console.log('✅ Demo controls created');
}

// Switch role function
window.switchRole = function(role) {
    console.log(`🎭 Switching to role: ${role}`);
    
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
                customers: true
            }
        },
        customer: {
            name: 'Customer',
            role: 'customer',
            permissions: {
                dashboard: true,
                calculator: true
            }
        }
    };
    
    window.currentUser = roles[role];
    document.getElementById('currentRoleDisplay').textContent = role;
    
    if (window.showNotification) {
        window.showNotification(`Switched to: ${roles[role].name}`, 'info');
    }
    
    // Update interface if functions exist
    setTimeout(() => {
        updatePageContent();
    }, 100);
};

// Navigate to page function
window.navigateToPage = function(page) {
    console.log(`🔗 Navigating to: ${page}`);
    
    if (window.showNotification) {
        window.showNotification(`Going to ${page}...`, 'info');
    }
    
    // Correct navigation
    setTimeout(() => {
        window.location.href = page;
    }, 500);
};

// Update page content based on role
function updatePageContent() {
    console.log('🔄 Updating page content for role:', window.currentUser?.role);
    
    // Update user name displays
    const nameElements = document.querySelectorAll('#userDisplayName, #currentUserName');
    nameElements.forEach(el => {
        if (el) el.textContent = window.currentUser?.name || 'Unknown';
    });
    
    const roleElements = document.querySelectorAll('#userRoleDisplay');
    roleElements.forEach(el => {
        if (el) el.textContent = window.currentUser?.role?.replace('_', ' ').toUpperCase() || 'UNKNOWN';
    });
    
    // Show/hide widgets based on role
    const p2pWidget = document.getElementById('p2pWidget');
    if (p2pWidget) {
        p2pWidget.style.display = window.hasPermission('p2p') ? 'block' : 'none';
    }
    
    const customerWidget = document.getElementById('customerWidget');
    if (customerWidget) {
        customerWidget.style.display = (window.currentUser?.role === 'customer') ? 'block' : 'none';
    }
}

console.log('✅ Demo Controls loaded successfully!');
DEMO_NEW_END