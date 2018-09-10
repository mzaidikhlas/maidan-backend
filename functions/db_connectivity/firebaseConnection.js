const admin = require('firebase-admin');
const serviceAccount = require('../service_account_key/maidan-d79d9-290bf03b7140.json');

console.log (serviceAccount);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "Maidan.appspot.com"
});

const db = admin.firestore();
const storageBucket = admin.storage().bucket();


module.exports = {
    db,
    admin,
    storageBucket
};

