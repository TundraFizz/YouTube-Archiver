var app  = require("../server.js");
var db   = app.db;
var io   = app.io;
var fs   = require("fs"); // File system library
var ytdl = require("ytdl-core");

var connections = {};
var downloadQueue = [];
var downloading = false;

app.get("/", async function(req, res){
  var [library] = await db.query("SELECT * FROM library");

  res.render("index.ejs", {
    "library": library,
  });
});

app.get("/admin", async function(req, res){
  res.render("admin.ejs");
});

app.use(function (req, res){
  res.render("404.ejs");
});

async function Hello(url){await new Promise((done, fail) => {
  var prev = -1;
  var current = -1;
  var videoObject = ytdl(url);

  videoObject.on("progress", (chunkLength, downloaded, total) => {
    current = Math.floor((downloaded / total) * 100);

    if(current > prev){
      prev = current;
      downloadQueue[0]["progress"] = current;
      io.emit("update", downloadQueue);
    }
  });

  videoObject.on("info", (info, format) => {
      console.log("==============================");
      console.log(info.title);
      console.log(info.thumbnail_url);
  });

  videoObject.on("finish", () => {
    console.log("FINISH!");
    done();
  });

  videoObject.pipe(fs.createWriteStream("video.mp4"));
})}

async function Trigger(){
  if(downloading)
    return;
  downloading = true;

  while(downloadQueue.length){
    var url = downloadQueue[0]["url"];
    await Hello(url);
    downloadQueue.shift();
  }
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  downloading = false;
}

io.on("connection", function(socket){
  var ip = socket.conn.request.headers["x-real-ip"] || "x-real-ip isn't defined";
  console.log("New connection:", ip);
  connections[socket.id] = {};

  socket.on("archive", async function(msg){
    var url = msg.url;
    var videoId = url.split("watch?v=")[1].split("&")[0];

    io.emit("complete");
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
