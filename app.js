const express = require('express');
const userRouter = require("./routes/userRoutes")
const errorHandler = require("./middlewares/errorHandler")
const connectDB = require('./data/db.js')
const cookieParser = require('cookie-parser')
const cors = require('cors')


// Connect to MongoDB
connectDB()

require('dotenv').config()

const app = express()
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

app.use(cookieParser())
const port = process.env.PORT || 3001

app.use(express.json())

app.get('/', (req, res) => {
  res.send('User management API is running')
})

//User routes
app.use("/api/users",userRouter)

//Centralized error handler
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})