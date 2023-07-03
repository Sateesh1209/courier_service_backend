module.exports = (sequelize, Sequelize) => {
    const CourierDetails = sequelize.define("courierDetails", {
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
      estimationDelivery: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      comments: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  
    return CourierDetails;
  };
  