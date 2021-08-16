const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const ProductSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    description: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    lastUpdated: Number,
    category: {
      type: String,
      required: true,
      enum: [
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
      ],
    },
  },
  opts
);

ProductSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

ProductSchema.virtual("lastUpdatedString").get(function () {
  const oneDay = 1000 * 60 * 60 * 24;
  const days = (Date.now() - this.lastUpdated) / oneDay;
  if (days < 1) {
    return "Just today";
  } else if (days < 2) {
    return "1 day ago";
  }
  return Math.floor(days) + " ago";
});

module.exports = mongoose.model("Product", ProductSchema);
