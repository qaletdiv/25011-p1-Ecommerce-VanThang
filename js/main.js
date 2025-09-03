// ========== CART TOGGLE ==========
var cart = document.querySelector('.cart');

function open_cart() {
    cart.classList.add("active")
}
function close_cart() {
    cart.classList.remove("active")
}

// ========== MENU TOGGLE ==========
var menu = document.querySelector('#menu');

function open_menu() {
    menu.classList.add("active")
}
function close_menu() {
    menu.classList.remove("active")
}

// ========== CHANGE BIG IMAGE ==========
function ChangeItemImage(img) {
    let bigImage = document.getElementById("bigImg");
    if (bigImage) bigImage.src = img;
}

// ========== CART LOGIC ==========
// đọc giỏ hàng từ localStorage
let product_cart = JSON.parse(localStorage.getItem("cart")) || [];

let items_in_cart = document.querySelector(".items_in_cart");
let count_item = document.querySelector('.count_item');
let count_item_cart = document.querySelector('.count_item_cart');
let price_cart_total = document.querySelector('.price_cart_total');
let price_cart_Head = document.querySelector('.price_cart_Head');

// lưu xuống localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(product_cart));
}

// thêm sản phẩm vào giỏ
function addToCart(product) {
    const exist = product_cart.find(p => p.id === product.id);
    if (exist) {
        exist.quantity += 1;
    } else {
        product_cart.push({ ...product, quantity: 1 }); // đảm bảo có quantity
    }
    saveCart();
    getCartItems();
}

// render giỏ hàng
function getCartItems() {
    let total_price = 0;
    let items_c = "";

    for (let i = 0; i < product_cart.length; i++) {
        const p = product_cart[i];
        items_c += `
        <div class="item_cart">
            <img src="${p.img}" alt="">
            <div class="content">
                <h4>${p.name}</h4>
                <p class="price_cart">$${p.price}</p>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="changeQuantity(${i}, -1)">-</button>
                    <span class="qty">${p.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${i}, 1)">+</button>
                </div>
            </div>
            <button onClick="remove_from_cart(${i})" class="delete_item"><i class="fa-solid fa-trash-can"></i></button>
        </div>
        `;
        total_price += p.price * p.quantity;
    }

    if (items_in_cart) items_in_cart.innerHTML = items_c;
    if (price_cart_Head) price_cart_Head.innerHTML = "$" + total_price;
    if (count_item) count_item.innerHTML = product_cart.length;
    if (count_item_cart) count_item_cart.innerHTML = `(${product_cart.length} Item${product_cart.length > 1 ? 's' : ''} in Cart)`;
    if (price_cart_total) price_cart_total.innerHTML = "$" + total_price;
}

// xóa sản phẩm khỏi giỏ
function remove_from_cart(index) {
    product_cart.splice(index, 1);
    saveCart();
    getCartItems();
}

// khi load trang thì render lại giỏ
window.addEventListener("DOMContentLoaded", getCartItems);

// ========== PRODUCT DETAIL PAGE ==========
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

if (productId) {
    fetch("js/items.json")
        .then(res => res.json())
        .then(products => {
            const product = products.find(p => p.id == productId);
            if (!product) {
                document.getElementById("product-detail").innerHTML = "<p>Không tìm thấy sản phẩm!</p>";
                return;
            }

            document.getElementById("product-detail").innerHTML = `
                <div class="img_item">
                    <div class="big_img">
                        <img id="bigImg" src="${product.img}" alt="${product.name}">
                    </div>
                    <div class="sm_imgs">
                        <img onclick="ChangeItemImage(this.src)" src="${product.img}" alt="">
                        <img onclick="ChangeItemImage(this.src)" src="${product.img_hover}" alt="">
                    </div>
                </div>

                <div class="details_item">
                    <h1 class="name">${product.name}</h1>
                    <div class="price">
                        <p><span>$${product.price}</span></p>
                        ${product.old_price ? `<p class="old_price">$${product.old_price}</p>` : ""}
                    </div>
                    <h5>Availability: <span>In Stock</span></h5>
                    <p class="text_p">Sản phẩm chính hãng, chất lượng đảm bảo.</p>
                    <button id="add-to-cart-btn">Add to cart <i class="fa-solid fa-cart-arrow-down"></i></button>
                    <div class="icons">
                        <span><i class="fa-regular fa-heart"></i></span>
                        <span><i class="fa-solid fa-sliders"></i></span>
                        <span><i class="fa-solid fa-print"></i></span>
                        <span><i class="fa-solid fa-share-nodes"></i></span>
                    </div>
                </div>
            `;

            // gắn sự kiện cho nút Add to cart
            document.getElementById("add-to-cart-btn").addEventListener("click", () => {
                addToCart(product);
            });
        })
        .catch(err => {
            console.error("Lỗi load sản phẩm:", err);
            document.getElementById("product-detail").innerHTML = "<p>Lỗi tải sản phẩm!</p>";
        });
}

// ========== BACK TO TOP ==========
let back_to_top = document.querySelector(".back_to_top");
if (back_to_top) {
    back_to_top.addEventListener("click", function(){
        window.scrollTo({
            top: 0,
            behavior:"smooth"
        })
    })
}
// ========== INDEX PAGE ==========
const productList = document.getElementById("product-list");
if (productList) {
    fetch("js/items.json")
        .then(res => res.json())
        .then(products => {
            // Render HTML
            productList.innerHTML = products.map(product => `
                <div class="product">
                    <a href="product_detail.html?id=${product.id}">
                        <img src="${product.img}" alt="${product.name}">
                        <h3>${product.name}</h3>
                    </a>
                    <p>$${product.price}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        Add to cart
                    </button>
                </div>
            `).join("");

            // Gắn sự kiện Add to Cart cho tất cả nút
            document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const productId = btn.getAttribute("data-id");
                    const product = products.find(p => p.id == productId);
                    if (product) addToCart({
                        ...product,
                        price: Number(product.price) // ép số để tránh NaN
                    });
                });
            });
        })
        .catch(err => console.error("Lỗi load sản phẩm:", err));
}
function changeQuantity(index, change) {
    const product = product_cart[index];
    product.quantity += change;

    // Nếu số lượng <= 0 thì xóa sản phẩm
    if (product.quantity <= 0) {
        product_cart.splice(index, 1);
    }

    saveCart();
    getCartItems();
}