import productsJSON from '../backend/products.json' with { type: 'json' }

export let products = [];

export async function loadProducts(){
  products = productsJSON;
  console.log(products);
}