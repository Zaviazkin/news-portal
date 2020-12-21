const { Pool, Client } = require("pg");

const pool = new Pool({
  connectionString: `${process.env.connectionString}`
});

async function setOneNews(req, res) {
  const { id } = req.params;
  const { author, content, title } = req.body;
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
  if (author && title && content) {
    (async () => {
      const client = await pool.connect();
      try {
        const time = req.requestTime;
        await client.query(
          `UPDATE news SET title='${title}',date='${time}',author='${author}',content='${content}' WHERE news_id=${id}`
        );

        return res
          .status(200)
          .json({ time, message: "новость успешно изменена" });
      } finally {
        client.release();
      }
    })().catch((err) => console.log(err));
  }
}
module.exports = { setOneNews };
