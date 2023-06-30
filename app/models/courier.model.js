module.exports = (sequelize, Sequelize) => {
    const Courier = sequelize.define("courier", {
      phone: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pickUpLocation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dropLocation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fair: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lastUpdatedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      comments: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  
    return Courier;
  };
  