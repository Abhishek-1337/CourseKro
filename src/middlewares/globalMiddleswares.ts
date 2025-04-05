import bcrypt from "bcrypt";
import { Schema } from "mongoose";

export const globalAuthMiddleware = (schema: Schema) => {
    schema.pre("save", async function (next) {
        if(!this.isModified('password')) return;
        this.password = await bcrypt.hash(this.password as string, 12);
        next();
    });
}

