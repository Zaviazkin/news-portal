const { Pool, Client } = require("pg");

const pool = new Pool({
  connectionString: `${process.env.connectionString}`
});

async function addNews(req, res) {
  req.requestTime = new Date().toLocaleString({
    timeZone: "Asia/Bishkek",
    timeZoneName: "short",
  });
  const time = req.requestTime;
  const { author, content, title } = req.body;
  const filedata = req.file;
  let nameFile = "ggnews.jpg";
  if (filedata) {
    nameFile = filedata.originalname;
  }
  if (author.trim() === "") {
    return res
      .status(400)
      .json({ message: "Неправильно заполнено поле author" });
  }
  if (title.trim() === "") {
    return res
      .status(400)
      .json({ message: "Неправильно заполнено поле title" });
  }
  if (content.trim() === "") {
    return res
      .status(400)
      .json({ message: "Неправильно заполнено поле content" });
  }
  const client = await pool.connect();
  (async () => {
    try {
      await client.query("INSERT INTO views(views_count) VALUES($1)", [1]);
      const viewsId = await client.query(
        "SELECT currval('views_id_seq'::regclass)"
      );
      await client.query("INSERT INTO likes(likes_count) VALUES($1)", [1]);
      const likeId = await client.query(
        "SELECT currval('likes_likes_id_seq'::regclass)"
      );
      await client.query(
        "INSERT INTO news(title,date,author,content,likes_id,views_id, image) VALUES($1,$2,$3,$4,$5,$6,$7)",
        [
          title,
          time,
          author,
          content,
          likeId.rows[0]["currval"],
          viewsId.rows[0]["currval"],
          `http://localhost:3030/upload/${nameFile}`,
        ]
      );
      const newsInfo = await client.query(
        `select * from news where title='${title}'`
      );
      const news = newsInfo.rows[0];

      return res
        .status(200)
        .json({ massege: "Новость успешно сохранена", news });
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err);
    return res.status(400).json(err.detail);
  });
}

module.exports = { addNews };
