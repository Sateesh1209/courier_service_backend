const db = require("../models");
const Op = db.Sequelize.Op;
const Customer = db.customers;
const { sendMail } = require("../utilities/email");
const { triggerRunBillGeneration } = require("../utilities/billGeneration");

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
    let data = await Customer.findOne({
      where: {
        email: req.body.email,
      },
    });
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
          req.body.isActive = true;
          const currentVersion = req.body;
          Customer.update(req.body, {
            where: { id: data.id },
          })
            .then(async (number) => {
              if (number == 1) {
                if (
                  data.street != currentVersion.street ||
                  data.avenue != currentVersion.avenue ||
                  data.block != currentVersion.block
                ) {
                  try {
                    await db.sequelize.transaction(async (t) => {
                      const sentOrders = await db.order.findAll({
                        where: {
                          sender: data.id,
                          pickupPoint: {
                            [Op.like]: "%/true",
                          },
                        },
                        transaction: t,
                      });
                      for (const sentOrder of sentOrders) {
                        sentOrder.pickupPoint = sentOrder.pickupPoint.replace(
                          "/true",
                          "/false"
                        );
                        await sentOrder.save({ transaction: t });
                      }

                      const receivedOrders = await db.order.findAll({
                        where: {
                          receiver: data.id,
                          dropoffPoint: {
                            [Op.like]: "%/true",
                          },
                        },
                        transaction: t,
                      });

                      for (const receivedOrder of receivedOrders) {
                        receivedOrder.dropoffPoint =
                          receivedOrder.dropoffPoint.replace("/true", "/false");
                        await receivedOrder.save({ transaction: t });
                      }
                    });
                  } catch (error) {
                    console.error("Error updating orders:", error);
                  }
                }
                res.send({
                  status: "Success",
                  message: "Customer reactivated successfully.",
                  data: null,
                });
                return "Customer reactivated successfully.";
              } else {
                res.status(404).send({
                  status: "Failure",
                  message: `Cannot update Customer with id = ${id}. Maybe Customer was not found or req.body is empty!`,
                  data: null,
                });
                return `Cannot update Customer with id = ${id}. Maybe Customer was not found or req.body is empty!`;
              }
            })
            .catch((err) => {
              res.status(500).send({
                status: "Failure",
                message:
                  err.message || "Error updating Customer with id =" + id,
                data: null,
              });
            });
        } else {
          res.send({
            status: "Success",
            message: "This email is soft deleted.",
            data: {
              accoutExists: true,
              message: `This email (${data.email}) is already registered but soft deleted. Please click on confirm if you wanted to reactivate it and all fields will get updated...`,
            },
          });
          return "This email is soft deleted.";
        }
      }
    } else {
      console.log("email not found");
      req.body.isActive = true;
      // Save Customer in the database
      await Customer.create(req.body)
        .then((data) => {
          sendMail(req.body.email, "Customer Onboarding", "customerOnBoard", {
            customerName: req.body.firstName,
          });
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
              err.message || "Some error occurred while creating the Customer.",
            data: null,
          });
        });
    }
    // })
    // .catch((err) => {
    //   return res.status(500).send({
    //     status: "Failure",
    //     message:
    //       err.message || "Error retrieving Customer with email=" + email,
    //     data: null,
    //   });
    // });
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
  Customer.findAll({
    where: { isActive: true },
  })
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
      isActive: true,
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
exports.findOrdersByCustomer = (req, res) => {
  const id = req.params.id;

  db.order
    .findAll({
      where: {
        sender: id,
      },
      include: [
        {
          model: db.employee,
          as: "assignedToDetails",
          attributes: ["empId", "firstName", "lastName"],
        },
        {
          model: db.customers,
          as: "receiverDetails",
        },
        {
          model: db.customers,
          as: "senderDetails",
        },
        {
          model: db.status,
          as: "status",
        },
      ],
    })
    .then((data) => {
      if (data) {
        res.send({
          status: "Success",
          message: "Orders Fetched Successfully",
          data: data,
        });
      } else {
        res.status(404).send({
          status: "Failure",
          message: `Cannot find orders of customer with id = ${id}.`,
          data: null,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: "Failure",
        message:
          err.message || "Error retrieving Orders of Customer with id = " + id,
        data: null,
      });
    });
};
// Find a single customer with an email id
exports.findByEmail = (req, res) => {
  const email = req.params.email;

  Customer.findOne({
    where: {
      email: email,
      isActive: true,
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
          message: `Cannot find Customer with email = ${email}.`,
          data: null,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: "Failure",
        message:
          err.message || "Error retrieving Customer with email = " + email,
        data: null,
      });
    });
};

