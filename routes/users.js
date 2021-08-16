const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");

router.get("/about", function (req, res) {
  res.render("about");
});

router.route("/me").get(catchAsync(users.renderUserProfile));

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.route("/favourite").get(catchAsync(users.favorites));
router
  .route("/favourite/:productId")
  .post(catchAsync(users.addFavorite))
  .delete(catchAsync(users.removeFavorite));

router.get("/logout", users.logout);

module.exports = router;
