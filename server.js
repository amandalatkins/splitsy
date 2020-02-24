var express = require("express");
var session = require("express-session");
var path = require("path");
const LocalStrategy = require("passport-local").Strategy;
var passport = require("./config/passport");

var PORT = process.env.PORT || 3001;
var db = require("./models");

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: "your secret line of secretness"
  })
);
app.use(passport.initialize());
app.use(passport.session());

require("./routes/payer-api-routes.js")(app);
require("./routes/user-api-routes.js")(app);
require("./routes/items-api-routes.js")(app);
require("./routes/receipt-api-routes.js")(app);

db.sequelize.sync({ force: false }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
