const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");
const { isLoggedIn, isProfileOwner } = require("../middleware");

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

router.put("/users/:user_id", isLoggedIn, isProfileOwner, users.updateUser);
router.delete("/users/:user_id", isLoggedIn, isProfileOwner, users.deleteUser);

router.route("/favourite").get(catchAsync(users.favorites));
router
  .route("/favourite/:productId")
  .post(catchAsync(users.addFavorite))
  .delete(catchAsync(users.removeFavorite));

router.get("/logout", users.logout);

module.exports = router;
