// Lấy giỏ hàng từ localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Lưu giỏ hàng vào localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Cập nhật số lượng sản phẩm
function updateQuantity(productName, change) {
  const cart = getCart();
  const index = cart.findIndex(item => item.name === productName);

  if (index !== -1) {
    cart[index].quantity += change;

    // Nếu quantity <= 0 thì xóa sản phẩm
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }

    saveCart(cart);
    loadOrderSummary();
  }
}

// Load sản phẩm vào Order Summary
function loadOrderSummary() {
  const cart = getCart();
  const orderItemsContainer = document.getElementById("order-items");
  const totalElement = document.getElementById("order-total");
  const countElement = document.querySelector(".count_item");

  if (!cart.length) {
    orderItemsContainer.innerHTML = "<p>Your cart is empty!</p>";
    totalElement.textContent = "$0";
    if (countElement) countElement.textContent = 0;
    return;
  }

  let total = 0;
  let html = "";

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    html += `
      <div class="item_cart">
        <img src="${item.img}" alt="${item.name}">
        <div class="content">
          <h4>${item.name}</h4>
          <p class="price_cart">Price: <span>$${item.price}</span></p>
          <div class="quantity-controls">
            <button  class="decrease qty-btn" data-name="${item.name}">-</button>
            <span>${item.quantity}</span>
            <button class="increase qty-btn" data-name="${item.name}">+</button>
          </div>
          <p>Subtotal: $${subtotal.toFixed(2)}</p>
        </div>
      </div>
    `;
  });

  orderItemsContainer.innerHTML = html;
  totalElement.textContent = `$${total.toFixed(2)}`;
  if (countElement) countElement.textContent = cart.reduce((a, c) => a + c.quantity, 0);

  // Gắn sự kiện tăng/giảm số lượng
  document.querySelectorAll(".increase").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      updateQuantity(name, 1);
    });
  });

  document.querySelectorAll(".decrease").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      updateQuantity(name, -1);
    });
  });
}

// Đặt hàng (ví dụ xóa giỏ hàng)
document.getElementById("place-order").addEventListener("click", (e) => {
  e.preventDefault();
  alert("Order placed successfully!");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
});

// Load khi vào trang
document.addEventListener("DOMContentLoaded", loadOrderSummary);
