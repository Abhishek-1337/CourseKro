import express from 'express';
import  adminRouter  from "./routes/admin"; 

const app = express();

app.use(express.json());

app.use("/api/v1/admin", adminRouter);

export default app;