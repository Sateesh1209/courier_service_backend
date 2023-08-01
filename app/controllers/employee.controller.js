const db = require("../models");
const Employee = db.employee;
const Session = db.session;
const Op = db.Sequelize.Op;
const { encrypt, getSalt, hashPassword } = require("../authentication/crypto");
const { Role } = require("parse");
const { sendMail } = require("../utilities/email");

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
    include: [
      {
        model: db.roles,
        attributes: ["roleId", "roleName"],
        required: true,
        as: "role",
      },
    ],
  })
    .then(async (data) => {
      if (data) {
        if (data.isActive) {
          res.status(500).send({
            status: "Failure",
            message: "This email is already in use.",
            data: null,
          });
          return "This email is already in use.";
        } else {
          if (req.body.reactivate) {
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
                roleId: data.roleId,
                isActive: true,
                salt: salt,
              };
            } else {
              user = req.body;
            }
            Employee.update(user, {
              where: { empId: data.empId },
            })
              .then((number) => {
                if (number == 1) {
                  res.send({
                    status: "Success",
                    message: "Account reactivated successfully.",
                    data: null,
                  });
                  return "Account reactivated successfully.";
                } else {
                  res.status(404).send({
                    status: "Failure",
                    message: `Cannot update Employee with id = ${id}. Maybe Employee was not found or req.body is empty!`,
                    data: null,
                  });
                  return `Cannot update Employee with id = ${id}. Maybe Employee was not found or req.body is empty!`;
                }
              })
              .catch((err) => {
                res.status(500).send({
                  status: "Failure",
                  message:
                    err.message || "Error updating Employee with id =" + id,
                  data: null,
                });
              });
          } else {
            res.send({
              status: "Success",
              message: "This email is soft delted.",
              data: {
                accoutExists: true,
                message: `This email (${data.email}) is already registered as ${data.role?.roleName} but soft deleted. Please click on confirm if you wanted to reactivate it and all fields will get updated except the role. If you wanted to change the role then click on cancel and try with different email...`,
              },
            });
            return "This email is soft deleted.";
          }
        }
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
          isActive: true,
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
              sendMail(
                req.body.email,
                "Employee Onboarding",
                "employeeOnBoard",
                {
                  userName: req.body.email,
                  password: req.body.password,
                  employeeName: req.body.firstName,
                  position: req.body.roleId === 2 ? "CLERK" : "DELIVERY AGENT",
                }
              );
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
      isActive: true,
    },
    attributes: { exclude: ["password", "salt"] },
    include: [
      {
        model: db.roles,
        attributes: ["roleId", "roleName"],
        required: true,
        as: "role",
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
      isActive: true,
    },
    attributes: { exclude: ["password", "salt"] },
    include: [
      {
        model: db.roles,
        attributes: ["roleId", "roleName"],
        required: true,
        as: "role",
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
exports.findDeliveryAgentByEmail = (req, res) => {
  const email = req.params.email;

  Employee.findOne({
    where: {
      email: email,
      roleId: 3,
      isActive: true,
    },
    include: [
      {
        model: db.roles,
        as: "role",
      },
    ],
  })
    .then((data) => {
      if (data) {
        const { empId, firstName, lastName, email, phone, role } = data;
        res.send({
          status: "Success",
          message: "Delivery Agent Fetched Successfully",
          data: {
            empId: empId,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            role: role,
          },
        });
      } else {
        res.status(404).send({
          status: "Failure",
          message: `Cannot find Delivery Agent with email = ${email}.`,
          data: null,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error retrieving Delivery Agent with email=" + email,
      });
    });
};

// Get all active delivery agents

exports.getAllActiveDeliveryAgents = (req, res) => {
  Employee.findAll({
    where: {
      roleId: 3,
      isActive: 1,
    },
    include: [
      {
        model: db.roles,
        as: "role",
      },
    ],
    attributes: { exclude: ["password", "salt"] },
  })
    .then((data) => {
      if (data) {
        res.send({
          status: "Success",
          message: "Delivery Agents Fetched Successfully",
          data: data,
        });
      } else {
        res.status(404).send({
          status: "Failure",
          message: `Cannot find Delivery Agents`,
          data: null,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Delivery Agents",
      });
    });
};

// Update a Employee by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  let user;
  await Employee.findOne({
    where: {
      email: req.body.email,
    },
  }).then(async (data) => {
    if (data?.empId && data?.empId != id) {
      res.status(500).send({
        status: "Failure",
        message: "This email can't be updated since it is already in use.",
        data: null,
      });
      return "This email is already in use.";
    } else {
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
            res.status(404).send({
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
    }
  });
};

// Delete a Employee with the specified id in the request
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const assignedOrders = await db.order.findAll({
      where: {
        assignedTo: id,
        statusId: {
          [Op.or]: [2, 3, 6],
        },
      },
    });
    if (assignedOrders.length > 0) {
      return res.status(400).send({
        status: "Failure",
        message:
          "This employee can't be deleted since he/she has ongoing orders",
        data: null,
      });
    }
    let employee = { isActive: false };
    const employeeDetails = await Employee.findOne({
      where: {
        empId: id,
      },
    });
    const employeeEmail = employeeDetails?.email;
    const employeeName = employeeDetails?.firstName;
    await Employee.update(employee, {
      where: { empId: id },
    })
      .then((number) => {
        if (number == 1) {
          sendMail(employeeEmail, "Access Revoked", "employeeTermination", {
            employeeName: employeeName,
          });
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
  } catch (e) {
    return res.status(500).send({
      status: "Failure",
      message: e.message,
      data: null,
    });
  }
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
