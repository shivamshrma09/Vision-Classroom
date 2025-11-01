const nodemailer = require('nodemailer');

// Create transporter function (same as OTP)
function createTransporter() {
  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// Send email function (same as OTP)
async function sendEmail(to, subject, html) {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

const sendNotificationEmail = async (to, subject, teacherName, action, className, title) => {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Classroom Mitra - ${className}</h2>
      <p>Hello,</p>
      <p><strong>${teacherName}</strong> ${action}: <strong>"${title}"</strong></p>
      <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
        <h3 style="color: #007bff; margin: 0;">New Activity</h3>
        <p style="margin: 10px 0; color: #333;">Check your classroom for updates</p>
      </div>
      <p>Visit your classroom to see the latest activities.</p>
      <p>If you're not enrolled in this class, please ignore this email.</p>
    </div>
  `;

  const emailSent = await sendEmail(to, subject, emailHtml);
  
  if (emailSent) {
    console.log(`✅ Notification email sent successfully to ${to}`);
  } else {
    console.log(`🔑 EMAIL FAILED - Notification for ${to}`);
  }
};

const sendWelcomeEmail = async (to, userName, userRole) => {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Classroom Mitra - Welcome!</h2>
      <p>Hello ${userName || 'User'},</p>
      <p>Welcome to Classroom Mitra! Your account has been successfully created.</p>
      <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
        <h3 style="color: #007bff; margin: 0;">Account Details</h3>
        <p style="margin: 10px 0; color: #333;">Email: ${to}</p>
        <p style="margin: 10px 0; color: #333;">Role: ${userRole === 'teacher' ? 'Teacher' : 'Student'}</p>
        <p style="margin: 10px 0; color: #333;">Status: Active</p>
      </div>
      <p>You can now ${userRole === 'teacher' ? 'create classrooms and manage students' : 'join classrooms and access study materials'}.</p>
      <p>If you didn't create this account, please contact support.</p>
    </div>
  `;

  const emailSent = await sendEmail(to, 'Classroom Mitra - Welcome!', emailHtml);
  
  if (emailSent) {
    console.log(`✅ Welcome email sent successfully to ${to}`);
  } else {
    console.log(`🔑 EMAIL FAILED - Welcome email for ${to}`);
  }
};

module.exports = { sendNotificationEmail, sendWelcomeEmail };