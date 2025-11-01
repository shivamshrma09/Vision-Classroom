const cors = require("cors");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectToDb = require('./db/db');
const userroutes = require('./routes/userroutes');
const creatclassroomroutes = require('./routes/creatclassroomroutes');
const feturesroutes = require('./routes/feturesroutes');
const streamTokenRoutes = require('./routes/stream-token');
const studyMaterialRoutes = require('./routes/studyMaterialRoutes');
const enhanceRoutes = require('./routes/enhanceRoutes');
const todoRoutes = require('./routes/todoRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

dotenv.config();

// Debug environment variables
console.log('🔧 Environment check:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0,4) + '****' : 'NOT SET');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET');

connectToDb();

const corsOptions = {
   origin: ['https://visionclassro0m.vercel.app', 'https://visionclassr0om.vercel.app', 'https://vision-classroom2.onrender.com' , 'http://localhost:3000'],
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization', 'token'],
   credentials: true,
   optionsSuccessStatus: 200
};

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsOptions));

app.use('/users', userroutes);
app.use('/classroom', creatclassroomroutes);
app.use('/fetures', feturesroutes);
app.use('/api/stream-token', streamTokenRoutes);
app.use('/api/study-materials', studyMaterialRoutes);
app.use('/api/todos', todoRoutes);
app.use('/gemini', enhanceRoutes);

app.get("/", (req, res) => {
  res.send("Classroom Mitra")
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
