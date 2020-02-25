module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 20]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 20]
      }
    },
    first_name: { type: DataTypes.STRING, allowNull: true },
    last_name: { type: DataTypes.STRING, allowNull: true }
  });

  User.associate = function(models) {
    User.hasMany(models.Receipt, {
      onDelete: "cascade"
    });
  };
  return User;
};
