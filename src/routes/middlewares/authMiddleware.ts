import * as jwt from "jsonwebtoken"

//@ts-ignore
export const protect = (req, res, next) => {
    if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")){
        res.status(401).json({
            message: "Access denied. Token not provided."
        });
    }

    const token = req.headers.authorization.split(" ")[1];
    try{
        const decoded = jwt.verify(token, process.env.jwt_key as string);
        
        if(decoded) {
            if(typeof decoded === "string"){
                res.status(401).json({
                    message: "You are not logged in."
                });
            }

            req.userId = (decoded as jwt.JwtPayload).userId;
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