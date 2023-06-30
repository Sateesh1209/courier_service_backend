require("dotenv").config();
const { Op } = require("sequelize");
const express = require("express");
const cors = require("cors");

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
  })
  .catch((e) => {
    console.log("Error creating table");
  });

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

// set port, listen for requests
const PORT = process.env.PORT || 3201;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}
module.exports = app;
