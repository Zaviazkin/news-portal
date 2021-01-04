const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { main } = require('../webTokenAuth/sendMail')


const { timeMiddleware } = require("../middleware/time");
const auth = require("../middleware/auth");

const { dropOneNews, dropAllNews } = require("../controllers_news/dropNews");
const { addNews } = require("../controllers_news/addNews");
const { setOneNews } = require("../controllers_news/setOneNews");
const {
  getAllNews,
  getOneNews,
  getLikesCount,
  getViewsCount,
} = require("../controllers_news/getNews");
const { addLike, getUsersId } = require("../controllers_news/likes");

const { createUser } = require("../controllers_users/createUser");
const { getOneUser, getAllUsers } = require("../controllers_users/getUser");
const { loginUser } = require("../webTokenAuth/authorization");
const { forgetPassword } = require('../webTokenAuth/resetPassword')


const fs = require("fs");

router.get("/news", timeMiddleware, getAllNews);
router.delete("/news/:id", timeMiddleware, auth, dropOneNews);
router.delete("/news", timeMiddleware, auth, dropAllNews);
router.patch("/news/:id", timeMiddleware, auth, setOneNews);
router.get("/news/:id", timeMiddleware, getOneNews);
router.post("/add-news", timeMiddleware, auth, addNews);
router.get("/likes/:id", timeMiddleware, getLikesCount);
router.get("/views/:id", timeMiddleware, getViewsCount);

router.get("/log", timeMiddleware, async function log(req, res){
  const time = req.requestTime;
  return res.status(200).json({"time":time,"message":"all is okey"})
});

router.post("/forget-password", timeMiddleware, forgetPassword, main);
router.get("/user/:id", timeMiddleware, getOneUser);
router.post(
  "/add-user",
  [
    check("email", "Некорректный email").isEmail(),
    check("password", "Минимальная длина пароля 6 символов").isLength({
      min: 6,
    }),
  ],
  createUser
);
router.get("/users", timeMiddleware, getAllUsers);

router.post("/add-like", timeMiddleware, auth, addLike);
router.get("/news-liked/:id", timeMiddleware, getUsersId);

router.post(
  "/login",
  [
    check("email", "Введите корректный email").normalizeEmail().isEmail(),
    check("password", "Введите пароль").exists(),
  ],
  loginUser
);

module.exports = {
  router,
};
