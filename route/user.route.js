const {userModel} = require("../model/user.model");
const express = require("express")
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {client} = require("../config/redis")


userRouter.post("/register", async(req, res)=>{
    const {email, password} = req.body;
    try {
        let ifExist = await userModel.find({email});
        if(ifExist.length != 0){
            res.status(400).json({"msg": "user already exist"})
        }else{
            bcrypt.hash(password, 5, async(err, hash)=>{
                if(err){
                    throw err;
                }else{
                    let user =  await new userModel({email, password:hash});
                    await user.save();
                    console.log(user)
                    res.status(200).send("user registered")
                }
            });
        }
    } catch (error) {
        console.log(error)
    }
});

userRouter.post("/login", async(req, res)=>{
    const {email, password} = req.body;
    try {
        let user = await userModel.findOne({email});
        if(user){
            bcrypt.compare(password, user.password, function(err, result) {
                if(err){
                    throw err
                }else{
                    const token = jwt.sign({ userID: user._id }, process.env.privateKey, { expiresIn: 300 });
                    res.status(200).json({"token": token})
                }
            });
        }else{
            res.status(400).json({"msg": "user not found"})
        }
    } catch (error) {
        console.log(error)
    }
})

userRouter.get("/logout", async(req, res)=>{
    try {
        await client.LPUSH("blacklist", req.headers.authorization.split(" ")[1]);
        res.status(200).json({"msg": "you are logged out"})
    } catch (error) {
        console.log(error)
    }
})

module.exports = {
    userRouter
}