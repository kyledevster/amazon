import { orders } from "../data/orders.js";
import { products, loadProducts } from "../data/products.js";
import { search } from "../data/search.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
async function loadPage() {
  try {
    await loadProducts();

    document.querySelector('.js-search-button').addEventListener('click', search);
    document.querySelector('.js-search-bar').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        search();
      }
    });

    const urlParams = new URLSearchParams(window.location.search);

    const orderId = urlParams.get('orderId');
    const productId = urlParams.get('productId');

    let matchingOrder;
    let matchingProduct;
    let matchingProduct2;

    orders.forEach((order) => {
      if (order.id === orderId) {
        matchingOrder = order;
      }
    });
    matchingOrder.products.forEach((product) => {
      if (product.productId === productId) {
        matchingProduct = product;
      }
    });

    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct2 = product;
      }
    });
    let percent = 0;
    const deliverInDays = dayjs(matchingProduct.estimatedDeliveryTime).diff(dayjs(matchingOrder.orderTime), 'day');

    const daysPassed = dayjs().diff(dayjs(matchingOrder.orderTime), 'day');

    if (deliverInDays <= daysPassed) {
      percent = 100;
    } else if (Math.floor((daysPassed / deliverInDays) * 100) !== 0) {
      percent = Math.floor((daysPassed / deliverInDays) * 100);
    } else {
      percent = 5;
    }


    function renderHTML() {

      function getDeliveryDate() {
        return dayjs(matchingProduct.estimatedDeliveryTime).format('dddd, MMMM D');
      }

      let html =
        `
  <a class="back-to-orders-link link-primary" href="orders.html">
    View all orders
  </a>

  <div class="delivery-date">
    Arriving on ${getDeliveryDate()}
  </div>

  <div class="product-info">
    ${matchingProduct2.name}
  </div>

  <div class="product-info">
    Quantity: ${matchingProduct.quantity}
  </div>

  <img class="product-image" src="${matchingProduct2.image}">

  <div class="progress-labels-container">
    <div class="progress-label ${percent <= 48 ? 'current-status' : ''}">
      Preparing
    </div>
    <div class="progress-label ${percent < 100 && percent > 48 ? 'current-status' : ''}">
      Shipped
    </div>
    <div class="progress-label ${percent === 100 ? 'current-status' : ''}">
      Delivered
    </div>
  </div>

  <div class="progress-bar-container">
    <div class="progress-bar js-progress-bar"></div>
  </div>
  `;
      document.querySelector('.js-order-tracking').innerHTML = html;
      document.querySelector('.js-progress-bar').style.width = percent + '%';
    }
    renderHTML();
  } catch (error) {
    console.error('Error: Product Not Found', error);
  }
}
loadPage();