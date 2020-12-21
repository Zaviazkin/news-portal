const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { Pool, Client } = require("pg");

const pool = new Pool({
  connectionString: `${process.env.connectionString}`
});
async function loginUser(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      message: "Некорректный данные при входе в систему",
    });
  }
  const { email, password } = req.body;
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

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Неверный пароль, попробуйте снова" });
      }
      const token = jwt.sign(
        { email: user.email, userId: user.user_id },
        "gipgip"
        // { expiresIn: "1h" }
      );

      req.headers.authorization = token.split(" ")[1];
      return res.status(200).json({ token, userId: user.user_id });
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
  loginUser,
};
