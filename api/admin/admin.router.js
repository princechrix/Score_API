const {
  createAdmin,
  getAdminByName,
  signinAdmin,
} = require("./admin.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.post("/admin", createAdmin);
router.get("/admin/:username", getAdminByName);
router.post("/admin/signin", signinAdmin);

module.exports = router;
