module.exports = function(sequelize, DataTypes) {
  var moment = require("moment");
  var moment = require("moment-timezone");

  var Receipt = sequelize.define("Receipt", {
    label: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1, 60]
      }
    },
    tax: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0.0
    },
    tip: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0.0
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0.0
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0.0
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING
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
