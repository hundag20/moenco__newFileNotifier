const path = require("path");
const fs = require("fs");
const logger = require("./logger");

const directoryPath = path.join(__dirname, "temp");

(async () => {
  const func = () => {
    //joining path of directory

    const been14days = (file) => {
      const now = new Date();
      const diff =
        (now.getTime() - file.birthtime.getTime()) / (1000 * 60 * 60);
      if (diff >= 336) return true;
      else return false;
    };

    // passsing directoryPath and callback function
    fs.readdir(directoryPath, (err, files) => {
      logger("info", "routine temp clean up called");

      //handling error
      if (err) {
        return logger("error", `Unable to scan directory: ${err}`);
      }
      //listing all files using forEach
      files.forEach((file) => {
        // Do whatever you want to do with the file
        fs.stat(`./temp/${file}`, (err, data) => {
          if (err) logger("error", err);
          else {
            if (been14days(data)) {
              //delete file
              fs.unlink(`./temp/${file}`, (err) => {
                if (err) {
                  logger("error", err);
                } else {
                  logger(
                    "info",
                    `${file} deleted because it expired (reached 14 days)`
                  );
                }
              });
            }
          }
        });
      });
    });
  };
  //run cleaner once in 24 hrs
  setInterval(func, 86400000);
})();
//push
