const Product = require("../models/product");
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const mapBoxToken = process.env.MAPBOX_TOKEN;
// const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");
const { contentSecurityPolicy } = require("helmet");

module.exports.index = async (req, res) => {
  const products = await Product.find({}).populate("popupText");
  res.render("products/index", { products });
};

module.exports.renderNewForm = (req, res) => {
  const categories = [
    "Beauty",
    "Books",
    "Camera",
    "Accessories",
    "Electronics",
    "Art",
    "Grocery",
    "Health",
    "Home",
    "Independent",
    "Industrial",
    "Music",
    "Instruments",
    "Office",
    "Outdoors",
    "Computers",
    "Pet",
    "Software",
    "Sports",
    "Tools",
    "Toys",
    "Video",
    "Games",
    "Watches",
  ];
  res.render("products/new", { categories });
};

module.exports.createProduct = async (req, res, next) => {
  const product = new Product(req.body.product);
  console.log("Product created", product);
  product.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  product.author = req.user._id;
  await product.save();
  req.flash("success", "Successfully made a new product!");
  res.redirect(`/products/${product._id}`);
};

module.exports.showProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!product) {
    req.flash("error", "Cannot find that product!");
    return res.redirect("/products");
  }
  res.render("products/show", {
    product: product,
  });
};

module.exports.renderEditForm = async (req, res) => {
  const categories = [
    "Beauty",
    "Books",
    "Camera",
    "Accessories",
    "Electronics",
    "Art",
    "Grocery",
    "Health",
    "Home",
    "Independent",
    "Industrial",
    "Music",
    "Instruments",
    "Office",
    "Outdoors",
    "Computers",
    "Pet",
    "Software",
    "Sports",
    "Tools",
    "Toys",
    "Video",
    "Games",
    "Watches",
  ];
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    req.flash("error", "Cannot find that product!");
    return res.redirect("/products");
  }
  res.render("products/edit", { product, categories });
};

module.exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, {
    ...req.body.product,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  product.images.push(...imgs);
  await product.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await product.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated product!");
  res.redirect(`/products/${product._id}`);
};

module.exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted product");
  res.redirect("/products");
};
