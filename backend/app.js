const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const cors = require("cors");
const router = express.Router();
require("dotenv/config");
const api = process.env.API_URL;

app.set("view engine", "ejs");
app.use(express.static("views"));

app.use(cors());
app.options("*", cors());

const productsRouter = require("./routers/products");
const { Product } = require("./models/product");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routers
app.use(api + "/products", productsRouter);


//Database
mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log("Database connection is ready");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("index", {
      productsList: products,
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/contact", async (req, res) => {
  res.render('contact')
});

//Order Schema
const orderSchema = {
  name: String,
  email: String,
  phone: Number,
  orderDetail: String
};

//Order Model
const Order = mongoose.model("Order", orderSchema);

// app.js
app.post("/", function (req, res) {
  let newOrder = new Order({
    name: req.body.nama,
    email: req.body.email,
    phone: req.body.phone,
    orderDetail: req.body.orderDetail,
  });

  newOrder
    .save()
    .then(() => {
      console.log("Order saved successfully");
      res.status(200).send("Order saved successfully"); // Send success message
    })
    .catch((err) => {
      console.error("Error saving order:", err);
      res.status(500).send("Error saving order"); // Send error message
    });
});

//Server
app.listen(3000, () => {
  console.log("server is running http://localhost:3000");
});
