const app = require('./app'); // app instance import
const connectDB = require('./config/databaseConfig'); // database connect
require('dotenv').config(); // env file access
const PORT = process.env.PORT || 5000;

const connect_to_db = async () => {
    try {
        //   const conn = await mongoose.connect(process.env.MONGO_URI);
        await connectDB();
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
    }
};

//Connect to the database before listening
connect_to_db().then(() => {
    app.listen(PORT, () => {
        console.log('listening for requests');
    });
});

app.listen(PORT, async () => {
    console.log(`server running at http://localhost:${PORT}`);
    // await connectDB();
});
