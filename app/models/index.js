const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.session = require("./session.model.js")(sequelize, Sequelize);
db.employee = require("./employee.model.js")(sequelize, Sequelize);
db.roles = require("./roles.model.js")(sequelize, Sequelize);
db.customers = require("./customers.model.js")(sequelize, Sequelize);
db.courier = require("./courier.model.js")(sequelize, Sequelize);
db.courierDetails = require("./courierDetails.model.js")(sequelize, Sequelize);
db.status = require("./status.model.js")(sequelize, Sequelize);

// foreign key for session
db.employee.hasMany(db.session, { onDelete: "CASCADE" });
db.session.belongsTo(db.employee, { onDelete: "CASCADE" });

db.roles.hasMany(db.employee, { foreignKey: "roleId" });
db.employee.belongsTo(db.roles, { foreignKey: "roleId" });

db.courier.belongsTo(db.status, { foreignKey: "statusId" });
db.status.hasMany(db.courier, { foreignKey: "statusId" });

db.customers.hasMany(db.courier, { foreignKey: "phone" });
db.courier.belongsTo(db.customers, { foreignKey: "phone" });

db.courier.belongsTo(db.employee, {
  foreignKey: "lastUpdatedBy",
});
db.courier.belongsTo(db.employee, {
  foreignKey: "assignedTo",
});

db.courier.hasOne(db.courierDetails, { onDelete: "CASCADE" });
db.courierDetails.belongsTo(db.courier, { onDelete: "CASCADE" });

module.exports = db;
