import mongoose from 'mongoose';
import { globalAuthMiddleware } from '../middlewares/globalMiddleswares';

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    firstName : {
        type: String,
        lowercase: true,
        maxLength: 20,
        required: [true, "Firstname can't be empty."]
    },
    lastName: {
        type: String,
        lowercase: true,
        maxLength: 20,
        required: [true, "lastName can't be empty."]
    },
    password: {
        type: String,
        required: [true, "Please provide a password."],
        minLength: [8, "Password should be more than characters."]
    }
});

globalAuthMiddleware(userSchema);

const User = mongoose.model('User', userSchema);
export default User;