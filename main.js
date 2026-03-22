
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Router functionality
    const contentArea = document.getElementById('content');
    const navItems = document.querySelectorAll('.nav-item');
    const userProfileBtn = document.getElementById('user-profile-btn');

    const routes = {
        '#stock-tracking': renderStockTracking,
        '#alerts': () => renderBlankPage('Alerts'),
        '#dashboard': () => renderBlankPage('Dashboard'),
        '#order-history': () => renderBlankPage('Order History'),
        '#profile': () => renderBlankPage('Supplier User Profile')
    };

    function handleRouting() {
        const hash = window.location.hash || '#stock-tracking';
        
        // Update active nav state
        navItems.forEach(item => {
            if (item.getAttribute('href') === hash) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Toggle user profile click state for tooltip
        if (hash === '#profile') {
            userProfileBtn.classList.add('clicked');
        } else {
            userProfileBtn.classList.remove('clicked');
        }

        // Render target page
        const renderFn = routes[hash] || renderStockTracking;
        contentArea.innerHTML = '';
        renderFn();

        // Re-initialize icons if any
        if (window.lucide) {
            window.lucide.createIcons();
        }

        window.scrollTo(0, 0);
    }

    // Profile Click Handler
    userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.hash = '#profile';
    });

    // Close tooltip when clicking elsewhere
    document.addEventListener('click', () => {
        if (window.location.hash === '#profile') {
            window.location.hash = '#stock-tracking';
        }
    });

    window.addEventListener('hashchange', handleRouting);
    
    // Initial load
    handleRouting();

    function renderStockTracking() {
        contentArea.innerHTML = `
            <div class="empty-state" style="padding: 100px 0; text-align: center;">
                <!-- Empty Stock Tracking Page -->
            </div>
        `;
    }

    function renderBlankPage(title) {
        contentArea.innerHTML = `
            <div class="empty-state" style="padding: 100px 0; text-align: center;">
                <!-- Empty ${title} Page -->
            </div>
        `;
    }
});
