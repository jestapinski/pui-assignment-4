/*
Jordan Stapinski (jstapins)
PUI A4
main.js

Javascript logic for shopping cart feature
*/

let cart;
let products_list;
let selected_product;

// Static class of cart functions
class Cart {
	// Add to Cart
	static add_to_cart(){
		this.load_cart();
		let select_quantity = document.getElementById('quantity');
		let quantity = parseInt(select_quantity.value);
		let item = selected_product;
		// Add this to the cart if it is not present
		if (cart[item.name] === undefined){
			item['quantity'] = quantity;
			cart[item.name] = item;
		// If this is in the cart, add more
		} else {
			cart[item.name]['quantity'] += quantity;
		}
		this.save_cart();
	}
	// Bulk Remove
	static bulk_remove_item(item){
		this.load_cart();
		delete cart[item];
		this.save_cart();
    this.render_cart_items();
	}
  static remove_parent_item(item){
    let item_to_delete = item.parentNode.id;
    Cart.bulk_remove_item(item_to_delete);
  }
	// Increase Quantity
	static increase_quantity(item, num_up){
		let quantity;
		this.load_cart();
		quantity = cart[item.name]['quantity'];
		quantity += num_up;
		cart[item.name]['quantity'] = quantity
		this.save_cart();
	}
	// Decrease Quantity
	static decrease_quantity(item, num_down){
		let quantity;
		this.load_cart();
		quantity = cart[item.name]['quantity'];
		quantity -= num_down;
		if (quantity <= 0){
			delete cart[item.name];
		} else {
			cart[item.name]['quantity'] = quantity;
		}
		this.save_cart();
	}
	static sum_cart_items(){
		let total_items = 0;
		for (var item in cart){
			total_items += cart[item].quantity;
		}
    let num_in_cart = document.getElementById('cart_size');
    num_in_cart.innerHTML = total_items;
	}
  static render_cart_items(){
    $("#shopping_cart_items").html("");
    let cart_list_div = $('#shopping_cart_items')[0];
    for (var item in cart){
      // Add templating here
      let new_item = $(Product.product_cart_template(item))[0];
      cart_list_div.append(new_item);
    }
    let button = $("<button class='checkout-button' onclick='alert(`Not yet!`)'>Checkout</button>")[0];
    cart_list_div.append(button);
  }
	// Load cart
	static load_cart(){
		cart = JSON.parse(localStorage.getItem("cart"));
		if (cart === null){
			cart = {};
		}
    Cart.sum_cart_items();
	}
	// Save cart
	static save_cart(){
		localStorage.setItem('cart', JSON.stringify(cart));
    Cart.sum_cart_items();
	}
}

class Product {
	constructor(name, unit_price, image_link){
		// image link
		// price
		this.name = name;
		this.unit_price = unit_price;
		this.quantity = 0;
		this.image_link = image_link;
	}
	static selectedProductChange(item_num){
		selected_product = products_list[item_num];
		let item_text = document.getElementById("item_text");
		let price_text = document.getElementById("price_text");
		let selected_img = document.getElementById("selected_img");
		item_text.innerHTML = products_list[item_num].name;
		price_text.innerHTML = "$".concat(products_list[item_num].unit_price.toString());
		selected_img.setAttribute("src", selected_product.image_link);
	}
	static set_product(product_id){
		if (products_list === undefined){
			this.initialize_products();
		}
		selected_product = products_list[product_id];
	}
  static product_cart_template(item){
    let template = `
    <div class='cart_item' id='{3}'>
      <img src='{2}' class='cart-img'/>
      <p class='customize-text'>{0}</p>
      <p class='quantity-text'>Quantity: {1}</p>
      <button class='remove-item' onclick='Cart.remove_parent_item(this);'>Remove</button>
      <br>
      <hr>
    </div>
    `
    template = template.replace('{0}', cart[item]['name']).replace('{1}', cart[item]['quantity']);
    return template.replace('{2}', cart[item]['image_link']).replace('{3}', item);
  }
	static initialize_products(){
		// Names
		// Prices
		// Image links (need images)
		let categories = ['Bed', 'Couch', 'Floor Pouf', 'Round'];
		categories = categories.map(function(x){return x.concat(' Pillow');});
		let sub_categories = ['Square', 'Cat', 'Bunny', 'Dog', 'Round', 'Custom'];
		let all_categories = sub_categories.map(function(x){
			return categories.map(function(y){return x.concat(' ', y);})
		});
		all_categories = [].concat.apply([], all_categories);
		let filepath_names = all_categories.map(function(x){return x.split(' ').join('');});
		filepath_names = filepath_names.map(function(x){return 'src/'.concat(x, '.png')})
		let price_array = [14.99, 19.99, 24.99];
		products_list = [];
		for (var i = 0; i < all_categories.length; i++){
			products_list.push(new Product(all_categories[i], price_array[i % price_array.length], filepath_names[i]));
		}
	}	
}

$(document).ready(function(){
	Cart.load_cart();
	Product.initialize_products();
})
