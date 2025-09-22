// main.js (REPLACEMENT) -----------------------------------------

// ========== CART TOGGLE ==========
var cart = document.querySelector('.cart');

function open_cart() { if (cart) cart.classList.add("active") }
function close_cart() { if (cart) cart.classList.remove("active") }

// ========== MENU TOGGLE ==========
var menu = document.querySelector('#menu');

function open_menu() { if (menu) menu.classList.add("active") }
function close_menu() { if (menu) menu.classList.remove("active") }

// ========== CHANGE BIG IMAGE ==========
function ChangeItemImage(img) {
    let bigImage = document.getElementById("bigImg");
    if (bigImage) bigImage.src = img;
}

// ========== CART LOGIC ==========
// đọc giỏ hàng từ localStorage (chuẩn hóa)
let product_cart = JSON.parse(localStorage.getItem("cart")) || [];
product_cart = product_cart.map(item => ({
    ...item,
    id: Number(item.id),
    price: Number(item.price),
    quantity: Number(item.quantity || item.qty || 1)
}));

let items_in_cart = document.querySelector(".items_in_cart");
let count_item = document.querySelector('.count_item');
let count_item_cart = document.querySelector('.count_item_cart');
let price_cart_total = document.querySelector('.price_cart_total');
let price_cart_Head = document.querySelector('.price_cart_Head');

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(product_cart));
}

// Thay đổi: addToCart chấp nhận product object và quantity
function addToCart(product, quantity = 1) {
    if (!product) return;
    const idNum = Number(product.id);
    const priceNum = Number(product.price);

    const existIndex = product_cart.findIndex(p => Number(p.id) === idNum);
    if (existIndex > -1) {
        product_cart[existIndex].quantity = Number(product_cart[existIndex].quantity || 0) + Number(quantity);
    } else {
        // push normalized item
        product_cart.push({
            id: idNum,
            name: product.name,
            img: product.img,
            price: priceNum,
            quantity: Number(quantity)
        });
    }
    saveCart();
    getCartItems();
}

// render giỏ hàng
function getCartItems() {
    let total_price = 0;
    let total_quantity = 0;
    let items_c = "";

    for (let i = 0; i < product_cart.length; i++) {
        const p = product_cart[i];
        const subtotal = Number(p.price) * Number(p.quantity);
        total_price += subtotal;
        total_quantity += Number(p.quantity);

        items_c += `
        <div class="item_cart">
            <img src="${p.img}" alt="">
            <div class="content">
                <h4>${p.name}</h4>
                <p class="price_cart">$${Number(p.price).toFixed(2)}</p>

                <div class="quantity-controls">
                    <button class="qty-btn" onclick="changeQuantity(${i}, -1)">-</button>
                    <span class="qty">${p.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${i}, 1)">+</button>
                    <p class="line_total"> = $${subtotal.toFixed(2)}</p>
                </div>

            </div>
            <button onClick="remove_from_cart(${i})" class="delete_item"><i class="fa-solid fa-trash-can"></i></button>
        </div>
        `;
    }

    if (items_in_cart) items_in_cart.innerHTML = items_c || "<p>Your cart is empty!</p>";
    if (price_cart_Head) price_cart_Head.innerHTML = "$" + total_price.toFixed(2);
    if (count_item) count_item.innerHTML = total_quantity;
    if (count_item_cart) count_item_cart.innerHTML = `(${total_quantity} Item${total_quantity > 1 ? 's' : ''} in Cart)`;
    if (price_cart_total) price_cart_total.innerHTML = "$" + total_price.toFixed(2);
}

// xóa sản phẩm khỏi giỏ
function remove_from_cart(index) {
    product_cart.splice(index, 1);
    saveCart();
    getCartItems();
}

// thay đổi số lượng (trên giao diện cart)
function changeQuantity(index, change) {
    if (!product_cart[index]) return;
    product_cart[index].quantity = Number(product_cart[index].quantity || 0) + Number(change);

    if (product_cart[index].quantity <= 0) {
        product_cart.splice(index, 1);
    }

    saveCart();
    getCartItems();
}

// khi load trang thì render lại giỏ
window.addEventListener("DOMContentLoaded", getCartItems);

// ========== PRODUCT DETAIL PAGE ==========
const urlParams = new URLSearchParams(window.location.search);
const productIdParam = urlParams.get("id");

// chỉ chạy nếu có container detail
const productDetailContainer = document.getElementById("product-detail");

