const express = require("express")
const router = express.Router()
const querystring = require("querystring")

const Assignment = require("../../models/Assignment")

// Load input validation
const validateAssignmentInput = require("../../validation/assignment")

router.post("/createAssignment", (req, res) => {
    const { errors, isValid } = validateAssignmentInput(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
      }
    const newAssignment = new Assignment({
        name: req.body.name,
        dueDate: req.body.dueDate,
        type: req.body.type,
        description: req.body.description
    })
    newAssignment
        .save()
        .then(assignment => res.json(assignment))
        .catch(err => console.log(err))
})

module.exports = router