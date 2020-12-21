const { Pool, Client } = require("pg");

const pool = new Pool({
  connectionString: `${process.env.connectionString}`
});

async function getAllUsers(req, res) {
  (async () => {
    const client = await pool.connect();
    try {
      const time = req.requestTime;
      const users = await client.query(`select * from users`);
      const allUsers = users.rows;

      if (!allUsers.length) {
        return res.status(400).json("Новостей нет");
      }
      return res.status(200).json({ time, allUsers });
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err);
    return res.status(400).json(err.detail);
  });
}

async function getOneUser(req, res) {
  const { id } = req.params;
  (async () => {
    const client = await pool.connect();
    try {
      const time = req.requestTime;
      const user = await client.query(
        `SELECT * FROM users WHERE user_id=${id}`
      );
      const oneUser = user.rows[0];
      console.log(user.rows);
      if (!oneUser) {
        return res.status(400).json("Пользователь не найден");
      }
      return res.status(200).json({ time, oneUser });
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err);
    return res.status(400).json(err.detail);
  });
}

module.exports = { getAllUsers, getOneUser };
