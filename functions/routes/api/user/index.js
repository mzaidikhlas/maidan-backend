const express = require('express');
const router = express.Router();
const db = require('../../../db_connectivity/firebaseConnection').db;

// const multer = require('multer');
// const destination = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, 'assets/uploads/users/image/')
//     },
//     filename: function(req, file, cb) {
//         console.log(file);
//         var fileObj = {
//           "image/png": ".png",
//           "image/jpeg": ".jpeg",
//           "image/jpg": ".jpg"
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
        type: "User",
        payload: payload,
        message: message,    
    });
}

//Host Routes
router.get('/getByPhone', function (req, res){
    let payload = [];
    let venues = [];
    var date = new Date();

    console.log("Phone ",req.query.phone);
    console.log("Time", date.getTime());
    return collectionRef.where("phone", "==", req.query.phone).get()
        .then((snapshot) => {
            console.log(snapshot);

            var data = snapshot.docs[0].data()
            var id = snapshot.docs[0].id
            if (data.isOwner){
                //Getting venues
                collectionRef.doc(id).collection('venues').get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        var venue = {
                            ref: doc.id,
                            name: doc.data().name,
                            location: doc.data().location,
                            pictures: doc.data().pictures,
                            verified: doc.data().verified,
                            amneties: doc.data().amneties,
                            reviews: doc.data().reviews,
                            ownerDocId: doc.data().ownerDocId,
                            activityType: doc.data().activityType,
                            rate: doc.data().rate,
                            minBookingHour: doc.data().minBookingHour,
                            createdAt: doc.data().createdAt,
                            updatedAt: doc.data().updatedAt
                        };

                        venues.push(venue);
                    });
                    var user = {
                        name: data.name,
                        email: data.email,
                        displayAvatar: data.displayAvatar,
                        dob: data.dob,
                        gender: data.gender,
                        phone: data.phone,
                        cnic: data.cnic,
                        isOwner: data.isOwner,
                        isClient: data.isClient,
                        venues: venues
                    }

                    payload.push({
                        id: id,
                        data: user, 
                    });
                    console.log("Payload", payload);
                    console.log("Response time", date.getTime());
                    response(res, 200, 'Okay', payload, 'Login User');
                }).catch(err => {
                    console.log("Error", err)
                    response(res, 404, 'Venuves not found', payload, 'No data available');
                });
            }
        })
        .catch((err) => {
            console.log('Error getting documents', err);        
            response(res, 404, 'Data not found', payload, 'No data available');
        });   
});

//Client Routes
router.get('/getByEmail', function (req, res){
    let payload = [];
    return collectionRef.where("email", "==", res.locals.email).get()
        .then((snapshot) => {
            console.log(snapshot);
                snapshot.forEach((doc) => {
                    console.log(doc.id, '=>', doc.data());
                    payload.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });
                response(res, 200, 'Okay', payload, 'Login User');
        })
        .catch((err) => {
            console.log('Error getting documents', err);        
            response(res, 404, 'Data not found', payload, 'No data available');
        });   
});

// router.get('/', function (req, res){
//     let payload = [];

//     if (req.res.locals.email != null || req.res.locals.email != undefined || req.res.locals.email != "")
//         console.log(req.res.locals.email)
        
//     return collectionRef.get()
//         .then((snapshot) => {
//             console.log(snapshot);
//                 snapshot.forEach((doc) => {
//                     console.log(doc.id, '=>', doc.data());
//                     payload.push({
//                         id: doc.id,
//                         data: doc.data()
//                     });
//                 });
//                 response(res, 200, "Okay", payload, "All Venues");
//         })
//         .catch((err) => {
//             console.log('Error getting documents', err);        
//             response(res, 404, "Data not found", null, "No data available");
//         });
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
//             response(res, 200, "Okay", payload, "Selected Venue");               
//         })
//         .catch((err) => {
//             console.log('Error getting documents', err);
//             response(res, 404, "Data not found", null, "No user found");
//         });            
// });

router.post('/', function (req, res){

    let payload = {
        email: req.body.email,
        name: req.body.name,
        cnic: req.body.cnic,
        phone: req.body.phone,
        userRecord: req.body.userRecord,
        displayAvatar: req.body.displayAvatar,  
        dob: req.body.dob,
        gender: req.body.gender,
        isClient: req.body.isClient,
        isOwner: req.body.isOwner,
    };

    console.log("Payload",payload)
    console.log("Request data",req.body);
    return collectionRef.doc().set(JSON.parse(JSON.stringify(payload)))
        .then(()=> {
            console.log('Created');
            response(res, 201, "Created", null, "New user created");
        })
        .catch((err) => {
            console.log('Error getting documents', err);
            response(res, 400, "Bad Request", null, "Some thing is wrong with data");
        }); 
});

// router.delete('/:id', function (req, res){
//     console.log(req.params.id);
//     return collectionRef.doc(req.params.id).delete()
//         .then(() => {
//             console.log('Item Deleted');
//             response(res, 200, "Okay", null, "Item Deleted");
//         })
//         .catch((err) => {
//             console.log('Error getting documents', err);
//             response(res, 404, "Data not found", null, "No item found");
//         });
// });

// router.put('/:id', function (req, res){
//     response(res, 200, "Okay", null, "Okay");
// });

module.exports = router;