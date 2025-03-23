const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

router.post('/', async (req, res) => {
    try {
        const { concertId, price } = req.body;
        const newBooking = new Booking({
            concertId,
            price,
            userAddress: "0xUserAddressPlaceholder"
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking successful', booking: newBooking });

    } catch (error) {
        res.status(500).json({ error: 'Booking failed' });
    }
});

module.exports = router;
