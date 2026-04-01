document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing Inventory Manager');

    // 1. Data Definitions
    const rawMaterials = [
        { name: "Whey protein isolate", cost: 1200, location: "Dairy Processors (Punjab)", leadTime: 7, currentStock: 45, reorderPoint: 60, expiryDays: 90, status: "critical" },
        { name: "Plant protein powder", cost: 850, location: "Soy/Pea processors (MP)", leadTime: 8, currentStock: 120, reorderPoint: 150, expiryDays: 120, status: "low" },
        { name: "Oats", cost: 80, location: "Grain markets (Punjab/Haryana)", leadTime: 3, currentStock: 800, reorderPoint: 200, expiryDays: 60, status: "sufficient" },
        { name: "Almond flour", cost: 950, location: "Dry Fruit Wholesalers (Mumbai imports)", leadTime: 6, currentStock: 35, reorderPoint: 100, expiryDays: 30, status: "critical" },
        { name: "Cocoa powder", cost: 650, location: "Kerala cocoa processors", leadTime: 5, currentStock: 150, reorderPoint: 100, expiryDays: 180, status: "sufficient" },
        { name: "Dates paste", cost: 250, location: "Rajasthan", leadTime: 4, currentStock: 200, reorderPoint: 100, expiryDays: 12, batchId: "DP-2305", status: "sufficient" },
        { name: "Chia seeds", cost: 450, location: "Rajasthan farms", leadTime: 5, currentStock: 95, reorderPoint: 100, expiryDays: 180, status: "low" },
        { name: "Vitamin premix", cost: 2500, location: "Nutraceutical suppliers (Hyderabad)", leadTime: 10, currentStock: 15, reorderPoint: 30, expiryDays: 200, status: "critical" },
        { name: "Natural sweeteners", cost: 150, location: "Suppliers from Gujarat", leadTime: 7, currentStock: 300, reorderPoint: 150, expiryDays: 365, status: "sufficient" }
    ];

    const products = [
        { name: "Chocolate Oats Protein Bar", category: "Protein Snacks", demand: 5200, popularity: "High", currentStock: 450, daysRemaining: 60 },
        { name: "Almond Date Energy Bites", category: "Protein Snacks", demand: 4500, popularity: "High", currentStock: 2500, daysRemaining: 16 },
        { name: "Protein Oat Cookies", category: "Protein Snacks", demand: 3300, popularity: "Moderate", currentStock: 400, daysRemaining: 30 },
        { name: "Kids Oat Nutrition Bar", category: "Kids Nutrition Snacks", demand: 2900, popularity: "Moderate", currentStock: 1800, daysRemaining: 18 },
        { name: "Chocolate Nutrition Bites", category: "Kids Nutrition Snacks", demand: 2600, popularity: "Moderate", currentStock: 350, daysRemaining: 4 },
        { name: "Low Sugar Nut Bar", category: "Functional Health Snacks", demand: 1800, popularity: "Low", currentStock: 4200, daysRemaining: 45 },
        { name: "Plant Protein Bar", category: "Functional Health Snacks", demand: 1500, popularity: "Low", currentStock: 50, daysRemaining: 1 },
        { name: "Chia Seed Wellness Bar", category: "Functional Health Snacks", demand: 2400, popularity: "Moderate", currentStock: 1400, daysRemaining: 17 }
    ];

    const bom = {
        "Chocolate Oats Protein Bar": [
            { item: "Whey protein isolate", amount: "25g" },
            { item: "Oats", amount: "15g" },
            { item: "Almond flour", amount: "8g" },
            { item: "Cocoa powder", amount: "5g" },
            { item: "Dates paste", amount: "5g" },
            { item: "Vitamin premix", amount: "1g" },
            { item: "Natural sweeteners", amount: "1g" }
        ],
        "Almond Date Energy Bites": [
            { item: "Almond flour", amount: "10g" },
            { item: "Cocoa powder", amount: "3g" },
            { item: "Dates paste", amount: "20g" },
            { item: "Chia seeds", amount: "5g" },
            { item: "Natural sweeteners", amount: "2g" }
        ],
        "Protein Oat Cookies": [
            { item: "Whey protein isolate", amount: "15g" },
            { item: "Oats", amount: "20g" },
            { item: "Almond flour", amount: "8g" },
            { item: "Cocoa powder", amount: "4g" },
            { item: "Natural sweeteners", amount: "3g" }
        ],
        "Kids Oat Nutrition Bar": [
            { item: "Oats", amount: "22g" },
            { item: "Almond flour", amount: "8g" },
            { item: "Dates paste", amount: "10g" },
            { item: "Vitamin premix", amount: "3g" },
            { item: "Natural sweeteners", amount: "2g" }
        ],
        "Chocolate Nutrition Bites": [
            { item: "Almond flour", amount: "8g" },
            { item: "Cocoa powder", amount: "10g" },
            { item: "Dates paste", amount: "12g" },
            { item: "Vitamin premix", amount: "3g" },
            { item: "Natural sweeteners", amount: "2g" }
        ],
        "Low Sugar Nut Bar": [
            { item: "Oats", amount: "18g" },
            { item: "Almond flour", amount: "10g" },
            { item: "Cocoa powder", amount: "5g" },
            { item: "Chia seeds", amount: "8g" },
            { item: "Vitamin premix", amount: "2g" },
            { item: "Natural sweeteners", amount: "4g" }
        ],
        "Plant Protein Bar": [
            { item: "Plant protein powder", amount: "22g" },
            { item: "Oats", amount: "15g" },
            { item: "Almond flour", amount: "8g" },
            { item: "Dates paste", amount: "3g" },
            { item: "Chia seeds", amount: "5g" },
            { item: "Natural sweeteners", amount: "2g" }
        ],
        "Chia Seed Wellness Bar": [
            { item: "Oats", amount: "18g" },
            { item: "Almond flour", amount: "8g" },
            { item: "Cocoa powder", amount: "1g" },
            { item: "Dates paste", amount: "6g" },
            { item: "Chia seeds", amount: "12g" },
            { item: "Vitamin premix", amount: "2g" },
            { item: "Natural sweeteners", amount: "3g" }
        ]
    };

    // 2. Global Elements
    const contentArea = document.getElementById('content');
    const navItems = document.querySelectorAll('.nav-item');
    const userProfileBtn = document.getElementById('user-profile-btn');

    // 3. Page Rendering Functions
    function renderStockTracking() {
        console.log('Rendering Stock Tracking Page');
        contentArea.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Stock Tracking</h1>
                <p class="page-description">Monitor the current stock levels of raw materials and finished products used in BioBite’s nutraceutical snack production.</p>
            </div>

            <div class="controls-row">
                <div class="search-container">
                    <i data-lucide="search" class="search-icon"></i>
                    <input type="text" class="search-input" placeholder="Search by name, product, or category..." id="stock-search">
                </div>
                <div class="filters-group">
                    <select class="filter-select" id="filter-category">
                        <option value="">All Categories</option>
                        <option value="Protein Snacks">Protein Snacks</option>
                        <option value="Kids Nutrition Snacks">Kids Nutrition Snacks</option>
                        <option value="Functional Health Snacks">Functional Health Snacks</option>
                    </select>
                    <select class="filter-select" id="filter-status">
                        <option value="">All Status</option>
                        <option value="sufficient">Sufficient</option>
                        <option value="low">Low Stock</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
            </div>

            <div class="stats-summary">
                <div class="stat-card">
                    <div class="stat-icon-box" style="background: #eef2ff; color: #4f46e5;">
                        <i data-lucide="package"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">${rawMaterials.length}</span>
                        <span class="stat-label">Raw Materials</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon-box" style="background: #f0fdf4; color: #16a34a;">
                        <i data-lucide="check-circle"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">${products.length}</span>
                        <span class="stat-label">Finished Products</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon-box" style="background: #fffbeb; color: #d97706;">
                        <i data-lucide="alert-circle"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">${rawMaterials.filter(m => m.status === 'low' || m.status === 'critical').length}</span>
                        <span class="stat-label">Low Stock (RM)</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon-box" style="background: #fef2f2; color: #dc2626;">
                        <i data-lucide="trending-down"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">${products.filter(p => p.daysRemaining < 5).length}</span>
                        <span class="stat-label">Critical (FG)</span>
                    </div>
                </div>
            </div>

            <div class="table-section">
                <div class="table-header">
                    <h3>Raw Materials Inventory</h3>
                </div>
                <div class="table-container">
                    <table id="rm-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Unit Cost</th>
                                <th>Source</th>
                                <th>Lead Time</th>
                                <th>Current Stock</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rawMaterials.map(rm => `
                                <tr>
                                    <td style="font-weight: 600;">${rm.name}</td>
                                    <td>₹${rm.cost}</td>
                                    <td>${rm.location}</td>
                                    <td>${rm.leadTime} days</td>
                                    <td style="font-weight: 700;">${rm.currentStock} kg</td>
                                    <td><span class="status-pill status-${rm.status}">${rm.status.charAt(0).toUpperCase() + rm.status.slice(1)}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="table-section">
                <div class="table-header">
                    <h3>Finished Goods Inventory</h3>
                </div>
                <div class="table-container">
                    <table id="fg-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Monthly Demand</th>
                                <th>Stock</th>
                                <th>Days Remaining</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${products.map(p => `
                                <tr class="expandable" onclick="toggleBOM(this)">
                                    <td style="font-weight: 600;">
                                        <div style="display: flex; align-items: center; gap: 10px;">
                                            <i data-lucide="chevron-right" class="expand-icon" style="width: 16px; transition: transform 0.3s;"></i>
                                            ${p.name}
                                        </div>
                                    </td>
                                    <td>${p.category}</td>
                                    <td>${p.demand} units</td>
                                    <td style="font-weight: 700;">${p.currentStock} units</td>
                                    <td>${p.daysRemaining} days</td>
                                    <td><span class="status-pill status-${p.daysRemaining < 5 ? 'critical' : p.daysRemaining < 10 ? 'low' : 'sufficient'}">
                                        ${p.daysRemaining < 5 ? 'Critical' : p.daysRemaining < 10 ? 'Low Stock' : 'Sufficient'}
                                    </span></td>
                                </tr>
                                <tr class="expanded-row">
                                    <td colspan="6">
                                        <div class="expanded-content">
                                            <h4 style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">Bill of Materials (per unit)</h4>
                                            <div class="bom-grid">
                                                ${bom[p.name].map(item => `
                                                    <div class="bom-item">
                                                        <span class="ingredient">${item.item}</span>
                                                        <span class="amount">${item.amount}</span>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Setup Search and Filter Listeners
        const searchInput = document.getElementById('stock-search');
        const categoryFilter = document.getElementById('filter-category');
        const statusFilter = document.getElementById('filter-status');

        const filterTables = () => {
            const query = searchInput.value.toLowerCase();
            const cat = categoryFilter.value;
            const stat = statusFilter.value;

            const rmRows = document.querySelectorAll('#rm-table tbody tr');
            rmRows.forEach(row => {
                const text = row.innerText.toLowerCase();
                const statusPill = row.querySelector('.status-pill');
                const rowStatus = statusPill.classList.contains(`status-${stat}`) || stat === '';
                row.style.display = text.includes(query) && rowStatus ? '' : 'none';
            });

            const fgRows = document.querySelectorAll('#fg-table tbody tr.expandable');
            fgRows.forEach(row => {
                const nextRow = row.nextElementSibling;
                const text = row.innerText.toLowerCase();
                const category = row.cells[1].innerText === cat || cat === '';
                const pill = row.querySelector('.status-pill');
                const rowStatus = pill.className.includes(stat) || stat === '';

                const visible = text.includes(query) && category && rowStatus;
                row.style.display = visible ? '' : 'none';
                if (!visible) nextRow.style.display = 'none';
            });
        };

        if (searchInput) {
            searchInput.addEventListener('input', filterTables);
            categoryFilter.addEventListener('change', filterTables);
            statusFilter.addEventListener('change', filterTables);
        }

        if (window.lucide) window.lucide.createIcons();
    }

    function generateAlerts() {
        const alerts = [];
        
        // Raw Material Rules
        rawMaterials.forEach(rm => {
            if (rm.currentStock < rm.reorderPoint) {
                alerts.push({
                    id: Math.random().toString(36).substr(2, 9),
                    category: "Raw Material",
                    type: "Raw Material Shortage",
                    severity: "Critical",
                    icon: "alert-triangle",
                    iconColor: "#dc2626",
                    item: rm.name,
                    metrics: `Current Stock: ${rm.currentStock} kg | Reorder Point: ${rm.reorderPoint} kg | Lead Time: ${rm.leadTime} days`,
                    message: `Stock level is below the reorder threshold. Supplier lead time may cause production delays.`,
                    action: "Generate purchase order to supplier immediately.",
                    timestamp: new Date().toISOString()
                });
            }
            
            if (rm.expiryDays && rm.expiryDays < 15) {
                alerts.push({
                    id: Math.random().toString(36).substr(2, 9),
                    category: "Raw Material",
                    type: "Expiry Warning",
                    severity: "Critical",
                    icon: "clock",
                    iconColor: "#dc2626",
                    item: rm.name,
                    metrics: `Batch ID: ${rm.batchId || 'N/A'} | Expiry Date: ${rm.expiryDays} days remaining`,
                    message: `This raw material batch is nearing expiry and should be used soon to avoid wastage.`,
                    action: "Prioritize production batches using this material.",
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Finished Product Rules
        products.forEach(p => {
            if (p.currentStock < p.demand) {
                alerts.push({
                    id: Math.random().toString(36).substr(2, 9),
                    category: "Product",
                    type: "Product Stock Running Low",
                    severity: "Warning",
                    icon: "trending-down",
                    iconColor: "#d97706",
                    item: p.name,
                    metrics: `Current Stock: ${p.currentStock} units | Monthly Demand: ${p.demand} units`,
                    message: `Available stock may not meet upcoming demand. Production planning may be required.`,
                    action: "Schedule production batch.",
                    timestamp: new Date().toISOString()
                });
            }
            
            if (p.currentStock > p.demand * 2) {
                alerts.push({
                    id: Math.random().toString(36).substr(2, 9),
                    category: "Product",
                    type: "Excess Inventory Detected",
                    severity: "Attention",
                    icon: "package-plus",
                    iconColor: "#eab308",
                    item: p.name,
                    metrics: `Current Stock: ${p.currentStock} units | Monthly Demand: ${p.demand} units`,
                    message: `Inventory levels exceed expected sales demand. This may increase holding costs.`,
                    action: "Reduce production or prioritize sales promotions.",
                    timestamp: new Date().toISOString()
                });
            }
        });

        // System explicit alert
        alerts.push({
            id: Math.random().toString(36).substr(2, 9),
            category: "System",
            type: "System Update",
            severity: "Informational",
            icon: "info",
            iconColor: "#10b981",
            item: "Inventory Sync",
            metrics: "Last Synced: Just now",
            message: "Inventory data successfully synchronized with warehouse management system.",
            action: "No action required.",
            timestamp: new Date().toISOString()
        });

        return alerts.sort((a,b) => {
            const severityMap = { "Critical": 4, "Warning": 3, "Attention": 2, "Informational": 1 };
            return severityMap[b.severity] - severityMap[a.severity];
        });
    }

    function renderAlertsPage() {
        console.log('Rendering Alerts Page');
        const alerts = generateAlerts();
        
        const totalAlerts = alerts.length;
        const criticalAlerts = alerts.filter(a => a.severity === 'Critical').length;
        const rmAlerts = alerts.filter(a => a.category === 'Raw Material').length;
        const productAlerts = alerts.filter(a => a.category === 'Product').length;

        contentArea.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Inventory Alerts</h1>
                <p class="page-description">Real-time notifications to help manage stock shortages, excess inventory, and product expiration risks.</p>
            </div>

            <div class="stats-summary alerts-stats">
                <div class="stat-card">
                    <div class="stat-icon-box" style="background: #eef2ff; color: #4f46e5;">
                        <i data-lucide="bell"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">${totalAlerts}</span>
                        <span class="stat-label">Total Alerts</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon-box" style="background: #fef2f2; color: #dc2626;">
                        <i data-lucide="alert-triangle"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">${criticalAlerts}</span>
                        <span class="stat-label">Critical Alerts</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon-box" style="background: #fdf4ff; color: #c026d3;">
                        <i data-lucide="box"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">${rmAlerts}</span>
                        <span class="stat-label">Raw Material Alerts</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon-box" style="background: #f0fdf4; color: #16a34a;">
                        <i data-lucide="package"></i>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">${productAlerts}</span>
                        <span class="stat-label">Product Alerts</span>
                    </div>
                </div>
            </div>

            <div class="controls-row">
                <div class="search-container">
                    <i data-lucide="search" class="search-icon"></i>
                    <input type="text" class="search-input" placeholder="Search alerts by item or message..." id="alerts-search">
                </div>
                <div class="filters-group">
                    <select class="filter-select" id="filter-alerts-severity">
                        <option value="">All Severities</option>
                        <option value="Critical">🔴 Critical</option>
                        <option value="Warning">🟠 Warning</option>
                        <option value="Attention">🟡 Attention</option>
                        <option value="Informational">🟢 Informational</option>
                    </select>
                    <select class="filter-select" id="filter-alerts-category">
                        <option value="">All Categories</option>
                        <option value="Raw Material">Raw Material</option>
                        <option value="Product">Product</option>
                        <option value="System">System</option>
                    </select>
                    <select class="filter-select" id="sort-alerts">
                        <option value="critical">Most Critical</option>
                        <option value="newest">Newest Alerts</option>
                        <option value="name">Item Name</option>
                    </select>
                </div>
            </div>

            <div class="alerts-container" id="alerts-list">
                ${renderAlertCards(alerts)}
            </div>
        `;
        
        // Setup Search and Filter Listeners for Alerts
        const searchInput = document.getElementById('alerts-search');
        const severityFilter = document.getElementById('filter-alerts-severity');
        const categoryFilter = document.getElementById('filter-alerts-category');
        const sortSelect = document.getElementById('sort-alerts');
        const alertsList = document.getElementById('alerts-list');

        const updateAlerts = () => {
            const query = searchInput.value.toLowerCase();
            const severity = severityFilter.value;
            const category = categoryFilter.value;
            const sort = sortSelect.value;
            
            let filtered = alerts.filter(a => {
                const matchQuery = a.item.toLowerCase().includes(query) || a.message.toLowerCase().includes(query) || a.type.toLowerCase().includes(query);
                const matchSev = severity === '' || a.severity === severity;
                const matchCat = category === '' || a.category === category;
                return matchQuery && matchSev && matchCat;
            });
            
            filtered.sort((a,b) => {
                if(sort === 'critical') {
                    const sev = { "Critical": 4, "Warning": 3, "Attention": 2, "Informational": 1 };
                    return sev[b.severity] - sev[a.severity];
                } else if(sort === 'name') {
                    return a.item.localeCompare(b.item);
                } else {
                    return new Date(b.timestamp) - new Date(a.timestamp);
                }
            });

            alertsList.innerHTML = renderAlertCards(filtered);
            if (window.lucide) window.lucide.createIcons();
        };

        if (searchInput) {
            searchInput.addEventListener('input', updateAlerts);
            severityFilter.addEventListener('change', updateAlerts);
            categoryFilter.addEventListener('change', updateAlerts);
            sortSelect.addEventListener('change', updateAlerts);
        }

        if (window.lucide) window.lucide.createIcons();
    }

    function renderAlertCards(alertsList) {
        if(alertsList.length === 0) {
            return `<div class="empty-state" style="text-align:center; padding: 40px; color: var(--text-muted);">No alerts found matching your criteria.</div>`;
        }
        
        return alertsList.map(alert => `
            <div class="alert-card severity-${alert.severity.toLowerCase()}">
                <div class="alert-icon" style="background-color: ${alert.iconColor}20; color: ${alert.iconColor};">
                    <i data-lucide="${alert.icon}"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-header">
                        <div class="alert-title-group">
                            <span class="alert-type">${alert.type}</span>
                            ${getSeverityBadge(alert.severity)}
                        </div>
                        <span class="alert-time">Just now</span>
                    </div>
                    <h3 class="alert-item-name">${alert.item}</h3>
                    <div class="alert-metrics">${alert.metrics}</div>
                    <p class="alert-message">${alert.message}</p>
                    <div class="alert-action">
                        <strong>Suggested Action:</strong> ${alert.action}
                    </div>
                </div>
            </div>
        `).join('');
    }

    function getSeverityBadge(severity) {
        const icons = {
            "Critical": "🔴",
            "Warning": "🟠",
            "Attention": "🟡",
            "Informational": "🟢"
        };
        return `<span class="severity-badge badge-${severity.toLowerCase()}">${icons[severity]} ${severity}</span>`;
    }

    function renderDashboardPage(){
        contentArea.innerHTML=`
            <h2>Product Performance</h2>
            <select id="selectProduct"></select>
            <div class="chart-box">
                <canvas id="chart"></canvas>
            </div>
        `;
        initialize_Dashboard();
    }

    function initialize_Dashboard(){
        const select = document.getElementById("selectProduct");
        fetch("/api/products")
        .then(res=>res.json())
        .then(products=>{
            products.forEach(p=>{
                const option=document.createElement("option");
                option.value=p;
                option.textContent=p;
                select.appendChild(option);
            });
            loadAll(products[0]);
            select.addEventListener("change",()=>{
                loadAll(select.value);
            });
        });
    }
    let chart;
    function loadGraph(product){
        fetch(`/api/product-sales/${product}`)
        .then(res=>res.json())
        .then(data=>{
            const labels=data.map(d=>d.dates);
            const values=data.map(d=>d.quantity_sold);
            if(chart){
                chart.data.labels=labels;
                chart.data.datasets[0].data=values;
                chart.update();
            }
            else{
                const chrt = document.getElementById("chart").getContext('2d')
                const gradient = chrt.createLinearGradient(0,0,0,400);
                gradient.addColorStop(0, 'rgba(54, 87, 235, 0.6)');
                gradient.addColorStop(1, 'rgba(54,162,235,0.05)');
                chart = new Chart(document.getElementById("chart"),{
                    type:"line",
                    data:{
                        labels:labels,
                        datasets:[{
                            label:"Quantity Sold",
                            data: values,
                            backgroundColor: gradient,
                            borderColor: '#3639eb',
                            fill: true,
                            tension: 0.4,
                            pointRadius: 4,
                            pointHoverRadius: 6
                        }]
                    },
                    options:{
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction:{
                            mode:'index',
                            intersect:false
                        },
                        plugins:{
                            legend:{
                                position: 'top',
                                labels:{
                                    color:'#333',
                                    font:{
                                        size:14
                                    }
                                }
                            },
                            tooltip:{
                                enabled:true,
                                backgroundColor:"#222",
                                titleColor: '#fff',
                                bodyColor: '#fff',
                                padding: 10,
                                cornerRadius: 6
                            }
                        },
                        scales:{
                            x:{
                                title:{
                                    display:true,
                                    text:'Year',
                                    color:'#333'
                                }
                            },
                            y:{
                                title:{
                                    display:true,
                                    text:'Quantity sold',
                                    color:'#333'
                                }
                            }
                        }
                    }
                });
            }
        });
    }

    function loadAll(product){
        loadGraph(product);
    }
    function renderBlankPage(title) {
        console.log('Rendering Blank Page:', title);
        contentArea.innerHTML = `
            <div class="empty-state" style="padding: 100px 0; text-align: center;">
                <h2 style="font-size: 2.5rem; margin-bottom: 20px;">${title}</h2>
                <p style="color: var(--text-muted);">Welcome to the ${title} page. This section is currently under development.</p>
                <button class="subscribe-btn" style="margin-top: 30px;" onclick="window.location.hash='#stock-tracking'">Back to Home</button>
            </div>
        `;
    }

    // 4. Router Configuration
    const routes = {
        '#stock-tracking': renderStockTracking,
        '#alerts': renderAlertsPage,
        '#dashboard': renderDashboardPage,
        '#order-history': () => renderBlankPage('Order History'),
        '#profile': () => renderBlankPage('Supplier User Profile')
    };

    function handleRouting() {
        const hash = window.location.hash || '#stock-tracking';
        console.log('Routing to:', hash);

        navItems.forEach(item => {
            if (item.getAttribute('href') === hash) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        if (hash === '#profile') {
            userProfileBtn.classList.add('clicked');
        } else {
            userProfileBtn.classList.remove('clicked');
        }

        const renderFn = routes[hash] || renderStockTracking;
        contentArea.innerHTML = '';
        renderFn();

        if (window.lucide) {
            window.lucide.createIcons();
        }

        window.scrollTo(0, 0);
    }

    // 5. Global Event Listeners & Execution
    window.addEventListener('hashchange', handleRouting);

    userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.hash = '#profile';
    });

    document.addEventListener('click', () => {
        if (window.location.hash === '#profile') {
            window.location.hash = '#stock-tracking';
        }
    });

    // Start Routing
    handleRouting();

    // Toggle BOM Global Function
    window.toggleBOM = (row) => {
        const expandedRow = row.nextElementSibling;
        const icon = row.querySelector('.expand-icon');
        const isActive = expandedRow.classList.contains('active');

        document.querySelectorAll('.expanded-row.active').forEach(r => {
            if (r !== expandedRow) {
                r.classList.remove('active');
                r.previousElementSibling.querySelector('.expand-icon').style.transform = 'rotate(0deg)';
            }
        });

        if (isActive) {
            expandedRow.classList.remove('active');
            icon.style.transform = 'rotate(0deg)';
        } else {
            expandedRow.classList.add('active');
            icon.style.transform = 'rotate(90deg)';
        }
    };
});
