
const User = require("../models/User")
const generateToken = require("../utils/generateToken")
const bcrypt = require("bcrypt")

//get users
const getUsers = async(req,res)=>{

    try {
        const users = await User.find()

        res.status(200).json({
            success:true,
            data:users
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }

}

//create user
const createUser = async(req,res)=>{
     const {name,gender,email,password} = req.body
    const saltRounds = 10
     try {
        bcrypt.hash(password,saltRounds,async (err,hash)=>{
            if(err){
                return res.status(500).json({error:err.message})
            }
            const newUser = new User({
                name:name,
                email:email,
                gender:gender,
                password:hash
            })
            const savedUser = await newUser.save() 
        
             res.status(201).json({
               success:true,
               message:"User created successfully",
               data:savedUser
             })

        })
       
        
    } catch (error) {
        res.status(400).json({message:error.message})
        
    }


}

// /api/users/:id
const getUserbyID = async(req,res,next)=>{

    const user = await User.findById(req.params.id)
    if(!user){
        const error = new Error("User not found")
        error.status = 404
        return next(error)
    }
    res.status(200).json({
        success:true,
        data:user
    })

}

//PUT Update  /api/users/:id
const updateUser = async(req,res,next)=>{

    // const id = Number(req.params.id) 
    //find user matching the id
    // const userIndex = users.findIndex((user)=> user.id === id )

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,req.body,{
            new:true,runValidators:true
        })
        if(!updatedUser){
            const error = new Error("User not found")
            error.status = 404
            return next(error)
        }
        res.status(200).json({
            success:true,
            message:"user updated",
            data:updatedUser
        })
    } catch (error) {
        res.status(400).json({message:error.message})
        
    }
    

    // const {name,gender,email} = req.body
    // users[userIndex] = {
    //     ...users[userIndex],
    //     name,
    //     gender:gender.toLowerCase(),
    //     email
    // }

}

//Delete - /api/users/:id
const deleteUser = async(req,res,next)=>{

    // const id = Number(req.params.id) 
    //find user matching the id
    // const userIndex = users.findIndex((user)=> user.id === id )
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    if(!deletedUser){
        const error = new Error("User not found")
        error.status = 404
        return next(error)
    }

    // const deletedUser = users.splice(userIndex,1)

    res.status(200).json({
        success:true,
        message:"user deleted",
        data:deletedUser
    })

}

const login = async(req,res,next)=>{
    try{
        if(!req.body){
            return res.status(400).json({error:"Login details cannot be empty"})
        }
        const {email,password} = req.body
        
        const user = await User.findOne({email:email})
        if (!user){
            return res.status(404).json({error:"User not found"})
        }
        
        const isValid = await bcrypt.compare(password,user.password)
        
        if(!isValid){
             return res.status(400).json({error:"Incorrect credentials"})
        }
        //For valid user - create token
      
        let payload = {
            email:email,
            role:user.role
        }
        const token = generateToken(payload)
       
        res.cookie('token',token,{
            httpOnly:true,
            secure:false
        })
        res.status(200).json({message:"Login successful"})
    }
    catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}

const checkUser = async(req,res)=>{
    return res.status(200).json({message:"User validated"})
}

module.exports = {
    getUsers,
    createUser,
    getUserbyID,
    updateUser,
    deleteUser,
    login,
    checkUser
}