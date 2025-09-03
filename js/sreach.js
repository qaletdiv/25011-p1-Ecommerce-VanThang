document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.searchInput');
    const resultsDiv = document.querySelector('.search-results');

    if (!searchInput || !resultsDiv) return;

    let products = [];

    // Load dữ liệu từ JSON
    fetch('js/items.json')
        .then(res => res.json())
        .then(data => {
            products = data;
        })
        .catch(err => console.error('Error loading items.json:', err));

    // Lấy các filter đã chọn
    function getSelectedFilters() {
        const categories = [...document.querySelectorAll("input[name='category']:checked")].map(el => el.value);
        const brands = [...document.querySelectorAll("input[name='brand']:checked")].map(el => el.value);
        const colors = [...document.querySelectorAll("input[name='color']:checked")].map(el => el.value);

        return { categories, brands, colors };
    }

    // Lọc dữ liệu theo search + filter
    function filterProducts() {
        const query = searchInput.value.toLowerCase();
        const { categories, brands, colors } = getSelectedFilters();

        return products.filter(product => {
            const matchQuery = product.name.toLowerCase().includes(query);
            const matchCategory = categories.length ? categories.includes(product.category) : true;
            const matchBrand = brands.length ? brands.includes(product.brand) : true;
            const matchColor = colors.length ? colors.includes(product.color) : true;

            return matchQuery && matchCategory && matchBrand && matchColor;
        });
    }

   function renderResults(filtered) {
    if (!searchInput.value.trim() || filtered.length === 0) {
        resultsDiv.style.display = 'none';
        resultsDiv.innerHTML = '';
        return;
    }

    resultsDiv.innerHTML = filtered.map(p => `
        <div class="product-item" onclick="window.location.href='product_detail.html?id=${p.id}'">
            <img src="${p.img}" alt="${p.name}">
            <div>
                <p>${p.name}</p>
                <p>$${p.price}</p>
            </div>
        </div>
    `).join('');

    resultsDiv.style.display = 'block';
}

    // Khi gõ search
    searchInput.addEventListener('input', () => {
        const filtered = filterProducts();
        renderResults(filtered);
    });

    // Khi click vào filter
    document.querySelectorAll(".filter input[type='checkbox']").forEach(input => {
        input.addEventListener('change', () => {
            const filtered = filterProducts();
            renderResults(filtered);
        });
    });

    // ẩn dropdown khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsDiv.contains(e.target)) {
            resultsDiv.style.display = 'none';
        }
    });

    // hiện lại dropdown khi click vào input
    searchInput.addEventListener('focus', () => {
        const filtered = filterProducts();
        renderResults(filtered);
    });
});
