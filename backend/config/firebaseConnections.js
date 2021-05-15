const admin = require('firebase-admin');

/* Cloud Firebase */
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});
console.log("💭 Cloud Firebase Connection Successful!");

function initializeCloudFirebase() {
    const db = admin.firestore();
    return db;
}

module.exports = {
    initializeCloudFirebase
};
