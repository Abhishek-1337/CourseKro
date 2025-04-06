import express from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Course from "../models/course";
import * as userMiddlewares from "../middlewares/user";
import Purchase from "../models/purchase";

const router = express.Router();

router.post("/signup", async (req, res) => {

    const { firstName, lastName, email, password } = req.body; 

    try{

        const user = await User.findOne({email});
        if(user){
            res.status(400).json({
                message: "User already exist."
            });
            return;
        }

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password
        });

        const userId = newUser._id;
        const token = await jwt.sign({userId}, process.env.jwt_user_key as string);

        res.status(201).json({
            token,
            message: "Sign up successful"
        });
    }
    catch(ex){
        res.status(401).json({
            message: "Validation error."
        });
        return;
    }
});

router.post("/signin", async (req, res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            res.status(401).json({
                message: "Please provide email or username."
            });
            return;
        } 

        const user = await User.findOne({email: email});
        if(!user || !(await bcrypt.compare(password, user.password))){
            res.status(401).json({
                message: "Incorrect email or password."
            });
            return;
        }

        const userId = user._id;
        const token = await jwt.sign({ userId }, process.env.jwt_user_key as string);
        
        res.status(200).json({
            message: "Logged in."
        });
    }
    catch(ex) {
        res.status(500).json({
            message: "Something went wrong."
        });
        return;
    }
});

router.post("/purchase", userMiddlewares.protect, async (req, res) => {
   try{
    const { courseId } = req.body;
    //@ts-ignore
    const userId = req.userId

    if(!courseId){
        res.status(401).json({
            message: "Select a course."
        });
        return;
    }

    const user = await User.findById(userId);
    if(!user){
        res.status(404).json({
            message: "User not found."
        });
        return;
    }

    const purchase = await Purchase.create({
        courseId,
        userId
    });

    res.status(200).json({
        purchase,
        message: "Purchase successful"
    })
   }
   catch(ex){
    console.log(ex);
    res.status(400).json({
        message: "Error while purchasing."
    });
   }
});



export default router;