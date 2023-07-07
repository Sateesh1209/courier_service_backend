module.exports = (app) => {
  const Employee = require("../controllers/employee.controller.js");
  const { authenticateRoute } = require("../authentication/authentication.js");
  var router = require("express").Router();

  // Create a new Employee
  router.post("/employee/", Employee.create);

  // Retrieve all Users
  router.get("/employees/", Employee.findAll);

  // Retrieve a single Employee with id
  router.get("/employee/:id", Employee.findOne);

  // Update a Employee with id
  router.put("/employee/:id", [authenticateRoute], Employee.update);

  // Delete a Employee with id
  router.delete("/employee/:id", [authenticateRoute], Employee.delete);

  // Delete all Employee
  router.delete("/users/", [authenticateRoute], Employee.deleteAll);

  app.use("/courierapi", router);
};
