const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create Schema
const CourseSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  startTime: {
    type: String
  },
  endTime: {
    type: String
  },
  days: {
    type: Array
  },
  instructor: {
    type: String
  },
  location: {
    type: String
  }
})

module.exports = Course = mongoose.model("courses", CourseSchema)