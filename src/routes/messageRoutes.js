const express = require('express');
const router = express.Router();


const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);


router.post('/sendMessage', (req, res) => {

    const data = req.body
    client.messages.create({
        body: data["messageBody"],
        from: data["from"],
        to: data["to"]
    })
    .then(message => {
        res.send(`Successfully sent message: ${message.sid}`)
    })
    .catch(err => {
        res.send(`An error occurred`)
    })
})

router.get('chat', (req, res)=>{
    let chat = [];
    client.messages.list({limit: 20})
    
})

router.get('/conversations', (req, res) => {
    let conversationsArray = []
    client
    .conversations
    .conversations
    .list({limit: 20})
    .then(conversations => conversations.forEach(c => conversationsArray.push(c)))
    .then(() => res.send(conversationsArray[0]))
    .catch(err => console.error(err))
})

module.exports = router;