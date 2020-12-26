const timeMiddleware = function (req, res, next) {
  let time = new Date()
  let tima = tim.getHours()
 time.setHours(tima+6)
    req.requestTime = time
    next();
  };
  module.exports = {
      timeMiddleware
  }
