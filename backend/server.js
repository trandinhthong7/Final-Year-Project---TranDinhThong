const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");


// Load environment variables FIRST
dotenv.config();

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const paypalRoutes = require("./routes/paypalRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const contactRoutes = require("./routes/contactRoutes");


const app = express();
const port = process.env.PORT || 3000;

// Middleware 
app.use(cors({
    origin: [
        'http://localhost:5173', // Local development
        'http://localhost:9000',
        'https://tdt-stadium-final.vercel.app', // Production frontend
        'https://final-year-project-tran-dinh-thong-umber.vercel.app' // Backend domain (for testing)
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Increase payload size limit for base64 images (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to MongoDB
connectDB();

app.get('/', (_req, res) => {
    res.send('Welcome to the TDT Stadium API!');
});

//API routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/chat', chatbotRoutes);
app.use('/api/contact', contactRoutes);


//Admin routes
app.use('/api/admin/users', adminRoutes);
app.use('/api/admin/products', productAdminRoutes);
app.use('/api/admin/orders', adminOrderRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});