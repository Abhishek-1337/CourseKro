import bcrypt from "bcrypt";
import { Schema } from "mongoose";
import { AuthRequest } from "../types/auth.types";
import { NextFunction, Response } from "express";

export const globalAuthMiddleware = (schema: Schema) => {
    schema.pre("save", async function (next) {
        if(!this.isModified('password')) return;
        this.password = await bcrypt.hash(this.password as string, 12);
        next();
    });
}

export const restrictTo = (...roles: string[]) => {
     return (req: AuthRequest, res: Response, next: NextFunction) => {
        if(req.role === undefined || !roles.includes(req.role)){
            res.status(403).json({
                message: "Access denied"
            });
            return;
        }
        next();
     }
}

