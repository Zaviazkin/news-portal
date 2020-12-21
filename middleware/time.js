const timeMiddleware = function (req, res, next) {
    req.requestTime = new Date().toLocaleString({
      timeZone: "Asia/Bishkek",
      timeZoneName: "short",
    });
    next();
  };
  module.exports = {
      timeMiddleware
  }