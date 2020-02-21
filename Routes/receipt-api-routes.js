var db = require("../models");
const multer = require("./node_modules/multer");
const upload = multer({ dest: "uploads/" });
const path = require("path");
const fs = require('fs');
const axios = require("./node_modules/axios");
require("./node_modules/dotenv").config();
const jimp = require("./node_modules/jimp");

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
    // const newFileName = req.body.label.replace(/\s/g, '_').replace(/^A-Za-z0-9/g, '').toLowerCase()+Date.now() + path.extname(req.file.originalname).toLowerCase();
    const newFileName = req.body.label.replace(/\s/g, '_').replace(/^A-Za-z0-9/g, '').toLowerCase()+Date.now() + ".jpg";
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "../client/public/assets/receipt_uploads/"+newFileName);

	var livePath;

	if (process.env.NODE_ENV === "production") {
    	//PRODUCTION:
		livePath = process.env.SERVER_PATH + "/assets/receipt_uploads/"+newFileName;
	} else {
    	// TESTING::
		livePath = "https://raindev.us/b_bar.jpg";
	}


    fs.rename(tempPath, targetPath, err => {
      	if (err) throw err;
		axios.get("https://api.ocr.space/parse/imageurl", { 
			params: {
				apikey: process.env.OCR_API_KEY,
				url: livePath,
				detectOrientation: true,
				isTable: true,
				filetype: "JPG"
			}
		})
			.then(results => {
				if (!results.data.ParsedResults[0].IsErroredOnProcessing) {
		
					// Get all the returned text
		
					var text = results.data.ParsedResults[0].ParsedText;
		
					// PARSE THE TEXT
		
					// Break it up into an array based on line breaks
					parse = text.split("\n");
		
					for (var i = 0; i < parse.length; i++) {
					// Replace random characters
					parse[i] = parse[i].replace(/\t\r/g,'');
					// Split the line by 'tabs'
					parse[i] = parse[i].split("\t");
					}
					// Remove any lines that don't have more than one item (nearly all the food items end up having 2 children)
					parse = parse.filter(item => item.length > 1);
		
					//Loop through the array and see if any item in that array contains a $. Keep it if it does.
					var itemArray = [];
		
					for (var i = 0; i < parse.length; i++) {
					var keep = false;
					parse[i].forEach(item => {
						if (item.includes('$')) {
						keep = true;
						}
					});
		
					if (keep) itemArray.push(parse[i])
		
					}
		
					// Format the returned itemArray into object with name and price keys to match database, 
					// parse out any non numerical characters from the price key
					var receiptItems = []
		
					itemArray.forEach(item => {
					receiptItems.push({
						name: item[0],
						price: item[1].replace(/[^.0-9]+/g,"")
					});
					});
		
					res.json({ receiptImagePath: livePath, receiptItems });
		
				}
			})
			.catch(err => res.json(err));
      })
    //   .catch(err => res.json(err));  

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
