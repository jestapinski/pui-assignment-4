/*
Jordan Stapinski (jstapins)
PUI A4
main.js

Javascript logic for shopping cart feature
*/

let cart;
let productsList;
let selectedProduct;

// Static class grouping of cart functions
class Cart {

  // Add the selected item to Cart
  static addToCart() {
    this.loadCart();
    // Below snackbar code borrowed from https://www.w3schools.com/howto/howto_js_snackbar.asp 
    // Get the snackbar DIV
    var snackbar = document.getElementById("snackbar")
    snackbar.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function() { 
      snackbar.className = snackbar.className.replace("show", ""); 
    }, 3000);

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

  // Bulk Remove an item from the cart
  static bulkRemoveItem(item) {
    this.loadCart();
    delete cart[item];
    this.saveCart();
    this.renderCartItems();
  }

  // Remove the item that the remove button belongs to in the cart.
  static removeParentItem(item) {
    let itemToDelete = item.parentNode.id;
    Cart.bulkRemoveItem(itemToDelete);
  }

  // Find the number of total items in the cart to display on
  // the top nav bar.
  static sumCartItems() {
    let totalItems = 0;
    for (let item in cart) {
      totalItems += cart[item].quantity;
    }
    let numInCart = document.getElementById('cart-size');
    numInCart.innerHTML = totalItems;
  }

  // Compute the total price of the entire cart
  static total() {
    let totalPrice = 0;
    for (let item in cart) {
      totalPrice += (cart[item].quantity * cart[item].unitPrice);
    }
    // Avoiding floating point addition error
    return Math.round(totalPrice * 100) / 100;
  }

  // Append formatted template for each item in the cart
  static renderCartItems() {
    // Clear the div as-is before appending items
    $('#shopping-cart-items').html('');
    let cartListDiv = $('#shopping-cart-items')[0];
    for (let item in cart) {
      // Format the item according to a cart item template and append
      let newItem = $(Product.productCartTemplate(item))[0];
      cartListDiv.append(newItem);
    }
    let cartPrice = $(
      '<p class="checkout-customize-text">Total Price: ${0}</p>'.replace(
        '{0}', Cart.total()))[0];
    cartListDiv.append($('<br>')[0], cartPrice);
    Wishlist.renderWishlist();
  }

  // Load cart from localStorage
  static loadCart() {
    cart = JSON.parse(localStorage.getItem('cart'));
    if (cart === null) {
      cart = {};
    }
    Cart.sumCartItems();
  }

  // Save cart to localStorage
  static saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    Cart.sumCartItems();
  }
}

class Wishlist {
  // Find the parent of the item we are looking to remove
  // and remove it from the wishlist
  static removeParentFromWishlist(item) {
    let itemToDelete = item.parentNode.id;
    productsList[itemToDelete].inWishlist = false;
    Product.saveProducts();
    this.renderWishlist();    
  }

  // Render the wish list items dynamically by
  // incrementally populating a div
  static renderWishlist() {
    $('#wishlist-items').html('');
    let wishlistDiv = $('#wishlist-items')[0];
    for (let item in productsList){
      if (productsList[item].inWishlist) {
        console.log(item);
        let newItem = $(Wishlist.productWishlistTemplate(productsList[item], item))[0];
        wishlistDiv.append(newItem);
      }
    }
  }

  // Add a product to the wish list
  static addToWishlist() {
    // Below snackbar code borrowed from https://www.w3schools.com/howto/howto_js_snackbar.asp 
    var snackbar = document.getElementById("snackbar-wishlist")
    snackbar.className = "show";
    // After 3 seconds, remove the show class from the snackbar
    setTimeout(function() { 
      snackbar.className = snackbar.className.replace("show", ""); 
    }, 3000);
    // Add the selected product to the wishlist and save
    selectedProduct.inWishlist = true;
    Product.saveProducts();
  }

  // A general template for displaying items on the
  // wish list on the shopping cart page.
  static productWishlistTemplate(item, num) {
    let template = `
    <div class='cart-item' id='{3}'>
      <img src='{2}' class='cart-img'/>
      <p class='checkout-customize-text'>{0}</p>
      <p class='checkout-price-text'>\${4} each</p>
      <br>
      <div class="mid-padding"></div>
      <button class='remove-item' onclick='Wishlist.removeParentFromWishlist(this);'>
        Remove</button>
        <br>
      <div class="mid-padding"></div>
      <hr>
    </div>
    `;
    // Replace values with dynamically-loaded item values
    template = template.replace('{0}',
      item['name']);
    template = template.replace('{4}', item['unitPrice']);
    return template.replace('{2}',
      item['imageLink']).replace('{3}', num);
  }
}

