module.exports = (sequelize, Sequelize) => {
  const Status = sequelize.define(
    "status",
    {
      statusId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      statusName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return Status;
};
