const jimp = require("jimp");

module.exports = (imgPath) => {
    return jimp.read(imgPath, (err,img) => {
        if (err) console.log(err);

        img
        // .clone()
        .quality(70)
        .greyscale()
        .brightness(0.2)
        .contrast(0.2)
        .write(imgPath);
        // .writeAsync(targetPath)
        // .then(imgDone => {
        //   res.status(200).end();
        // })
        // .catch(err => console.log(err));

        // formatImage.write(newImg, () => {
        //   console.log("did it");
        // });
    });

}