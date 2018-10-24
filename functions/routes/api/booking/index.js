const express = require('express');
const router = express.Router();
const db = require('../../../db_connectivity/firebaseConnection').db;

const collectionRef = db.collection('bookings');

const response = (res, code, statusMessage, payload, message) => {
    res.send({
        statusCode: code,
        statusMessage: statusMessage,
        type: "Booking",
        payload: payload,
        message: message,    
    });
}
router.get('/testing', function(res,req){
return response(res,404,'Error', null,'Yo');
});

//Client usage
router.get('/getUserBookings/:id', function(req,res){
    console.log('In route with id ', req.params.id);
    let payload = [];
    return collectionRef.get()
    .then(snapshot => {
        snapshot.docs
            .filter(booking => 
                booking.data().user.id == req.params.id)
            .map(booking => 
                payload.push({
                    id: booking.id,
                    data: booking.data()
                }))    
        return payload;
    })
    .then(payload => {
        console.log("Payload ", payload);
        response(res, 200, 'Okay', payload,'All bookings of selected user');
    })
    .catch(err => {
        console.log("Error", err);
        response(res, 404, 'Bad Request', payload,'Error getting bookings of user');
    });
});

//Client usage
router.get('/getVenueBookings/:id', function(req,res){
    let payload = [];
    return collectionRef.orderBy('startTime').get()
    .then(snapshot => {
        snapshot.docs
            .filter(booking => 
                booking.data().venue.ref == req.params.id)
            .map(booking => 
                payload.push({
                    id: booking.id,
                    data: booking.data()
                }))
        return payload;
    })
    .then(payload => {
        console.log("Payload ", payload);
        response(res, 200, 'Okay', payload,'All bookings of selected venue');
    })
    .catch (err => {
        console.log("Error", err);
        response(res, 404, 'Bad Request', payload,'Error getting bookings by date');
    });
});

//Host Usage
router.get('/getOwnerVenuesBookings', function(req,res){
    let payload = [];
    return collectionRef.orderBy('startTime').get()
    .then(snapshot => {
        var ownerRef = 'users/' + req.query.id ;
        console.log("Owner ref", ownerRef);

        snapshot.docs
            .filter(doc => 
                (doc.data().venue != null || doc.data().venue != undefined) && 
                (doc.data().venue.ownerDocId == ownerRef)
            ).map(doc => {
                payload.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
        
        return payload; 
    }).then(payload => {
        console.log("Payload ", payload);
        response(res, 200, 'Okay', payload,'Bookings by date');
    }).catch (err => {
        console.log("Error", err);
        response(res, 404, 'Bad Request', payload,'Error getting bookings by date');
    });
});

router.get('/:id', function (req, res){
    let payload = [];
    console.log(req.params.id);
    return collectionRef.doc(req.params.id).get()
        .then((doc) => {
            console.log(doc);
            payload.push({
                id: doc.id,
                data: doc.data()
            });     
            response(res, 200, 'okay', payload, 'Selected venues');         
        })
        .catch((err) => {
            console.log('Error getting documents', err);
            response(res, 404, 'Bad Request', payload, 'No doc found');
        });            
});

router.post('/', function (req, res){
    console.log("Payload", req.body)
    return collectionRef.doc().set(JSON.parse(JSON.stringify(req.body)))
        .then(()=> {
            console.log('New Booking Created');
            response(res, 201, 'created', null, 'New Booking Created');
        })
        .catch((err) => {
            console.log('Error getting documents', err);
            response(res, 404, 'bad request', req.body, 'Some thing is wrong with data');
        }); 
});

module.exports = router;