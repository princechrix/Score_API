const { verify } = require("jsonwebtoken");

module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");

    if (token) {
      token = token.slice(7);
      verify(token, process.env.JSON_KEY, (err, decode) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: "Invalid Token",
          });
        } else {
          next();
        }
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Access Denied! You are unauthorized user!",
      });
    }
  },
};
