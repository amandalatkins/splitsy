var db = require("../models");

// API routes for User
module.exports = function(app) {
  //get all users
  app.get("/api/users", function(req, res) {
    db.User.findAll({}).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  // get specific user by id
  app.get("/api/users/:id", function(req, res) {
    db.User.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  // get specific user by user name
  app.get("/api/users/user-name/:name", function(req, res) {
    db.User.findOne({
      where: {
        user_name: req.params.name
      }
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  // get specific user by user_name and pass
  app.get("/api/users/user-name/:user/password/:pass", function(req, res) {
    db.User.findOne({
      where: {
        password: req.params.pass,
        user_name: req.params.user
      }
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  //create new user
  app.post("/api/users", function(req, res) {
    db.User.create(req.body).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  // delete user
  app.delete("/api/users/:id", function(req, res) {
    db.User.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });
};
