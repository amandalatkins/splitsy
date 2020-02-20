var db = require("../models");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const path = require("path");
const fs = require('fs');

module.exports = function(app) {
  //get all receipts
  app.get("/api/receipts", function(req, res) {
    db.Receipt.findAll({ include: [db.Payer, db.Item, db.User] }).then(function(
      dbReceipt
    ) {
      res.json(dbReceipt);
    });
  });

  //get all receipts for a user
  app.get("/api/receipts/userId/:userId", function(req, res) {
    db.Receipt.findAll({
      where: {
        UserId: req.params.userId
      },
      include: [db.Payer, db.Item, db.User]
    }).then(function(dbReceipt) {
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

  // get specific Receipt of a user by label
  app.get("/api/receipts/userId/:userId/label/:label", function(req, res) {
    db.Receipt.findOne({
      where: {
        label: req.params.label,
        UserId: req.params.userId
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

  //create new Receipt with image
  app.post("/api/upload", upload.single('receiptImage'), function(req, res) {
    const newFileName = req.body.label.replace(/\s/g, '_').replace(/^A-Za-z0-9/g, '').toLowerCase()+Date.now() + path.extname(req.file.originalname).toLowerCase();
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "../uploads/"+newFileName);

    fs.rename(tempPath, targetPath, err => {
      if (err) return handleError(err, res);

        res
          .status(200)
          .contentType("text/plain")
          .end("File uploaded!");
    });
    // console.log(req);
    // req.body.image = "/uploads/"+req.body.receiptImage.name;
    // db.Receipt.create(req.body).then(function(dbReceipt) {
    //   res.json(dbReceipt);
    // });
  });

  //update receipt
  app.put("/api/receipts/:id", function (req, res) {
    db.Receipt.update(req.body, {where: { id: req.params.id } })
    .then(dbReceipt => res.json(dbReceipt));
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
