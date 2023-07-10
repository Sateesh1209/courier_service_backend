module.exports = (sequelize, Sequelize) => {
    const CompanyInfo = sequelize.define("company_info", {
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pricePerBlock: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      timePerBlock: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      onTimeBonus: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },{
      tableName: 'company_info',
      timestamps: false,
      freezeTableName: true
    });
  
    return CompanyInfo;
  };
  