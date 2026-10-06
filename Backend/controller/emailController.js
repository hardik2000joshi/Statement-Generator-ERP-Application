const transporter = require("../services/EmailService");
const sendTestEmail = async (req, res) => {
    try {
        const { to } = req.body;

        if (!to) {
            return res.status(400).json({
                success: false,
                message: "Recipient email is required",
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: "Statement Generator Test Email",
            text: "This is a test email from Statement Generator.",
        };

        const info = await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "Email sent successfully",
            messageId: info.messageId,
        });

    } catch (error) {
        console.error("Email sending error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send email",
            error: error.message,
        });
    }
};

module.exports = {
    sendTestEmail,
};