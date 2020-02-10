module.exports = function(sequelize, DataTypes) {
  var Payer = sequelize.define("Payer", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 20]
      }
    }
  });

  Payer.associate = function(models) {
    Payer.belongsTo(models.Receipt, {
      onDelete: "cascade"
    });
    Payer.belongsToMany(models.Item, {
      through: "PayerItem"
    });
  };
  return Payer;
};
