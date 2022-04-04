const Fs = require("fs");
const Ytdl = require("ytdl-core");
const ProgressBar = require("progress");
const Config = require("./config.json");

const output = Config.output.toLowerCase();
if (output !== "mp3" && output !== "mp4") {
    console.log("Output must be mp3 or mp4 !");
    process.exit(1);
}

let downloadingBar;
Ytdl.getInfo(Config.video).then((info) => {
    const outputfile = info.videoDetails.title.replace(/[ ]/g, "-").replace(/[^a-zA-Z0-9_-]/g, "") + "." + output;
    console.log(`Downloading ${outputfile}...`);
    Ytdl(Config.video, { filter: output === "mp3" ? "audioonly" : "video" })
        .on("response", (res) => downloadingBar = new ProgressBar(`${info.videoDetails.title} ${outputfile} [:bar] :percent :etas`, {
            complete: String.fromCharCode(0x2588),
            total: parseInt(res.headers["content-length"], 10)
        }))
        .on("data", (data) => downloadingBar.tick(data.length))
        .on("finish", () => console.log("Download complete !"))
        .pipe(Fs.createWriteStream(outputfile));
});