var app     = require("../server.js");
var fs      = require("fs");
var request = require("request");
var ytdl    = require("ytdl-core");

app.get("/", function(req, res){
  res.render("index.ejs");
});

app.post("/archive", function(req, res){

  // var videoId  = req["body"]["videoId"];
  var videoId     = "-PKNuZovuSw";
  var part        = "snippet%2CcontentDetails";
  var apiKey      = "AIzaSyDrUpWR74T1E5rrNcmHcm6Gjifgdn0HCZ0";
  var metaDataUrl = `https://www.googleapis.com/youtube/v3/videos/?id=${videoId}&part=${part}&key=${apiKey}`;

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

    // Duration Format: PT4M35S = 4 minutes, 35 seconds => 275 seconds

    var urlOfLargestThumbnail  = "";
    var areaOfLargestThumbnail = 0;

    for(i in thumbnails){
      var area = thumbnails[i]["width"] * thumbnails[i]["height"];
      if(area > areaOfLargestThumbnail){
        urlOfLargestThumbnail = thumbnails[i]["url"];
      }
    }

    console.log(title);
    console.log(urlOfLargestThumbnail);
    console.log(duration);

    var percentNow = 0;

    var link = `https://www.youtube.com/watch?v=${videoId}`;
    var stream = ytdl(link);

    stream.pipe(fs.createWriteStream(`./src/static/videos/${videoId}.mp4`));

    console.log("Downloading...");

    stream.on("progress", function(a,b,c){
      var qwe = Math.ceil((b/c) * 100);
      if(qwe > percentNow){
        percentNow = qwe;
        console.log(`${percentNow}%`);
      }
    });

    stream.on("finish", function(){
      console.log(">>>>>>>> FINISH!");
    });

    stream.on("error", function(err){
      console.log(">>>>>>>> ERROR!");
      console.log(err);
    });

    res.json({});
  });
});