if (productDetailContainer && productIdParam !== null) {
    const productId = parseInt(productIdParam, 10);

    fetch("js/items.json")
        .then(res => {
            if (!res.ok) throw new Error("Không thể load js/items.json (status " + res.status + ")");
            return res.json();
        })
        .then(products => {
            // tìm sản phẩm (id kiểu number)
            const product = products.find(p => Number(p.id) === productId);
            if (!product) {
                productDetailContainer.innerHTML = "<p>Không tìm thấy sản phẩm!</p>";
                return;
            }

            // render phần chi tiết (ảnh + info + quantity controls + nút add)
            productDetailContainer.innerHTML = `
                <div class="img_item">
                    <div class="big_img">
                        <img id="bigImg" src="${product.img}" alt="${product.name}">
                    </div>
                    <div class="sm_imgs">
                        <img onclick="ChangeItemImage(this.src)" src="${product.img}" alt="">
                        <img onclick="ChangeItemImage(this.src)" src="${product.img_hover || product.img}" alt="">
                    </div>
                </div>

                <div class="details_item">
                    <h1 class="name">${product.name}</h1>
                    <div class="price">
                        <p><span>$${Number(product.price).toFixed(2)}</span></p>
                        ${product.old_price ? `<p class="old_price">$${Number(product.old_price).toFixed(2)}</p>` : ""}
                    </div>
                    <h5>Availability: <span>In Stock</span></h5>
                    <p class="text_p">Sản phẩm chính hãng, chất lượng đảm bảo.</p>

                    <div class="quantity_control">
                        <button id="decreaseQty" class="qty-btn">-</button>
                        <input type="number" id="productQty" value="1" min="1" />
                        <button id="increaseQty" class="qty-btn">+</button>
                    </div>

                    <button id="add-to-cart-btn" class="btn primary">Add to cart <i class="fa-solid fa-cart-arrow-down"></i></button>

                    <div class="icons" style="margin-top:10px">
                        <span><i class="fa-regular fa-heart"></i></span>
                        <span><i class="fa-solid fa-sliders"></i></span>
                        <span><i class="fa-solid fa-print"></i></span>
                        <span><i class="fa-solid fa-share-nodes"></i></span>
                    </div>
                </div>
            `;

            // quantity control listeners
            const qtyInput = document.getElementById("productQty");
            document.getElementById("decreaseQty").addEventListener("click", () => {
                if (Number(qtyInput.value) > 1) qtyInput.value = Number(qtyInput.value) - 1;
            });
            document.getElementById("increaseQty").addEventListener("click", () => {
                qtyInput.value = Number(qtyInput.value) + 1;
            });

            // Add to cart từ trang chi tiết
            document.getElementById("add-to-cart-btn").addEventListener("click", () => {
                const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
                addToCart(product, qty); // sử dụng hàm addToCart đã chuẩn hóa
                // tùy chọn: mở cart để user thấy
                open_cart();
            });

            // ========== Random related products (ưu tiên cùng category) ==========
            let relatedCandidates = products.filter(p => Number(p.id) !== productId);

            // ưu tiên cùng category (nếu có) — nếu không đủ thì lấy từ toàn bộ
            const sameCat = relatedCandidates.filter(p => p.category === product.category);
            relatedCandidates = (sameCat.length >= 4) ? sameCat : relatedCandidates;

            // random và lấy tối đa 4
            const related = relatedCandidates.sort(() => 0.5 - Math.random()).slice(0, 4);

            // render related dưới main (chèn sau #product-detail)
            const relatedHtml = `
                <section class="related_products">
                    <div class="container">
                        <div class="product_list related_grid icons">
                        <h3>Related Products</h3>

                            ${related.map(r => `
                                <div class="product_card ">
                                    <a href="product_detail.html?id=${r.id}">
                                        <img src="${r.img}" alt="${r.name}" onmouseover="this.src='${r.img_hover || r.img}'" onmouseout="this.src='${r.img}'">
                                        <h4>${r.name}</h4>
                                    </a>
                                    <p class="price">$${Number(r.price).toFixed(2)} ${r.old_price ? `<span class="old-price">$${Number(r.old_price).toFixed(2)}</span>` : ''}</p>
                                    <button class="btn add-related" data-id="${r.id}" data-name="${r.name}" data-price="${r.price}" data-img="${r.img}">Add to cart</button>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </section>
            `;

            // chèn (nếu đã có phần related trước đó thì remove trước)
            // tránh duplicate khi script chạy nhiều lần
            const prevRelated = document.querySelector(".related_products");
            if (prevRelated) prevRelated.remove();
            productDetailContainer.insertAdjacentHTML('afterend', relatedHtml);

            // gắn event cho nút Add to cart trong related
            document.querySelectorAll(".add-related").forEach(btn => {
                btn.addEventListener("click", () => {
                    const p = {
                        id: Number(btn.dataset.id),
                        name: btn.dataset.name,
                        price: Number(btn.dataset.price),
                        img: btn.dataset.img
                    };
                    addToCart(p, 1);
                });
            });

        })
        .catch(err => {
            console.error("Lỗi load sản phẩm:", err);
            productDetailContainer.innerHTML = "<p>Lỗi tải sản phẩm!</p>";
        });
} // end product detail

// ========== INDEX PAGE (nếu có #product-list) ==========
const productList = document.getElementById("product-list");
if (productList) {
    fetch("js/items.json")
        .then(res => {
            if (!res.ok) throw new Error("Không thể load js/items.json (status " + res.status + ")");
            return res.json();
        })
        .then(products => {
            productList.innerHTML = products.map(product => `
                <div class="product">
                    <a href="product_detail.html?id=${product.id}">
                        <img src="${product.img}" alt="${product.name}">
                        <h3>${product.name}</h3>
                    </a>
                    <p>$${Number(product.price).toFixed(2)}</p>
                    <button class="add-to-cart-btn"
                        data-id="${product.id}"
                        data-name="${encodeHTML(product.name)}"
                        data-price="${product.price}"
                        data-img="${product.img}">
                        Add to cart
                    </button>
                </div>
            `).join("");

            // Gắn sự kiện Add to Cart
            document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const product = {
                        id: Number(btn.dataset.id),
                        name: btn.dataset.name,
                        price: Number(btn.dataset.price),
                        img: btn.dataset.img
                    };
                    addToCart(product, 1);
                    alert(`${product.name} added to cart!`);
                });
            });
        })
        .catch(err => console.error("Lỗi load sản phẩm:", err));
}

// utility: simple encode (avoid breaking attributes)
function encodeHTML(str){
    if (!str) return "";
    return String(str).replace(/"/g,'&quot;').replace(/'/g,"&#39;");
}

// ========== BACK TO TOP ==========
let back_to_top = document.querySelector(".back_to_top");
if (back_to_top) {
    back_to_top.addEventListener("click", function(){
        window.scrollTo({ top: 0, behavior:"smooth" });
    });
}
