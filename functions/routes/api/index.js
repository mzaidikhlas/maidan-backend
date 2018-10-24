const express = require('express');
const router = express.Router();
const tokenCheck = require('../middleware/middleware')

console.log('YO');
router.use('/booking',tokenCheck, require('./booking'));
router.use('/venue',tokenCheck, require('./venue'));
router.use('/user',tokenCheck, require('./user'));

router.get('/yoyo',function(req,res){
    console.log('Api route');
    
    const accountSid = 'ACa23de2f941a12dbee06efb9fb151daf6'; 
    const authToken = '2e5c66959b3d95c46485c49593930286'; 
    const client = require('twilio')(accountSid, authToken); 
    
    client.messages 
        .create({ 
            body: 'Welcome to the future', 
            from: '+18504035802',       
            to: '+923214658283' 
        }) 
        .then(message => console.log(message.sid)) 
        .done();
});

module.exports = router;