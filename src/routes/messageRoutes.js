const express = require('express');
const router = express.Router();


const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const TWILIO_NUMBER = process.env.NUMERO_CHILE;


router.post('/sendMessage', async (req, res) => {

    let convSid;

    let createConversation = await client.conversations.conversations
    .create({friendlyName: 'SMS-to-WhatsApp Example'})
    .then(conversation => {
        convSid = conversation.sid;
        res.send(conversation.sid)
    });

    let addParticipantWspp = await client.conversations.conversations(convSid)
    .participants.create({
        'messagingBinding.address': 'whatsapp:+5492616138625',
         'messagingBinding.proxyAddress': `whatsapp:${TWILIO_NUMBER}`
        })

    let addParticipant = await client.conversations.conversations(convSid)
    .participants.create({
        'messagingBinding.address': '+5492616138625',
        'messagingBinding.proxyAddress': `${TWILIO_NUMBER}`
        })

})

router.get('/conversations', (req, res) => {
    let conversationsArray = []
    client
    .conversations
    .conversations
    .list({limit: 20})
    .then(conversations => conversations.forEach(c => conversationsArray.push(c)))
    .then(() => res.send(conversationsArray))
    .catch(err => console.error(err))
})

router.get('/conversationByParticipant', (req, res) => {

    let conversationsArray = []
    client
    .conversations
    .participantConversations
    .list({address: '+5492616138635', limit: 2})
    .then(participantConversations => {
        participantConversations.forEach(p => conversationsArray.push(p))})
    .then(() => res.send(conversationsArray))
    .catch(err => console.error(err))

})

router.get('/fetchConversatParticipant', (req, res) => {
    client.conversations.v1.conversations('CH00199b11afd1420d917df21739227a4f')
      .participants('MBd221e13d3ee547cdbbebe3b40ff9591f')
      .fetch()
      .then(participant => res.send(participant));
})



module.exports = router;