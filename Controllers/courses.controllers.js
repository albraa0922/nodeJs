const { STATES } = require("mongoose");
const Course = require("../models/Course");

const getAllCourses = async (req, res) => {
  const courses = await Course.find();
  return res.json({ stats: "success", data: { courses } });
};

const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json("no course");
    }
    return res.json({ stats: "success", data: { course } });
  } catch (err) {
    return res.status(400).json("invalid id");
  }
};

const postCourse = async (req, res) => {
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.status(201).json({ stats: "success", data: { newCourse } });
};

const deleteCourse = async (req, res) => {
  await Course.findByIdAndDelete(req.params.courseId);
  res.json({ stats: "success", data: null });
};

module.exports = {
  getAllCourses,
  postCourse,
  getCourse,
  deleteCourse,
};
