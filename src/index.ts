import express from 'express';
import  adminRouter  from "./routes/admin"; 

const app = express();

app.use(express.json());

app.use("/auth/admin", adminRouter);

export default app;