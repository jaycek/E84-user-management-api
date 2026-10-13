const jwt = require('jsonwebtoken')

const validateToken = (req,res,next)=>{
    let token = null
    
    if(req.cookies?.token){
        token = req.cookies.token
    }
    if(!token){
        return res.status(401).json({message:"Not authorised, no token"})
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        console.log(req.user)
        next()
    }
    catch(error){
        res.status(401).json({message:"Invalid token"})
    }

}

module.exports = validateToken
