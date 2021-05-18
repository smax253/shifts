import firebase from 'firebase/app';
import 'firebase/auth';

import config from './serviceAccountKey.js'
if (!firebase.apps.length) {

  firebase.initializeApp(config);

}else {

  firebase.app(); // if already initialized, use that one

}
const auth = firebase.auth();
console.log(auth)

export default auth;

