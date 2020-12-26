const { Pool, Client } = require("pg");

const pool = new Pool({
  connectionString: `${process.env.connectionString}`
});
async function dropOneNews(req, res) {
  const { id } = req.params;
  const time = req.requestTime;

  (async () => {
    const client = await pool.connect();
    try {
      const count = await client.query(`select likes_id from news where news_id=${id}`);
      console.log(count.rows[0]);
      await client.query(`DELETE FROM news WHERE news_id =${id}`);
      await client.query(`DELETE FROM likes_to_users WHERE like_id=${id}`)
      await client.query(`DELETE FROM likes WHERE likes_id =${count.rows[0]}`);
      await client.query(`DELETE FROM views WHERE views_id =${count.rows[0]}`);
      
      return res.status(200).json({ time, massege: "Новость успешно удалена" }); 
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err);
    return res.status(400).json(err);
  });
}

async function dropAllNews(req, res) {
  const time = req.requestTime;

  (async () => {
    const client = await pool.connect();
    try {
      await client.query(`TRUNCATE TABLE news CASCADE`);
      await client.query(`TRUNCATE TABLE likes CASCADE`);
      await client.query(`TRUNCATE TABLE views CASCADE`);
      await client.query(`TRUNCATE TABLE likes_to_users CASCADE`);
      await client.query(`select setval('news_news_id_seq'::regclass, 1, true)`)
      await client.query(`select setval('likes_likes_id_seq'::regclass, 1, true)`)
      await client.query(`select setval('views_id_seq'::regclass, 1, true)`)
      return res
        .status(200)
        .json({ time, massege: "Все новости успешно удалены" });
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err);
    return res.status(400).json(err.detail);
  });
}

module.exports = { dropOneNews, dropAllNews };
