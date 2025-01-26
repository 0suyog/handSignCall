// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDoKjxQW4QflAAGdsR614l1eId6DFR8zjw',
    authDomain: 'callapp-84d34.firebaseapp.com',
    projectId: 'callapp-84d34',
    storageBucket: 'callapp-84d34.firebasestorage.app',
    messagingSenderId: '920143830204',
    appId: '1:920143830204:web:3c9956d18bf0de9dca84b9',
    databaseURL: "https://callapp-84d34-default-rtdb.asia-southeast1.firebasedatabase.app",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
