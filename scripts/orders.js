import { orders } from "../data/orders.js";
import { products, loadProducts } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { cart, updateCartQuantity } from "../data/cart.js";
import { search } from "../data/search.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

async function loadPage() {

  await loadProducts();

  document.querySelector('.js-search-button').addEventListener('click', search);
  document.querySelector('.js-search-bar').addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
      search();
    }
  })

  function renderOrdersHTML() {
    let html = orders.length === 0 ? `
    <div data-testid="empty-cart-message">
      Your cart is empty.
    </div>
    <a class="button-primary view-products-link" href="./" data-testid="view-products-link">
      View products
    </a>
  ` : '';

    function getDate(date) {
      return dayjs(date).format('MMMM D');
    }
    let matchingProducts = [];
    orders.reverse().forEach((order) => {
      let nestedHtml = '';
      console.log(order);
      order.products.forEach((orderProduct) => {
        let matchingItem;

        products.forEach((product) => {
          if (product.id === orderProduct.productId) {
            matchingItem = product;
            matchingProducts.push(product);
          }
        });

        nestedHtml += `
      
    <div class="product-image-container">
      <img src="${matchingItem.image}">
    </div>

    <div class="product-details">
      <div class="product-name">
        ${matchingItem.name}
      </div>
      <div class="product-delivery-date">
        Arriving on: ${getDate(orderProduct.estimatedDeliveryTime)}
      </div>
      <div class="product-quantity">
        Quantity: ${orderProduct.quantity}
      </div>
      <button class="buy-again-button button-primary js-buy-again-button">
        <img class="buy-again-icon" src="images/icons/buy-again.png">
        <span class="buy-again-message">Buy it again</span>
      </button>
    </div>

    <div class="product-actions">
        <button class="track-package-button button-secondary js-track-package-button-${matchingItem.id}-${order.id}">
          Track package
        </button>
    </div>

      `;
      });

      html += `
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${getDate(order.orderTime)}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${formatCurrency(order.totalCostCents)}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${order.id}</div>
        </div>
      </div>

      <div class="order-details-grid">${nestedHtml}</div>
    </div>
      `
    });

    document.querySelector('.js-cart-quantity').innerHTML = updateCartQuantity() === 0 ? '' : updateCartQuantity();

    document.querySelector('.js-orders-grid').innerHTML = html;


    document.querySelectorAll('.js-buy-again-button').forEach((button, i) => {
      let timeoutId;

      button.addEventListener('click', () => {
        document.querySelector('.js-cart-quantity').innerHTML = updateCartQuantity(matchingProducts[i].id, 1, '1');

        // Added message
        button.classList.add('added');

        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
          button.classList.remove('added')
        }, 2000);
      });
    });

    orders.reverse().forEach((order) => {
      let nestedHtml = '';

      order.products.forEach((orderProduct) => {
        let matchingItem;

        products.forEach((product) => {
          if (product.id === orderProduct.productId) {
            matchingItem = product;
            matchingProducts.push(product);

            document.querySelector(`.js-track-package-button-${matchingItem.id}-${order.id}`).addEventListener('click', () => {
              window.location.href = `tracking.html?orderId=${order.id}&productId=${matchingItem.id}`;
            });
          }
        });
      });
    });
  }
  renderOrdersHTML();
}
loadPage();