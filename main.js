/*
Jordan Stapinski (jstapins)
PUI A4
main.js

Javascript logic for shopping cart feature
*/

let cart;
let productsList;
let selectedProduct;

// Static class of cart functions
class Cart {
  // Add to Cart
  static addToCart() {
    this.loadCart();
    let selectQuantity = document.getElementById('quantity');
    let quantity = parseInt(selectQuantity.value);
    let item = selectedProduct;
    // Add this to the cart if it is not present
    if (cart[item.name] === undefined) {
      item['quantity'] = quantity;
      cart[item.name] = item;
    // If this is in the cart, add more
    } else {
      cart[item.name]['quantity'] += quantity;
    }
    this.saveCart();
  }
  // Bulk Remove
  static bulkRemoveItem(item) {
    this.loadCart();
    delete cart[item];
    this.saveCart();
    this.renderCartItems();
  }
  static removeParentItem(item) {
    let itemToDelete = item.parentNode.id;
    Cart.bulkRemoveItem(itemToDelete);
  }
  // Increase Quantity
  static increaseQuantity(item, numUp) {
    let quantity;
    this.loadCart();
    quantity = cart[item.name]['quantity'];
    quantity += numUp;
    cart[item.name]['quantity'] = quantity;
    this.saveCart();
  }
  // Decrease Quantity
  static decreaseQuantity(item, numDown) {
    let quantity;
    this.loadCart();
    quantity = cart[item.name]['quantity'];
    quantity -= numDown;
    if (quantity <= 0) {
      delete cart[item.name];
    } else {
      cart[item.name]['quantity'] = quantity;
    }
    this.saveCart();
  }
  static sumCartItems() {
    let totalItems = 0;
    for (let item in cart) {
      totalItems += cart[item].quantity;
    }
    let numInCart = document.getElementById('cart_size');
    numInCart.innerHTML = totalItems;
  }
  static total() {
    let totalPrice = 0;
    for (let item in cart) {
      totalPrice += (cart[item].quantity * cart[item].unitPrice);
    }
    return totalPrice;
  }
  static renderCartItems() {
    $('#shopping_cart_items').html('');
    let cartListDiv = $('#shopping_cart_items')[0];
    for (let item in cart) {
      // Add templating here
      let newItem = $(Product.productCartTemplate(item))[0];
      cartListDiv.append(newItem);
    }
    let button = $(
      '<p class="checkout-customize-text">Total Price: ${0}</p>'.replace(
        '{0}', Cart.total()))[0];
    cartListDiv.append($('<br>')[0], button);
  }
  // Load cart
  static loadCart() {
    cart = JSON.parse(localStorage.getItem('cart'));
    if (cart === null) {
      cart = {};
    }
    Cart.sumCartItems();
  }
  // Save cart
  static saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    Cart.sumCartItems();
  }
}

class Product {
  constructor(name, unitPrice, imageLink) {
    // image link
    // price
    this.name = name;
    this.unitPrice = unitPrice;
    this.quantity = 0;
    this.imageLink = imageLink;
  }
  static selectedProductChange(itemNum) {
    selectedProduct = productsList[itemNum];
    let itemText = document.getElementById('item_text');
    let priceText = document.getElementById('price_text');
    let selectedImg = document.getElementById('selected_img');
    itemText.innerHTML = productsList[itemNum].name;
    priceText.innerHTML = '$'.concat(
      productsList[itemNum].unitPrice.toString());
    selectedImg.setAttribute('src', selectedProduct.imageLink);
  }
  static setProduct(productId) {
    if (productsList === undefined) {
      this.initializeProducts();
    }
    selectedProduct = productsList[productId];
  }
  static productCartTemplate(item) {
    let template = `
    <div class='cart_item' id='{3}'>
      <img src='{2}' class='cart-img'/>
      <p class='checkout-customize-text'>{0}</p>
      <p class='checkout-price-text'>\${4} each</p>
      <p class='quantity-text'>Quantity: {1}</p>
      <button class='remove-item' onclick='Cart.removeParentItem(this);'>
        Remove</button>
      <br>
      <hr>
    </div>
    `;
    template = template.replace('{0}',
      cart[item]['name']).replace('{1}', cart[item]['quantity']);
    template = template.replace('{4}', cart[item]['unitPrice']);
    return template.replace('{2}',
      cart[item]['imageLink']).replace('{3}', item);
  }
  static initializeProducts() {
    // Names
    // Prices
    // Image links (need images)
    let categories = ['Bed', 'Couch', 'Floor Pouf', 'Round'];
    categories = categories.map(function(x) {
      return x.concat(' Pillow');
    });
    let subCategories = ['Square', 'Cat', 'Bunny', 'Dog', 'Round', 'Custom'];
    let allCategories = subCategories.map(function(x) {
      return categories.map(function(y) {
        return x.concat(' ', y);
      });
    });
    allCategories = [].concat.apply([], allCategories);
    let filepathNames = allCategories.map(function(x) {
      return x.split(' ').join('');
    });
    filepathNames = filepathNames.map(function(x) {
      return 'src/'.concat(x, '.png');
    });
    let priceArray = [14.99, 19.99, 24.99];
    productsList = [];
    for (let i = 0; i < allCategories.length; i++) {
      productsList.push(new Product(allCategories[i],
        priceArray[i % priceArray.length], filepathNames[i]));
    }
  }
}

$(document).ready(function() {
  Cart.loadCart();
  Product.initializeProducts();
});
