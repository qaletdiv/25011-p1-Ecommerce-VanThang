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
    if (cart[index].quantity <= 0) cart.splice(index, 1); // Xóa nếu số lượng <= 0
    saveCart(cart);
    loadOrderSummary();
  }
}

// Load danh sách sản phẩm trong trang thanh toán
function loadOrderSummary() {
  const cart = getCart();
  const orderItemsContainer = document.getElementById("order-items");
  const totalElement = document.getElementById("order-total");
  const countElement = document.querySelector(".count_item");

  if (!cart.length) {
    orderItemsContainer.innerHTML = "<p>Giỏ hàng trống!</p>";
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
          <p class="price_cart">Giá: <span>$${item.price}</span>  <span> x ${item.quantity}</span>  </p>
          <p>Tạm tính: $${subtotal.toFixed(2)}</p>
        </div>
      </div>
    `;
  });

  orderItemsContainer.innerHTML = html;
  totalElement.textContent = `$${total.toFixed(2)}`;
  if (countElement) countElement.textContent = cart.reduce((a, c) => a + c.quantity, 0);

  // Gắn sự kiện tăng/giảm
  document.querySelectorAll(".increase").forEach(btn => {
    btn.addEventListener("click", () => updateQuantity(btn.dataset.name, 1));
  });
  document.querySelectorAll(".decrease").forEach(btn => {
    btn.addEventListener("click", () => updateQuantity(btn.dataset.name, -1));
  });
}

// Xử lý đặt hàng
document.getElementById("place-order").addEventListener("click", (e) => {
  e.preventDefault();

  // Lấy dữ liệu từ form
  const email = document.querySelector('input[type="email"]').value.trim();
  const name = document.querySelector('input[type="text"]').value.trim();
  const address = document.querySelector('input[placeholder="Enter your address"]').value.trim();
  const phone = document.querySelector('input[type="number"]').value.trim();

  if (!email || !name || !address || !phone) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  const cart = getCart();
  if (!cart.length) {
    alert("Giỏ hàng trống, không thể đặt hàng!");
    return;
  }

  // Lưu thông tin đơn hàng
  const orderInfo = {
    customer: { email, name, address, phone },
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  };

  localStorage.setItem("lastOrder", JSON.stringify(orderInfo));
  localStorage.removeItem("cart"); // Xóa giỏ hàng

  window.location.href = "order_success.html"; // Chuyển sang trang thành công
});

// Load khi vào trang
document.addEventListener("DOMContentLoaded", loadOrderSummary);
