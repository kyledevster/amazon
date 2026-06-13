import { emptyCart, saveToStorage } from "./cart.js";

export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export async function addOrder(cartOrder) {
  const response = await fetch('https://supersimplebackend.dev/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cart: cartOrder })
  });
  const orderObj = await response.json();
  orders.push(orderObj);
  emptyCart();
  saveOrders(); 
}

function saveOrders() {
  localStorage.setItem('orders', JSON.stringify(orders));
  saveToStorage();
}