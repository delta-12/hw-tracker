const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create Schema
const AssignmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
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
  }
})

module.exports = Assignment = mongoose.model("assignments", AssignmentSchema)