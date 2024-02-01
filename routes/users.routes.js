const express = require("express")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { UserModel } = require("../model/users.model");

const userRouter = express.Router()


userRouter.post("/register", async(req, res)=> {
    const {password} = req.body
    console.log(req.body)

    try {
        bcrypt.hash(password, 5, async function(err, hash) {
            if (hash) {
                const user = new UserModel({...req.body, "password": hash})
                await user.save()
                res.status(200).json({"msg": "New user has been registered"})
            } else if (err) {
                console.log("its in error")
                res.status(200).json({"msg": err.message})
            }
        });
        
    } catch (error) {
        res.status(400).json({"err": error.message})
    }
})


userRouter.post("/login", async(req, res)=> {
    

    try {
        const {email, password} = req.body

        let user = await UserModel.findOne({email})

        if (user) {
            let passwordSentByUser = password
            let passwordFromDB = user.password
            let role = user.role


            const passwordMatch = await bcrypt.compare(passwordSentByUser, passwordFromDB);

            if (passwordMatch) {
                const token = jwt.sign({ email, role }, process.env.JWT_SECRET || 'avenger');
                res.status(200).json({ "msg": "Login Successful", "token": token , "userName": user.userName, "role": user.role});
            } else {
                res.status(401).json({ "msg": "Incorrect password" });
            }
        } else {
            res.status(200).json({"msg": "User not found"})
        }
        
    } catch (error) {
        res.status(400).json({"err": error.message})
    }

    
})



module.exports = {userRouter}

