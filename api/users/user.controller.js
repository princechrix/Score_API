const { signup, getUserByPhone, allUsers } = require("./user.service");

const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
  signupUser: (req, res) => {
    const body = req.body;

    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    signup(body, (err, results) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          message: "database connection error!!",
        });
      }

      return res.status(200).json({
        success: true,
        data: results,
        message: "User Created successfully!",
      });
    });
  },
  userByPhone: (req, res) => {
    const phone = req.params.phone;
    getUserByPhone(phone, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
      if (!results) {
        return res.status(200).json({
          success: false,
          message: `Could notn find user with phone : ${phone}`,
        });
      }
      return res.json({
        success: true,
        data: results,
        message: "User was found!",
      });
    });
  },
  signinUser: (req, res) => {
    const body = req.body;

    getUserByPhone(body.phone, (err, results) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Server Error",
          });
        }
        if (!results) {
          return res.status(200).json({
            success: false,
            message: `Could notn find user with phone : ${body.phone}`,
          });
        }

        // if user was found check if password match with pre-encrypted password

        const result = compareSync(body.password, results.password);

        if(result) {
            results.password = undefined; 
            const jsontoken = sign({ result: results }, process.env.JSON_KEY, {
                expiresIn: "30d"
            })

            return res.status(200).json({
                success: true, 
                message: "Logged in successfully", 
                data: {
                    userId: results.id, 
                    username: results.fullname,
                    token: jsontoken
                }
            })
        } else {
            res.status(200).json({
                success: false,
                message: "Wrong Password!!"
            })
        }
        


        // return res.json({
        //   success: true,
        //   data: results,
        //   message: "User was found!",
        // });
      });
  }, 
  getAllUsers: (req, res) => {
    allUsers((err, results)=> {
        if(err) {
            return res.status(500).json({ 
                success: false, 
                message: "Internal Server error!"
            })
        }

        if(!results) {
            return res.status(200).json({
                success: true, 
                message: "No Users in the database!"
            }) 
        } 

        return res.status(200).json({
            success: true, 
            data: results, 
            message: "Users were found!"
        })
    })
  }
};
