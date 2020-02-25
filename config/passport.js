const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var db = require("../models");

passport.use(
  new LocalStrategy(
    {
      username: "username",
      password: "password"
    },
    function(username, password, done) {
      db.User.findOne({ where: { username: username } }).then(theUser => {
        if (!theUser) {
          return done(null, false, { message: "User does not exist" });
        }
        if (!theUser.validPass(password)) {
          return done(null, false, { message: "Password is not valid." });
        }
        return done(null, true);
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(user, done) {
  db.User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;
