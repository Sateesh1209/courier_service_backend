module.exports = (sequelize, Sequelize) => {
  const CompanyInfo = sequelize.define(
    "company_info",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startHour: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      endHour: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      cancelCharges: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      avenue: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      street: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      block: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pricePerBlock: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      timePerBlock: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      onTimeBonus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      billingCycle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      billingExpression: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastBillGenerated: {
        type: Sequelize.DATE,
        allowNull: true
      }
    },
    {
      tableName: "company_info",
      timestamps: false,
      freezeTableName: true,
    }
  );

  return CompanyInfo;
};
