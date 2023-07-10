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
db.order = require("./order.model.js")(sequelize, Sequelize);
db.status = require("./status.model.js")(sequelize, Sequelize);
db.companyInfo = require("./companyInfo.model.js")(sequelize, Sequelize);

// foreign key for session
db.employee.hasMany(db.session, { onDelete: "CASCADE" });
db.session.belongsTo(db.employee, { onDelete: "CASCADE" });

db.roles.hasMany(db.employee, { foreignKey: "roleId" });
db.employee.belongsTo(db.roles, { foreignKey: "roleId" });

db.order.belongsTo(db.status, { foreignKey: "statusId" });
db.status.hasMany(db.order, { foreignKey: "statusId" });

db.order.belongsTo(db.customers, {
  foreignKey: "sender",
});
db.order.belongsTo(db.customers, {
  foreignKey: "receiver",
});

db.order.belongsTo(db.employee, {
  foreignKey: "assignedBy",
});
db.order.belongsTo(db.employee, {
  foreignKey: "assignedTo",
});

module.exports = db;
