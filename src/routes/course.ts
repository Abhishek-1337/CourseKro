import express from "express";
import Course from "../models/course";
import { restrictTo } from "../middlewares/globalMiddleswares";
import { AuthRequest } from "../types/auth.types";

const router = express.Router();

//@ts-ignore
router.post("/", adminMiddlewares.protect, restrictTo('admin'), async (req: AuthRequest, res) => {
    const { title, description, price, imgUrl } = req.body;

    const userId = req.userId;
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

router.get("/bulk", async (req, res) => {
    try{
        const courses = await Course.find({});
        console.log(courses);
        
        if(courses.length === 0) {
            res.status(404).json({
                message: "No course found."
            });
            return;
        }

        res.status(200).json({
            courses
        });
    }
    catch(ex) {
        console.log(ex);
        res.status(500).json({
            message: "Something went wrong."
        });
        return;
    }
});

export default router;