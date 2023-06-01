import express from "express";
import APIController from "../controller/APIController";
const router = express.Router();
const initApiRoute = (app) => {
  router.get("/users/", APIController.getAllUsers);
  router.post("/createNewUser", APIController.createNewUser);
  router.put("/updateUser", APIController.updateUser);
  router.delete("/deleteUser", APIController.deleteUser);
  return app.use("/api/v1/", router);
};
export default initApiRoute;
