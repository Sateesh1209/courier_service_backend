module.exports = (app) => {
    const Order = require("../controllers/order.controller.js");
    const { authenticateRoute } = require("../authentication/authentication.js");
    var router = require("express").Router();
  
    // Create a new Order
    router.post("/order/", [authenticateRoute], Order.create);
  
    //   Retrieve all orders
    router.get("/orders/", [authenticateRoute], Order.findAll);
  
    // Retrieve a single Order with id
    router.get("/order/:id", [authenticateRoute], Order.findOne);
  
    // Update a Order with id
    router.put("/order/:id", [authenticateRoute], Order.update);
  
    // Delete a Order with id
    router.delete("/order/:id", [authenticateRoute], Order.delete);
  
    app.use("/courierapi", router);
  };
  