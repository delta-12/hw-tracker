const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create Schema
const AssignmentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  courseID: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date
  },
  type: {
    type: String
  },
  description: {
    type: String
  },
  completed: {
    type: Boolean
  },
  archived: {
    type: Boolean
  },
  userID: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = Assignment = mongoose.model("assignments", AssignmentSchema)