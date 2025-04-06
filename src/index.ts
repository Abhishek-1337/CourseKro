import express from 'express';
import  adminRouter  from "./routes/admin"; 
import userRouter from "./routes/user";
import courseRouter from "./routes/course";

const app = express();

app.use(express.json());

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);

export default app;