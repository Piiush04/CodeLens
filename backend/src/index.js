import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import repoRoutes from "./routes/repoRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/repo',repoRoutes);
const PORT = process.env.PORT || 5000;


app.listen(PORT, ()=>{
    console.log(`server is running at ${PORT}`);
});