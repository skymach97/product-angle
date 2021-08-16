const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "neutral"],
    default: "neutral",
  },
  favorite: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
  ],
  image: String,
  imageId: String,
  joined: { type: Date, default: Date.now },
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.pre(/^find/, function (next) {
  this.populate("favorite");
  next();
});

UserSchema.methods.addFavorite = function (productId) {
  this.favorite.push(productId);
};

UserSchema.methods.removeFavorite = function (productId) {
  this.favorite.pull(productId);
};

module.exports = mongoose.model("User", UserSchema);
