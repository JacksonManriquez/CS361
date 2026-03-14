const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Email sending endpoint
app.post('/send-email', (req, res) => {
    console.log('📧 Received email request:');
    console.log('Event:', req.body.event);
    console.log('User ID:', req.body.user_id);
    console.log('Email:', req.body.email);
    console.log('Subject:', req.body.subject);
    console.log('Message:', req.body.message);
    console.log('---');

    // Simulate email sending
    setTimeout(() => {
        console.log('✅ Email sent successfully to:', req.body.email);
    }, 100);

    res.json({
        success: true,
        message: 'Email sent successfully',
        sent_to: req.body.email,
        sent_at: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'email-service',
        port: PORT
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Email microservice running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`📧 Email endpoint: http://localhost:${PORT}/send-email`);
});