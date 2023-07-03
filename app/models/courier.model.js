module.exports = (sequelize, Sequelize) => {
  const Courier = sequelize.define("courier", {
    phone: {
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
    assignedTo: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return Courier;
};
