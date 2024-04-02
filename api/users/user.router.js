const {
  signupUser,
  userByPhone,
  signinUser,
  getAllUsers,
} = require("./user.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.get("/users", checkToken, getAllUsers);
router.post("/users", signupUser);
router.post("/users/signin", signinUser);
router.get("/users/:phone", userByPhone);

module.exports = router;
