const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 12000; 

app.use(cors());
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));

connectDB();

app.use('/api/auth', require('./routes/auth'));
app.use('/api', uploadRoutes);
app.use('/api', require('./routes/history'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
