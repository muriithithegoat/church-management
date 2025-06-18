const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('👋 Church Management API is running');
});

// Import and use routes
const memberRoutes = require('./routes/memberRoutes');
app.use('/api/members', memberRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const familyRoutes = require('./routes/familyRoutes');
app.use('/api/families', familyRoutes);
