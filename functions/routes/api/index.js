const express = require('express');
const router = express.Router();
const tokenCheck = require('../middleware/middleware')

console.log('YO');
router.use('/booking',tokenCheck, require('./booking'));
router.use('/venue',tokenCheck, require('./venue'));
router.use('/user',tokenCheck, require('./user'));

router.get('/yoyo',function(req,res){
    res.send("Hello 2");
});

module.exports = router;