const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
var http = require("http");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'static')));

app.get("/v1/logs", cors(), (req, res) => {
  const content = fs.readFileSync(`./combined.txt`, {
    encoding: "utf8",
    flag: "r",
  });
  res.send(content);
});
app.get("/v1/env", cors(), (req, res) => {
  const content = fs.readFileSync(`./.env.production`, {
    encoding: "utf8",
    flag: "r",
  });
  res.send(content);
});

http.createServer(app).listen(3000, (err) => {
  if (err) console.log("err", err);
  console.log("newfilenotifer micro-service running on 3000");
});
module.exports = app;

/*
  TODO: validate token on requests
  */
