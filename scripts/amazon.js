import { saveToStorage, updateCartQuantity } from '../data/cart.js';
import { loadProducts, products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { search } from '../data/search.js';

let productsHTML = '';


loadPage();

async function loadPage() {
  await loadProducts();
  const searchQuery = await getSearchQuery();
  if (searchQuery) {
    document.querySelector('.js-search-bar').value = searchQuery;
  }
  document.querySelector('.js-search-button').addEventListener('click', search);
  document.querySelector('.js-search-bar').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      search();
    }
  });

  renderProducts(products);

  function renderProducts(products) {
    document.querySelector('.js-cart-quantity').innerHTML = updateCartQuantity() === 0 ? '' : updateCartQuantity();
    products.forEach((product) => {
      let isMatching = false;
      if (searchQuery) {
        for (const keyword of product.keywords) {
          isMatching = (keyword.includes(searchQuery.trim().toLowerCase()));
          if (isMatching === true) {
            break;
          };
        }
        if (!isMatching) {
          isMatching = product.name.trim().toLowerCase().includes(searchQuery.toLowerCase());
        }
      }
      if (!searchQuery || isMatching) {
        productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${formatCurrency(product.priceCents)}
      </div>

      <div class="product-quantity-container js-product-quantity-container-${product.id}">
        <select>
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart"
      data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
      }
    });

    if(productsHTML !== '') {
      document.querySelector('.js-products-grid').innerHTML = productsHTML; 
    } else {
      document.querySelector('.js-products-grid').innerHTML = 
      `
      <p class="no-result">No such Results for "${searchQuery}"</p>
      `;
    }

    document.querySelectorAll('.js-add-to-cart')
      .forEach((button, buttonIndex) => {
        let timeoutId;
        button.addEventListener('click', () => {
          const productId = button.dataset.productId;
          let quantity = +document.querySelector(`.js-product-quantity-container-${productId}`).firstElementChild.value;

          document.querySelector('.js-cart-quantity')
            .innerHTML = updateCartQuantity(
              productId,
              quantity,
              '1'
            );

          const addedToCart = document.querySelector(`.js-added-to-cart-${productId}`);

          addedToCart.classList.add('added');

          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          timeoutId = setTimeout(() => {
            addedToCart.classList.remove('added');
          }, 2000);
        });
      });
  }
  async function getSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    return searchQuery?.replaceAll('+', ' ');
  }
  function addTwoArrays(arr1, arr2) {
    const resultArr = arr1;
    for (const item of arr2) {
      if (!resultArr.includes(item)) {
        resultArr.push(item);
      }
    }
    return resultArr;
  }
}