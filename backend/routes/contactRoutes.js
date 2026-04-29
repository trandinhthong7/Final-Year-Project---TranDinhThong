const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// POST /api/contact - Send contact form email
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Create transporter using Gmail with explicit configuration
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify transporter configuration
    await transporter.verify();

    // Email to TDT Stadium (store owner)
    const mailToStore = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Store email
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #004643; border-radius: 10px;">
          <h2 style="color: #004643; border-bottom: 2px solid #f9bc60; padding-bottom: 10px;">New Contact Form Submission</h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong style="color: #004643;">Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong style="color: #004643;">Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong style="color: #004643;">Phone:</strong> ${phone}</p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <p style="margin: 0 0 10px 0;"><strong style="color: #004643;">Message:</strong></p>
            <p style="margin: 0; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
            <p>This email was sent from the TDT Stadium contact form.</p>
            <p>Please respond to the customer at: <a href="mailto:${email}" style="color: #004643;">${email}</a></p>
          </div>
        </div>
      `
    };

    // Confirmation email to customer
    const mailToCustomer = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting TDT Stadium',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #004643; border-radius: 10px;">
          <h2 style="color: #004643; border-bottom: 2px solid #f9bc60; padding-bottom: 10px;">Thank You for Contacting Us!</h2>
          
          <p style="line-height: 1.6;">Dear ${name},</p>
          
          <p style="line-height: 1.6;">Thank you for reaching out to TDT Stadium. We have received your message and will get back to you as soon as possible.</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <p style="margin: 0 0 10px 0;"><strong style="color: #004643;">Your Message:</strong></p>
            <p style="margin: 0; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #004643; color: white; border-radius: 5px;">
            <h3 style="margin: 0 0 10px 0;">Contact Information</h3>
            <p style="margin: 5px 0;">📍 74 Định Công, Phường Định Công, Quận Hoàng Mai, Hà Nội</p>
            <p style="margin: 5px 0;">📞 +84 123 456 789</p>
            <p style="margin: 5px 0;">📧 contact@tdtstadium.com</p>
            <p style="margin: 5px 0;">🕐 Daily: 06:00 - 23:00</p>
          </div>
          
          <p style="line-height: 1.6;">Best regards,<br><strong>TDT Stadium Team</strong></p>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
            <p>This is an automated confirmation email. Please do not reply to this email.</p>
          </div>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(mailToStore);
    await transporter.sendMail(mailToCustomer);

    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully! We will contact you soon.' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.',
      error: error.message 
    });
  }
});

module.exports = router;
