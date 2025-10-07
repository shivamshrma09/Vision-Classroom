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
   origin: '*',
   optionsSuccessStatus: 200
};



const app = express();
const PORT = 4000;

// Serve static files

// JSON parsing
app.use(express.json());
app.use(cors(corsOptions));

// Mount REST routes
app.use('/users', userroutes);
app.use('/classroom', creatclassroomroutes);
app.use('/fetures', feturesroutes);
app.use('/api/stream-token', streamTokenRoutes);

app.get("/", (req, res) => {
  res.send("Classroom Mitra")
});

// Create HTTP and Socket.io server


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
