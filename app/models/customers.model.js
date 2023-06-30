module.exports = (sequelize, Sequelize) => {
    const Customers = sequelize.define("customers", {
      phone: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  
    return Customers;
  };
  