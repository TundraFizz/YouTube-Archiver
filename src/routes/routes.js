var app  = require("../server.js");
var fs   = require("fs");
var ytdl = require("ytdl-core");

app.get("/", function(req, res){
  res.render("index.ejs");
});

app.post("/archive", function(req, res){
  var link = req["body"]["link"];

  var options = {
    "quality": "highest",
    "filter" : "audioandvideo"
  };

  ytdl(link, options).pipe(fs.createWriteStream("output.mp4"));

  res.json({});
});
