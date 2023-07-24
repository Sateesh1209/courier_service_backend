module.exports = (app) => {
  const Order = require("../controllers/order.controller.js");
  const { authenticateRoute } = require("../authentication/authentication.js");
  var router = require("express").Router();

  // Create a new Order
  router.post("/order/", [authenticateRoute], Order.create);

  //   Retrieve all orders
  router.get(
    "/orders/:statusId/:customerId",
    [authenticateRoute],
    Order.findAll
  );

  router.get(
    "/ordersAssignedTo/:empId",
    [authenticateRoute],
    Order.findAllByEmployee
  );

  // Retrieve a single Order with id
  router.get("/order/:id", [authenticateRoute], Order.findOne);

  // Update a Order with id
  router.put("/order/:id", [authenticateRoute], Order.update);

  // assign Order with id
  router.put("/order/assign/:id", [authenticateRoute], Order.updateAssigned);
  router.put("/order/pickup/:id", [authenticateRoute], Order.updatePickup);
  router.put("/order/deliveryStatus/:id", [authenticateRoute], Order.updateDeliveryStatus);

  // assign Order with id
  router.put(
    "/order/updateStatus/:id",
    [authenticateRoute],
    Order.updateOrderStatus
  );

  // Delete a Order with id
  router.delete("/order/:id", [authenticateRoute], Order.delete);

  app.use("/courierapi", router);
};
