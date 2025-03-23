const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/concertDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const bookingsRouter = require('./routes/bookings');
app.use('/api/bookings', bookingsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
