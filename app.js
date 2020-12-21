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
const connectionString1 = "	postgres://nqigpuly:vdwmz4ad0leRW4S7Ow7UxCzKuUiHyAF2@suleiman.db.elephantsql.com:5432/nqigpuly"

const pool = new Pool({
  connectionString: 'postgres://nqigpuly:vdwmz4ad0leRW4S7Ow7UxCzKuUiHyAF2@suleiman.db.elephantsql.com:5432/nqigpuly'
});
app.use('/upload', express.static('upload'));

async function startApp() {
  try {
     await pool.connect();
    app.listen(3030, () => {
      console.log(`app started`);
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  } finally {
    console.log("Hello epta");
  }
}
module.exports={pool}
startApp();
 