const express = require("express")
const router = express.Router()

const User = require("../../models/User")
const Assignment = require("../../models/Assignment")

const validateAssignmentInput = require("../../validation/assignment")

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

router.post("/createAssignment", (req, res) => {
    const { errors, isValid } = validateAssignmentInput(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }
    const newAssignment = new Assignment({
        name: req.body.name,
        courseID: req.body.courseID,
        dueDate: req.body.dueDate,
        type: req.body.type,
        description: req.body.description,
        completed: false,
        userID: req.body.userID
    })
    newAssignment
        .save()
        .then(assignment => res.json(assignment))
        .catch(err => console.log(err))
})

router.post("/deleteAssignment", (req, res) => {
    Assignment
        .deleteOne({ _id: req.body.assignmentID })
        .then(() => {
            return res.status(200).json({ success: true })
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ success: false, error: err })
        })
})

router.post("/updateAssignment", (req, res) => {
    Assignment
        .updateOne({ _id: req.body.assignmentID }, req.body.update, { new: true })
        .then(assignment => {
            if (assignment) {
                return res.status(200).json({ success: true, updatedAssignment: assignment })
            }
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({ success: false, error: err })
        })
})

router.post("/updateAssignments", (req, res) => {
    Assignment
        .updateMany({ courseID: req.body.courseID }, req.body.update, { new: true })
        .then(assignmentList => {
            if (assignmentList) {
                return res.status(200).json({ success: true, updatedAssignment: assignmentList })
            }
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({ success: false, error: err })
        })
})

router.post("/info", (req, res) => {
    Assignment.find({ courseID: req.body.courseID }).sort('dueDate').then(assignmentList => {
        if (assignmentList) {
            return res.status(200).json({ success: true, assignments: assignmentList })
        }
        return res.status(400).json({ success: false, error: "Failed to find assignments" })
    })
})

router.post("/infoAll", (req, res) => {
    Assignment.find({ userID: req.body.userID }).sort('dueDate').then(assignmentList => {
        if (assignmentList) {
            return res.status(200).json({ success: true, assignments: assignmentList })
        }
        return res.status(400).json({ success: false, error: "Failed to find assignments" })
    })
})

module.exports = router