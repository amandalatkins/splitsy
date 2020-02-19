var db = require("../models");

module.exports = function(app) {
  //get all payers
  app.get("/api/payers", function(req, res) {
    db.Payer.findAll({ include: [db.Item, db.Receipt] }).then(function(
      dbPayer
    ) {
      res.json(dbPayer);
    });
  });

  // get specific Payer by id
  app.get("/api/payers/id/:id", function(req, res) {
    db.Payer.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Item, db.Receipt]
    }).then(function(dbPayer) {
      res.json(dbPayer);
    });
  });

  // get specific Payer by name
  app.get("/api/payers/name/:name", function(req, res) {
    db.Payer.findOne({
      where: {
        name: req.params.name
      },
      include: [db.Item, db.Receipt]
    }).then(function(dbPayer) {
      res.json(dbPayer);
    });
  });
  // update Payer
  app.put("/api/payers/:id", function(req, res) {
    db.Payer.update(req.body, { where: { id: req.params.id } }).then(
      dbPayer => {
        res.json(dbPayer);
      }
    );
  });

  //create new Payer
  app.post("/api/payers", function(req, res) {
    db.Payer.create(req.body).then(function(dbPayer) {
      res.json(dbPayer);
    });
  });

  //add a payer to item
  app.put("/api/payers/:PayerId/add/item/:itemId", function(req, res) {
    let thePayer;
    let theItem;
    db.Payer.findOne({
      where: {
        id: req.params.PayerId
      }
    }).then(function(dbPayer) {
      thePayer = dbPayer;
      console.log(dbPayer);
      db.Item.findOne({
        where: {
          id: req.params.itemId
        }
      }).then(function(dbItem) {
        theItem = dbItem;
        theItem.addPayer(thePayer);
        res.send("payer added to item");
      });
    });
  });

  //remove a Payer from item
  app.put("/api/payers/:PayerId/remove/item/:itemId", function(req, res) {
    let thePayer;
    let theItem;
    db.Payer.findOne({
      where: {
        id: req.params.PayerId
      }
    }).then(function(dbPayer) {
      thePayer = dbPayer;
      console.log(dbPayer);
      db.Item.findOne({
        where: {
          id: req.params.itemId
        }
      }).then(function(dbItem) {
        theItem = dbItem;
        theItem.removePayer(thePayer);
        res.send("payer removed from item");
      });
    });
  });

  // delete Payer
  app.delete("/api/payers/:id", function(req, res) {
    db.Payer.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbPayer) {
      res.json(dbPayer);
    });
  });
};
