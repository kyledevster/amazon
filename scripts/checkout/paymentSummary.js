import { cart, updateCartQuantity } from '../../data/cart.js';
import { products } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { deliveryOptions } from '../../data/cart.js';
import { orders, addOrder } from '../../data/orders.js';

export function renderPaymentSummary() {

  function getTotalPriceDollars() {
    let total = 0;
    cart.forEach((cartItem) => {
      let matchingItem;
      products.forEach((product) => {
        if(product.id === cartItem.productId){
          matchingItem = product;
        }
      });
      total += matchingItem.priceCents * cartItem.quantity;
    });
    return total;
  }

  function getTotalDeliveryPriceDollars() {
    let total = 0;
    cart.forEach((cartItem) => {
      let matchingDeliveryOption;
      deliveryOptions.forEach((deliveryOption) => {
        if(cartItem.deliveryOptionId === deliveryOption.deliveryOptionId){
          matchingDeliveryOption = deliveryOption;
        }
      });
      total += matchingDeliveryOption.priceCents;
    });
    return total;
  }
  
  document.querySelector('.js-payment-summary').innerHTML = 
  `
  <div class="payment-summary-title">
    Order Summary
  </div>

  <div class="payment-summary-row">
    <div>Items (${updateCartQuantity()}):</div>
    <div class="payment-summary-money">$${formatCurrency(getTotalPriceDollars())}</div>
  </div>

  <div class="payment-summary-row">
    <div>Shipping &amp; handling:</div>
    <div class="payment-summary-money">$${formatCurrency(getTotalDeliveryPriceDollars())}</div>
  </div>

  <div class="payment-summary-row subtotal-row">
    <div>Total before tax:</div>
    <div class="payment-summary-money">$${formatCurrency(getTotalPriceDollars() + getTotalDeliveryPriceDollars())}</div>
  </div>

  <div class="payment-summary-row">
    <div>Estimated tax (10%):</div>
    <div class="payment-summary-money">$${formatCurrency((getTotalPriceDollars() + getTotalDeliveryPriceDollars()) / 10)}</div>
  </div>

  <div class="payment-summary-row total-row">
    <div>Order total:</div>
    <div class="payment-summary-money">$${formatCurrency(getTotalPriceDollars() + getTotalDeliveryPriceDollars() + (getTotalPriceDollars() + getTotalDeliveryPriceDollars()) / 10)}</div>
  </div>

  <button class="place-order-button button-primary js-place-order-button${cart.length === 0 ? ' disabled' : ''}" ${cart.length === 0 ? 'disabled' : ''}>
    Place your order
  </button>
  `;

  document.querySelector('.js-place-order-button').addEventListener('click', async () => {
      await addOrder(cart);
      window.location.assign('orders.html');
  });
}

