//express router
const express = require("express");
const router = express.Router();

//twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const twilioNumber = process.env.NUMERO_CHILE;

router.post("/sendMessage", (req, res) => {

   client
   .messages
   .create({
    body: req.body.messageBody,
    to: req.body.destiny, // Text this number
    from: twilioNumber, // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));

});



