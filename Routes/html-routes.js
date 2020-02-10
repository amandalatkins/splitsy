// HTML Routes
// =============================================================
module.exports = function(app, path) {
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/views/index.html"));
  });

  app.get("/sample", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/views/sample.html"));
  });
};
