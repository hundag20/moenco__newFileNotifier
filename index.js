const Client = require("ssh2-sftp-client");
const { listenForNewEntries } = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./env.env" });

const sftp = new Client("moenco-client");

const config = {
  host: process.env.SERVER_HOST,
  username: process.env.SERVER_USERNAME,
  password: process.env.SERVER_PASSWORD,
};
try {
  (async () => {
    const p = await sftp.connect(config).then((s) => {
      return sftp.cwd();
    });
    sftp.on("error", (err) => err);
    console.log(`Remote working directory is ${p}`);

    module.exports = { sftp };

    listenForNewEntries();
    // .then(() => sftp.end());
    // return
  })();
} catch (err) {
  //TODO: log to file
  console.log(`Error: ${err.message}`);
}
