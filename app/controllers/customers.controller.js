const db = require("../models");
const Customer = db.customers;

// Create and Save a new Customer
exports.create = async (req, res) => {
  // Validate request
  try {
    if (req.body.firstName === undefined) {
      const error = new Error("First name cannot be empty for customer!");
      error.message = "First name cannot be empty for customer!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.lastName === undefined) {
      const error = new Error("Last name cannot be empty for customer!");
      error.message = "Last name cannot be empty for customer!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.email === undefined) {
      const error = new Error("Email cannot be empty for customer!");
      error.message = "Email cannot be empty for customer!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.phone === undefined) {
      const error = new Error("Phone cannot be empty for customer!");
      error.message = "Phone cannot be empty for customer!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.avenue === undefined) {
      const error = new Error("Avenue cannot be empty for customer!");
      error.message = "Avenue cannot be empty for customer!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.street === undefined) {
      const error = new Error("Street cannot be empty for customer!");
      error.message = "Street cannot be empty for customer!";
      error.statusCode = 400;
      throw error;
    } else if (req.body.block === undefined) {
      const error = new Error("Block cannot be empty for customer!");
      error.message = "Block cannot be empty for customer!!";
      error.statusCode = 400;
      throw error;
    }

    // find by email
    await Customer.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then(async (data) => {
        if (data) {
          res.status(500).send({
            status: "Failure",
            message: "This email is already in use.",
            data: null,
          });
          return "This email is already in use.";
        } else {
          console.log("email not found");

          // Save Customer in the database
          await Customer.create(req.body)
            .then((data) => {
              res.send({
                status: "Success",
                message: "Customer created successfully",
                data: null,
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send({
                status: "Failure",
                message:
                  err.message ||
                  "Some error occurred while creating the Customer.",
                data: null,
              });
            });
        }
      })
      .catch((err) => {
        return res.status(500).send({
          status: "Failure",
          message:
            err.message || "Error retrieving Customer with email=" + email,
          data: null,
        });
      });
  } catch (e) {
    return res.status(500).send({
      status: "Failure",
      message: e.message,
      data: null,
    });
  }
};

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
  Customer.findAll()
    .then((data) => {
      res.send({
        status: "Success",
        message: "Customers Fetched Successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: "Failure",
        message:
          err.message || "Some error occurred while retrieving Customers.",
        data: null,
      });
    });
};

// Find a single Customer with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Customer.findOne({
    where: {
      id: id,
    },
  })
    .then((data) => {
      if (data) {
        res.send({
          status: "Success",
          message: "Customer Fetched Successfully",
          data: data,
        });
      } else {
        res.status(404).send({
          status: "Failure",
          message: `Cannot find Customer with id = ${id}.`,
          data: null,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: "Failure",
        message: err.message || "Error retrieving Customer with id = " + id,
        data: null,
      });
    });
};

// Update a Customer by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  let customer = req.body;
  Customer.update(customer, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          status: "Success",
          message: "Customer was updated successfully.",
          data: null,
        });
      } else {
        res.send({
          status: "Failure",
          message: `Cannot update Customer with id = ${id}. Maybe Customer was not found or req.body is empty!`,
          data: null,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: "Failure",
        message: err.message || "Error updating Customer with id =" + id,
        data: null,
      });
    });
};

// Delete a Customer with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Customer.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          status: "Success",
          message: "Customer was deleted successfully!",
          data: null,
        });
      } else {
        res.send({
          status: "Failure",
          message: `Cannot delete Customer with id = ${id}. Maybe Customer was not found!`,
          data: null,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: "Failure",
        message: err.message || "Could not delete Customer with id = " + id,
        data: null,
      });
    });
};
