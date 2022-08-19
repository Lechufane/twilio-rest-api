const express = require('express');
const router = express.Router();


const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const TWILIO_NUMBER = process.env.NUMERO_CHILE;


router.post('/sendMessage', async (req, res) => {

    let convSid;
    let participantSid;
    let messageSid;

    try {
    let createConversation = await client.conversations.v1.conversations
    .create({friendlyName: 'numero-de-cliente'})
    .then(conversation => {
        convSid = conversation.sid;
        console.log(convSid);
    });
    } catch (error) {
        console.error('conv Error: ', error);
    }

    try {
    let addParticipantWspp = await client.conversations.v1.conversations(convSid)
    .participants.create({
        'messagingBinding.address': 'whatsapp:+5492622408898',
        'messagingBinding.proxyAddress': `whatsapp:+56227127123}`
        })
        .then(participant => {
            participantSid = participant.sid;
        })
    } catch (error) {
        console.error('participant Error: ', error);
    }

    try {
    let messageSent = client.conversations.v1.conversations(convSid)
    .messages
    .create({
       author:`whatsapp:${TWILIO_NUMBER}`,
       body: 'Hola Bienvenido a QuePlan.cl'
     })
    .then(message => messageSid = message.sid);

    } catch (error) {
        console.error('message Error: ', error);
    }
    res.send('Message sent');
    }
);



router.get('/conversations', async(req, res) => {
    
    try {
    const conversationList = await client.conversations.v1.conversations.list({limit: 20});
    const conversationsSid = conversationList.map(({sid}) => sid)
    const messagesList = await Promise.all(conversationsSid.map(conversation => client.conversations.v1.conversations(conversation).messages.list({limit:20})))
    const messagesArray = messagesList.map(messages => messages.map(({body}) => body))
    res.send(messagesArray); 

    } catch (error) {
        console.error('conversation Error: ', error);
    }

})

router.get('/conversationsByParticipant', async(req, res) => {


    try{
    let participantConversationSid = await client.conversations.v1.participantConversations.list({address: 'whatsapp:+5492616138635', limit: 5})
    let participantConversationSidArray = participantConversationSid.map(({conversationSid}) => conversationSid)
    let messagesList = await Promise.all(participantConversationSidArray.map(conversation => client.conversations.v1.conversations(conversation).messages.list({limit:10})))
    let messagesArray = messagesList.map(messages => messages.map(({body}) => body))
    res.send(messagesArray);
    } catch (error) {
        console.error('conversation Error: ', error);
    }

})

router.get('/conversationsByParticipant', async(req, res) => {


    try{
    let participantConversationSid = await client.conversations.v1.participantConversations.list({address: 'whatsapp:+5492616138635', limit: 5})
    let participantConversationSidArray = participantConversationSid.map(({conversationSid}) => conversationSid)
    let messagesList = await Promise.all(participantConversationSidArray.map(conversation => client.conversations.v1.conversations(conversation).messages.list({limit:10})))
    let messagesArray = messagesList.map(messages => messages.map(({body}) => body))
    res.send(messagesArray);
    } catch (error) {
        console.error('conversation Error: ', error);
    }

})

router.get('/getCallsFromNumber', async (req, res) => {

    let clientCallsLog = await client.insights.v1.callSummaries.list({to: '+56227127123', limit: 20})
    let clientCallsLogArray = clientCallsLog.map(({from, startTime, endTime, duration, callSid}) => {
        return {from, startTime, endTime, duration, callSid}
    })
    console.log(clientCallsLogArray);

});
    


module.exports = router;