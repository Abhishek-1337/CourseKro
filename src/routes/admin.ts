import express from "express";
import Admin from "../models/admin";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Course from "../models/course";

const router = express.Router();

router.post("/signup", async (req, res) => {

    const { firstName, lastName, email, password } = req.body; 

    try{

        const user = await Admin.create({
            firstName,
            lastName,
            email,
            password
        });

        const userId = user._id;
        const token = await jwt.sign({userId}, "abhishekvish");

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

        const user = await Admin.findOne({email: email});
        if(!user || !(await bcrypt.compare(password, user.password))){
            res.status(401).json({
                message: "Incorrect email or password."
            });
            return;
        }

        const userId = user._id;
        const token = await jwt.sign({ userId }, "abhishekvish");
        
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

router.post("/course", async (req, res) => {
    const { title, description, price, imgUrl, userId } = req.body;
    if(!title || !description || !price || !imgUrl){
        res.status(401).json({
            message: "Data can't be empty."
        });
        return;
    }

    const course = new Course({
        title, 
        description,
        price,
        imgUrl,
        creatorId: userId
    });
    await course.save();
    res.status(201).json({
        course,
        message: "Course created successfully."
    })
})

export default router;