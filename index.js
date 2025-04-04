require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const verfiyToken = require("./middleware/verfiyToken");
const path = require("path");
const multer = require("multer");
const app = express();

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },

  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const imgeType = file.mimetype.split("/")[0];
  if (imgeType == "image") {
    return cb(null, true);
  } else {
    return cb(new Error("File must be an image"), false);
  }
};

const uplode = multer({ storage: diskStorage, fileFilter });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const url = process.env.MONGO_URL;
mongoose
  .connect(url)
  .then(() => {
    console.log("connecting successfully");
  })
  .catch((error) => {
    console.log("connecting error", error);
  });
app.use(express.json());

const courseController = require("./Controllers/courses.controllers");
const userController = require("./Controllers/user.controller");
const userRoles = require("./utils/role");
const allowedTo = require("./middleware/allowedTo");

app.get("/courses", courseController.getAllCourses);
app.get("/courses/:courseId", courseController.getCourse);
app.post("/courses", courseController.postCourse);
app.delete(
  "/courses/:courseId",
  verfiyToken,
  allowedTo(userRoles.ADMIN, userRoles.MANGER),
  courseController.deleteCourse
);

app.get("/user", verfiyToken, userController.getAllUsers);
app.post("/user/register", uplode.single("avatar"), userController.register);
app.post("/user/login", userController.login);

app.listen(process.env.PORT || 4000, () => {
  console.log("dddddd");
});
