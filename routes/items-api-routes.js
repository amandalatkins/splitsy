var db = require("../models");

module.exports = function(app) {
  //get all Items
  app.get("/api/items", function(req, res) {
    db.Item.findAll({ include: [db.Payer, db.Receipt] }).then(function(dbItem) {
      res.json(dbItem);
    });
  });

  // get specific Item by id
  app.get("/api/items/id/:id", function(req, res) {
    db.Item.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Payer, db.Receipt]
    }).then(function(dbItem) {
      res.json(dbItem);
    });
  });

  // get specific Item by label
  app.get("/api/items/label/:label", function(req, res) {
    db.Item.findOne({
      where: {
        label: req.params.label
      },
      include: [db.Payer, db.Receipt]
    }).then(function(dbItem) {
      res.json(dbItem);
    });
  });

  //create new Item
  app.post("/api/items", function(req, res) {
    db.Item.create(req.body).then(function(dbItem) {
      res.json(dbItem);
    });
  });

  // update item
  app.put("/api/items/:id", function(req, res) {
    db.Item.update(req.body, { where: { id: req.params.id } }).then(dbItem => {
      res.json(dbItem);
    });
  });

  // get items for specific receipt
  app.get("/api/items/receipt/:receiptId", function(req, res) {
    db.Item.findAll({
      where: {
        ReceiptId: req.params.receiptId
      },
      include: [db.Payer, db.Receipt]
    }).then(function(dbItem) {
      res.json(dbItem);
    });
  });

  // delete Item
  app.delete("/api/items/:id", function(req, res) {
    db.Item.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbItem) {
      res.json(dbItem);
    });
  });
};
