document.addEventListener('DOMContentLoaded', () => {
    const componentsDB = {
        cpu: [ { id: 1, name: 'AMD Ryzen 9 7950X', brand: 'AMD', vendors: [{name: 'PrimeABGB', price: 47990, url: '#'}] }, { id: 2, name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', vendors: [{name: 'Amazon', price: 34990, url: '#'}, {name: 'Computech', price: 35500, url: '#'}] }, { id: 25, name: 'AMD Ryzen 5 7600X', brand: 'AMD', vendors: [{name: 'Vedant', price: 21500, url: '#'}] }, { id: 3, name: 'Intel Core i9-13900K', brand: 'Intel', vendors: [{name: 'MDComputers', price: 52999, url: '#'}] }, { id: 4, name: 'Intel Core i7-13700K', brand: 'Intel', vendors: [{name: 'Amazon', price: 38999, url: '#'}, {name: 'PrimeABGB', price: 39500, url: '#'}] }, { id: 26, name: 'Intel Core i5-13600K', brand: 'Intel', vendors: [{name: 'Amazon', price: 29990, url: '#'}] }, ],
        motherboard: [ { id: 5, name: 'ASUS ROG Crosshair X670E Hero', brand: 'AMD', ramType: 'DDR5', formFactor: 'ATX', vendors: [{name: 'Computech', price: 65000, url: '#'}] }, { id: 3, name: 'Gigabyte B650 AORUS Elite', brand: 'AMD', ramType: 'DDR5', formFactor: 'ATX', vendors: [{name: 'Vedant', price: 21500, url: '#'}] }, { id: 27, name: 'ASRock B650M PG Riptide', brand: 'AMD', ramType: 'DDR5', formFactor: 'Micro-ATX', vendors: [{name: 'MDComputers', price: 18990, url: '#'}] }, { id: 4, name: 'MSI MAG Z790 Tomahawk', brand: 'Intel', ramType: 'DDR5', formFactor: 'ATX', vendors: [{name: 'Computech', price: 28999, url: '#'}] }, { id: 8, name: 'ASRock Z790M-ITX WIFI', brand: 'Intel', ramType: 'DDR5', formFactor: 'Mini-ITX', vendors: [{name: 'PrimeABGB', price: 24500, url: '#'}] }, { id: 28, name: 'Gigabyte Z790 AORUS Master', brand: 'Intel', ramType: 'DDR5', formFactor: 'E-ATX', vendors: [{name: 'Computech', price: 54999, url: '#'}] }, ],
        ram: [ { id: 9, name: 'G.Skill Trident Z5 Neo 32GB DDR5', ramType: 'DDR5', vendors: [{name: 'Computech', price: 11499, url: '#'}] }, { id: 10, name: 'Corsair Vengeance 32GB DDR5', ramType: 'DDR5', vendors: [{name: 'Amazon', price: 9999, url: '#'}, {name: 'Vedant', price: 10200, url: '#'}] }, { id: 11, name: 'Corsair Vengeance LPX 16GB DDR4', ramType: 'DDR4', vendors: [{name: 'MDComputers', price: 3800, url: '#'}] }, ],
        gpu: [ { id: 12, name: 'NVIDIA GeForce RTX 4090 24GB', vendors: [{name: 'PrimeABGB', price: 175000, url: '#'}] }, { id: 31, name: 'NVIDIA GeForce RTX 4080 16GB', vendors: [{name: 'Computech', price: 125000, url: '#'}] }, { id: 13, name: 'NVIDIA GeForce RTX 4070 Ti 12GB', vendors: [{name: 'Vedant', price: 85000, url: '#'}, {name: 'MDComputers', price: 86500, url: '#'}] }, ],
        storage: [ { id: 15, name: 'Samsung 990 Pro 2TB NVMe SSD', vendors: [{name: 'Amazon', price: 14999, url: '#'}] }, { id: 16, name: 'Crucial P5 Plus 2TB NVMe SSD', vendors: [{name: 'Computech', price: 11990, url: '#'}] }, { id: 33, name: 'WD Black SN850X 1TB NVMe SSD', vendors: [{name: 'Amazon', price: 8500, url: '#'}] }, { id: 34, name: 'Samsung 870 EVO 1TB SATA SSD', vendors: [{name: 'Computech', price: 7500, url: '#'}] }, { id: 35, name: 'Seagate Barracuda 4TB HDD', vendors: [{name: 'Amazon', price: 7990, url: '#'}] }, ],
        psu: [ { id: 18, name: 'Corsair RM1000e 1000W Gold', vendors: [{name: 'Amazon', price: 15500, url: '#'}] }, { id: 19, name: 'SeaSonic FOCUS Plus 850W Gold', vendors: [{name: 'Computech', price: 13500, url: '#'}] }, { id: 36, name: 'Cooler Master MWE 750W Bronze', vendors: [{name: 'Amazon', price: 6500, url: '#'}] }, ],
        pcCase: [ { id: 20, name: 'Lian Li Lancool 216', formFactor: 'ATX', vendors: [{name: 'Computech', price: 8500, url: '#'}] }, { id: 37, name: 'Fractal Design North', formFactor: 'ATX', vendors: [{name: 'Computech', price: 13990, url: '#'}] }, { id: 22, name: 'Cooler Master NR200P', formFactor: 'Mini-ITX', vendors: [{name: 'Amazon', price: 9200, url: '#'}] }, ],
        monitor: [ { id: 23, name: 'Dell Alienware AW3423DWF 34" QD-OLED', vendors: [{name: 'Dell', price: 95000, url: '#'}] }, { id: 24, name: 'LG UltraGear 27GR95QE-B 27" OLED', vendors: [{name: 'Best Buy', price: 89990, url: '#'}] }, { id: 38, name: 'Gigabyte M27Q 27" IPS 170Hz', vendors: [{name: 'Amazon', price: 29500, url: '#'}] }, ],
    };
    const openSearchBtn = document.getElementById('open-search-modal-btn');
    const modalContainer = document.getElementById('search-modal-container');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    const searchInput = document.getElementById('search-input');
    const searchResultsBody = document.getElementById('search-results-body');
    const searchFiltersContainer = document.getElementById('search-filters');
    let activeFilter = 'all';
    const allComponents = Object.entries(componentsDB).flatMap(([category, items]) => items.map(item => ({ ...item, category })));
    const renderFilterButtons = () => {
        const categories = ['all', ...Object.keys(componentsDB)];
        searchFiltersContainer.innerHTML = '';
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.category = category;
            const displayName = category.replace('pcCase', 'Case').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            btn.textContent = displayName;
            if (category === 'all') btn.classList.add('active');
            searchFiltersContainer.appendChild(btn);
        });
    };
    const renderResults = (results) => {
        searchResultsBody.innerHTML = '';
        if (results.length === 0) {
            searchResultsBody.innerHTML = '<p class="search-prompt">No components found.</p>';
            return;
        }
        results.forEach(item => {
            const displayName = item.category.replace('pcCase', 'Case & Fans');
            let vendorsHTML = item.vendors.map(vendor => `<li class="vendor-item"><a href="${vendor.url}" target="_blank" class="vendor-link">${vendor.name} ⇗</a><span>₹${vendor.price.toLocaleString('en-IN')}</span></li>`).join('');
            const itemDiv = document.createElement('div');
            itemDiv.className = 'component-item';
            itemDiv.innerHTML = `<h4>${item.name}<small>${displayName}</small></h4><ul class="vendor-list">${vendorsHTML}</ul>`;
            searchResultsBody.appendChild(itemDiv);
        });
    };
    const performSearch = (query) => {
        let results;
        if (query) {
            const lowerCaseQuery = query.toLowerCase();
            results = allComponents.filter(item => item.name.toLowerCase().includes(lowerCaseQuery));
        } else {
            results = allComponents;
        }
        if (activeFilter !== 'all') {
            results = results.filter(item => item.category === activeFilter);
        }
        renderResults(results);
    };
    openSearchBtn.addEventListener('click', () => { modalContainer.classList.add('active'); searchInput.focus(); });
    const closeModal = () => {
        modalContainer.classList.remove('active');
        searchInput.value = '';
        activeFilter = 'all';
        searchFiltersContainer.querySelector('.filter-btn.active').classList.remove('active');
        searchFiltersContainer.querySelector('.filter-btn[data-category="all"]').classList.add('active');
        searchResultsBody.innerHTML = '<p class="search-prompt">Start typing to see results...</p>';
    };
    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    searchInput.addEventListener('input', (e) => { performSearch(e.target.value); });
    searchFiltersContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            searchFiltersContainer.querySelector('.filter-btn.active').classList.remove('active');
            e.target.classList.add('active');
            activeFilter = e.target.dataset.category;
            performSearch(searchInput.value);
        }
    });
    renderFilterButtons();

    // Deep-link support: browse.html#search and/or ?q=...&category=...
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const qParam = params.get('q');
    const categoryParam = params.get('category');
    const validCategories = ['all', ...Object.keys(componentsDB)];
    const applyDeepLink = () => {
        if (hash === '#search' || qParam || categoryParam) {
            modalContainer.classList.add('active');
            // Category
            if (categoryParam && validCategories.includes(categoryParam)) {
                activeFilter = categoryParam;
                // Update buttons UI
                const currentActive = searchFiltersContainer.querySelector('.filter-btn.active');
                if (currentActive) currentActive.classList.remove('active');
                const targetBtn = searchFiltersContainer.querySelector(`.filter-btn[data-category="${categoryParam}"]`);
                if (targetBtn) targetBtn.classList.add('active');
            }
            // Query
            if (qParam) {
                searchInput.value = qParam;
            }
            performSearch(searchInput.value);
        }
    };
    applyDeepLink();
});