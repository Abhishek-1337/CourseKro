import * as jwt from "jsonwebtoken"
import { AuthRequest } from "../types/auth.types";

//@ts-ignore
export const protect = (req: AuthRequest, res, next) => {
    if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")){
        res.status(401).json({
            message: "Access denied. Token not provided."
        });
        return;
    }

    const token = req.headers.authorization.split(" ")[1];
    try{
        const decoded = jwt.verify(token, process.env.jwt_admin_key as string);
        
        if(decoded) {
            if(typeof decoded === "string"){
                res.status(401).json({
                    message: "You are not logged in."
                });
            }

            req.userId = (decoded as jwt.JwtPayload).userId;
            req.role = 'admin';
        }

        next();
    }
    catch(ex) {
        console.log(ex);
        res.status(401).json({
            message: "Access denied"
        });
    }
};

