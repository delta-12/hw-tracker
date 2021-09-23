const express = require("express")
const router = express.Router()
const querystring = require("querystring")

const Course = require("../../models/Course")
const Assignment = require("../../models/Assignment")

const validateCourseInput = require("../../validation/course")

router.post("/addCourse", (req, res) => {
    const { errors, isValid } = validateCourseInput(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
      }
    Course.findOne({ name: req.body.name }).then(course => {
        if(course) {
            return res.status(400).json({ success: false, name: "'" + req.body.name + "' already exists."})
        }
    })
    const newCourse = new Course({
        name: req.body.name,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        days: req.body.days,
        instructor: req.body.instructor,
        location: req.body.location
    })
    newCourse
        .save()
        .then(course => res.status(201).json({success: true, course: course}))
        .catch(err => console.log(err))
})

router.post("/deleteCourse", (req, res) => {
    Course
        .deleteOne({ _id: req.body.courseID })
        .then(() => {
            Assignment
                .deleteMany({ courseID: req.body.courseID })
                .then(() => {
                    return res.status(200).json({ success: true })
                })
                .catch(err => {
                    console.log(err)
                    return res.status(500).json({ success: false, error: err})
                })
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ success: false, error: err})
        })
})

router.get("/info", (req, res) => {
    Course.find().then(courseList => {
        if(courseList) {
            return res.status(200).json({ success: true, courses: courseList })
        }
        return res.status(400).json({ success: false, error: "Failed to find courses" })
    })
})

module.exports = router