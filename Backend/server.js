import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import  {Userrouter}  from './routes/user.js';
import mongoose, { connect } from 'mongoose';
import cookieParser from 'cookie-parser';

dotenv.config(); 

const app = express();
(async()=>{
    await mongoose.connect(process.env.MONGO)
    console.log(`mongo connected with ${process.env.MONGO}`)
})()
// Middleware
app.use(cors({
    origin:["http://localhost:3001"],
    credentials:true
}));
app.use(express.json()); 
app.use(cookieParser())
app.use("/auth",Userrouter)

app.get('/', async(req, res) => {
   await res.send('Welcome');
   console.log("/  is running ")
});

const PORT = process.env.PORT || 3000;
(async () => {
    try {
        await app.listen(PORT);
        console.log(`Server running on port ${PORT}`);
    } catch (error) {
        console.error('Error starting the server:', error);
    }
})();
