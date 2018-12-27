var app  = require("../server.js");
var db   = app.db;
var io   = app.io;
var fs   = require("fs"); // File system library
var ytdl = require("ytdl-core");

app.get("/", async function(req, res){
  var [library] = await db.query("SELECT * FROM library");

  res.render("index.ejs", {
    "library": library,
  });
});

app.use(function (req, res){
  res.render("404.ejs");
});

async function Hello(socket, url){await new Promise((done, fail) => {
  var prev = -1;
  var current = -1;

  var videoObject = ytdl(url);

  videoObject.on("progress", (chunkLength, downloaded, total) => {
    current = Math.floor((downloaded / total) * 100);
    if(current > prev){
      prev = current;
      console.log(`Progress: ${current}%`);
      socket.emit("progress", current);
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

io.on("connection", function(socket){
  var ip = socket.conn.request.headers["x-real-ip"] || "x-real-ip isn't defined";
  console.log("New connection:", ip);

  socket.on("archive", async function(msg){
    var url = msg.url;
    url = "https://www.youtube.com/watch?v=A02s8omM_hI";
    var videoId = url.split("watch?v=")[1].split("&")[0];

    await Hello(socket, url);
    console.log("========== DONE ==========");
    io.emit("complete");
  });

  socket.on("disconnect", function(){
    // delete connectionMap[socket.id];
  });
});
