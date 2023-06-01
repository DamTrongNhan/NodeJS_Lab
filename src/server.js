import express from "express";
import configViewEngine from "./configs/viewEngine.js";
import initWebRoute from "./route/web.js";
import initApiRoute from "./route/api.js";
import morgan from "morgan";
import fs from "fs";
import appRoot from "app-root-path";
//import biến môi trường
require("dotenv").config();

const port = process.env.PORT || 8080;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(appRoot + "/src/log/access.log", {
  flags: "a",
});
// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

// set up view engine
configViewEngine(app);

// set up router
initWebRoute(app);

// set up router api
initApiRoute(app);

// handle 404 not found
app.use((req, res) => res.render("404.ejs"));
app.listen(port, () => {
  console.log(`Example is listening on port http://localhost:${port}`);
});
