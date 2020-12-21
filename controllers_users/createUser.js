const { Pool, Client } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const pool = new Pool({
  connectionString: `${process.env.connectionString}`
});

async function createUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      message: "Некорректный данные при регистрации",
    });
  }
  const { email, password, full_name, date_of_birth } = req.body;
  let { is_admin } = req.body;

  if (full_name === "" || !full_name) {
    return res
      .status(400)
      .json({ message: "Неправильно заполнено поле full_name" });
  }
  if (password.trim() === "" || !password) {
    return res
      .status(400)
      .json({ message: "Неправильно заполнено поле password" });
  }
  if (date_of_birth === "" || !date_of_birth) {
    return res
      .status(400)
      .json({ message: "Неправильно заполнено поле date_of_birth" });
  }
  if (!is_admin) {
    is_admin = false;
  }
  if (email && full_name && password && date_of_birth) {
    const hashedPassword = await bcrypt.hash(password, 12);
    (async () => {
      const client = await pool.connect();
      try {
        await client.query(
          "INSERT INTO users(email,password,is_admin,full_name, date_of_birth) VALUES($1,$2,$3,$4,$5)",
          [email, hashedPassword, is_admin, full_name, date_of_birth]
        );
        const userInfo = await client.query(
          `select * from users where email='${email}'`
        );
        const user = userInfo.rows[0];
        return res.status(200).json({ massege: "User успешно создан", user });
      } finally {
        client.release();
      }
    })().catch((err) => {
      console.log(err);
      return res.status(400).json(err.detail);
    });
  }
}

module.exports = { createUser };
