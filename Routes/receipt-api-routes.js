var db = require("../models");

module.exports = function(app) {
  //get all receipts
  app.get("/api/receipts", function(req, res) {
    db.Receipt.findAll({ include: [db.Payer, db.Item, db.User] }).then(function(
      dbReceipt
    ) {
      res.json(dbReceipt);
    });
  });

  // get specific Receipt by id
  app.get("/api/receipts/id/:id", function(req, res) {
    db.Receipt.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Payer, db.Item, db.User]
    }).then(function(dbReceipt) {
      res.json(dbReceipt);
    });
  });

  // get specific Receipt by label
  app.get("/api/receipts/label/:label", function(req, res) {
    db.Receipt.findOne({
      where: {
        label: req.params.label
      },
      include: [db.Payer, db.Item, db.User]
    }).then(function(dbReceipt) {
      res.json(dbReceipt);
    });
  });

  //create new Receipt
  app.post("/api/receipts", function(req, res) {
    db.Receipt.create(req.body).then(function(dbReceipt) {
      res.json(dbReceipt);
    });
  });

  // delete Receipt
  app.delete("/api/receipts/:id", function(req, res) {
    db.Receipt.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbReceipt) {
      res.json(dbReceipt);
    });
  });
};
