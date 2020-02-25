var db = require("../models");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const path = require("path");
const fs = require('fs');
const axios = require("axios");
require("dotenv").config();
const jimp = require("jimp");
var FormData = require('form-data');

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
		livePath = targetPath;
	}

	fs.rename(tempPath, targetPath, err => {
		if (err) throw err;
	
		jimp.read(livePath, (err, img) => {
			if (err) return console.log(err);
			console.log('running jimp and creating base64');
			img
			.clone()
			.quality(60)
			.scaleToFit( 750, 750 )
			.greyscale()
			.brightness(0.2)
			.contrast(0.2)
			.getBase64(jimp.AUTO, (_, base64) => res.json({base64}));
			// .getBase64(jimp.AUTO, (_, base64) => {
			// 	fs.writeFile('base64.txt', base64, (err) => {
			// 		if (err) { 
			// 			console.log(err)
			// 		} else {
			// 			console.log('writing file');
			// 		}
			// 	});
				
			// });
		});
	});
});

app.post("/api/ocr", function({body},res) {
	const {livePath} = body;

	axios.get("https://api.ocr.space/parse/imageurl", { 
		params: {
			apikey: process.env.OCR_API_KEY,
			url: livePath,
			detectOrientation: true,
			isTable: true,
			filetype: "JPG"
		}
	}).then(results => {
		res.json(results.data);
	})
	.catch(err => console.log(err));
});

// app.post("/api/ocr", function({body}, res) {
// 	const {base64} = body;
// 	console.log(base64);
// 	fs.writeFile('base64.txt', base64, () => {});
// 	console.log("starting ocr");

// 	var ocrData = new FormData();
// 	ocrData.append('apikey',process.env.OCR_API_KEY);
// 	ocrData.append('base64Image', base64);
// 	ocrData.append('detectOrientation', 'true');
// 	ocrData.append('isTable','true');

// 	axios({
// 		method: "post",
// 		url: "https://api.ocr.space/parse/image",
// 		data: ocrData,
// 		config: {
// 			headers: {
// 				'Content-Type': 'multipart/form-data'
// 			}
// 		}
// 	})
// 	// axios.post("https://api.ocr.space/parse/image", {
// 	// 	// apikey: process.env.OCR_API_KEY,
// 	// 	apikey: "5d04fbee1088957",
// 	// 	// base64Image: base64,
// 	// 	url: "https://raindev.us/b_bar.jpg",
// 	// 	detectOrientation: true,
// 	// 	isTable: true,
// 	// 	filetype: "JPG"
// 	// }
// 	// // , 
// 	// // { 
// 	// // 	headers: {
// 	// // 		'Content-Type': 'image/jpeg'
// 	// // 		// 'Content-Type': 'multipart/form-data'
// 	// // 		// 'Content-Type': 'application/x-www-form-urlencoded'
// 	// // 	}
// 	// // }
// 	// )
// 	.then(results => {
// 		console.log("OCR Complete");
// 		res.json(results.data);
// 		// if (!results.data.ParsedResults[0].IsErroredOnProcessing) {
// 		// 	console.log(results.data);
// 		// 	res.json({ text: results.data });
// 		// 	// runParse(results.data.ParsedResults[0].ParsedText);
// 		// } else {
// 		// 	console.log("there was an error with OCR:");
// 		// 	console.log(results.data);
// 		// 	res.json(results.data);
// 		// }
// 	})
// 	.catch(err => console.log(err));

// });

app.post("/api/parse", function({text}, res) {

	function runParse(text) {
		console.log(text);
		console.log("starting parse");

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
		
		res.json(receiptItems);
			
	}

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
