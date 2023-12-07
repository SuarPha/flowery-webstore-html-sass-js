let cartIcon = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listCarttoHTML = document.querySelector('.listCart ');
let listProductItem = document.querySelector('.listProducts');
let iconCartSpan = document.querySelector('.icon-cart span');
let listProducts =[];
let cart = [];

cartIcon.addEventListener('click', () => {
  body.classList.toggle('showCart')
})
closeCart.addEventListener('click', () => {
  body.classList.toggle('showCart')
})



// Add to Cart Functionality

const addDataProductItem = () => {
    listProductItem.innerHTML = '';

    if(listProducts.length > 0){
      //Display only the first 6 products
      const totalProductToSHow = 4;
      const displayProductList = listProducts.slice(0, totalProductToSHow);

        displayProductList.forEach(product => {
        let newProduct = document.createElement('div');
        newProduct.classList.add('item');
        newProduct.dataset.id = product.id;
        newProduct.innerHTML = `

        <img src="${product.img}" alt="">
        <h2>${product.name}</h2>
        <p class="price">$ ${product.price}</p>
        <button class="addCart">
            Add To Cart
        </button>
        `;
        listProductItem.appendChild(newProduct);
      } )
    }
}
listProductItem.addEventListener('click', (event) => {
  let buttonClick = event.target;
  if(buttonClick.classList.contains('addCart')){
    let product_id = buttonClick.parentElement.dataset.id;
    addtoCart(product_id);
  }
})

const addtoCart = (product_id) => {
  let itemProductInCart = cart.findIndex((value) => value.product_id == product_id);
  if(cart.length <= 0) {
    cart = [{
      product_id: product_id,
      quantity: 1
    }]
  }else if(itemProductInCart < 0 ){
    cart.push({
      product_id: product_id,
      quantity: 1
    });
  }else{
    cart[itemProductInCart].quantity = cart[itemProductInCart].quantity + 1; 
  }
  addItemCartToHTML();
  addItemCartToLocalStorage();
}
const addItemCartToLocalStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
}
const addItemCartToHTML = () => {
  listCarttoHTML.innerHTML = '';
  let totalQuantity = 0;
  if(cart.length > 0){
    cart.forEach(itemCart => {
      totalQuantity = totalQuantity + itemCart.quantity;
      let newCartItem = document.createElement('div');
      newCartItem.classList.add('itemCart');
      newCartItem.dataset.id = itemCart.product_id;

      let itemProduct = listProducts.findIndex((value) => value.id == itemCart.product_id);
      let itemInfo = listProducts[itemProduct];
      listCarttoHTML.appendChild(newCartItem);
      newCartItem.innerHTML = `
      <div class="image">
        <img src="${itemInfo.img}" alt="" />
      </div>
      <div class="name">
            <h2>${itemInfo.name}</h2>
      </div>
      <div class="totalPrice">
            <p>${itemInfo.price * itemCart.quantity}</p>
      </div>
      <div class="quantity">
      <span class="plus">+</span>
      <span>${itemCart.quantity}</span>
      <span class="minus">-</span>
    </div>
    `;
   
    })
}
iconCartSpan.innerText = totalQuantity;
}
listCarttoHTML.addEventListener('click', (event) => {
  let itemClick = event.target;
  if(itemClick.classList.contains('minus') || itemClick.classList.contains('plus')){
    let product_id  = itemClick.parentElement.parentElement.dataset.id;
    let type = 'minus';
    if(itemClick.classList.contains('plus')){
      type = 'plus'
  }
  updateQuantityInCart(type, product_id);
}
})
const updateQuantityInCart = (type, product_id) => {
    let productItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(productItemInCart >= 0){
      let itemInfo = cart[productItemInCart];
      switch (type){
        case 'plus':
          cart[productItemInCart].quantity = cart[productItemInCart].quantity + 1;
          break;

      default:
        let updateQuantityInCart = cart[productItemInCart].quantity -1;
        if (updateQuantityInCart > 0) {
          cart[productItemInCart].quantity = updateQuantityInCart;
        }else{
          cart.splice(productItemInCart , 1);
        }
        break;
      }
    }
    addItemCartToLocalStorage();
    addItemCartToHTML();
}
const initApp = () => {
// get data from json

fetch('products.json')
.then(response => response.json())
.then(data => {
  listProducts = data;
  addDataProductItem();

  // Get item from LocalStorage 
   if(localStorage.getItem('cart')){
    cart = JSON.parse(localStorage.getItem('cart'));
    addItemCartToHTML();
   }
})
}
initApp();