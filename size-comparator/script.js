document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const productSelect = document.getElementById('productSelect');
    const categorySelect = document.getElementById('categorySelect');
    const brandSelect = document.getElementById('brandSelect');
    const sizeSelect = document.getElementById('sizeSelect');
    const measureInput = document.getElementById('measureInput');
    const compareBtn = document.getElementById('compareBtn');
    const searchModeRadios = document.querySelectorAll('input[name="searchMode"]');
    const sizeInputGroup = document.getElementById('sizeInputGroup');
    const measureInputGroup = document.getElementById('measureInputGroup');
    const resultsTable = document.getElementById('resultsTable');
    const resultsBody = document.getElementById('resultsBody');
    const emptyState = document.getElementById('emptyState');
    const brandWarning = document.getElementById('brandWarning');
    const svgContainer = document.getElementById('svgContainer');

    // State
    let db = {
        shoes: null,
        clothing: null
    };

    // Load SVG files
    async function loadSVGs() {
        try {
            const shoeRes = await fetch('assets/shoe-outline.svg');
            if (shoeRes.ok) {
                window.shoeSVG = await shoeRes.text();
                // set default svg
                svgContainer.innerHTML = window.shoeSVG;
            }
            const bodyRes = await fetch('assets/body-outline.svg');
            if (bodyRes.ok) {
                window.bodySVG = await bodyRes.text();
            }
        } catch (e) {
            console.error("Error loading SVGs:", e);
        }
    }

    // Load JSON data
    async function loadData() {
        try {
            const [shoesRes, clothingRes] = await Promise.all([
                fetch('data/shoes.json'),
                fetch('data/clothing.json')
            ]);
            
            if(shoesRes.ok) db.shoes = await shoesRes.json();
            if(clothingRes.ok) db.clothing = await clothingRes.json();
            
            updateBrandsList();
        } catch (error) {
            console.error('Error loading databases:', error);
            // Fallback for development if no local server
            alert("Error loading JSON data. Ensure you are running through a local server (e.g., Live Server, python -m http.server)");
        }
    }

    // Handlers
    function updateBrandsList() {
        const product = productSelect.value;
        const category = categorySelect.value;
        brandSelect.innerHTML = '<option value="" disabled selected>Selecciona una marca</option>';
        sizeSelect.innerHTML = '<option value="" disabled selected>Selecciona un talle</option>';
        sizeSelect.disabled = true;
        compareBtn.disabled = true;

        if (!db[product]) return;

        const brands = Object.keys(db[product]);
        brands.forEach(brand => {
            if (db[product][brand] && db[product][brand][category]) {
                const opt = document.createElement('option');
                opt.value = brand;
                opt.textContent = brand.charAt(0).toUpperCase() + brand.slice(1);
                brandSelect.appendChild(opt);
            }
        });
        
        // Update SVG illustration based on product
        if (product === 'shoes' && window.shoeSVG) svgContainer.innerHTML = window.shoeSVG;
        else if (product === 'clothing' && window.bodySVG) svgContainer.innerHTML = window.bodySVG;
    }

    function updateSizesList() {
        const product = productSelect.value;
        const category = categorySelect.value;
        const brand = brandSelect.value;
        
        sizeSelect.innerHTML = '<option value="" disabled selected>Selecciona un talle</option>';
        sizeSelect.disabled = false;
        compareBtn.disabled = true;

        if (!brand || !db[product] || !db[product][brand][category]) return;

        const dataList = db[product][brand][category].sizes;
        dataList.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.us;
            opt.textContent = `US ${item.us} (${item.cm} CM)`;
            sizeSelect.appendChild(opt);
        });
    }

    function handleCompare() {
        const product = productSelect.value;
        const category = categorySelect.value;
        const searchMode = document.querySelector('input[name="searchMode"]:checked').value;
        
        let targetCM = null;
        const sourceBrand = brandSelect.value;

        if (searchMode === 'size') {
            const sizeValue = sizeSelect.value;
            const sizeData = db[product][sourceBrand][category].sizes.find(s => s.us == sizeValue);
            if(sizeData) targetCM = sizeData.cm;
        } else {
            targetCM = parseFloat(measureInput.value);
        }

        if (!targetCM) return;

        renderResultsList(product, category, targetCM);
        showWarnings(product, category, sourceBrand);
    }

    function renderResultsList(product, category, targetCM) {
        resultsBody.innerHTML = '';
        emptyState.classList.add('hidden');
        resultsTable.classList.remove('hidden');

        const brands = Object.keys(db[product]);
        
        brands.forEach(brand => {
            if (!db[product][brand] || !db[product][brand][category]) return;
            
            const sizes = db[product][brand][category].sizes;
            
            // Find closest match by CM
            let closestFit = sizes.reduce((prev, curr) => {
                return (Math.abs(curr.cm - targetCM) < Math.abs(prev.cm - targetCM) ? curr : prev);
            });

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="brand-cell">
                    ${brand.charAt(0).toUpperCase() + brand.slice(1)}
                </td>
                <td>${closestFit.us || '-'}</td>
                <td>${closestFit.uk || '-'}</td>
                <td>${closestFit.eu || '-'}</td>
                <td>${closestFit.br || '-'}</td>
                <td>${closestFit.py || '-'}</td>
                <td class="highlight-col">${closestFit.cm || '-'}</td>
            `;
            resultsBody.appendChild(tr);
        });
        
        highlightSVGParts(targetCM);
    }
    
    function showWarnings(product, category, sourceBrand) {
        brandWarning.classList.add('hidden');
        if(!sourceBrand) return;
        
        if (db[product] && db[product][sourceBrand] && db[product][sourceBrand][category] && db[product][sourceBrand][category].warning) {
            brandWarning.textContent = db[product][sourceBrand][category].warning;
            brandWarning.classList.remove('hidden');
        }
    }
    
    function highlightSVGParts(cm) {
        // Animate some part of SVG to show interactivity
        const svgLines = document.querySelectorAll('.svg-container svg path, .svg-container svg line');
        svgLines.forEach(line => {
            line.classList.add('highlight');
            setTimeout(() => line.classList.remove('highlight'), 1000);
        });
    }

    // Toggle Search Modes
    searchModeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'size') {
                sizeInputGroup.classList.remove('hidden');
                measureInputGroup.classList.add('hidden');
            } else {
                sizeInputGroup.classList.add('hidden');
                measureInputGroup.classList.remove('hidden');
                sizeSelect.value = "";
                brandSelect.value = "";
            }
            checkFormValidity();
        });
    });

    function checkFormValidity() {
        const mode = document.querySelector('input[name="searchMode"]:checked').value;
        if (mode === 'size') {
            compareBtn.disabled = !sizeSelect.value;
        } else {
            compareBtn.disabled = !measureInput.value || measureInput.value <= 0;
        }
    }

    // Event Listeners
    productSelect.addEventListener('change', updateBrandsList);
    categorySelect.addEventListener('change', updateBrandsList);
    brandSelect.addEventListener('change', updateSizesList);
    sizeSelect.addEventListener('change', checkFormValidity);
    measureInput.addEventListener('input', checkFormValidity);
    compareBtn.addEventListener('click', handleCompare);

    // Init
    loadSVGs();
    loadData();
});
