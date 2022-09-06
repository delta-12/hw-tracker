const express = require("express")
const router = express.Router()

const User = require("../../models/User")
const Course = require("../../models/Course")
const Assignment = require("../../models/Assignment")

const validateCourseInput = require("../../validation/course")

router.use((req, res, next) => {
    User.findOne({ _id: req.body.userID })
        .then(user => {
            if (!user) {
                return res.status(404).json({ success: false, error: "Account Not Found" })
            }
            else {
                next()
            }
        })
        .catch(() => {
            return res.status(500).json({ success: false, error: "Account Not Found" })
        })
})

router.post("/addCourse", (req, res) => {
    const { errors, isValid } = validateCourseInput(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }
    const newCourse = new Course({
        name: req.body.name,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        days: req.body.days,
        instructor: req.body.instructor,
        location: req.body.location,
        archived: false,
        userID: req.body.userID
    })
    newCourse
        .save()
        .then(course => res.status(201).json({ success: true, course: course }))
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
                    return res.status(500).json({ success: false, error: err })
                })
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ success: false, error: err })
        })
})

router.post("/updateCourse", (req, res) => {
    const { errors, isValid } = validateCourseInput(req.body.update)
    if (!isValid) {
        return res.status(400).json(errors)
    }
    // Course.findOne({ $and: [{ name: req.body.update.name }, { _id: { $ne: req.body.courseID } }] }).then(course => {
    //     if (course) {
    //         return res.status(400).json({ success: false, name: "'" + req.body.update.name + "' already exists." })
    //     }
    // })
    Course
        .updateOne({ _id: req.body.courseID }, req.body.update, { new: true })
        .then(course => {
            if (course) {
                return res.status(200).json({ success: true, updatedCourse: course })
            }
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({ success: false, error: err })
        })
})

router.post("/info", (req, res) => {
    Course.find({ $and: [{ archived: false }, { userID: req.body.userID }] }).then(courseList => {
        if (courseList) {
            return res.status(200).json({ success: true, courses: courseList })
        }
        return res.status(400).json({ success: false, error: "Failed to find courses" })
    })
})

router.post("/archive", (req, res) => {
    Course.find({ $and: [{ archived: true }, { userID: req.body.userID }] }).then(courseList => {
        if (courseList) {
            return res.status(200).json({ success: true, courses: courseList })
        }
        return res.status(400).json({ success: false, error: "Failed to find archived courses" })
    })
})

module.exports = router