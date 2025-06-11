
document.addEventListener('DOMContentLoaded', function() {
    // منتظر می‌مانیم تا auth سیستم لود شود
    setTimeout(function() {
        if (typeof hasPermission === 'function' && hasPermission('p2p')) {
            addP2PWidget();
            updateQuickActionsForP2P();
        }
    }, 1000);
});

function addP2PWidget() {
    // پیدا کردن محل مناسب برای widget
    const container = document.querySelector('.container.mx-auto.px-6.py-8');
    if (!container) return;
    
    const statsGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-4.gap-6.mb-8');
    if (!statsGrid) return;
    
    // ایجاد P2P widget
    const p2pWidget = document.createElement('div');
    p2pWidget.className = 'bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 mb-8 text-white';
    p2pWidget.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <div>
                <h2 class="text-xl font-bold">🤝 P2P Marketplace</h2>
                <p class="text-purple-200 text-sm">Inter-exchanger trading network</p>
            </div>
            <a href="p2p-marketplace.html" class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 font-medium">
                Open P2P
            </a>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white bg-opacity-20 rounded-lg p-3">
                <div class="text-sm opacity-80">Active Orders</div>
                <div class="text-xl font-bold">5</div>
            </div>
            <div class="bg-white bg-opacity-20 rounded-lg p-3">
                <div class="text-sm opacity-80">Today Volume</div>
                <div class="text-xl font-bold">$47K</div>
            </div>
            <div class="bg-white bg-opacity-20 rounded-lg p-3">
                <div class="text-sm opacity-80">Success Rate</div>
                <div class="text-xl font-bold">98.7%</div>
            </div>
            <div class="bg-white bg-opacity-20 rounded-lg p-3">
                <div class="text-sm opacity-80">Rating</div>
                <div class="text-xl font-bold">4.9★</div>
            </div>
        </div>
    `;
    
    // اضافه کردن widget بعد از آمار
    statsGrid.parentNode.insertBefore(p2pWidget, statsGrid.nextSibling);
}

function updateQuickActionsForP2P() {
    // پیدا کردن grid quick actions
    const quickActionsGrid = document.querySelector('.grid.grid-cols-2.md\\:grid-cols-4.gap-6');
    if (!quickActionsGrid) return;
    
    // اضافه کردن P2P action
    const p2pAction = document.createElement('a');
    p2pAction.href = 'p2p-marketplace.html';
    p2pAction.className = 'bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 block text-center relative';
    p2pAction.innerHTML = `
        <div class="absolute top-2 right-2">
            <span class="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">Pro</span>
        </div>
        <div class="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <i class="fas fa-handshake text-purple-600 text-2xl"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">P2P Marketplace</h3>
        <p class="text-gray-600 text-sm">Trade with other exchangers</p>
    `;
    
    // اضافه کردن به grid (جایگزینی یا اضافه)
    if (quickActionsGrid.children.length >= 4) {
        quickActionsGrid.children[3].replaceWith(p2pAction);
    } else {
        quickActionsGrid.appendChild(p2pAction);
    }
}
DASHBOARD_P2P_JS_END