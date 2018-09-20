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
        snapshot.forEach(booking => {
            if (booking.data().user.id == req.params.id){
                payload.push({
                    id: booking.id,
                    data: booking.data()
                });
            }
        });
        console.log("Payload ", payload);
        response(res, 200, 'Okay', payload,'All bookings of selected user');
    }).catch(err => {
        console.log("Error", err);
        response(res, 404, 'Bad Request', payload,'Error getting bookings of user');
    });
});

//Client usage
router.get('/getVenueBookings/:id', function(req,res){
    console.log('Idhr hai');
    let payload = [];
    return collectionRef.orderBy('startTime').get()
    .then(snapshot => {
        snapshot.forEach(booking => {
            if (booking.data().venue.ref == req.params.id){
                payload.push({
                    id: booking.id,
                    data: booking.data()
                })
            }
        });
        console.log("Payload ", payload);
        response(res, 200, 'Okay', payload,'All bookings of selected venue');
    }).catch (err => {
        console.log("Error", err);
        response(res, 404, 'Bad Request', payload,'Error getting bookings by date');
    });
});

// router.get('/', function (req,res){
//     return collectionRef.orderBy('startTime').get()
//     .then(snapshot => {
//         snapshot.forEach(doc => {
//             var ownerRef = 'users/' + req.query.id ;
//             if (doc.data().venue.ownerDocId == ownerRef){
//                 payload.push({
//                     id: doc.id,
//                     data: doc.data()
//                 });
//             }
//         });
//         console.log("Payload ", payload);
//         response(res, 200, 'Okay', payload,'Bookings by date');
//     }).catch (err => {
//         console.log("Error", err);
//         response(res, 404, 'Bad Request', payload,'Error getting bookings by date');
//     });
// });

//Host
router.get('/getOwnerVenuesBookings', function(req,res){
    let payload = [];
    return collectionRef.orderBy('startTime').get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            var ownerRef = 'users/' + req.query.id ;
            console.log("Owner ref", ownerRef);
            if (doc.data().venue != null || doc.data().venue != undefined){
                console.log('In here');
                if (doc.data().venue.ownerDocId == ownerRef){
                    console.log("Check true");
                    payload.push({
                        id: doc.id,
                        data: doc.data()
                    });
                }
            }
        });
        console.log("Payload ", payload);
        response(res, 200, 'Okay', payload,'Bookings by date');
    }).catch (err => {
        console.log("Error", err);
        response(res, 404, 'Bad Request', payload,'Error getting bookings by date');
    });
    // return collectionRef.orderBy('startTime').get()
    // .then((snapshot)=>{
    //     snapshot.forEach((doc)=>{
    //         if (doc.data().user.isOwner){
    //             console.log("Db", doc.data().user.phone );
    //             console.log("Query", req.query.phone );
    //             if (doc.data().user.phone == req.query.phone){
    //                 console.log(doc.id, '=>', doc.data());
    //                 payload.push({
    //                     id: doc.id,
    //                     data: doc.data()
    //                 });
    //             }else console.log("No");
    //         }else{
    //             var ownerRef = 'users/' + req.query.id ;
    //             console.log("Doc ref ",doc.data().ownerDocId, "Owner ref ",ownerRef);
    //             if (doc.data().ownerDocId == ownerRef){
    //                 console.log(doc.id, '=>', doc.data());
    //                 payload.push({
    //                     id: doc.id,
    //                     data: doc.data()
    //                 });
    //             }else console.log("No");
    //         }
    //     });
    //     console.log("Payload ", payload);
    //     response(res, 200, 'Okay', payload,'Bookings by date');
    // })
    // .catch((err)=>{
    //     console.log("Error", err);
    //     response(res, 404, 'Bad Request', payload,'Error getting bookings by date');
    // });
});

router.get('/getBookingsByOwner', function(req,res){
    let payload = [];
    return collectionRef.get()
    .then((snapshot)=>{
        snapshot.forEach((doc)=>{
            if (doc.data().venue.owner.email == res.locals.email){
                console.log(doc.id, '=>', doc.data());
                payload.push({
                    id: doc.id,
                    data: doc.data()
                });
            }else console.log("No");
        });
        console.log("Payload ", payload);
        response(res, 200, 'Okay', payload,'Bookings by date');
    })
    .catch((err)=>{
        console.log("Error", err);
        response(res, 404, 'Bad Request', payload,'Error getting bookings by date');
    });
});


router.get('/getBookingsByDate', function(req,res){
    let payload = [];
    return collectionRef.where('bookingDate', '==', req.query.date).get()
    .then((snapshot)=>{
        snapshot.forEach((doc)=>{
            if (doc.data().venue.owner.email == req.query.email){
                console.log(doc.id, '=>', doc.data());
                payload.push({
                    id: doc.id,
                    data: doc.data()
                });
            }else console.log("No");
        });
        console.log("Payload ", payload);
        response(res, 200, 'Okay', payload,'Bookings by date');
    })
    .catch((err)=>{
        console.log("Error", err);
        response(res, 404, 'Bad Request', payload,'Error getting bookings by date');
    });
});

router.get('/', function (req, res){
    let payload = [];

    return collectionRef.get()
        .then((snapshot) => {
            console.log(snapshot);
                snapshot.forEach((doc) => {
                    console.log(doc.id, '=>', doc.data());
                    payload.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });
                response(res, 200, 'Okay', payload,'All bookings');
        })
        .catch((err) => {
            console.log('Error getting documents', err);        
            response(res, 404, 'Bad Request', payload,'Error getting bookings');
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

// router.delete('/:id', function (req, res){
//     console.log(req.params.id);
//     return collectionRef.doc(req.params.id).delete()
//         .then(() => {
//             console.log("Deleted");
//             response(res, 200, 'Okay', null, 'Booking Deleted');
//         })
//         .catch((err) => {
//             console.log('Error getting documents', err);
//             response(res, 404, 'Not found', null, 'No doc found');
//         });
// });

// router.put('/:id', function (req, res){
//     response(res, 200, 'created', null, 'New Booking Created');
// });

module.exports = router;