var fs = require("fs");
const { sendEmail } = require("./mailer");
const FileJson = require("./models/fileJsons");

const REPORT = {
  subject: "New file Added on Moenco SFTP Server",
  message: "new file prompt on MOENCO file server",
  email: "hundag@moenco.com.et",
  from: "'new file notifier (temporary email)' <trtvps@etmilestone.com>",
  to: "subscriber for new file updates",
};
//email client for outlook has to add sender adress to safe adresses
const date = new Date();
const current_time = {
  date: date.getDate(),
  day: date.getDay(),
  year: date.getFullYear(),
  month: date.getMonth(),
  hour: date.getHours(),
  minute: date.getMinutes(),
  second: date.getSeconds(),
};
const now = `${current_time.year}-${current_time.month}-${current_time.date} ${current_time.hour}:${current_time.minute}:${current_time.second}`;

exports.listenForNewEntries = async () => {
  const List = require("./models/list");
  const { sftp } = require(".");

  const recursiveFunc = async () => {
    try {
      const lists = await List.query()
        .findById(1)
        .then()
        .catch((err) => console.log("list not there err: ", err));
      const prevListLength2 = lists.filesAmount;
      let listLength = await sftp.list("/data").then((d) => d.length);
      /* > or < only handles adition and deletion, not rename-- 
      renamed file will be emailed on next file addition (treated as new based on fileList.json) 
      */
      console.log("current files # ", listLength);
      console.log("prev files # ", prevListLength2);
      if (listLength > prevListLength2) {
        //update listLength.txt
        console.log("new file added");
        const fileList = await sftp.list("/data");

        let prevFileList = await FileJson.query();
        const func = (arr) => {
          return arr.map((el) => JSON.parse(el.fileJson));
        };
        prevFileList = prevFileList.length > 0 ? func(prevFileList) : [];
        //get new files
        let newFiles = [];

        if (prevFileList.length < 1) {
          newFiles = fileList;
        } else {
          newFiles = fileList.filter((el, i) => {
            //new files will be filtered out based on name and size matching
            if (
              prevFileList.some(
                (el2) => el2.name === el.name && el2.size === el.size
              )
            ) {
              console.log("file exists in previous file list");
              return false;
            } else {
              //   console.log(file doesn't exist in previous file list);
              return true;
            }
          });
        }
        if (newFiles.length > 0) {
          //download new files
          const remotePaths = newFiles.map((el) => `/data/${el.name}`);
          console.log("remotePaths", remotePaths);
          for (el of remotePaths) {
            const fd = fs.openSync(`./temp/${el.split("data/")[1]}`, "w");

            await sftp.fastGet(el, `./temp/${el.split("data/")[1]}`);
            console.log("file saved: ", el.split("data/")[1]);
            fs.close(fd);
          }

          //email new files
          const filesToMail = remotePaths.map((el) => {
            return {
              path: `./temp/${el.split("data/")[1]}`,
            };
          });
          const newReport = {
            ...REPORT,
            attachments: filesToMail,
          };
          await sendEmail(
            newReport.msg,
            newReport.email,
            newReport.subject,
            newReport.from,
            newReport.to,
            newReport.attachments
          );

          //delete new files();
          remotePaths.forEach(async (el) => {
            fs.unlink(`./temp/${el.split("data/")[1]}`, (err) => {
              if (err) console.log(err);
              console.log("File deleted ...");
            });
          });

          //update list
          await List.query().findById(1).patch({
            filesAmount: listLength,
            updated_at: now,
          });
          console.log("length updated after new files added");

          //update jsonFiles
          const files =
            prevFileList.length > 0 ? [prevFileList, newFiles] : newFiles;
          files.forEach(async (el) => {
            await FileJson.query().insert({ fileJson: el });
          });
          console.log("new files added to filesJsons table");
        }

        //recursive
        recursiveFunc();
      } else if (listLength < prevListLength2) {
        //deleted
        console.log("file deleted");
        await List.query().findById(1).patch({
          filesAmount: listLength,
        });
        console.log("length table updated after delete");

        //recursive
        recursiveFunc();
      }
    } catch (err) {
      console.log("err caught by try/catch: ", err);
    }

    //recursive
    recursiveFunc();
  };

  recursiveFunc();
};
//FIXME: sftp.end not being recognized
