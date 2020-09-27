import firebase from "firebase";

const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "ramhack2020-d3d09.firebaseapp.com",
    databaseURL: "https://ramhack2020-d3d09.firebaseio.com",
    projectId: "ramhack2020-d3d09",
    storageBucket: "ramhack2020-d3d09.appspot.com",
    messagingSenderId: "824295915479",
    appId: "1:824295915479:web:c5c99e6c3537528d291592",
    measurementId: "G-5EZYT7BRKR",
};

firebase.initializeApp(config);

export default firebase;
