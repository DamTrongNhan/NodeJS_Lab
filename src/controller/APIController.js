import pool from "../configs/connectDB";
const getAllUsers = async (req, res, next) => {
  const [rows, fields] = await pool.execute("select * from users");
  return res.status(200).json({
    message: "Lấy tất cả user thành công",
    data: rows,
  });
};
const createNewUser = async (req, res) => {
  let { firstName, lastName, email, address } = req.body;
  if (!firstName || !lastName || !email || !address) {
    return res.status(200).json({
      message: "Missing required parameters",
    });
  }
  const [rows, fields] = await pool.execute(
    "insert into users (firstName, lastName, email, address) values(?,?,?,?)",
    [firstName, lastName, email, address]
  );
  return res.status(200).json({
    message: "Tạo user thành công",
  });
};
const updateUser = async (req, res) => {
  let { firstName, lastName, email, address, userId } = req.body;
  if (!firstName || !lastName || !email || !address || !userId) {
    return res.status(200).json({
      message: "Missing required parameters",
    });
  }
  const [rows, fields] = await pool.execute(
    "UPDATE users SET firstName = ?, lastName = ?, email = ?, address = ? where userId = ? ",
    [firstName, lastName, email, address, userId]
  );
  return res.status(200).json({
    message: "Chỉnh sửa user thành công",
  });
};
const deleteUser = async (req, res) => {
  let userId = req.body.userId;
  if (!userId) {
    return res.status(200).json({
      message: "missing  required parameter",
    });
  }
  const [row, fields] = await pool.execute(
    "DELETE from users where userId = ?",
    [userId]
  );
  return res.status(200).json({
    message: "Xóa user thành công",
  });
};

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
