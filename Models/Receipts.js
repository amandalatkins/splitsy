module.exports = function(sequelize, DataTypes) {
  var moment = require("moment");
  var moment = require("moment-timezone");

  var Receipt = sequelize.define("Receipt", {
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 40]
      }
    },
    tax: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    tip: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment
          .tz(this.getDataValue("createdAt"), "America/Los_Angeles")
          .format("MMMM Do YYYY, h:mm a");
      }
    }
  });

  Receipt.associate = function(models) {
    Receipt.belongsTo(models.User, {
      onDelete: "cascade"
    });
    Receipt.hasMany(models.Item, {
      onDelete: "cascade"
    });
    Receipt.hasMany(models.Payer, {
      onDelete: "cascade"
    });
  };
  return Receipt;
};
