const mongoose = require("mongoose");
const fs = require("fs");
const Product = require("../models/product");
const User = require("../models/user");

mongoose.connect(
  "mongodb+srv://shourya:shourya@cluster0.yshty.mongodb.net/yelpcamp?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  // await User.deleteMany({});
  // const products = JSON.parse(
  //   fs.readFileSync(`${__dirname}/products.json`, "utf-8")
  // );
  const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
  await User.create(users, { validateBeforeSave: false });
  console.log("Data successfully loaded!");
};

const deleteDB = async function () {
  await Product.deleteMany({});
  await User.deleteMany({});
  console.log(`Database Deleted`);
};

seedDB().then(() => {
  mongoose.connection.close();
});
// deleteDB().then(() => {
//   mongoose.connection.close();
// });