// Product class for organizing components of Products and
// encapsulating static product-based functions
class Product {
  // Products have a name, price, quantity in cart, and image
  constructor(name, unitPrice, imageLink, description) {
    this.name = name;
    this.unitPrice = unitPrice;
    this.quantity = 0;
    this.inWishlist = false;
    this.imageLink = imageLink;
    this.description = description;
  }

  // Change the displayed product on the product detail page
  // to be the selected product
  static selectedProductChange(itemNum) {
    selectedProduct = productsList[itemNum];
    let itemText = document.getElementById('item-text');
    let priceText = document.getElementById('price-text');
    let selectedImg = document.getElementById('selected-img');
    let prodDescription = document.getElementById('prod-description');
    itemText.innerHTML = productsList[itemNum].name;
    prodDescription.innerHTML = productsList[itemNum].description;
    priceText.innerHTML = '$'.concat(
      productsList[itemNum].unitPrice.toString());
    // Change the source image to be the selected product's
    selectedImg.setAttribute('src', selectedProduct.imageLink);
  }

  // Parameterized product template for display in
  // the cart.
  static productCartTemplate(item) {
    let template = `
    <div class='cart-item' id='{3}'>
      <img src='{2}' class='cart-img'/>
      <p class='checkout-customize-text'>{0}</p>
      <p class='checkout-price-text'>\${4} each</p>
      <p class='quantity-text'>Quantity: {1}</p>
      <div class="mid-padding"></div>
      <button class='remove-item' onclick='Cart.removeParentItem(this);'>
        Remove</button>
      <br>
      <div class="mid-padding"></div>
      <hr>
    </div>
    `;
    // Replace values with dynamically-loaded item values
    template = template.replace('{0}',
      cart[item]['name']).replace('{1}', cart[item]['quantity']);
    template = template.replace('{4}', cart[item]['unitPrice']);
    return template.replace('{2}',
      cart[item]['imageLink']).replace('{3}', item);
  }

  // Load products from localStorage
  static loadProducts() {
    productsList = JSON.parse(localStorage.getItem('productsList'));
  }

  // Save products to localStorage
  static saveProducts() {
    localStorage.setItem('productsList', JSON.stringify(productsList));
  }

  // A general description demplate to update based on an item's name.
  static descriptionTemplate(item){
    return `
      An amazing 0. Did you know that this 0 is the best we have? 
      Neither did I. The pillow is comfortable too. <br>Features:<br>
      - One 0 
    `.replace(/0/g, item);
    // Replace globally based on a regular expression
  }

  // Initialize the entire list of products with properties
  static initializeProducts() {
    this.loadProducts();
    if (productsList !== null){
      return;
    }
    let categories = ['Bed', 'Couch', 'Floor Pouf', 'Round'];

    // <Category> Pillow
    categories = categories.map(function(x) {
      return x.concat(' Pillow');
    });
    let subCategories = ['Square', 'Cat', 'Bunny', 'Dog', 'Round', 'Custom'];
    let allCategories = subCategories.map(function(x) {
      return categories.map(function(y) {
        // Square Bed Pillow, Square Couch Pillow, ...
        return x.concat(' ', y);
      });
    });

    // Flatten the list of pillow categories into one dimension
    allCategories = [].concat.apply([], allCategories);
    let filepathNames = allCategories.map(function(x) {
      // File naming convention is the category name without spaces
      // and is a .png file
      return x.split(' ').join('');
    });

    // Map the filename to the folder it is in and the extension
    filepathNames = filepathNames.map(function(x) {
      return 'src/'.concat(x, '.png');
    });

    productsList = [];
    for (let i = 0; i < allCategories.length; i++) {
      // Note i + 0.99 is used to generate unique prices for
      // each product in the list
      productsList.push(new Product(allCategories[i],
        i + 0.99, filepathNames[i],
        this.descriptionTemplate(allCategories[i])));
    }
  }
}

// On loading the page, load the cart and initialize
// the array of products
$(document).ready(function() {
  Cart.loadCart();
  Product.initializeProducts();
});
