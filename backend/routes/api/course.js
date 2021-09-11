const express = require("express")
const router = express.Router()
const querystring = require("querystring")

const Course = require("../../models/Course")

// Load input validation
const validateCourseInput = require("../../validation/course")

router.post("/addCourse", (req, res) => {
    const { errors, isValid } = validateCourseInput(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
      }
    const newCourse = new Course({
        name: req.body.name
    })
    newCourse
        .save()
        .then(course => res.json(course))
        .catch(err => console.log(err))
})

router.get("/info", (req, res) => {
    Course.find().then(courseList => {
        if(courseList) {
            return res.status(200).json({ success: true, courses: courseList })
        }
        return res.status(400).json({ success: false, error: "No courses found." })
    })
})

module.exports = router