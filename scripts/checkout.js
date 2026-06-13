import { loadProducts } from '../data/products.js';
import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
async function loadPage() {
  await loadProducts();
  renderPaymentSummary();
  renderOrderSummary();
}
loadPage()