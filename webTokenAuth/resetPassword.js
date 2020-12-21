const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { Pool, Client } = require("pg");

const pool = new Pool({
  connectionString: `${process.env.connectionString}`
});

async function forgetPassword(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      message: "Некорректный данные при входе в систему",
    });
  }
  const { email } = req.body;
  (async () => {
    const client = await pool.connect();
    try {
      const userInfo = await client.query(
        `select * from users where email='${email}'`
      );
      const user = userInfo.rows[0];
      if (!user) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }
      const password = user.password
     req.body = { email, password}
     next()
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err);
    return res.status(400).json({
      message: "Что-то пошло не так, попробуйте снова",
      error: err.detail,
    });
  });
}

module.exports = {
    forgetPassword,
};
