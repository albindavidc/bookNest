import express from 'express';
import {Request, Response} from 'express';
import connectToDatabase from './config/database';

const app = express();



//Middleware for JSON
app.use(express.json());

//Connect to MongoDB Atlas
connectToDatabase();



app.get("/",(req: Request, res: Response) =>{
    res.send("Welcome to the LMS!")
});

//Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
});