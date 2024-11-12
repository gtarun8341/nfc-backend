const Enquiry = require('../models/Enquiry'); // Make sure you have an Enquiry model

// Controller to handle the enquiry submission
exports.submitEnquiry = async (req, res) => {
    try {
        console.log(req.body)
        const { userId, name, email, phone, message } = req.body;

        // Create a new enquiry entry in the database
        const newEnquiry = new Enquiry({
            userId,
            name,
            email,
            phone,
            message,
        });

        await newEnquiry.save();

        res.status(200).json({ message: 'Enquiry submitted successfully!' });
    } catch (error) {
        console.error('Error submitting enquiry:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getEnquiriesByUserId = async (req, res) => {
    try {
        console.log(req.user._id)
        const enquiries = await Enquiry.find({ userId: req.user._id }).populate('userId', 'name email');
        console.log(enquiries)
        res.status(200).json(enquiries);
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};