var db = require("../models");
const multer = require("multer");
const upload = multer({ dest: "uploads/receipt_images/" });
const path = require("path");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();
const jimp = require("jimp");

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
  app.post("/api/upload", upload.single("receiptImage"), function(req, res) {
    // const newFileName = req.body.label.replace(/\s/g, '_').replace(/^A-Za-z0-9/g, '').toLowerCase()+Date.now() + path.extname(req.file.originalname).toLowerCase();
    const newFileName =
      req.body.label
        .replace(/\s/g, "_")
        .replace(/^A-Za-z0-9/g, "")
        .toLowerCase() +
      "_" +
      Date.now() +
      ".jpg";
    // const tempPath = path.join(__dirname, "../"+req.file.path);
    const tempPath = req.file.path;
    const targetPath = path.join(
      __dirname,
      "../uploads/receipt_images/" + newFileName
    );
    console.log(tempPath + " ==> " + targetPath);
    fs.rename(tempPath, targetPath, err => {
      if (err) throw err;

      console.log("moved file! " + targetPath);

      jimp.read(targetPath, (err, img) => {
        if (err) return console.log(err);
        console.log("running jimp");
        img
          .quality(60)
          .scaleToFit(750, 750)
          .greyscale()
          .brightness(0.3)
          .contrast(0.3)
          .write(targetPath, err => {
            if (err) res.json(err);
            console.log("wrote jimp file");
            if (process.env.NODE_ENV === "production") {
              res.json({
                imageUrl: process.env.SERVER_PATH + "/api/image/" + newFileName
              });
            } else {
              res.json({ imageUrl: "testing only" });
            }
          });
      });
    });
  });

  // Sends Image to OCR API
  app.post("/api/ocr", function({ body }, res) {
    let imageUrl = "";

    if (process.env.NODE_ENV === "production") {
      imageUrl = body.imageUrl;
    } else {
      imageUrl = "https://raindev.us/b_bar.jpg";
    }

    var params = {
      apikey: process.env.OCR_API_KEY,
      url: imageUrl,
      detectOrientation: true,
      isTable: true,
      filetype: "JPG"
    };

    console.log(params);

    axios
      .get("https://api.ocr.space/parse/imageurl", { params })
      .then(results => {
        console.log(results.data);
        if (results.data.ParsedResults) {
          res.json(results.data.ParsedResults);
        } else {
          res.json({ error: "Couldn't process image :(" });
        }
      })
      .catch(err => console.log(err));
  });

  // Returns an uploaded receipt image
  app.get("/api/image/:img", ({ params }, res) => {
    var { img } = params;
    var imageUrl = path.join(__dirname, "../uploads/receipt_images/" + img);
    console.log(imageUrl);
    res.sendFile(imageUrl);
  });

  // // Parses OCR response
  app.post("/api/parse", function(req, res) {
    var { text } = req.body;

    var parse = text.split("\n");

    for (var i = 0; i < parse.length; i++) {
      // Replace random characters
      parse[i] = parse[i].replace(/\t\r/g, "");

      // Split the line by 'tabs'
      parse[i] = parse[i].split("\t");
    }

    //Remove any lines that don't have more than one item OR a dollar sign (nearly all the food items end up having 2 children)
    parse = parse.filter(item => {
      if (item.length > 1) {
        return true;
      } else {
        return item.some(child => child.includes("$"));
      }
    });

    //Loop through the array and see if any item in that array contains a $. Keep it if it does.
    var itemArray = [];

    for (var i = 0; i < parse.length; i++) {
      var keep = false;
      parse[i].forEach(item => {
        if (item.includes("$")) {
          keep = true;
        }
      });

      if (keep) itemArray.push(parse[i]);
    }

    // Format the returned itemArray into object with name and price keys to match database,
    // parse out any non numerical characters from the price key
    var receiptItems = [];

    itemArray.forEach(item => {
      if (item.length > 1) {
        receiptItems.push({
          name: item[0],
          price: item[1].replace(/[^.0-9]+/g, "")
        });
      } else {
        if (item[0].includes("$")) {
          receiptItems.push({
            name: "",
            price: item[0].replace(/[^.0-9]+/g, "")
          });
        } else {
          receiptItems.push({
            name: item[0],
            price: 0
          });
        }
      }
    });

    res.json(receiptItems);
  });

  //update receipt
  app.put("/api/receipts/:id", function(req, res) {
    db.Receipt.update(req.body, {
      where: { id: req.params.id }
    }).then(dbReceipt => res.json(dbReceipt));
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
