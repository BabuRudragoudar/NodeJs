var productController = {};

productController.showMPID = function(res) {	
	res.render("../views/show", { product: "Hello World"});
};  

module.exports = productController;