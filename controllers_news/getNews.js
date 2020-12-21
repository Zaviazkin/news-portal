const { Pool, Client } = require("pg");
const pool = new Pool({
  connectionString: 'postgres://nqigpuly:vdwmz4ad0leRW4S7Ow7UxCzKuUiHyAF2@suleiman.db.elephantsql.com:5432/nqigpuly'
});

async function getAllNews(req, res) {
  (async () => {
    const client = await pool.connect();
    try {
      const news = await client.query(`select news_id, title, author,likes_count, views_count, content, date, image 
      from news
      left join likes using(likes_id)
      left join views using (views_id)`);
      const allNews = news.rows;

      if (!news.rows.length) {
        return res.status(400).json("Новостей нет");
      }
      return res.status(200).json(allNews);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err);
    return res.status(400).json(err.detail);
  });
}

async function getOneNews(req, res) {
  const { id } = req.params;
  (async () => {
    const client = await pool.connect();
    try {
      const time = req.requestTime;
      const newsCorrect = await client.query(
        `select * from news where news_id =${id}`
      );
      if(!newsCorrect.rows[0]){
        return res.status(400).json('Новости с таким айди не найдено')
      }
      const viewsAndLikes = await client.query(
        `SELECT views_id, likes_id FROM news WHERE news_id=${id}`
      );
      const views = await client.query(
        `SELECT views_count FROM views WHERE views_id=${viewsAndLikes.rows[0]["views_id"]}`
      );
      const oneCount = views.rows[0]["views_count"];
      const likeCount = await client.query(
        `select count(user_id) from likes_to_users where like_id =${viewsAndLikes.rows[0]["likes_id"]}`
      );
      await client.query(
        `UPDATE likes SET likes_count=${likeCount.rows[0]["count"]} WHERE likes_id=${viewsAndLikes.rows[0]["likes_id"]}`
      );
      await client.query(
        `UPDATE views SET views_count=${oneCount + 1} WHERE views_id=${
          viewsAndLikes.rows[0]["views_id"]
        }`
      );
      const news = await client.query(`select news_id, title, author,likes_count, views_count, content, date, image 
        from news
        left join likes using(likes_id)
        left join views using (views_id) WHERE news_id=${id}`);
      const oneNews = news.rows[0];

      if (!news.rows.length) { 
        return res.status(200).json({});
      }
      return res.status(200).json(oneNews);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err);
    return res.status(400).json(err.detail);
  });
}

async function getLikesCount(req, res) {
  const { id } = req.params;
  (async () => {
    const client = await pool.connect();
    try {
      const time = req.requestTime;
      const likes = await client.query(
        `SELECT likes_count FROM likes WHERE likes_id=${id}`
      );
      const oneCount = likes.rows;

      if (!oneCount.length) {
        return res.status(400).json("Новости с таким id нет");
      }
      return res.status(200).json({ time, oneCount });
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err);
    return res.status(400).json(err.detail);
  });
}

async function getViewsCount(req, res) {
  const { id } = req.params;
  (async () => {
    const client = await pool.connect();
    try {
      const time = req.requestTime;
      const views = await client.query(
        `SELECT views_count FROM views WHERE views_id=${id}`
      );
      const oneCount = views.rows;

      if (!oneCount.length) {
        return res.status(400).json("Новости с таким id нет");
      }
      return res.status(200).json({ time, oneCount });
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err);
    return res.status(400).json(err.detail);
  });
}

module.exports = { getAllNews, getOneNews, getLikesCount, getViewsCount };


// const { Pool, Client } = require("pg");

// const pool = new Pool({
//   user: "postgres",
//   host: "127.0.0.1",
//   database: "testdb",
//   password: "1236",
//   port: 5432,
// });

// async function getAllNews(req, res) {
//   (async () => {
//     const client = await pool.connect();
//     try {
//       const news = await client.query(`select news_id, title, author,likes_count, views_count, content, date, image 
//       from news
//       left join likes using(likes_id)
//       left join views using (views_id)`);
//       const allNews = news.rows;

//       if (!news.rows.length) {
//         return res.status(400).json("Новостей нет");
//       }
//       return res.status(200).json(allNews);
//     } finally {
//       client.release();
//     }
//   })().catch((err) => {
//     console.log(err);
//     return res.status(400).json(err.detail);
//   });
// }

// async function getOneNews(req, res) {
//   const { id } = req.params;
//   (async () => {
//     const client = await pool.connect();
//     try {
//       const time = req.requestTime;
//       const newsCorrect = await client.query(
//         `select * from news where news_id =${id}`
//       );
//       if(!newsCorrect.rows[0]){
//         return res.status(400).json('Новости с таким айди не найдено')
//       }
//       const viewsAndLikes = await client.query(
//         `SELECT views_id, likes_id FROM news WHERE news_id=${id}`
//       );
//       const views = await client.query(
//         `SELECT views_count FROM views WHERE views_id=${viewsAndLikes.rows[0]["views_id"]}`
//       );
//       const oneCount = views.rows[0]["views_count"];
//       const likeCount = await client.query(
//         `select count(user_id) from likes_to_users where like_id =${viewsAndLikes.rows[0]["likes_id"]}`
//       );
//       await client.query(
//         `UPDATE likes SET likes_count=${likeCount.rows[0]["count"]} WHERE likes_id=${viewsAndLikes.rows[0]["likes_id"]}`
//       );
//       await client.query(
//         `UPDATE views SET views_count=${oneCount + 1} WHERE views_id=${
//           viewsAndLikes.rows[0]["views_id"]
//         }`
//       );
//       const news = await client.query(`select news_id, title, author,likes_count, views_count, content, date, image 
//         from news
//         left join likes using(likes_id)
//         left join views using (views_id) WHERE news_id=${id}`);
//       const oneNews = news.rows[0];

//       if (!news.rows.length) { 
//         return res.status(200).json({});
//       }
//       return res.status(200).json(oneNews);
//     } finally {
//       client.release();
//     }
//   })().catch((err) => {
//     console.log(err);
//     return res.status(400).json(err.detail);
//   });
// }

// async function getLikesCount(req, res) {
//   const { id } = req.params;
//   (async () => {
//     const client = await pool.connect();
//     try {
//       const time = req.requestTime;
//       const likes = await client.query(
//         `SELECT likes_count FROM likes WHERE likes_id=${id}`
//       );
//       const oneCount = likes.rows;

//       if (!oneCount.length) {
//         return res.status(400).json("Новости с таким id нет");
//       }
//       return res.status(200).json({ time, oneCount });
//     } finally {
//       client.release();
//     }
//   })().catch((err) => {
//     console.log(err);
//     return res.status(400).json(err.detail);
//   });
// }

// async function getViewsCount(req, res) {
//   const { id } = req.params;
//   (async () => {
//     const client = await pool.connect();
//     try {
//       const time = req.requestTime;
//       const views = await client.query(
//         `SELECT views_count FROM views WHERE views_id=${id}`
//       );
//       const oneCount = views.rows;

//       if (!oneCount.length) {
//         return res.status(400).json("Новости с таким id нет");
//       }
//       return res.status(200).json({ time, oneCount });
//     } finally {
//       client.release();
//     }
//   })().catch((err) => {
//     console.log(err);
//     return res.status(400).json(err.detail);
//   });
// }

// module.exports = { getAllNews, getOneNews, getLikesCount, getViewsCount };
