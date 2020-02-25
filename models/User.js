const bcrypt = require("bcryptjs");

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

  User.addHook("beforeCreate", newUser => {
    newUser.password = bcrypt.hashSync(
      newUser.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  User.prototype.validPass = function(pw) {
    return bcrypt.compareSync(pw, this.password);
  };

  User.associate = function(models) {
    User.hasMany(models.Receipt, {
      onDelete: "cascade"
    });
  };
  return User;
};
