const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const userRouter = require("./app/user/route");
const authRouter = require("./app/auth/route");
const categoryRouter = require("./app/category/route");
const tourismRouter = require("./app/tourism/route");
const authorRouter = require("./app/author/route");

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
app.use("/tourism", tourismRouter);
app.use("/authors", authorRouter);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.log("error", error);
  res.status(error.status || 500).json({
    message: error.message,
  });
});

module.exports = app;
