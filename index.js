const express = require("express");
const os = require("os");
const EventEmitter = require("events");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const User = require("./models/User");
const orderRoutes = require("./routes/orderRoutes");
const ProductRoutes = require("./routes/productRoutes");
const path = require("path");
const CustomError = require("./utils/CustomError");
const globalErrorHandler = require("./controllers/errorController");

const upload = require("./middleware/fileUploadMiddleware");

const event = new EventEmitter();

// console.log(os.arch())
// console.log(os.freemem()/(1024 * 1024 * 1024));
// console.log(os.totalmem()/(1024 * 1024 * 1024));
// console.log(os.hostname());
// console.log(os.platform());
// console.log(os.userInfo());

const cors = require("cors");
const Product = require("./models/Product");
const { error } = require("console");
require("dotenv").config();

const app = express();
const port = 3000;

connectDB();

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", orderRoutes);
app.use("/api", ProductRoutes);
app.use("/api/auth", authRoutes);
// app.use("/public", express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

let count = 0;

event.on("countAPI", () => {
  count++;
  console.log("EVENT CALLED", count);
});

//Multi search api
app.get("/search/:key", async (req, res) => {
  event.emit("countAPI");
  const data = await User.find({
    $or: [
      { name: { $regex: req.params.key, $options: "i" } },
      { email: { $regex: req.params.key, $options: "i" } },
    ],
  });
  res.send(data);
});

//File Upload api
app.post("/upload", upload, (req, res) => {
  res.send("upload File");
});

//default Route must be at last of all routes
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on the server`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on the server`);
  // err.status = "fail";
  // err.statusCode = 404;

  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server`,
    404
  );

  next(err);
});

//Global error Handling middleware
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
