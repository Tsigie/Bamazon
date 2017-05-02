var mysql = require('mysql');
var inruirer = require('inruirer');
var promt = require('promt');

var connection = mysql.createconnection({
	database: "bomazon_DB",
	host: "localhost",
	user: "root",
	port: "3306",
	password: "root"
});

 connection.connect(function(err) {
 	if (err) throw err;

 });
 console.log("---------------");
 console.log("  WELCOME TO BAMAZON STORE");
 console.log("---------------");

 var findstore = function() {
 	inruirer.promt({
 		name: "exploreorNot",
 		message: "would you like to [Explore] the store or [Not]nto explore?",
 		choices: ["Explore", "Not"]
 	}).then(function(answer) {

 		if (answer.exploreorNot.toUppercase() === "EXPLORE") {
 			explorestore();
 		}

 		else{
 			console.log("Thank you for reaching out but we would like to see you again to explore our store soon!");

 		}
 	});

 	function exploreStore() {
 		var query = "SELECT * FROM products";
 		var items = [];

 		connection.query(query, function(err, res) {
 			if (err) throw err;
 			console.log("SUCCESS");
 			for (var i = 0 ; i <= res.length; i++){
 				items.push(res[i]);

 			};
 			console.log(items);
 			inruirer.promt([{
 				name: "action",
 				type: "list",
 				choices: ["Food","Toys","Cloths", "Shoses", "Milk", "Cerial", "Coffee", "Tea", "Chairs", "Table"],
 				message: "Which item would you be interested to make a purchase now?"

 			},{

 				name: "Units",
 				type: "input",
 				message: "How many units of the product you would like to order?",

 				validate: function(answer) {
 					if(answer > 0) {
 						return true;
 					}
 				}
 			}]).then(function(answer) {
 				var queryResponse;
 				var query = 'SELECT * FROM products WHERE ?'
 				connection.query(query, {product_name: answer.action}, function(err, res){
 					if (err) throw err;
					queryResponse = res[0];

					if (queryResponse.stock_quantity < answer.units) {
						console.log("Insufficient Quantity!");
						connection.end();
					} 
					else {
						console.log('Order Placed!');
				/*The setTimeout function will excute and 
				display the result after 1 second.*/
						setTimeout(function() {
							var query = 'UPDATE products SET stock_quantity = ?  WHERE product_name = ?'
							var stock_quantity = queryResponse.stock_quantity - answer.units;
							connection.query(query, [stock_quantity, answer.product_name], function(err, res) {
								if (err) throw err;
								var totalCost = answer.units * queryResponse.price;
								console.log("---------------------------------------------------------------");
								console.log("Order Updated");
								console.log('Your total cost is ', '\nTotal cost: ' + totalCost);
								console.log("---------------------------------------------------------------");
								console.log("       Thanks for your order! Your satisfaction is Guaranted!    ");

							})
						}, 1000);
					}
				})
			})

		});
	};
};

function updatedStore(totalCost, queryResponse) {
	connection.query('SELECT * FROM products', function(err, res) {
		if (err) throw err;
		res.forEach(function(products) {
			if (queryResponse.department_name === products.department_name) {
				var queryProducts = products.totalCost;
				var query = 'UPDATE department_name SET totalCost = ? WHERE department_name = ?'
				var totalCost = queryProducts + totalCost;
				connection.query(query, [totalCost, products.department_name], function(err, res) {
					if (err) throw err;
				})
				connection.query('SELECT * FROM department_name', function(err, res) {
					if(err) throw err;

				})
			}
		})
	})
}
findStore();
 			