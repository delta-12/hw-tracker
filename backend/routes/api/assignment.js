const express = require("express")
const router = express.Router()

const Assignment = require("../../models/Assignment")

const validateAssignmentInput = require("../../validation/assignment")

router.post("/createAssignment", (req, res) => {
    const { errors, isValid } = validateAssignmentInput(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }
    Assignment.findOne({ name: req.body.name }).then(assignment => {
        if (assignment) {
            return res.status(400).json({ success: false, name: "'" + req.body.name + "' already exists." })
        }
        const newAssignment = new Assignment({
            name: req.body.name,
            courseID: req.body.courseID,
            dueDate: req.body.dueDate,
            type: req.body.type,
            description: req.body.description,
            completed: false
        })
        newAssignment
            .save()
            .then(assignment => res.json(assignment))
            .catch(err => console.log(err))
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
    Assignment.find().sort('dueDate').then(assignmentList => {
        if (assignmentList) {
            return res.status(200).json({ success: true, assignments: assignmentList })
        }
        return res.status(400).json({ success: false, error: "Failed to find assignments" })
    })
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

router.post("updateAssignment", (req, res) => {
    Assignment
        .findOneAndUpdate({ _id: req.body.assignmentID }, req.body.update, {new: true})
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

module.exports = router