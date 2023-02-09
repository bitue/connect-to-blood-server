const app = require('./app'); // app instance import
const connectDB = require('./config/databaseConfig'); // database connect
require('dotenv').config(); // env file access
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`server running at http://localhost:${PORT}`);
    await connectDB();
});
