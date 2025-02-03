const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;
let generatedOTP = null; // Store the generated OTP
let otpEmail = null; // Store the email associated with the OTP

// Database connection (Using MySQL with XAMPP configuration)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Leave empty if no password set in XAMPP MySQL
    database: 'user_db' // Replace with your database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, '../public')));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'adityasuraj194@gmail.com',  // Replace with your email
        pass: 'xnsh esrm qwpy unsi'   // Replace with your email password (enable less secure apps in Gmail settings)
    }
});

// Send OTP
app.post('/send-otp', (req, res) => {
    const email = req.body.email;
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    otpEmail = email; // Store email to validate during registration

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP is: ${generatedOTP}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.json({ success: false, message: 'Error sending OTP' });
        }
        res.json({ success: true, message: 'OTP sent successfully' });
    });
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (email === otpEmail && otp === generatedOTP) {
        res.json({ success: true, message: 'OTP Verified Successfully' });
    } else {
        res.json({ success: false, message: 'Invalid OTP' });
    }
});

// User registration
app.post('/register', (req, res) => {
    const { username, email, password, otp } = req.body;

    // Check if OTP is valid
    if (email !== otpEmail || otp !== generatedOTP) {
        return res.json({ success: false, message: 'OTP verification failed. Please try again.' });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Insert user into the database
    const query = 'INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())';
    db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
            return res.json({ success: false, message: 'Error registering user' });
        }

        // Clear OTP and associated email after successful registration
        generatedOTP = null;
        otpEmail = null;

        res.json({ success: true, message: 'User registered successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
