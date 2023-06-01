import pool from "../configs/connectDB";
import multer from "multer";
const getHomePage = async (req, res) => {
  const [rows, fields] = await pool.execute("SELECT * FROM users");
  return res.render("index.ejs", { dataUsers: rows });
};
const getDetailUser = async (req, res) => {
  let userId = req.params.userId;
  const [rows, fields] = await pool.execute(
    "SELECT * FROM users where userId = ?",
    [userId]
  );
  return res.send(JSON.stringify(rows));
};
const createNewUser = async (req, res) => {
  let { firstName, lastName, email, address } = req.body;
  const [rows, fields] = await pool.execute(
    "INSERT INTO users (firstName, lastName, email, address)  VALUES(?,?,?,?)",
    [firstName, lastName, email, address]
  );
  return res.redirect("/");
};
const deleteUser = async (req, res) => {
  let { userId } = req.body;
  const [rows, fields] = await pool.execute(
    "DELETE FROM users WHERE userId = ?",
    [userId]
  );
  return res.redirect("/");
};
const getUpdateUser = async (req, res) => {
  let userId = req.params.userId;
  let [rows, fields] = await pool.execute(
    "SELECT * from USERS WHERE userId = ?",
    [userId]
  );
  return res.render("userUpdate.ejs", { dataUser: rows[0] });
};
const postUpdateUser = async (req, res) => {
  let { firstName, lastName, email, address, userId } = req.body;
  let [rows, fields] = await pool.execute(
    "UPDATE users set firstName = ?, lastName = ?, email = ?, address = ? where userId = ?",
    [firstName, lastName, email, address, userId]
  );
  return res.redirect("/");
};
const getUploadFile = async (req, res) => res.render("upload.ejs", {});

// handle upload single file pic

// check upload function [Function: multerMiddleware]

// check multer object Multer {
//   storage: MemoryStorage {},
//   limits: undefined,
//   preservePath: undefined,
//   fileFilter: [Function: allowAll]
// }

// check multer.single function [Function: multerMiddleware]
const postUploadSinglePic = async (req, res) => {
  // check err  undefined undefined

  // check req.fileValidationError undefined undefined

  // check req.file object {
  //   fieldname: 'profile_pic',
  //   originalname: 'Screenshot_20230116_060719.png',
  //   encoding: '7bit',
  //   mimetype: 'image/png',
  //   destination: 'D:\\Last semester\\learning\\node1/src/public/img/',
  //   filename: 'profile_pic-1674571820408.png',
  //   path: 'D:\\Last semester\\learning\\node1\\src\\public\\img\\profile_pic-1674571820408.png',
  //   size: 188643
  // }

  // req.file contains information of uploaded file
  // req.body contains information of text fields, if there were any

  if (req.fileValidationError) {
    return res.send(req.fileValidationError);
  } else if (!req.file) {
    return res.send("Please select an image to upload");
  }
  // Display uploaded image for user validation // render ra với data đường dẫn or lưu vào database
  res.send(
    `You have uploaded this image: 
      <hr/>
      <img src="/img/${req.file.filename}" width="500">
      <hr/>
      <a href="/getUploadFile">Upload another image</a>`
  );
};

// handle upload multiple file pic
const postUploadMultiplePic = async (req, res) => {
  // 10 is the limit I've defined for number of uploaded files at once
  // 'multiple_images' is the name of our file input fieldF
  if (req.fileValidationError) {
    return res.send(req.fileValidationError);
  } else if (req.files.length === 0) {
    return res.send("Please select an image to upload");
  }
  let result = "You have uploaded these images: <hr />";
  const files = req.files;
  let len, index;
  // Loop through all the uploaded images and display them on frontend
  for (index = 0, len = files.length; index < len; ++index) {
    result += `<img src="/img/${files[index].filename}" width="300" style="margin-right: 20px;">`;
  }
  result += '<hr/><a href="/getUploadFile">Upload more images</a>';
  res.send(result);
};

module.exports = {
  getHomePage,
  getDetailUser,
  createNewUser,
  getUpdateUser,
  deleteUser,
  postUpdateUser,
  getUploadFile,
  postUploadSinglePic,
  postUploadMultiplePic,
};
