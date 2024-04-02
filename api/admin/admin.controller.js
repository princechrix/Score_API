const { signupAdmin, getAdminByName } = require("./admin.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
  createAdmin: (req, res) => {
    const body = req.body;

    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    signupAdmin(body, (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to signup! Try again!",
        });
      }

      return res.status(200).json({
        success: true,
        data: results,
        message: "Admin was signed up successfully!",
      });
    });
  },
  getAdminByName: (req, res) => {
    const username = req.params.username;

    getAdminByName(username, (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Internal Server Error!",
        });
      }

      if (!results[0]) {
        return res.status(200).json({
          success: true,
          message: "No Admin was found!",
        });
      }

      return res.status(200).json({
        success: true,
        data: results,
        message: "Admin found!",
      });
    });
  },
  signinAdmin: (req, res) => {
    const body = req.body;

    getAdminByName(body.username, (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Internal Server Error!",
        });
      }

      if (!results[0]) {
        return res.status(200).json({
          success: true,
          message: "No Admin was found!",
        });
      }

      // if user was found check if password match with pre-encrypted password

      const result = compareSync(body.password, results[0].password);

      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, process.env.JSON_KEY, {
          expiresIn: "30d",
        });

        return res.status(200).json({
          success: true,
          message: "Logged in successfully",
          data: {
            userId: results[0].id,
            username: results[0].username,
            token: jsontoken,
          },
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Wrong Password!!",
        });
      }
    });
  },
};
