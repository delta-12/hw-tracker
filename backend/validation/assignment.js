const Validator = require("validator")
const isEmpty = require("is-empty")

module.exports = function validateAssignmentInput(data) {
    let errors = {}
  
    // Convert empty fields to an empty string so we can use validator functions
    data.name = !isEmpty(data.name) ? data.name : ""
    data.courseID = !isEmpty(data.courseID) ? data.courseID : ""
    
    // name checks
    if (Validator.isEmpty(data.name)) {
      errors.name = "Name field is required."
    }
    // classID checks
    if (Validator.isEmpty(data.courseID)) {
      errors.courseID = "Course field is required."
    }
  
    return {
      errors,
      isValid: isEmpty(errors)
    }
  }