import mongoose, { Schema } from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Course name can't be empty."]
    },
    description: {
        type: String,
        required: [true, "Description must be provided."]
    },
    price: {
        type: Number,
        required: [true, "Course must have a price"]
    },
    imgUrl: String,
    creatorId: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Admin'
        }
    ]
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
