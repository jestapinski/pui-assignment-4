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
	static add_to_cart(item, quantity){
		this.load_cart();
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
		delete cart[item.name];
		this.save_cart();
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
	// Load cart
	static load_cart(){
		cart = JSON.parse(localStorage.getItem("cart"));
		if (cart === null){
			cart = {};
		}
	}
	// Save cart
	static save_cart(){
		localStorage.setItem('cart', JSON.stringify(cart));
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
		console.log(products_list);
	}	
}

$(document).ready(function(){
	Cart.load_cart();
	Product.initialize_products();
})
