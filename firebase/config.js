import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyBr7TkHX6geFDLBgIcJ5D6CzOgMKdCJIBk",
    authDomain: "komunitas-3baa3.firebaseapp.com",
    databaseURL: "https://komunitas-3baa3.firebaseio.com",
    projectId: "komunitas-3baa3",
    storageBucket: "komunitas-3baa3.appspot.com",
    messagingSenderId: "915947038761"
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

var auth = firebase.auth();

export {
  auth
};