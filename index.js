const Fs = require("fs");
const Ytdl = require("ytdl-core");
const ProgressBar = require("progress");
const Config = require("./config.json");

let downloadingBar;

Ytdl.getInfo(Config.videoId).then((info) => {
    console.log(`Downloading ${info.videoDetails.title}...`);
    Ytdl("https://www.youtube.com/watch?v=" + Config.videoId, { quality: "highest" })
        .on("response", (res) => downloadingBar = new ProgressBar(`${info.videoDetails.title} ${Config.outputFile} :percent [:bar] :etas`, {
            complete: String.fromCharCode(0x2588),
            total: parseInt(res.headers["content-length"], 10)
        }))
        .on("data", (data) => downloadingBar.tick(data.length))
        .on("finish", () => console.log("Download complete !"))
        .pipe(Fs.createWriteStream(Config.outputFile));
});