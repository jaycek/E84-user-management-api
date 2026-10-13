const express = require('express')
const router = express.Router()
const {getUsers,createUser,getUserbyID,updateUser,deleteUser,login,checkUser} = require("../controllers/userController")
const validateUser = require("../middlewares/validateUser")
const validateToken  =require("../middlewares/authMiddleware")
const authorize = require("../middlewares/authorize")

//check user is logged in
router.get('/checkUser',validateToken,checkUser)

//Get all users
router.get("/",validateToken,authorize("admin"),getUsers)
//create user
router.post("/",validateUser,createUser)
//Get single user 
router.get("/:id",getUserbyID)
//Update user
router.put("/:id",updateUser)
//Delete user
router.delete("/:id",deleteUser)
//login
router.post("/login",login)

module.exports = router