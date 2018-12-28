var app   = require("../server.js");
var data  = app.data;
var db    = app.db;
var io    = app.io;
var fs    = require("fs"); // File system library
var axios = require("axios");
var ytdl  = require("ytdl-core");

var connections   = {};
var library       = [];
var downloadQueue = [];
var downloading   = false;

app.get("/", async function(req, res){
  res.render("index.ejs", {
    "library"      : library,
    "downloadQueue": downloadQueue
  });
});

app.get("/admin", async function(req, res){
  res.render("admin.ejs");
});

app.use(function (req, res){
  res.render("404.ejs");
});

async function Hello(url){await new Promise((done, fail) => {
  var prev        = -1;
  var current     = -1;
  var videoId     = url.split("watch?v=")[1].split("&")[0];
  var videoObject = ytdl(url);

  downloadQueue[0]["videoId"] = videoId;

  videoObject.on("info", (info, format) => {
    if(info.livestream){
      videoObject.destroy();
      fail("Livestreams can't be downloaded");
      return;
    }

    downloadQueue[0]["title"]    = info.title;
    downloadQueue[0]["thumb"]    = info.thumbnail_url;
    downloadQueue[0]["duration"] = info.length_seconds;
  });

  videoObject.on("progress", (chunkLength, downloaded, total) => {
    current = Math.floor((downloaded / total) * 100);

    if(current > prev){
      prev = current;
      downloadQueue[0]["progress"] = current;
      io.emit("update", downloadQueue);
    }
  });

  videoObject.on("finish", () => {
    done();
  });

  videoObject.pipe(fs.createWriteStream(`./static/videos/${videoId}.mp4`));
})}

async function Trigger(){
  if(downloading)
    return;
  downloading = true;

  while(downloadQueue.length){
    var url = downloadQueue[0]["url"];

    try {
      await Hello(url);

      await db.query("INSERT INTO library (youtubeId, title, duration, pathImage, pathVideo) VALUES (?)", [[
        downloadQueue[0]["videoId"],
        downloadQueue[0]["title"],
        downloadQueue[0]["duration"],
        downloadQueue[0]["thumb"],
        `${data["domain"]}/videos/${downloadQueue[0]["videoId"]}.mp4`
      ]]);
    }catch(err){
      console.log("Something bad happened!");
      console.log(err);
    }

    downloadQueue.shift();
    io.emit("update", downloadQueue);

    [library] = await db.query("SELECT * FROM library");
    io.emit("update2", library);
  }

  downloading = false;
}

io.on("connection", function(socket){
  var ip = socket.conn.request.headers["x-real-ip"] || "x-real-ip isn't defined";
  console.log("New connection:", ip);
  connections[socket.id] = {};

  socket.on("archive", async function(msg){
    var url = msg.url;

    try {
      var videoId = url.split("watch?v=")[1].split("&")[0];
    }catch(err){
      socket.emit("alert", "Bad YouTube URL");
      return;
    }

    var qwe = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id=${videoId}&fields=items(contentDetails%2Fduration%2Csnippet(thumbnails%2Fdefault%2Furl%2Ctitle))&key=${data["youtubeApiKey"]}`;
    var result = await axios.get(qwe);

    if(result["data"]["items"].length == 0){
      socket.emit("alert", "That video doesn't exist");
      return;
    }

    var items = result["data"]["items"][0];
    var snippet = items["snippet"]
    var contentDetails = items["contentDetails"];
    var title     = snippet["title"];
    var thumbnail = snippet["thumbnails"]["default"]["url"];
    var duration  = contentDetails["duration"];
    console.log("=================================================")
    console.log(title);
    console.log("=================================================")
    console.log(thumbnail);
    console.log("=================================================")
    console.log(duration);

    downloadQueue.push({"url": url, "progress": 0});
    io.emit("update", downloadQueue);
    Trigger();
  });

  socket.on("admin", () => {
    socket.emit("admin", connections);
    // io.emit               // Sends to everybody
    // socket.emit           // Only sends to the sender
    // socket.broadcast.emit // Sends to everybody EXCEPT the sender
  });

  socket.on("disconnect", function(){
    delete connections[socket.id];
  });
});

(async () => {
  [library] = await db.query("SELECT * FROM library");
})();
