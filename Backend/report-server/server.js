const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
connectRedis();

app.use('/api', apiRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`API Server currently running with MVC architecture at htttps://localhost:${PORT}`);
})