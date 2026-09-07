const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function sendSMS(phone, message) {

  client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to: phone
  })
  .then(message => console.log(message.sid))
  .catch(err => console.error(err));

}

module.exports = sendSMS;