module.exports = (app) => {
  const Customer = require("../controllers/customers.controller.js");
  const { authenticateRoute } = require("../authentication/authentication.js");
  var router = require("express").Router();

  // Create a new Employee
  router.post("/customer/", [authenticateRoute], Customer.create);

  //   Retrieve all employees
  router.get("/customers/", [authenticateRoute], Customer.findAll);

  // Retrieve a single Employee with id
  router.get("/customer/:id", [authenticateRoute], Customer.findOne);

  // Retrieve a single Employee with email
  router.get(
    "/findCustomerByEmail/:email",
    [authenticateRoute],
    Customer.findByEmail
  );

  // Update a Employee with id
  router.put("/customer/:id", [authenticateRoute], Customer.update);

  // Delete a Employee with id
  router.delete("/customer/:id", [authenticateRoute], Customer.delete);

  //   // Delete all Employee
  //   router.delete("/employees/", [authenticateRoute], Employee.deleteAll);

  app.use("/courierapi", router);
};
