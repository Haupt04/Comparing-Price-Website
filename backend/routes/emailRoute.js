import nodemailer from 'nodemailer';
import express from 'express';

const router = express.Router();


router.post("/", async (req, res) => {
    const {email} = req.body

    if (!email) return res.status(400).json({success: false, message: "Email is required"});

    try {
        let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }});


        const emailMessage ={
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Thank you for subscribing",
            text: `Hi there!\nThank you for subscribing.\nPlease note this website is only for educational purpose\n`
        }

        await transporter.sendMail(emailMessage);

        res.status(200).json({ success: true, message: "Confirmation Email Sent. Check your email"});
    } catch (error) {
        console.error("Error", error.message);
        res.status(500).json({success: false, message: "Failed to send email"});
    } 
})

export default router


