// import { initializeApp } from 'firebase';
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    addDoc,
    onSnapshot,
    getDoc,
    updateDoc
} from 'firebase/app';

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: 'AIzaSyDGNlBdYCLUj2jQpAL9ds78FY9-c9EB_OQ',
//     authDomain: 'sample-video-call-88700.firebaseapp.com',
//     projectId: 'sample-video-call-88700',
//     storageBucket: 'sample-video-call-88700.firebasestorage.app',
//     messagingSenderId: '533386259000',
//     appId: '1:533386259000:web:724814914cf8e1021d14cd'
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
import { app } from './config';

// Initialize Firebase and Firestore
// const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
    ],
    iceCandidatePoolSize: 10
};

// Global State
const pc = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;

// HTML elements
const webcamButton = document.getElementById('webcamButton');
const webcamVideo = document.getElementById('webcamVideo');
const callButton = document.getElementById('callButton');
const callInput = document.getElementById('callInput');
const answerButton = document.getElementById('answerButton');
const remoteVideo = document.getElementById('remoteVideo');
const hangupButton = document.getElementById('hangupButton');

// 1. Setup media sources

webcamButton.onclick = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    });
    remoteStream = new MediaStream();

    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
    });

    // Pull tracks from remote stream, add to video stream
    pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        });
    };

    webcamVideo.srcObject = localStream;
    remoteVideo.srcObject = remoteStream;

    callButton.disabled = false;
    answerButton.disabled = false;
    webcamButton.disabled = true;
};

// 2. Create an offer
callButton.onclick = async () => {
    // Reference Firestore collections for signaling
    // const callDoc = firestore.collection('calls').doc();
    // const callDoc = doc(collection(firestore,'calls'));
    const callDoc = doc(firestore, 'calls', callInput.value || new Date().toISOString());
    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');

    callInput.value = callDoc.id;

    // Get candidates for caller, save to db
    pc.onicecandidate = (event) => {
        console.log('Calling');
        if (event.candidate) {
            addDoc(offerCandidates, event.candidate.toJSON());
        }
    };

    // Create offer
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type
    };

    // await callDoc.set({ offer });
    console.log(offer);
    await setDoc(callDoc, { offer });

    // Listen for remote answer
    onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
            const answerDescription = new RTCSessionDescription(data.answer);
            pc.setRemoteDescription(answerDescription);
        }
    });

    // When answered, add candidate to peer connection
    onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const candidate = new RTCIceCandidate(change.doc.data());
                pc.addIceCandidate(candidate);
            }
        });
    });

    hangupButton.disabled = false;
};

// 3. Answer the call with the unique ID
answerButton.onclick = async () => {
    const callId = callInput.value;

    const callDoc = doc(firestore, 'calls', callId);
    // const callDoc = doc(collection(firestore,'calls', callId));

    const answerCandidates = collection(callDoc, 'answerCandidates');

    const offerCandidates = collection(callDoc, 'offerCandidates');

    pc.onicecandidate = (event) => {
        console.log('Answered');
        if (event.candidate) {
            addDoc(answerCandidates, event.candidate.toJSON());
        }
    };

    // const callData = (await callDoc.get()).data();

    const callData = (await getDoc(callDoc)).data();

    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp
    };

    // await callDoc.update({ answer });
    await updateDoc(callDoc, { answer });

    onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change);
            if (change.type === 'added') {
                // let data = change.doc.data();
                // pc.addIceCandidate(new RTCIceCandidate(data));
                const candidate = new RTCIceCandidate(change.doc.data());
                pc.addIceCandidate(candidate);
            }
        });
    });
};

hangupButton.onclick = async () => {
    // Stop local media tracks
    if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        localStream = null;
    }

    // Stop remote media tracks
    if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
        remoteStream = null;
    }

    // Close the PeerConnection
    if (pc) {
        pc.close();
        pc = null;
    }

    // Optionally, delete the Firestore document for cleanup
    const callId = callInput.value;
    if (callId) {
        const callDoc = doc(firestore, 'calls', callId);
        await updateDoc(callDoc, { hangup: true }); // Indicate the call was ended (optional)
        // You could also delete the call document entirely:
        // await deleteDoc(callDoc);
    }

    // Reset UI
    callInput.value = '';
    hangupButton.disabled = true;
    callButton.disabled = false;
    webcamButton.disabled = false;
    answerButton.disabled = true;
};
