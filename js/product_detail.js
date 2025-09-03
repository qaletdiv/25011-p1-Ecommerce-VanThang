// // Lấy ID từ URL (vd: product_detail.html?id=2)
// const urlParams = new URLSearchParams(window.location.search);
// const productId = urlParams.get("id");

// // Load dữ liệu từ items.json
// fetch("js/items.json")
//     .then(res => res.json())
//     .then(products => {
//         const product = products.find(p => p.id == productId);
//         if (!product) {
//             document.getElementById("product-detail").innerHTML = "<p>Không tìm thấy sản phẩm!</p>";
//             return;
//         }

//         document.getElementById("product-detail").innerHTML = `
//             <div class="img_item">
//                 <div class="big_img">
//                     <img id="bigImg" src="${product.img}" alt="${product.name}">
//                 </div>
//                 <div class="sm_imgs">
//                     <img onclick="document.getElementById('bigImg').src=this.src" src="${product.img}" alt="">
//                     <img onclick="document.getElementById('bigImg').src=this.src" src="${product.img_hover}" alt="">
//                 </div>
//             </div>

//             <div class="details_item">
//                 <h1 class="name">${product.name}</h1>
//                 <div class="price">
//                     <p><span>$${product.price}</span></p>
//                     ${product.old_price ? `<p class="old_price">$${product.old_price}</p>` : ""}
//                 </div>
//                 <h5>Availability: <span>In Stock</span></h5>
//                 <p class="text_p">Sản phẩm chính hãng, chất lượng đảm bảo.</p>
//                 <button>add to cart <i class="fa-solid fa-cart-arrow-down"></i></button>
//                 <div class="icons">
//                     <span><i class="fa-regular fa-heart"></i></span>
//                     <span><i class="fa-solid fa-sliders"></i></span>
//                     <span><i class="fa-solid fa-print"></i></span>
//                     <span><i class="fa-solid fa-share-nodes"></i></span>
//                 </div>
//             </div>
//         `;
//     })
//     .catch(err => {
//         console.error("Lỗi load sản phẩm:", err);
//         document.getElementById("product-detail").innerHTML = "<p>Lỗi tải sản phẩm!</p>";
//     });
