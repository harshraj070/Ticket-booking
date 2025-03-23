const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    concertId: Number,
    price: String,
    userAddress: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
