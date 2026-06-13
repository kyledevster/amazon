import { cart, saveToStorage, updateCartQuantity, deliveryOptions, emptyCart } from '../../data/cart.js';
import { products } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { renderPaymentSummary } from './paymentSummary.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
// ^--  // default export;



export function renderOrderSummary() {
  let html = cart.length === 0 ? `
    <div data-testid="empty-cart-message">
      Your cart is empty.
    </div>
    <a class="button-primary view-products-link" href="./" data-testid="view-products-link">
      View products
    </a>
  ` : '';

  function getDate(i) {
    let delayDays = deliveryOptions[i].delayDays;
    const now = dayjs();
    
    return now.add(delayDays, 'd').format('dddd, D MMMM');
  }
  (getDate(2))

  function getPrice(index) {
    if (deliveryOptions[index].priceCents === 0) {
      return 'FREE';
    } else {
      return `$${formatCurrency(deliveryOptions[index].priceCents)} -`;
    }
  }

  cart.forEach((cartItem) => {

    let matchingItem;
    products.forEach((product) => {
      if (product.id === cartItem.productId) {
        matchingItem = product;
      }
    });

    let matchingDeliveryOption;
    deliveryOptions.forEach((option) => {
      if (cartItem.deliveryOptionId === option.deliveryOptionId) {
        matchingDeliveryOption = option;
      }
    });

    html +=
      `
<div class="cart-item-container">
  <div class="delivery-date">
    Delivery date: ${getDate(deliveryOptions.indexOf(matchingDeliveryOption))}
  </div>

  <div class="cart-item-details-grid">
    <img class="product-image" src="${matchingItem.image}">

    <div class="cart-item-details">
      <div class="product-name">
        ${matchingItem.name}
      </div>
      <div class="product-price">
        $${formatCurrency(matchingItem.priceCents)}
      </div>
      <div class="product-quantity">
        <span>
          Quantity: <span class="quantity-label js-quantity-label-${matchingItem.id}">${cartItem.quantity}</span>
        </span>
        <span class="update-quantity-link link-primary js-update-quantity-link-${matchingItem.id}">
          Update
        </span>
        <input type="number" class="update-quantity-input js-update-quantity-input-${matchingItem.id} disappear">
        <button class="update-quantity-save-btn js-update-quantity-save-btn-${matchingItem.id} disappear">
          Save
        </button>
        <span class="delete-quantity-link link-primary js-delete-quantity-link-${matchingItem.id}">
          Delete
        </span>
      </div>
    </div>

    <div class="delivery-options">
      <div class="delivery-options-title">
        Choose a delivery option:
      </div>
      <div class="delivery-option">
        <input type="radio" ${matchingDeliveryOption.deliveryOptionId === '1' ? 'checked' : ''}
          class="delivery-option-input js-delivery-option-${matchingItem.id}"
          name="delivery-option-1-${matchingItem.id}" data-delivery-option="1">
        <div>
          <div class="delivery-option-date">
            ${getDate(0)}
          </div>
          <div class="delivery-option-price">
            ${getPrice(0)} Shipping
          </div>
        </div>
      </div>
      <div class="delivery-option">
        <input type="radio" ${matchingDeliveryOption.deliveryOptionId === '2' ? 'checked' : ''}
          class="delivery-option-input js-delivery-option-${matchingItem.id}"
          name="delivery-option-1-${matchingItem.id}" data-delivery-option="2">
        <div>
          <div class="delivery-option-date">
            ${getDate(1)}
          </div>
          <div class="delivery-option-price">
            ${getPrice(1)} Shipping
          </div>
        </div>
      </div>
      <div class="delivery-option">
        <input type="radio" ${matchingDeliveryOption.deliveryOptionId === '3' ? 'checked' : ''}
          class="delivery-option-input  js-delivery-option-${matchingItem.id}"
          name="delivery-option-1-${matchingItem.id}" data-delivery-option="3">
        <div>
          <div class="delivery-option-date">
            ${getDate(2)}
          </div>
          <div class="delivery-option-price">
            ${getPrice(2)} Shipping
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

  });

  document.querySelector('.js-order-summary').innerHTML = html;

  cart.forEach((cartItem) => {
    const updatedCart = [];
    const deleteLink = document.querySelector(`.js-delete-quantity-link-${cartItem.productId}`);
    const { productId } = cartItem;

    function removeItem() {
      cart.forEach((item) => {
        if (productId !== item.productId) {
          updatedCart.push(item);
        }
      });
      emptyCart();
      cart.unshift(...updatedCart);

      renderOrderSummary();
      renderPaymentSummary();
      saveToStorage();
    }

    deleteLink.addEventListener('click', () => {
      removeItem();
    });

    const updateLink = document.querySelector(`.js-update-quantity-link-${productId}`);
    const updateInput = document.querySelector(`.js-update-quantity-input-${productId}`);
    const updateSaveBtn = document.querySelector(`.js-update-quantity-save-btn-${productId}`);

    updateLink.addEventListener('click', () => {
      updateLink.classList.add('disappear');
      updateInput.classList.remove('disappear');
      updateSaveBtn.classList.remove('disappear');
      const quantityLabelElem = document.querySelector(`.js-quantity-label-${productId}`);

      updateInput.value = quantityLabelElem.innerHTML;
      quantityLabelElem.innerHTML = '';

      function updateSaveFunction() {
        if (updateInput.value !== '') {
          if (+updateInput.value >= 1000) {
            cartItem.quantity = 1000;
          } else if (+updateInput.value < 1) {
            removeItem();
          } else {
            cartItem.quantity = +updateInput.value;
          }
        }

        renderOrderSummary();
        renderPaymentSummary();
        saveToStorage();
      }

      updateSaveBtn.addEventListener('click', updateSaveFunction);
      updateInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          updateSaveFunction();
        }
      });
    });

    document.querySelectorAll(`.js-delivery-option-${productId}`)
      .forEach((option) => {
        option.addEventListener('input', () => {
          const { deliveryOption } = option.dataset;
          cartItem.deliveryOptionId = deliveryOption;
          renderOrderSummary();
          renderPaymentSummary();
          saveToStorage();
        });
      });
  });

  document.querySelector('.js-cart-items').innerHTML = ` ${updateCartQuantity()} items`;

}

