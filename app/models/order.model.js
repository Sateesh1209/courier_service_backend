module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define(
      "order",
      {
        sender: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        receiver: {
          type: Sequelize.INTEGER,
          allowNull: true,
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
        statusId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        assignedBy: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        assignedTo: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
  