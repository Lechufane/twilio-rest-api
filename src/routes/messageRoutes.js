const express = require('express');
const router = express.Router();


const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const TWILIO_NUMBER = process.env.NUMERO_CHILE;


router.post('/startInteraction', async (req, res) => {


    try {
        let createConversation = await client.conversations.v1.conversations
        .create(
            {
                channel: {
                    type: 'whatsapp',
                    initiated_by: 'agent',
                    properties: {
                      type: 'whatsapp'
                    },
                    participants: [
                      {
                        address: 'whatsapp:+5492613440775',
                        proxy_address: 'whatsapp:+56227127123',
                        type: 'whatsapp'
                      }
                    ]
                }})
            let convSid = createConversation.sid;
            console.log(convSid);
            let message = await client.conversations.v1.conversations(convSid).messages.create({
                from: `whatsapp:${TWILIO_NUMBER}`,
                body: 'Hola Bienvenido a QuePlan.cl'
            });
            res.status(200).json({
                message: 'Message sent'
            });
    } catch (error) {
            console.error('conv Error: ', error);
             
    }   
});


router.post('/sendMessage', async (req, res) => {

    let convSid;
    let participantSid;
    let workerEmail = req.body.workerEmail;

    try {
    let createConversation = await client.conversations.v1.conversations
    .create({friendlyName: 'numero-de-cliente'})
    .then(conversation => {
        convSid = conversation.sid;
    });
    } catch (error) {
        console.error('conv Error: ', error);
    }

    try {
    let addParticipantWspp = await client.conversations.v1.conversations(convSid)
    .participants.create({
        'messagingBinding.address': 'whatsapp:+5492616138635',
        'messagingBinding.proxyAddress': `whatsapp:+56227127123`
        })
        .then(participant => {
            console.log("participants", participant);
            participantSid = participant.sid;

        })
    } catch (error) {
        console.error('participant Error: ', error);
    }

    try {
    client.conversations.v1.conversations(convSid)
      .participants(participantSid)
      .update({attributes: JSON.stringify({
         workerEmail: workerEmail
       })})
      .then(participant => {
        console.log("participant", participant);
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
    .then(message => console.log("messages", message));

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

router.get('/getComs', async (req, res) => {

    const clientNumber = req.body.clientNumber
    const countryPhone = req.body.countryPhone
    let comsArray = [];

    try{
    let clientCallsLog = await client.insights.v1.callSummaries.list({from: '+56988082209', limit: 20})
    let clientCallsLogArray = clientCallsLog.map(({from, startTime, endTime, duration, callSid}) => {
        comsArray.push({from, date:startTime, endTime, duration, callSid});
    })

    let workerCallsLog = await client.insights.v1.callSummaries.list({to: '+56988082209', limit: 20})
    let workerCallsLogArray = workerCallsLog.map(({from, startTime, endTime, duration, callSid}) => {
        comsArray.push({from, date:startTime, endTime, duration, callSid});
    })


    let getMessagesFromClient = await client.messages.list({from: `whatsapp:${clientNumber}`,limit: 20})
    let clientMessages = getMessagesFromClient.map(({body, dateSent, status}) =>{
        comsArray.push({clientBody:body, date:dateSent, status});
    })

    let getMessagesFromWorker = await client.messages.list({to: `whatsapp:${clientNumber}`,limit: 20})
    let workerMessages = getMessagesFromWorker.map(({body, dateSent, status}) =>{
        comsArray.push({workerBody:body, date:dateSent, status});
    })

    const sorted = comsArray.sort((a, b) => {
        return (a.date < b.date) ? -1 : ((a.date > b.date) ? 1 : 0)
      });

    res.send(sorted)

    } catch(err) {
        console.error(error)
    }
    

});
    


module.exports = router;