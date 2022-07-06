const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  }
});

const sendRegisterEmail = (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Thanks for joining in!',
    html: `<h2>Welcome ${name},</h2><p>You have successfully registered</p>`
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log('Error: ', err);
    } else {
      console.log('Email sent successfully');
    }
  });
};

const sendCancelationEmail = (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Sorry to see you go!',
    html: `<h2>Goodbye, ${name}</h2><p>I hope to see you back sometime soon.</p>`
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log('Error: ', err);
    } else {
      console.log('Email sent successfully');
    }
  });
};

const sendPasswordResetRequestEmail = (email, name, link) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your password reset link',
    html: `<h2>Hi! ${name},</h2><p>Here is your password reset <a href="https://${link}">link</a></p>`
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log('Error: ', err);
    } else {
      console.log('Email sent successfully');
    }
  });
};

const sendPasswordResetSuccessEmail = (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset Successfully',
    html: `<h2>Hi! ${name},</h2><p>Your password was changed</p>`
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log('Error: ', err);
    } else {
      console.log('Email sent successfully');
    }
  });
};

module.exports = {
  sendRegisterEmail,
  sendCancelationEmail,
  sendPasswordResetRequestEmail,
  sendPasswordResetSuccessEmail
};
