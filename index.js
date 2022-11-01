const Client = require("ssh2-sftp-client");
const { listenForNewEntries } = require("./app");
const dotenv = require("dotenv");
const fs = require("fs");
require("./server");
const logger = require("./logger");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const sftp = new Client("moenco-client");

(async () => {
  try {
    logger("info", `Program is running in enviroment: ${process.env.NODE_ENV}`);
    let filenames1 = fs.readdirSync("./");
    let filenames2 = fs.readdirSync(".././");
    let filenames3 = fs.readdirSync("./../");

    logger("info", "\nFilenames in directory 1:");
    filenames1.forEach((file) => {
      logger("info", `file1: ${file}`);
    });
    logger("info", "\nFilenames in directory 2:");
    filenames2.forEach((file) => {
      logger("info", `file2: ${file}`);
    });
    filenames3.forEach((file) => {
      logger("info", `file3: ${file}`);
    });
    const config = {
      host: process.env.SERVER_HOST,
      username: process.env.SERVER_USERNAME,
      password: process.env.SERVER_PASSWORD,
    };
    logger("info", `hsot: ${config.host}`);
    logger("info", `uname: ${config.username}`);
    logger("info", `pwd: ${config.password}`);
    const dir = await sftp.connect(config).then((s) => {
      return sftp.cwd();
    });
    sftp.on("error", (err) => logger("error", err));
    logger(
      "info",
      `connected to remote SFTP server, the working dir is ${dir}`
    );
    module.exports = { sftp };

    listenForNewEntries();
    // .then(() => sftp.end());
    // return
  } catch (err) {
    //TODO: log to file
    console.log(`Error: ${err.message}`);
    logger("error", err);
  }
})();
