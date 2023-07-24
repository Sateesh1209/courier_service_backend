module.exports = (sequelize, Sequelize) => {
  const Roles = sequelize.define(
    "roles",
    {
      roleId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      roleName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return Roles;
};
