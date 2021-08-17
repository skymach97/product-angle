const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  console.log(req.body);
  try {
    const { email, username, gender, password } = req.body;
    const user = new User({ email, username, gender });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to  Product Angle!");
      res.redirect("/products/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = req.session.returnTo || "/products";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  // req.session.destroy();
  req.flash("success", "Goodbye!");
  res.redirect("/products");
};

module.exports.renderUserProfile = async (req, res) => {
  const products = await User.findById(req.user.id).select("favorite");
  const gender = await User.findById(req.user.id).select("gender");
  console.log(gender);
  res.render("users/profile", { products: products, gender });
};

module.exports.addFavorite = async (req, res, next) => {
  req.user.addFavorite(req.params.productId);
  await req.user.save({ validateBeforeSave: false });
  res.status(201).json({
    status: "success",
    data: {},
  });
};

module.exports.removeFavorite = async (req, res, next) => {
  req.user.removeFavorite(req.params.productId);
  await req.user.save({ validateBeforeSave: false });
  res.status(204).json({
    status: "success",
    data: {},
  });
};

module.exports.favorites = async (req, res, next) => {
  const favorites = await User.findById(req.user.id).select("favorite");
  res.status(200).json({
    status: "success",
    data: {
      favorites,
    },
  });
};

module.exports.deleteUser = function (req, res) {
  User.findById(req.params.user_id, async function (err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    user.remove();
    res.redirect("/");
  });
};

module.exports.updateUser = function (req, res) {
  User.findById(req.params.user_id, async function (err, user) {
    if (err) {
      req.flash("error", err.message);
    } else {
      user.gender = req.body.gender;
      user.username = req.body.username;
      user.save();
      req.flash("success", "Updated your profile!");
      res.redirect("/me/");
    }
  });
};
