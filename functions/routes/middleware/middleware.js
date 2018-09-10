const admin = require('../../db_connectivity/firebaseConnection').admin

module.exports = (req,res,next) => {
    try{
        console.log('aya hai');
        //Token check karna hai idhr
        var idToken = req.header("Authorization");
    
        console.log("Token",idToken);
        
        admin.auth().verifyIdToken(idToken)
        .then(decodeToken => {
            var uid = decodeToken.uid;
            var email = decodeToken.email;
            console.log("Yo",uid, email);
            res.locals.email = email;
            // req.email = email;
            next();
        })
        .catch(err => {
            console.log('Token ', err)
        });
    }
    catch(error){
        console.log('aya hai error');
    }
}