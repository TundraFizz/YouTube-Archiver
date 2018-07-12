var app     = require("../server.js");
var fs      = require("fs");
var request = require("request");
var ytdl    = require("ytdl-core");
var config  = require("../../config.json");

app.get("/", function(req, res){
  res.render("index.ejs");
});

app.post("/archive", function(req, res){
  var link        = req["body"]["link"];
  var videoId     = link.split("watch?v=")[1].split("&")[0];
  var part        = "snippet%2CcontentDetails";
  var apiKey      = config["apiKey"];
  var metaDataUrl = `https://www.googleapis.com/youtube/v3/videos/?id=${videoId}&part=${part}&key=${apiKey}`;
  var dir         = `./src/videos/${videoId}`;

  if(!fs.existsSync("./src/videos")) fs.mkdirSync("./src/videos");
  if(!fs.existsSync(dir))            fs.mkdirSync(dir);

  request(metaDataUrl, {json:true}, function(error, response, obj){
    // Info wanted:
    // * ID        [from user]
    // * Title     [snippet]
    // * Thumbnail [snippet]
    // * Duration  [contentDetails]
    // * Size      [from downloading]

    var title      = obj["items"][0]["snippet"]["title"];
    var thumbnails = obj["items"][0]["snippet"]["thumbnails"];
    var duration   = obj["items"][0]["contentDetails"]["duration"];

    var urlOfLargestThumbnail  = "";
    var areaOfLargestThumbnail = 0;

    for(i in thumbnails){
      var area = thumbnails[i]["width"] * thumbnails[i]["height"];
      if(area > areaOfLargestThumbnail){
        urlOfLargestThumbnail = thumbnails[i]["url"];
      }
    }

    process.stdout.write("Downloading image... ");
    var image = request(urlOfLargestThumbnail).pipe(fs.createWriteStream(`${dir}/${videoId}.jpg`));

    image.on("finish", function(){
      console.log("completed!");

      var percentNow = 0;

      var link = `https://www.youtube.com/watch?v=${videoId}`;
      var video = ytdl(link);

      video.pipe(fs.createWriteStream(`${dir}/${videoId}.mp4`));

      process.stdout.write("Downloading video... ");

      video.on("progress", function(a,b,c){
        // var qwe = Math.ceil((b/c) * 100);
        // if(qwe > percentNow){
        //   percentNow = qwe;
        //   console.log(`${percentNow}%`);
        // }
      });

      video.on("finish", function(){
        var hours   = 0;
        var minutes = 0;
        var seconds = 0;

        // Duration Format: PT2H4M35S
        if(/([0-9])H/g.exec(duration)) hours   = parseInt(/([0-9])H/g.exec(duration)[1]);
        if(/([0-9])M/g.exec(duration)) minutes = parseInt(/([0-9])M/g.exec(duration)[1]);
        if(/([0-9])S/g.exec(duration)) seconds = parseInt(/([0-9])S/g.exec(duration)[1]);

        var totalSeconds = (hours * 60 * 60) + (minutes * 60) + seconds;

        console.log("completed!");
        console.log(title);
        console.log(totalSeconds);

        // Update database
      });

      video.on("error", function(err){
        console.log(">>>>>>>> ERROR!");
        console.log(err);
      });

      res.json({});
    });
  });
});
