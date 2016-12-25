var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: 'postmaster@cogniance.com',
    pass: '8e37cec3c9d82373868c580539cdd51b'
  }
});
// var transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true, // use SSL
//   auth: {
//     user: '',
//     pass: ''
//   }
// });

/**
 * from: options.from,
 * to: options.to,
 * subject: options.subject,
 * text: options.text || '',
 * html: options.html || '',
 * attach: options.html || ''
 *
 * @param options
 * @param cb
 */
exports.send = function(options, cb) {
  transporter.sendMail(options, function(err) {
    cb(err, { message: 'Thank you! Your feedback has been submitted.' })
  });
};