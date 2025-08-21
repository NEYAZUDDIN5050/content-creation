const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Add this line
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Add CORS middleware BEFORE other middleware
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));

app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');

// Mount Routes
app.use('/auth', authRoutes);
app.use('/content', contentRoutes);

// Welcome Route
app.get('/', (req, res) => {
    res.send('Content Approval API is running...');
});

// MongoDB connection URI from environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
