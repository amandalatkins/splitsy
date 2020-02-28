# Splitsy

Restaurant bill splitting made easy.
<br>

# Summary

A full stack web application that uses optical character recognition (OCR) technology to convert a user uploaded receipt image into a virtual receipt. Users can then easily add payers to the virtual receipt and assign items, simplifying the receipt “split up” process. Built with React, Node.js, Express, MySQL, Passport.js and OCR.space API.
<br>

# Demo

![Image](client/public/assets/img/splitsy.gif)
<br>

# Technologies

General

- VScode
- Git
- GitHub

<br>
Front end

- React
- React-Strap
- React-chartjs-2
- Bootstrap
- CSS
- Moment.js

<br>
Back End

- Node
- Express
- MySQL
- Sequelize
- Multer
- Jimp
- OCR.space
- Passport
- Bcrypt
- Axios
  <br>

# Models

![Image](client/public/assets/img/models.png)
<br>

# OCR Flow

![Image](client/public/assets/img/ocrFlow.png)

# Authors

[Arman Riahi](https://www.linkedin.com/in/arman-riahi/)
</br>

[Amanda Atkins](https://www.linkedin.com/in/amandalatkins/)
<br>

# Code Snippet

Code showing how JSON return from OCR.space API is parsed into receipt items:

```
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

    // checks to see if a line has only one item and the proceeding line also only has one item. then checks if proceeding line is a dollar amount, if so pushes to original item, mimic-ing an item and price
    for (var i = 0; i < parse.length - 1; i++) {
      if (parse[i].length === 1 && parse[i + 1].length === 1) {
        if (parse[i + 1][0].includes("$")) {
          parse[i].push(parse[i + 1][0]);
        }
      }
    }

    //Remove any lines that don't have more than one item (more than 3) OR a dollar sign (nearly all the food items end up having 2 children)
    parse = parse.filter(item => {
      if (item.length > 1 || item.length < 3) {
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
        if (item.includes("$") || item.includes(".")) {
          keep = true;
        }
      });

      if (keep) itemArray.push(parse[i]);
    }

```
