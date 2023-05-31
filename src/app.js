const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const userRouter = require("./app/user/route");
const authRouter = require("./app/auth/route");
const categoryRouter = require("./app/category/route");
const tourismRouter = require("./app/tourism/route");

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

module.exports = app;
