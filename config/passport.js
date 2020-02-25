const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var db = require("../models");

passport.use(
  new LocalStrategy(
    {
      usernameField: "user_name"
    },
    function(username, password, done) {
      db.User.findOne({ where: { user_name: username } }).then(theUser => {
        if (!theUser) {
          return done(null, false, { message: "User does not exist" });
        }
        if (!theUser.validPass(password)) {
          return done(null, false, { message: "Password is not valid." });
        }
        return done(null, theUser);
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;
