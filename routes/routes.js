var express = require("express");
var app = express();
var router = express.Router();
var UserController = require("../controllers/UserController");
var AdminAuth = require("../middleware/AdminAuth");

router.get("/user", AdminAuth, UserController.index);
router.post("/user", UserController.create);
router.get("/user/:id", AdminAuth, UserController.findUser);
router.put("/user", AdminAuth, UserController.editUser);
router.delete("/user/:id", AdminAuth, UserController.deleteUser);
router.post("/recoverpassword", UserController.recoverPassword);
router.post("/newPassword", UserController.newPassword);
router.post("/login", UserController.login);

module.exports = router;
