const db = require("../models");
const Employee = db.employee;
const Session = db.session;
const Op = db.Sequelize.Op;
const { encrypt, getSalt, hashPassword } = require("../authentication/crypto");
const { Role } = require("parse");

// Create and Save a new Employee
exports.create = async (req, res) => {
  // Validate request
  if (req.body.firstName === undefined) {
    const error = new Error("First name cannot be empty for employee!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.lastName === undefined) {
    const error = new Error("Last name cannot be empty for employee!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.email === undefined) {
    const error = new Error("Email cannot be empty for employee!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.password === undefined) {
    const error = new Error("Password cannot be empty for employee!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.roleId === undefined) {
    const error = new Error("RoleId cannot be empty for employee!");
    error.statusCode = 400;
    throw error;
  }

  // find by email
  await Employee.findOne({
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
        let salt = await getSalt();
        let hash = await hashPassword(req.body.password, salt);

        // Create a Employee
        const user = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          email: req.body.email,
          password: hash,
          roleId: req.body.roleId,
          salt: salt,
        };

        // Save Employee in the database
        await Employee.create(user)
          .then(async (data) => {
            // Create a Session for the new user
            let userId = data.empId;
            let expireTime = new Date();
            expireTime.setDate(expireTime.getDate() + 1);

            const session = {
              email: req.body.email,
              employeeEmpId: userId,
              expirationDate: expireTime,
            };
            await Session.create(session).then(async (data) => {
              let sessionId = data.id;
              await encrypt(sessionId);
              res.send({
                status: "Success",
                message: "Employee created successfully",
                data: null,
              });
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send({
              status: "Failure",
              message:
                err.message ||
                "Some error occurred while creating the Employee.",
              data: null,
            });
          });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        status: "Failure",
        message: err.message || "Error retrieving Employee with email=" + email,
        data: null,
      });
    });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  Employee.findAll({
    where: {
      roleId: {
        [Op.ne]: 1,
      },
    },
    attributes: { exclude: ["password", "salt"] },
    include: [
      {
        model: db.roles,
        attributes: ["roleId", "roleName"],
        required: true,
      },
    ],
  })
    .then((data) => {
      res.send({
        status: "Success",
        message: "Employees Fetched Successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        status: "Failure",
        message: err.message || "Some error occurred while retrieving users.",
        data: null,
      });
    });
};

// Find a single Employee with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Employee.findOne({
    where: {
      empId: id,
    },
    attributes: { exclude: ["password", "salt"] },
    include: [
      {
        model: db.roles,
        attributes: ["roleId", "roleName"],
        required: true,
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.send({
          status: "Success",
          message: "Employees Fetched Successfully",
          data: data,
        });
      } else {
        res.status(404).send({
          status: "Failure",
          message: `Cannot find Employee with id = ${id}.`,
          data: null,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: "Failure",
        message: err.message || "Error retrieving Employee with id = " + id,
        data: null,
      });
    });
};

// Find a single Employee with an email
exports.findByEmail = (req, res) => {
  const email = req.params.email;

  Employee.findOne({
    where: {
      email: email,
    },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.send({ email: "not found" });
        /*res.status(404).send({
          message: `Cannot find Employee with email=${email}.`
        });*/
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Employee with email=" + email,
      });
    });
};

// Update a Employee by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  let user;
  if (req.body.password !== undefined) {
    let salt = await getSalt();
    let hash = await hashPassword(req.body.password, salt);

    // Create a Employee
    user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password: hash,
      roleId: req.body.roleId,
      salt: salt,
    };
  } else {
    user = req.body;
  }

  Employee.update(user, {
    where: { empId: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          status: "Success",
          message: "Employee was updated successfully.",
          data: null,
        });
      } else {
        res.send({
          status: "Failure",
          message: `Cannot update Employee with id = ${id}. Maybe Employee was not found or req.body is empty!`,
          data: null,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: "Failure",
        message: err.message || "Error updating Employee with id =" + id,
        data: null,
      });
    });
};

// Delete a Employee with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Employee.destroy({
    where: { empId: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          status: "Success",
          message: "Employee was deleted successfully!",
          data: null,
        });
      } else {
        res.send({
          status: "Failure",
          message: `Cannot delete Employee with id = ${id}. Maybe Employee was not found!`,
          data: null,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: "Failure",
        message: err.message || "Could not delete Employee with id = " + id,
        data: null,
      });
    });
};

// Delete all People from the database.
exports.deleteAll = (req, res) => {
  Employee.destroy({
    where: {},
    truncate: false,
  })
    .then((number) => {
      res.send({ message: `${number} People were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all people.",
      });
    });
};