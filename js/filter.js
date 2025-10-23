// Lấy tất cả link danh mục
const categoryLinks = document.querySelectorAll(".category-link");
const productsContainer = document.querySelector("#swiper_items_sale"); // hoặc id mà Thắng hiển thị sản phẩm

// Giả sử dữ liệu nằm trong file JSON hoặc mảng `products`
import products from "./data.json" assert { type: "json" };

// Gắn sự kiện click cho từng danh mục
categoryLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const selectedCategory = link.dataset.category;
    filterProducts(selectedCategory);
  });
});

// Hàm lọc sản phẩm
function filterProducts(category) {
  let filtered = [];

  if (category === "all") {
    filtered = products;
  } else {
    filtered = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  renderProducts(filtered);
}

// Hàm hiển thị sản phẩm
function renderProducts(list) {
  productsContainer.innerHTML = "";

  if (list.length === 0) {
    productsContainer.innerHTML = `<p class="no-result">Không có sản phẩm nào trong danh mục này.</p>`;
    return;
  }

  list.forEach(p => {
    const item = document.createElement("div");
    item.classList.add("swiper-slide", "product-item");
    item.innerHTML = `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p>$${p.price}</p>
      </div>
    `;
    productsContainer.appendChild(item);
  });
}
