module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define("Item", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 60]
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.00
    }
  });

  Item.associate = function(models) {
    Item.belongsTo(models.Receipt, {
      onDelete: "cascade"
    });
    Item.belongsToMany(models.Payer, {
      through: "PayerItem"
    });
  };
  return Item;
};
