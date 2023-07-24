module.exports = (app) => {
  const Employee = require("../controllers/employee.controller.js");
  const { authenticateRoute } = require("../authentication/authentication.js");
  var router = require("express").Router();

  // Create a new Employee
  router.post("/employee/", Employee.create);

  // Retrieve all employees
  router.get("/employees/", [authenticateRoute], Employee.findAll);

  // Retrieve a single Employee with id
  router.get("/employee/:id", [authenticateRoute], Employee.findOne);
  // Retrieve a single delievry agent with email
  router.get(
    "/employee/deliveryAgent/:email",
    [authenticateRoute],
    Employee.findDeliveryAgentByEmail
  );

  // Update a Employee with id
  router.put("/employee/:id", [authenticateRoute], Employee.update);

  // Delete a Employee with id
  router.delete("/employee/:id", [authenticateRoute], Employee.delete);

  // Delete all Employee
  router.delete("/employees/", [authenticateRoute], Employee.deleteAll);

  app.use("/courierapi", router);
};
