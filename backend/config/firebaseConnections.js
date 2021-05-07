const admin = require('firebase-admin');

function initializeCloudFirebase() {
    /* Cloud Firebase */
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    });
  
    const db = admin.firestore();
    console.log("💭 Cloud Firebase Connection Successful!");
    return db;
}

module.exports = {
    initializeCloudFirebase
};
