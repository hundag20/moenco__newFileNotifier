const fs = require("fs");
const logger = require("./logger");

const archive = async (fileName, content) => {
  try {
    const path =
      process.env.NODE_ENV === "production"
        ? `${process.env.ARCHIVE_LOCATION}/${fileName}`
        : `${process.env.ARCHIVE_LOCATION}\\${fileName}`;
    const fd = fs.openSync(path, "w");
    fs.writeFileSync(fd, content);
    fs.close(fd);
    logger(
      "info",
      `file(${fileName}) archived to ${process.env.ARCHIVE_LOCATION}`
    );
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
