import { EventEmitter } from 'events';
import nodemailer, { SendMailOptions } from 'nodemailer';

const emailEmitter = new EventEmitter();
const credentials = {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD,
};
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: credentials,
});

// Handle the "sendEmail" event
emailEmitter.on('sendEmail', (mailOptions: SendMailOptions) => {
  const _opts = {
    ...mailOptions,
    from: credentials.user,
    replyTo: credentials.user,
  };
  transporter.sendMail(_opts, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      emailEmitter.emit('emailError', { error, mailOptions });
    } else {
      console.log('Email sent successfully:', info.response);
    }
  });
});

// Handle the "emailError" event
emailEmitter.on('emailError', ({ error, mailOptions }) => {
  // Log the error for debugging purposes
  console.error('Email sending error:', error, { mailOptions });

  // Optionally, you can notify the user or take other actions here
});

export default emailEmitter;
