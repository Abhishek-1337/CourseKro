import express from "express";
import Course from "../models/course";
import { restrictTo } from "../middlewares/globalMiddleswares";
import { AuthRequest } from "../types/auth.types";
import * as adminMiddlewares from "../middlewares/admin";

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
    console.log(userId);
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
});

router.delete("/:id", adminMiddlewares.protect, restrictTo('admin'), async (req: AuthRequest, res) => {
    try{
        const { id } = req.params;
        const course = await Course.findById(id);
        if(!course) {
            res.status(404).json({
                message: "Course not found."
            });
            return;
        }

        if (!req.userId) {
             res.status(401).json({ message: "User not authenticated" });
             return;
        }

        if(!course.creatorId.some(id => id.toString() === req.userId)){
            res.status(403).json({
                message: "Access denied"
            });
            return;
        }

        const deletedItem = await Course.findByIdAndDelete(course._id);
        res.status(200).json({
            deletedItem,
            message: "Course is deleted successfully."
        });
    }
    catch(err){
        res.status(500).json({
            message: "Something went wrong."
        });
    }
});

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

router.get("/preview/:courseId", async (req, res) => {
    try{
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if(!course) {
            res.status(404).json({
                message: "Course not found."
            });
            return;
        }

        res.status(200).json({
            course,
            message: "Successfully returned the course."
        })
    }
    catch(err){
        res.status(500).json({
            message: "Something went wrong."
        });
        return;
    }
})

export default router;