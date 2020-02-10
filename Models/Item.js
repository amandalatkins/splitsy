module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define("Item", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 20]
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  });

  Item.associate = function(models) {
    Item.belongsTo(models.Receipt, {
      onDelete: "cascade"
    });
    Item.belongsToMany(models.Item, {
      through: "PayerItem"
    });
  };
  return Item;
};
