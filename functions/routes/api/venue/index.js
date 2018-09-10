const express = require('express');
const router = express.Router();
const db = require('../../../db_connectivity/firebaseConnection').db;

// //To save users image
// const multer = require('multer');
// const destination = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, 'assets/uploads/venue/images/')
//     },
//     filename: function(req, file, cb) {
//         console.log(file);
//         var fileObj = {
//           "images/png": ".png",
//           "images/jpeg": ".jpeg",
//           "images/jpg": ".jpg"
//         }
//         if (fileObj[file.mimetype] == undefined)
//             cb(new Error("file format not valid"));
//         else
//             cb(null, file.fieldname + '-' + Date.now() + fileObj[file.mimetype]);
//     }
// });
// const upload = multer({storage: destination});

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

//For client app only getting all venues 
router.get('/selectedVenues', function(req,res){
    let payload = [];

    // returning data after checking country, city
    return collectionRef.get()
    .then((snapshot)=>{
        console.log('Country ', req.query.country, ' City ', req.query.city)
        snapshot.forEach(user => {
            console.log("User", user);
            if (user.data().isOwner){
                collectionRef.doc(user.id).collection('venues').get()
                .then(snapshot =>{
                    snapshot.forEach((doc)=>{
                        if (doc.data().location.country == req.query.country && doc.data().location.city == req.query.city){
                            console.log(doc.id, '=>', doc.data());
                            payload.push({
                                id: doc.id,
                                data: doc.data()
                            });
                        }
                    });
                    console.log("Payload", payload)
                    response(res, 200, 'Okay', payload, 'Selected venues');
                }).catch((err)=>{
                    console.log('No venue of this user', err);        
                });
            }
        });
    }).catch((err)=>{
        console.log('Error getting documents', err);        
        response(res, 404, 'Data not found', null, 'No data available');
    });
});


// router.get('/', function (req, res){
//     let payload = [];

//     // return collectionRef.get()
//     //     .then((snapshot) => {
//     //         console.log(snapshot);
//     //         snapshot.forEach((user) => {
//     //             console.log(user.id, '=>', user.data());
//     //             if (user.data().isOwner){
//     //                 collectionRef.doc(doc.id).collection('venues').get()
//     //                 .then(snapshot =>{
//     //                     snapshot.forEach((doc)=>{
//     //                         if (doc.data().location.country == req.query.country && doc.data().location.city == req.query.city){
//     //                             console.log(doc.id, '=>', doc.data());
//     //                             payload.push({
//     //                                 id: doc.id,
//     //                                 data: doc.data()
//     //                             });
//     //                         }
//     //                     });
//     //                     response(res, 200, 'Okay', payload, 'Selected venues');
//     //                 }).catch((err)=>{
//     //                     console.log('Error getting documents', err);        
//     //                     response(res, 404, 'Data not found', null, 'No data available');
//     //                 });
//     //             }

//     //             // if (res.locals.email != null){
//     //             //     if (doc.data().owner.email == res.locals.email){
//     //             //         payload.push({
//     //             //             id: doc.id,
//     //             //             data: doc.data()
//     //             //         });
//     //             //     }
//     //             // }
//     //             // if (res.locals.phone != null ){
//     //             //     if (doc.data().owner.phone == res.locals.phone){
//     //             //         payload.push({
//     //             //             id: doc.id,
//     //             //             data: doc.data()
//     //             //         });
//     //             //     }
//     //             // }
//     //         });
//     //     })
//     //     .catch((err) => {
//     //         console.log('Error getting documents', err);        
//     //         response(res, 404, 'Bad Request', payload, 'No data available');
//     //     });
// });

// router.get('/:id', function (req, res){
//     let payload = [];
//     console.log(req.params.id);
//     return collectionRef.doc(req.params.id).get()
//         .then((doc) => {
//             console.log(doc);
//             payload.push({
//                 id: doc.id,
//                 data: doc.data()
//             }); 
//             response(res, 200, 'Okay', payload, 'Selected venue');
//         })
//         .catch((err) => {
//             console.log('Error getting documents', err);
//             response(res, 404, 'Bad Request', null, 'No doc found');
//         });            
// });

// router.post('/', function (req, res){

//     let factoryData = {
//         name: 'Venue 1',
//         location: {
//            latitude:30.3756,
//            longitude:-0.127666, 
//            country: 'Pakistan',
//            city: 'Lahore',
//            area: 'Model Town',
//         },
//         pictures: [
//            'picture1',
//            'picture2',
//            'picture3'
//         ],
//         verified: true,
//         amenities: {

//         },
//         reviews: {

//         },
//         owner: {
//             isOwner: false,
//             phone: "03214658283",
//             gender: "Male",
//             dob: "26-09-1994",
//             displayAvatar: "https://lh5.googleusercontent.com/-8DqroICZHO4/AAAAAAAAAAI/AAAAAAAAAWo/cQY8aP9ABws/s96-c/photo.jpg",
//             cnic: "3520221192197",
//             email: "wasif.nadeem90@gmail.com",
//             name: "Wasif Nadeem",
//             isClient: true
//         },
//         activityType: 'Cricket',
//         rate: {
//             perHrRate: 1500,
//             nightRate: 100,
//             peakRate: 100,
//             clientServiceFee: 2,
//             vendorServiceFee: 8
//         },
//         minBookingHour: 3,  
//         createdAt: Date.now(),
//         updatedAt: Date.now(),
//     };

//     return collectionRef.doc().set(JSON.parse(JSON.stringify(factoryData)))
//         .then(()=> {
//             Console.log('New Venue Created');
//             response(res, 201, 'Created', factoryData, 'New Venue created');
//         })
//         .catch((err) => {
//             console.log('Error getting documents', err);
//             response(res, 404, 'Bad Request', factoryData, 'Some went wrong');
//         }); 
// });

// router.delete('/:id', function (req, res){
//     console.log(req.params.id);
//     return collectionRef.doc(req.params.id).delete()
//         .then(() => {
//             console.log('Item Deleted');
//             response(res, 200, 'Okay', null, 'Item Deleted');
//         })
//         .catch((err) => {
//             console.log('Error getting documents', err);
//             response(res, 404, 'Bad Request', null, 'Error');
//         });
// });

// router.put('/:id', function (req, res){
//     response(res, 200, 'Okay', null, 'Okay');
// });

module.exports = router;