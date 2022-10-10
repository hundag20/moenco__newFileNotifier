var fs = require("fs");
const { sendEmail } = require("./mailer");
var parser = require("simple-excel-to-json");
const File = require("./models/file");
const { archiver } = require("./archiver.js");
const xlsx = require("xlsx");

require("./archiver.js");
require("./cleanTemp.js");

let allFiles = [];
const REPORT = {
  subject: "New file Added on Moenco SFTP Server",
  message: "new file prompt on MOENCO file server",
  email: [
    "adenm@moenco.com.et",
    "BeakalY@moenco.com.et",
    "hundag@moenco.com.et",
  ],
  from: "'new file notifier (temporary email)' <trtvps@etmilestone.com>",
  to: "subscriber for new file updates",
};
//email client for outlook has to add sender address to safe adresses
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
  const logger = require("./logger");
  const { sftp } = require(".");
  // const r = fs.readdirSync("./temp");
  // console.log(r);
  // for (el of r) {
  //   if (el != "temp.txt") {
  //     const workbook = xlsx.readFile(`./temp/${el}`, {
  //       cellDates: true,
  //     });

  //     allFiles.push({
  //       name: el,
  //       content: xlsx.utils.sheet_to_json(
  //         workbook.Sheets[workbook.SheetNames[0]]
  //       ),
  //     });
  //   }
  // }
  // console.log(allFiles[allFiles.length - 2]);
  const recursiveFunc = async () => {
    try {
      //get new files
      const fileList = await sftp.list("/data");

      //check new file existence
      if (fileList.length > 0) {
        logger("info", "new files added to remote server");

        //download new files
        const remotePaths = fileList.map((el) => `/data/${el.name}`);
        for (el of remotePaths) {
          const fd = fs.openSync(`./temp/${el.split("data/")[1]}`, "w");

          await sftp.fastGet(el, `./temp/${el.split("data/")[1]}`);
          console.log("file saved: ", el.split("data/")[1]);
          fs.close(fd);
        }
        logger("info", `${remotePaths.length} files downloaded to temp folder`);

        //save new files to db in form of JSONs
        for (el of remotePaths) {
          const workbook = xlsx.readFile(`./temp/${el.split("data/")[1]}`, {
            cellDates: true,
          });
          allFiles.push({
            name: `${el.split("data/")[1]}`,
            content: xlsx.utils.sheet_to_json(
              workbook.Sheets[workbook.SheetNames[0]]
            ),
          });
        }

        //truncate table
        await File.query().truncate();
        logger("info", `truncated table before adding new entries`);

        //insert files
        for (el of allFiles) {
          await File.query().insert({
            name: el.name,
            content: JSON.stringify(el.content),
          });
        }
        logger("info", `${remotePaths.length} files uploaded to DB`);

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
        logger("info", `notification email sent`);

        //save files to archive
        for (el of remotePaths) {
          //fileName
          archiver(`${el.split("data/")[1]}`);
        }

        //delete new files() from DB not from file
        for (el of remotePaths) {
          await sftp.delete(el);
          console.log(
            `${el.split("data/")[1]} deleted from remote server ... `
          );
        }
        logger(
          "info",
          `${remotePaths.length} files deleted from remote server`
        );
      }

      //recursive
      recursiveFunc();
    } catch (err) {
      console.log("err caught by try/catch: ", err);
      logger("error", err);
    }
  };

  recursiveFunc();
};
//FIXME: sftp.end not being recognized
/*DONE new logic: delete all files after saving to db... then all existing files are 
treated as new files(no filesmount, no filesJSons)
1. check db for files --
2. save files to temp -- 
3. delete files from db --
4. save fileJsons to db --
5. email files --
6. Add log file -- 
*/
//DONE: new file that deletes files from temp in 14 days
//TODO: remove T00 parts if she asks
