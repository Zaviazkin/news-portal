const express = require("express");
const app = express();
require("dotenv").config();
const cors = require('cors');
const bodyParser = require("body-parser");
const { Pool, Client } = require("pg");
const _ = require('lodash');
const multer = require('multer')

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
      cb(null, "upload");
  },
  filename: (req, file, cb) =>{
      cb(null, file.originalname);
  }
});
app.use(multer({storage:storageConfig}).single("addImage"));

const { router } = require("./routes/routes");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", router);

app.use('/upload', express.static('upload'));

async function startApp() {
  try {
    const http = require("http");
setInterval(function() {
    http.get("http://gipgipnews.herokuapp.com");
}, 300000); 
    app.listen(process.env.PORT || 3030, () => {
      console.log(`app started`);
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  } finally {
    console.log("Hello epta");
  }
}
startApp();
 