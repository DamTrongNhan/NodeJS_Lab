import express from "express";
import multer from "multer";
import path from "path";
import helpers from "../helper/helpers";
// Không cần ../ move file khi dùng approot vẫn ok
import appRoot from "app-root-path";
import homeController from "../controller/homeController.js";
import { send } from "process";
const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, appRoot + "/src/public/img/"),
  // By default, multer removes file extensions so let's add them back
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: helpers.imageFilter,
});
const uploadMultiple = multer({
  storage: storage,
  fileFilter: helpers.imageFilter,
}).array("profileMultiplePic", 3);
const initWebRoute = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/detail/user/:userId", homeController.getDetailUser);
  router.post("/createNewUser", homeController.createNewUser);
  router.get("/getUpdateUser/:userId", homeController.getUpdateUser);
  router.post("/deleteUser", homeController.deleteUser);
  router.post("/postUpdateUser", homeController.postUpdateUser);
  router.get("/getUploadFile", homeController.getUploadFile);
  router.post(
    "/postUploadSinglePic",
    upload.single("profileSinglePic"),
    homeController.postUploadSinglePic
  );
  router.post(
    "/postUploadMultiplePic",
    (req, res, next) => {
      uploadMultiple(req, res, (err) => {
        if (
          err instanceof multer.MulterError &&
          err.code === "LIMIT_UNEXPECTED_FILE"
        ) {
          // handle multer file limit error here
          res.send(
            `<h1 class="btn btn-danger">Bạn đã tải lên file vượt giới hạn cho phép</h1>`
          );
        } else if (err) {
          res.send(err);
        } else {
          // make sure to call next() if all was well
          next();
        }
      });
    },
    homeController.postUploadMultiplePic
  );
  return app.use("/", router);
};
export default initWebRoute;
