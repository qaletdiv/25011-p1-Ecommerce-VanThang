// all_products.js

document.addEventListener("DOMContentLoaded", () => {

    // ---- Filter toggle ----
    const filter = document.querySelector(".filter");
    if(filter){
        window.open_close_filter = function() {
            filter.classList.toggle("active");
        }
    }

    // ---- Load products from JSON ----
    let all_products_json = [];

    fetch('js/items.json')
        .then(response => response.json())
        .then(data => {
            all_products_json = data; 
            renderProducts(all_products_json); 
        })
        .catch(err => console.error("Error loading JSON:", err));

    // ---- Get selected filters ----
    function getSelectedFilters() {
        const categories = [...document.querySelectorAll("input[name='category']:checked")].map(el => el.value);
        const brands = [...document.querySelectorAll("input[name='brand']:checked")].map(el => el.value);
        const colors = [...document.querySelectorAll("input[name='color']:checked")].map(el => el.value);
        return { categories, brands, colors };
    }

    // ---- Apply filter ----
    function applyFilter() {
        const { categories, brands, colors } = getSelectedFilters();

        let filtered = all_products_json.filter(product => {
            const matchCategory = categories.length ? categories.includes(product.category) : true;
            const matchBrand = brands.length ? brands.includes(product.brand) : true;
            const matchColor = colors.length ? colors.includes(product.color) : true;

            return matchCategory && matchBrand && matchColor;
        });

        filtered = sortProducts(filtered);
        renderProducts(filtered);
    }

    // ---- Add change event to filter checkboxes ----
    const filterInputs = document.querySelectorAll(".filter input[type='checkbox']");
    if(filterInputs.length){
        filterInputs.forEach(input => {
            input.addEventListener("change", applyFilter);
        });
    }

    // ---- Sort products ----
    function sortProducts(products) {
        const sortSelect = document.getElementById("sort");
        if(!sortSelect) return products;

        const sortValue = sortSelect.value;
        if (sortValue === "price-asc") {
            products.sort((a, b) => a.price - b.price);
        } else if (sortValue === "price-desc") {
            products.sort((a, b) => b.price - a.price);
        } else if (sortValue === "name-asc") {
            products.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortValue === "name-desc") {
            products.sort((a, b) => b.name.localeCompare(a.name));
        }

        return products;
    }

    // ---- Add change event to sort select ----
    const sort = document.getElementById("sort");
    if(sort){
        sort.addEventListener("change", applyFilter);
    }

    // ---- Render products ----
    function renderProducts(products) {
        const products_dev = document.getElementById("products_dev");
        if(!products_dev) return; // tránh lỗi nếu không có element

        products_dev.innerHTML = ""; 

        products.forEach(product => {
            const old_price_pargrahp = product.old_price ? `<p class="old_price">$${product.old_price}</p>` : "";
            const percent_disc_div = product.old_price ? `<span class="sale_present">%${Math.floor((product.old_price - product.price) / product.old_price * 100)}</span>` : "";

            products_dev.innerHTML += `
                <div class="product swiper-slide">
                    <div class="icons">
                        <span><i onclick='addToCart(${JSON.stringify(product)})' class="fa-solid fa-cart-plus"></i></span>
                        <span><i class="fa-solid fa-heart"></i></span>
                        <span><i class="fa-solid fa-share"></i></span>
                    </div>
                    ${percent_disc_div}
                    <div class="img_product">
                        <img src="${product.img}" alt="">
                        <img class="img_hover" src="${product.img_hover}" alt="">
                    </div>
                    <h3 class="name_product"><a href="product_detail.html?id=${product.id}">${product.name}</a></h3>
                    <div class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <div class="price">
                        <p><span>$${product.price}</span></p>
                        ${old_price_pargrahp}
                    </div>
                </div>
            `;
        });
    }

});
