const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const templateRoutes = require('./routes/templateRoutes'); // Template routes
const path = require('path');
const userDetailsRoutes = require('./routes/userDetailsRoutes');
const productRoutes = require('./routes/productRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const selectedTemplateRoutes = require('./routes/selectedTemplateRoutes');
const discountRoutes = require('./routes/discountRoutes');
const contactRoutes = require('./routes/contactRoutes');
const crmRoutes = require('./routes/crmRoutes');
const contactDeveloper = require('./routes/contactDeveloper');
const feedback = require('./routes/feedback');
const paymentRoutes = require('./routes/paymentRoutes');
const userPlanRoutes = require('./routes/userPlanRoutes');
const orderPaymentRoutes = require('./routes/orderPaymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { addAdminProduct } = require('./controllers/adminProductController');
const adminProductRoutes = require('./routes/adminProductRoutes');
const subscription = require('./routes/subscription');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.set('view engine', 'ejs');
app.set('uploads', path.join(__dirname, 'uploads'));  // Define where your EJS templates are located
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// API Routes
app.use('/api/users', userRoutes); // User-related routes
app.use('/api/templates', templateRoutes); // Template-related routes
app.use('/api/user-details', userDetailsRoutes); // User Details API route
app.use('/api/products', productRoutes); // User Details API route
app.use('/api/enquiry', enquiryRoutes); // User Details API route
app.use('/api/review', reviewRoutes);
app.use('/api/selectedtemplates', selectedTemplateRoutes);
app.use('/api/discount', discountRoutes); // User Details API route
app.use('/api/contacts', contactRoutes); // Add this line
app.use('/api/crm', crmRoutes); // Add this line
app.use('/api/contact-developer', contactDeveloper); // Add this line
app.use('/api/feedback', feedback); // Add this line
app.use('/api/payment', paymentRoutes);
app.use('/api/user-plans', userPlanRoutes);
app.use('/api/orderPaymentRoutes', orderPaymentRoutes); // Payment and tracking routes
app.use('/api/order', orderRoutes); // Payment and tracking routes
app.use('/api/addAdminProduct', adminProductRoutes); // Payment and tracking routes
app.use('/api/subscription', subscription); // Payment and tracking routes

// Sample route
app.get('/', (req, res) => {
    res.send('NFC Card API');
});

// Static files for uploaded templates
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
