document.addEventListener('DOMContentLoaded', () => {
    const componentsDB = {
        cpu: [ { id: 1, name: 'AMD Ryzen 9 7950X', brand: 'AMD', vendors: [{name: 'PrimeABGB', price: 47990, url: '#', stock: true}] }, { id: 2, name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', vendors: [{name: 'Amazon', price: 34990, url: '#', stock: true}, {name: 'Computech', price: 35500, url: '#', stock: false}] }, { id: 25, name: 'AMD Ryzen 5 7600X', brand: 'AMD', vendors: [{name: 'Vedant', price: 21500, url: '#', stock: true}] }, { id: 3, name: 'Intel Core i9-13900K', brand: 'Intel', vendors: [{name: 'MDComputers', price: 52999, url: '#', stock: false}] }, { id: 4, name: 'Intel Core i7-13700K', brand: 'Intel', vendors: [{name: 'Amazon', price: 38999, url: '#', stock: true}, {name: 'PrimeABGB', price: 39500, url: '#', stock: true}] }, { id: 26, name: 'Intel Core i5-13600K', brand: 'Intel', vendors: [{name: 'Amazon', price: 29990, url: '#', stock: false}] }, ],
        motherboard: [ { id: 5, name: 'ASUS ROG Crosshair X670E Hero', brand: 'AMD', ramType: 'DDR5', formFactor: 'ATX', vendors: [{name: 'Computech', price: 65000, url: '#', stock: true}] }, { id: 3, name: 'Gigabyte B650 AORUS Elite', brand: 'AMD', ramType: 'DDR5', formFactor: 'ATX', vendors: [{name: 'Vedant', price: 21500, url: '#', stock: true}] }, { id: 27, name: 'ASRock B650M PG Riptide', brand: 'AMD', ramType: 'DDR5', formFactor: 'Micro-ATX', vendors: [{name: 'MDComputers', price: 18990, url: '#', stock: true}] }, { id: 4, name: 'MSI MAG Z790 Tomahawk', brand: 'Intel', ramType: 'DDR5', formFactor: 'ATX', vendors: [{name: 'Computech', price: 28999, url: '#', stock: false}] }, { id: 8, name: 'ASRock Z790M-ITX WIFI', brand: 'Intel', ramType: 'DDR5', formFactor: 'Mini-ITX', vendors: [{name: 'PrimeABGB', price: 24500, url: '#', stock: true}] }, { id: 28, name: 'Gigabyte Z790 AORUS Master', brand: 'Intel', ramType: 'DDR5', formFactor: 'E-ATX', vendors: [{name: 'Computech', price: 54999, url: '#', stock: true}] }, ],
        ram: [ { id: 9, name: 'G.Skill Trident Z5 Neo 32GB DDR5', ramType: 'DDR5', vendors: [{name: 'Computech', price: 11499, url: '#', stock: true}] }, { id: 10, name: 'Corsair Vengeance 32GB DDR5', ramType: 'DDR5', vendors: [{name: 'Amazon', price: 9999, url: '#', stock: true}, {name: 'Vedant', price: 10200, url: '#', stock: false}] }, { id: 11, name: 'Corsair Vengeance LPX 16GB DDR4', ramType: 'DDR4', vendors: [{name: 'MDComputers', price: 3800, url: '#', stock: true}] }, ],
        gpu: [ { id: 12, name: 'NVIDIA GeForce RTX 4090 24GB', vendors: [{name: 'PrimeABGB', price: 175000, url: '#', stock: false}] }, { id: 31, name: 'NVIDIA GeForce RTX 4080 16GB', vendors: [{name: 'Computech', price: 125000, url: '#', stock: true}] }, { id: 13, name: 'NVIDIA GeForce RTX 4070 Ti 12GB', vendors: [{name: 'Vedant', price: 85000, url: '#', stock: true}, {name: 'MDComputers', price: 86500, url: '#', stock: true}] }, ],
        storage: [ { id: 15, name: 'Samsung 990 Pro 2TB NVMe SSD', vendors: [{name: 'Amazon', price: 14999, url: '#', stock: true}] }, { id: 16, name: 'Crucial P5 Plus 2TB NVMe SSD', vendors: [{name: 'Computech', price: 11990, url: '#', stock: false}] }, { id: 33, name: 'WD Black SN850X 1TB NVMe SSD', vendors: [{name: 'Amazon', price: 8500, url: '#', stock: true}] }, ],
        psu: [ { id: 18, name: 'Corsair RM1000e 1000W Gold', vendors: [{name: 'Amazon', price: 15500, url: '#', stock: true}] }, { id: 19, name: 'SeaSonic FOCUS Plus 850W Gold', vendors: [{name: 'Computech', price: 13500, url: '#', stock: true}] }, ],
        pcCase: [ { id: 20, name: 'Lian Li Lancool 216', formFactor: 'ATX', vendors: [{name: 'Computech', price: 8500, url: '#', stock: false}] }, { id: 37, name: 'Fractal Design North', formFactor: 'ATX', vendors: [{name: 'Computech', price: 13990, url: '#', stock: true}] }, { id: 22, name: 'Cooler Master NR200P', formFactor: 'Mini-ITX', vendors: [{name: 'Amazon', price: 9200, url: '#', stock: true}] }, ],
        monitor: [ { id: 23, name: 'Dell Alienware AW3423DWF 34" QD-OLED', vendors: [{name: 'Dell', price: 95000, url: '#', stock: true}] }, { id: 24, name: 'LG UltraGear 27GR95QE-B 27" OLED', vendors: [{name: 'Best Buy', price: 89990, url: '#', stock: false}] }, ],
    };
    let currentBuild = { cpu: null, motherboard: null, ram: null, gpu: null, storage: null, psu: null, pcCase: null, monitor: null };
    let modalState = { view: 'list', category: null };
    const componentPickerEl = document.getElementById('component-picker');
    const buildItemsEl = document.getElementById('build-items');
    const totalPriceEl = document.getElementById('total-price');
    const modalContainer = document.getElementById('modal-container');
    const modalHeader = document.getElementById('modal-header');
    const modalBody = document.getElementById('modal-body');
    const isComponentInStock = (component) => component.vendors.some(v => v.stock);
    const getLowestPrice = (component) => {
        const inStockVendors = component.vendors.filter(v => v.stock);
        if (inStockVendors.length === 0) return 0;
        return Math.min(...inStockVendors.map(v => v.price));
    };
    function renderComponentSlots() {
        componentPickerEl.innerHTML = '<h2>Choose Your Components</h2>';
        for (const category of Object.keys(componentsDB)) {
            const item = currentBuild[category];
            const slot = document.createElement('div');
            slot.className = 'component-slot';
            let priceInfo = item ? ` - ₹${getLowestPrice(item).toLocaleString('en-IN')}` : '';
            const displayName = category.replace('pcCase', 'Case & Fans');
            slot.innerHTML = `<div class="component-slot-info"><h3>${displayName}</h3><p>${item ? `${item.name}${priceInfo}` : 'Not selected'}</p></div><button class="choose-btn" data-category="${category}">${item ? 'Change' : 'Choose'}</button>`;
            componentPickerEl.appendChild(slot);
        }
    }
    function updateBuildUI() {
        buildItemsEl.innerHTML = '';
        let total = 0;
        let hasItems = false;
        Object.keys(currentBuild).forEach(category => {
            const item = currentBuild[category];
            if (item) {
                hasItems = true;
                const price = getLowestPrice(item);
                const buildItem = document.createElement('div');
                const displayName = category.replace('pcCase', 'Case & Fans');
                buildItem.className = 'selected-item';
                buildItem.innerHTML = `<span><strong>${displayName}:</strong> ${item.name}</span><span>₹${price.toLocaleString('en-IN')}</span>`;
                buildItemsEl.appendChild(buildItem);
                total += price;
            }
        });
        if (!hasItems) buildItemsEl.innerHTML = '<p>Select parts to begin.</p>';
        totalPriceEl.textContent = `Total: ₹${total.toLocaleString('en-IN')}`;
    }
    function renderComponentList(category) {
        modalState = { view: 'list', category };
        const displayName = category.replace('pcCase', 'Case & Fans');
        modalHeader.innerHTML = `<h2>Select a ${displayName}</h2><button class="modal-close-btn">&times;</button>`;
        modalBody.innerHTML = '';
        componentsDB[category].forEach(item => {
            const isInStock = isComponentInStock(item);
            const isCompatible = checkCompatibility(category, item);
            const card = document.createElement('div');
            card.className = `component-card ${(!isCompatible || !isInStock) ? 'disabled' : ''}`;
            if (isCompatible && isInStock) { card.dataset.id = item.id; card.dataset.category = category; }
            const priceText = isInStock ? `From ₹${getLowestPrice(item).toLocaleString('en-IN')}` : 'Out of Stock';
            card.innerHTML = `<div><h4>${item.name}</h4></div><strong>${priceText}</strong>`;
            modalBody.appendChild(card);
        });
        modalContainer.classList.add('active');
    }
    function renderComponentDetail(category, itemId) {
        modalState = { view: 'detail', category };
        const item = componentsDB[category].find(i => i.id == itemId);
        const isInStock = isComponentInStock(item);
        modalHeader.innerHTML = `<button class="modal-back-btn">&larr;</button><h2>${item.name}</h2><button class="modal-close-btn">&times;</button>`;
        let vendorHTML = item.vendors.map(vendor => {
            const stockClass = vendor.stock ? 'in-stock' : 'out-of-stock';
            const stockText = vendor.stock ? 'In Stock' : 'Out of Stock';
            return `<li class="vendor-item"><div class="vendor-info"><a href="${vendor.url}" target="_blank" class="vendor-link">${vendor.name} ⇗</a><span class="stock-status ${stockClass}">${stockText}</span></div><span>₹${vendor.price.toLocaleString('en-IN')}</span></li>`;
        }).join('');
        const buttonHTML = isInStock 
            ? `<button class="add-to-build-btn" data-id="${item.id}" data-category="${category}">Add to Build for ₹${getLowestPrice(item).toLocaleString('en-IN')}</button>`
            : `<button class="add-to-build-btn" disabled>Out of Stock</button>`;
        modalBody.innerHTML = `<ul class="vendor-list">${vendorHTML}</ul><div class="detail-view-footer">${buttonHTML}</div>`;
    }
    function checkCompatibility(category, item) {
        const { cpu, motherboard, pcCase } = currentBuild;
        if (category === 'motherboard' && cpu && item.brand !== cpu.brand) return false;
        if (category === 'cpu' && motherboard && item.brand !== motherboard.brand) return false;
        if (category === 'ram' && motherboard && item.ramType !== motherboard.ramType) return false;
        if (category === 'pcCase' && motherboard && item.formFactor !== motherboard.formFactor) return false;
        if (category === 'motherboard' && pcCase && item.formFactor !== pcCase.formFactor) return false;
        return true;
    }
    componentPickerEl.addEventListener('click', e => { if (e.target.classList.contains('choose-btn')) renderComponentList(e.target.dataset.category); });
    modalContainer.addEventListener('click', e => {
        const target = e.target;
        if (target.classList.contains('modal-close-btn') || target.classList.contains('modal-overlay')) modalContainer.classList.remove('active');
        if (target.classList.contains('modal-back-btn')) renderComponentList(modalState.category);
        const card = target.closest('.component-card');
        if (card && !card.classList.contains('disabled')) renderComponentDetail(card.dataset.category, card.dataset.id);
        if (target.classList.contains('add-to-build-btn')) {
            const { id, category } = target.dataset;
            currentBuild[category] = componentsDB[category].find(item => item.id == id);
            modalContainer.classList.remove('active');
            renderComponentSlots();
            updateBuildUI();
        }
    });
    renderComponentSlots();
    updateBuildUI();
});