const Client = require("ssh2-sftp-client");
const { listenForNewEntries } = require("./app");
const dotenv = require("dotenv");
require("./server");
const logger = require("./logger");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const sftp = new Client("moenco-client");

(async () => {
  try {
    logger("info", `Program is running in enviroment: ${process.env.NODE_ENV}`);
    const config = {
      host: process.env.SERVER_HOST,
      username: process.env.SERVER_USERNAME,
      password: process.env.SERVER_PASSWORD,
    };
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
