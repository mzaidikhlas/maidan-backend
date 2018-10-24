const express = require('express');
const router = express.Router();
const db = require('../../../db_connectivity/firebaseConnection').db;

const collectionRef = db.collection('users');

const response = (res, code, statusMessage, payload, message) => {
    res.send({
        statusCode: code,
        statusMessage: statusMessage,
        type: "Venue",
        payload: payload,
        message: message,    
    });
}

//For client app only; getting all venues 
router.get('/selectedVenues',function(req,res){
    return collectionRef.where('isOwner', '==', true).get()
    .then(snapshot => {
        var venues = [];
        snapshot.docs.map(user => {
            console.log('User', user);
            venues.push(collectionRef.doc(user.id).collection('venues').get());
        });
        return Promise.all(venues);
    }).then(snapshots => {
        let payload = [];
        snapshots.forEach(venues => {
            console.log('Venues', venues);
            venues.docs
                .filter(doc => 
                    doc.data().location.country == req.query.country && 
                    doc.data().location.city == req.query.city
                )
                .map(doc => 
                    payload.push({
                        id: doc.id,
                        data: doc.data()
                    })
                ) 
        });
        return payload ;
    }).then(payload => {
        console.log('Payload', payload);
        response(res, 200, "Okay", payload, "Selected venues");
    }).catch(err => {
        console.log('Error getting documents', err);        
        response(res, 404, 'Data not found', null, 'No data available');
    });
});

module.exports = router;