// Update a Customer by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  let customer = req.body;
  await Customer.findOne({
    where: {
      email: req.body.email,
    },
  }).then(async (data) => {
    if (data?.id && data?.id != id) {
      res.status(500).send({
        status: "Failure",
        message: "This email can't be updated since it is already in use.",
        data: null,
      });
      return "This email is already in use.";
    } else {
      const currentVersion = req.body;
      const previousVersion = await Customer.findOne({
        where: {
          id: id,
          isActive: true,
        },
      });
      Customer.update(customer, {
        where: { id: id },
      })
        .then(async (number) => {
          if (number == 1) {
            if (
              previousVersion.street != currentVersion.street ||
              previousVersion.avenue != currentVersion.avenue ||
              previousVersion.block != currentVersion.block
            ) {
              try {
                await db.sequelize.transaction(async (t) => {
                  const sentOrders = await db.order.findAll({
                    where: {
                      sender: id,
                      pickupPoint: {
                        [Op.like]: "%/true",
                      },
                    },
                    transaction: t,
                  });
                  for (const sentOrder of sentOrders) {
                    sentOrder.pickupPoint = sentOrder.pickupPoint.replace(
                      "/true",
                      "/false"
                    );
                    await sentOrder.save({ transaction: t });
                  }

                  const receivedOrders = await db.order.findAll({
                    where: {
                      receiver: id,
                      dropoffPoint: {
                        [Op.like]: "%/true",
                      },
                    },
                    transaction: t,
                  });

                  for (const receivedOrder of receivedOrders) {
                    receivedOrder.dropoffPoint =
                      receivedOrder.dropoffPoint.replace("/true", "/false");
                    await receivedOrder.save({ transaction: t });
                  }
                });
              } catch (error) {
                console.error("Error updating orders:", error);
              }
            }
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
    }
  });
};

// generateBill

exports.generateBill = async (req, res) => {
  try {
    await triggerRunBillGeneration(false);
    res.status(200).send({
      status: "Success",
      message: "Bill Reports are successfully generated",
      data: null,
    });
  } catch (e) {
    console.log("Error in generating the bill", e);
    res.status(500).send({
      status: "Failure",
      message: "Error in generating the bill",
      data: null,
    });
  }
};

// Delete a Customer with the specified id in the request
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const activeOrders = await db.order.findAll({
      where: {
        sender: id,
        statusId: {
          [Op.or]: [1, 2, 3, 6],
        },
      },
    });
    if (activeOrders.length > 0) {
      return res.status(400).send({
        status: "Failure",
        message:
          "This customer can't be deleted since he/she has ongoing orders",
        data: null,
      });
    }
    let customer = { isActive: false };
    const customerDetails = await Customer.findOne({
      where: {
        id: id,
      },
    });
    Customer.update(customer, {
      where: { id: id },
    })
      .then((number) => {
        if (number == 1) {
          sendMail(
            customerDetails?.email,
            "Account Deletion",
            "customerAccountDeletion",
            {
              customerName: customerDetails?.firstName,
            }
          );
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
  } catch (e) {
    return res.status(500).send({
      status: "Failure",
      message: e.message,
      data: null,
    });
  }
};
