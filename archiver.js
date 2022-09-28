const fs = require("fs");
const logger = require("./logger");

const archive = async (fileName, content) => {
  try {
    const fd = fs.openSync(`\\\\172.20.105.115\\sf\\${fileName}`, "w");
    fs.writeFileSync(fd, content);
    fs.close(fd);
    logger("info", `file(${fileName}) archived to "\\\\172.20.105.115S\\sf"`);
  } catch (err) {
    logger("error", err);
  }
};

exports.archiver = async (file) => {
  try {
    const content = fs.readFileSync(`./temp/${file}`, {
      encoding: "utf8",
      flag: "r",
    });
    const fileName = file;
    await archive(fileName, content);
  } catch (err) {
    logger("error", err);
  }
};
