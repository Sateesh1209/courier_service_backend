require("dotenv").config();
const { Op } = require("sequelize");
const express = require("express");
const cors = require("cors");
const {triggerRunBillGeneration} = require('./app/utilities/billGeneration')

const app = express();

const db = require("./app/models");

db.sequelize
  .sync({
    force: false,
  })
  .then(() => {
    //Tables are successfully created
    console.log("Tables are created successfully");
    const rolesIds = [1, 2, 3];
    db.roles
      .findAll({
        where: {
          roleId: {
            [Op.in]: rolesIds,
          },
        },
      })
      .then((roles) => {
        if (roles?.length === 0) {
          // Insert records into roles table
          db.roles
            .bulkCreate([
              { roleId: 1, roleName: "ADMIN" },
              { roleId: 2, roleName: "CLERK" },
              { roleId: 3, roleName: "DELIVERY AGENT" },
            ])
            .then(() => {
              console.log("Records are inserted into table roles");
            })
            .catch((e) => {
              console.log("Trouble inserting records into roles table", e);
            });
        }
      });
    db.companyInfo.findAll().then((data) => {
      if (data?.length === 0) {
        db.companyInfo
          .create({
            name: "Courier Express",
            startHour: "07:00:00",
            endHour: "16:00:00",
            cancelCharges: "10",
            avenue: "3rd Avenue",
            street: "C Street",
            block: "Block 14",
            pricePerBlock: "1.5",
            timePerBlock: "3",
            onTimeBonus: "10",
            billingCycle: "Monthly",
            phone: "+1 (231) 231-3121",
            billingExpression: "0 9 1 * *",
          })
          .then(() => {
            console.log("Records are inserted into table companyInfo");
          })
          .catch((e) => {
            console.log("Trouble inserting records into companyInfo table", e);
          });
      }
    });
    db.status.findAll().then((data) => {
      if (data?.length === 0) {
        db.status
          .bulkCreate([
            {
              statusId: 1,
              statusName: "Initiated",
            },
            {
              statusId: 2,
              statusName: "Assigned",
            },
            {
              statusId: 3,
              statusName: "Picked Up",
            },
            {
              statusId: 4,
              statusName: "Delivered",
            },
            {
              statusId: 5,
              statusName: "Cancelled",
            },
            {
              statusId: 6,
              statusName: "Delayed",
            },
            {
              statusId: 7,
              statusName: "Rejected",
            },
          ])
          .then(() => {
            console.log("Records are inserted into table statuses");
          })
          .catch((e) => {
            console.log("Trouble inserting records into statuses table", e);
          });
      }
    });
  })
  .catch((e) => {
    console.log("Error creating table");
  });

triggerRunBillGeneration(true)
  
var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.options("*", cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the courier backend." });
});

require("./app/routes/auth.routes.js")(app);
require("./app/routes/employee.routes")(app);
require("./app/routes/customers.routes")(app);
require("./app/routes/companyInfo.routes")(app);
require("./app/routes/order.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3201;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}
module.exports = app;
