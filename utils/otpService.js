const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use SMTP
  auth: {
    user: "aizend818@gmail.com",
    pass: "tslhqjxzcxxqnbeb"
  }
});

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`
  };
  // console.log('EMAIL_USER:', process.env.EMAIL_USER);
  // console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
  
  await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;
