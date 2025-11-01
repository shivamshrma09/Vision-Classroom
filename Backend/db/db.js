const mongoose = require('mongoose');


function connectToDb() {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
    };
    
    mongoose.connect(process.env.DB_CONNECT, options
    ).then(() => {
        console.log('Connected to DB');
    }).catch(err => {
        console.log('DB Connection Error:', err);
        process.exit(1);
    });
}


module.exports = connectToDb;
