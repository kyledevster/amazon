export let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartQuantity = 0;

export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function emptyCart() {
  cart = [];
}

export function updateCartQuantity(productId, quantity, deliveryOptionId) {
  if (productId) {

    let matchingItem;

    cart.forEach((item) => {
      if (productId === item.productId) {
        matchingItem = item;
      }
    });

    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      cart.push({
        productId,
        quantity,
        deliveryOptionId
      });
    }
    saveToStorage();
  }

  cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });

  return cartQuantity;
}

export const deliveryOptions = [
  {
    deliveryOptionId: '1',
    delayDays: 7,
    priceCents: 0
  },
  {
    deliveryOptionId: '2',
    delayDays: 3,
    priceCents: 499
  },
  {
    deliveryOptionId: '3',
    delayDays: 1,
    priceCents: 999
  }
]