var fs         = require("fs");                   // File system
var express    = require("express");              // Define the web framework
var bodyParser = require("body-parser");          // Allows you to read POST data
var app        = module.exports = express();      // Define the application

fs.readFile("config.json", "utf-8", function(err, data){
  // Import the data from config.json
  module.exports.data = JSON.parse(data);

  // Create the videos directory if it doesn't exist already
  if(!fs.existsSync(__dirname + "/videos")) fs.mkdirSync("./src/videos");

  app.set("views", __dirname + "/views");           // Define the views directory
  app.use(express.static(__dirname + "/static"));   // Define the static directory
  app.use(bodyParser.urlencoded({extended: true})); // Setting for bodyParser
  require(__dirname + "/routes/routes.js");         // Include web routes third
  app.listen(80);                                   // Start the server
});
