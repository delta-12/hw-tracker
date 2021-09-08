const express = require('express')
const mongoose = require('mongoose')
const course = require("./routes/api/course")
const assignment = require("./routes/api/assignment")
const app = express()
const path = require('path')

// Bodyparser middleware
const bodyParser = require("body-parser")
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(bodyParser.json())

// DB Config
const db = require("./config/keys").mongoURI

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err))

app.use("/api/course", course)
app.use("/api/assignment", assignment)

// Set static folder
app.use(express.static('../hw-tracker/build'))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../hw-tracker/build/index.html'))
})

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server up and running on port ${port} !`))
