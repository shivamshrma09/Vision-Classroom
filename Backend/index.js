const cors = require("cors");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectToDb = require('./db/db');
const userroutes = require('./routes/userroutes');
const creatclassroomroutes = require('./routes/creatclassroomroutes');
const feturesroutes = require('./routes/feturesroutes');
const streamTokenRoutes = require('./routes/stream-token');
const authMiddleware = require('./middlewares/authMiddleware');


dotenv.config();
connectToDb();

const corsOptions = {
   origin: ['https://visionclassroo0m-jkiw.vercel.app', 'https://vision-classroom2.onrender.com'],
<<<<<<< HEAD
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization', 'token'],
   credentials: true,
=======
>>>>>>> e8e53ce76d3f40c57b9775acc132b33f4f63f217
   optionsSuccessStatus: 200
};



const app = express();
const PORT = process.env.PORT || 4000;


app.use(express.json());
app.use(cors(corsOptions));

app.use('/users', userroutes);
app.use('/classroom', creatclassroomroutes);
app.use('/fetures', feturesroutes);
app.use('/api/stream-token', streamTokenRoutes);

app.get("/", (req, res) => {
  res.send("Vision Classroom")
});



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
