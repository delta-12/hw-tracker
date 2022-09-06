const express = require("express")
const mongoose = require("mongoose")
const passport = require("passport")
const path = require("path")

const course = require("./routes/api/course")
const assignment = require("./routes/api/assignment")
const users = require("./routes/api/users")

const app = express()

// Bodyparser middleware
const bodyParser = require("body-parser")
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(bodyParser.json())

// DB Config
const db = process.env.MONGOURI || require("./config/keys").mongoURI

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err))

// Passport middleware
app.use(passport.initialize())
// Passport config
require("./config/passport")(passport)
// Routes
app.use("/api/users", users)
app.use("/api/course", course)
app.use("/api/assignment", assignment)

// Set static folder
app.use(express.static("../build"))
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../build/index.html"))
})

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server up and running on port ${port}!`))
