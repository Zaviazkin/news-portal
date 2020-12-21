const express = require("express");
const app = express();
const { Pool, Client } = require("pg");

// const client = new Client({
//   user: "postgres",
//   host: "127.0.0.1",
//   database: "northwind",
//   password: "1236",
//   port: 5432,
// });

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "testdb",
  password: "1236",
  port: 5432,
});
// "INSERT INTO news(title,date,author,content_id) VALUES($1,$2,$3,$4)",
//["10 человек погибло в авиакатастрофе над Нарыном", date, "Кристина Владынина",1]
// для создания таблицы с колонами = "CREATE TABLE product (product_id serial PRIMARY KEY, product_name varchar(128) NOT NULL, product_price real NOT NULL)"
// для создания значений в колонах - таблице = "INSERT INTO product(product_id,product_name,product_price) VALUES($1,$2,$3)", [1,'Sofa',420]

const date = new Date();
(async () => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "INSERT INTO news(title,date,author,content_id) VALUES($1,$2,$3,$4)",
      ["это прекрвсно что все наачинает работать", date, "Кристина Владынина",2]
    );
    console.log(res.command);
    pool.end();
  } finally {
    client.release();
  };
})().catch((err) => console.log(err));

app.listen(3000, () => {
  console.log(`app started`);
});

module.exports = { pool, app };
