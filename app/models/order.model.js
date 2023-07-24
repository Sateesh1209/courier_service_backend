module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    "order",
    {
      sender: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      receiver: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pickupPoint: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dropoffPoint: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      estimateTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      estimateBlocks: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quotedPrice: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      totalPrice: {
        type: Sequelize.DOUBLE(10, 2),
        allowNull: true,
      },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      assignedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      assignedTo: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      assignedTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      pickedUpTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deliveredTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      requestedDateTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deliveryInstructions: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return Order;
};
