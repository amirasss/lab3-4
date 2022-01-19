const fs = require('fs')
const validateUser = async (req, res, next) =>{
    try {
        const {username , password} = req.body;
        if(!username) return next({status:422,message:"username is required"})
        if(!password) return next({status:422,message:"password is required"})
        const data=await fs.promises.readFile('./user.json',{encoding:'utf8'})
            const users = JSON.parse(data)
            const isUsernameExists = users.some(user=>user.username===username)
            if(isUsernameExists && req.method=='POST') return next({status:422,message:"username is used"})
    } catch (error) {
        next({status:500,internalMessage:error.message})

    }
       
            next()
       
    
}

module.exports = {
    validateUser
}