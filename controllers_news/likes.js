const { Pool, Client } = require("pg");
const jwt = require("jsonwebtoken");

const pool = new Pool({
  connectionString: 'postgres://nqigpuly:vdwmz4ad0leRW4S7Ow7UxCzKuUiHyAF2@suleiman.db.elephantsql.com:5432/nqigpuly'
});
async function addLike(req, res) {
  const { news_id } = req.body;
  (async () => {
    const client = await pool.connect();
    try {
      const token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, "gipgip");

      const user_id = decoded.userId;
      await client.query(
        "INSERT INTO likes_to_users(like_id,user_id) VALUES($1,$2)",
        [news_id, user_id]
      );
      const news = await client.query(
        `SELECT title from news WHERE news_id=${news_id}`
      );
      const user = await client.query(
        `SELECT full_name from users WHERE user_id=${user_id}`
      );
      return res.status(200).json({
        message: `Пользователь ${user.rows[0]["full_name"]} лайкнул новость ${news.rows[0]["title"]}`,
      });
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err);
    return res.status(400).json(err.detail);
  });
}

async function getUsersId(req, res) {
  const { id } = req.params;
  (async () => {
    const client = await pool.connect();
    try {
      const users = await client.query(
        `SELECT user_id FROM likes_to_users WHERE like_id=${id}`
      );
      const all_users_liked = users.rows;

      if (!all_users_liked.length) {
        return res.status(400).json("Новости с таким id нет");
      }
      return res
        .status(200)
        .json({
          "Все id пользователей которым понравилась новость": all_users_liked,
        });
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err);
    return res.status(400).json(err.detail);
  });
}

module.exports = { addLike, getUsersId };
