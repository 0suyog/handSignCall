import React, { useState, useRef, useEffect, createRef } from 'react';
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    addDoc,
    onSnapshot,
    getDoc,
    updateDoc
} from 'firebase/firestore';
import { app } from '../config';
import Video from './Video';
import { OverLay } from './overlay';
import Form from './form';
import VideoContainer from './VideoContainer';

const firestore = getFirestore(app);

const VideoCall = () => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [showVideo, setShowVideo] = useState(true);
    const [peerConnection, setPeerConnection] = useState(null);
    // const [stream, setStream] = useState(null);
    const webcamVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    // const videoRefs = useRef({
    //     webcamVideoRef: React.createRef(),
    //     remoteVideoRef: React.createRef()
    // });
    const [sound, setSound] = useState(true);
    const [show, setShow] = useState(false);
    const servers = {
        iceServers: [
            {
                urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
            }
        ],
        iceCandidatePoolSize: 10
    };

    useEffect(() => {
        const pc = new RTCPeerConnection(servers);
        setPeerConnection(pc);
        setShowVideo(true);
        setSound(true);
        (async () => {
            // const temp = await navigator.mediaDevices.getUserMedia({ video: true });
            // setStream(temp);
            (async () => {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: showVideo,
                    audio: sound
                });
                console.log(stream);
                stream.getTracks().forEach((track) => {
                    pc.addTrack(track, stream);
                });
                setLocalStream(stream);
            })();
        })();
        return () => {
            pc.close();
        };
    }, []);

    useEffect(() => {
        // console.log(peerConnection);
        peerConnection && startWebcam();
    }, [peerConnection]);

    useEffect(() => {
        if (localStream !== null) {
            if (webcamVideoRef.current) {
                console.log(localStream);
                webcamVideoRef.current.srcObject = localStream;
                // videoRefs.current.webcamVideoRef.current.play();
            }
        }
    }, [localStream]);

    useEffect(() => {
        alert(showVideo);
        if (!showVideo) {
            localStream.getVideoTracks().forEach((track) => (track.enabled = false));
        } else {
            if (localStream !== null) {
                localStream.getVideoTracks().forEach((track) => (track.enabled = true));
            }
            // (async () => {
            //     const stream = await navigator.mediaDevices.getUserMedia({
            //         video: showVideo,
            //         audio: false
            //     });
            //     stream.getTracks().forEach((track) => {
            //         peerConnection.addTrack(track, stream);
            //     });
            //     setLocalStream(stream);
            // })();
        }
    }, [showVideo]);
    // Sound on off part
    useEffect(() => {
        // alert(sound)
        if (!sound) {
            console.log('Sound Xaina');
            localStream.getAudioTracks().forEach((track) => (track.enabled = false));
        } else {
            if (localStream !== null) {
                console.log('Sound Xa');
                localStream.getAudioTracks().forEach((track) => (track.enabled = true));
            }
        }
    }, [sound]);

    // useEffect(() => {

    // }, [localStream]);

    const startWebcam = async () => {
        // const stream = await navigator.mediaDevices.getUserMedia({
        //     video: showVideo,
        //     audio: false
        // });

        const remote = new MediaStream();
        // setLocalStream(stream);
        setRemoteStream(remote);
        // stream.getTracks().forEach((track) => {
        //     peerConnection.addTrack(track, stream);
        // });

        peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                console.log('running');
                remote.addTrack(track);
                track.onended = () => {
                    alert('fuck you bitch open video');
                };
            });
        };

        // if (webcamVideoRef.current) {
        //     console.log(localStream);
        //     webcamVideoRef.current.srcObject = localStream;
        //     // videoRefs.current.webcamVideoRef.current.play();
        // }

        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remote;
            // videoRefs.current.remoteVideoRef.current.play();
        }
    };

    const createCall = async () => {
        const callDoc = doc(firestore, 'calls', new Date().toISOString());
        const offerCandidates = collection(callDoc, 'offerCandidates');
        const answerCandidates = collection(callDoc, 'answerCandidates');

        // setCallId(callDoc.id);
        navigator.clipboard.writeText(callDoc.id);

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                addDoc(offerCandidates, event.candidate.toJSON());
            }
        };

        const offerDescription = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offerDescription);

        const offer = { sdp: offerDescription.sdp, type: offerDescription.type };
        await setDoc(callDoc, { offer });

        onSnapshot(callDoc, (snapshot) => {
            const data = snapshot.data();
            if (!peerConnection.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer);
                peerConnection.setRemoteDescription(answerDescription);
            }
        });

        onSnapshot(answerCandidates, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    peerConnection.addIceCandidate(candidate);
                }
            });
        });
    };

    const answerCall = async (callId) => {
        const callDoc = doc(firestore, 'calls', callId);
        const answerCandidates = collection(callDoc, 'answerCandidates');
        const offerCandidates = collection(callDoc, 'offerCandidates');

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                addDoc(answerCandidates, event.candidate.toJSON());
            }
        };

        const callData = (await getDoc(callDoc)).data();
        const offerDescription = callData.offer;

        await peerConnection.setRemoteDescription(new RTCSessionDescription(offerDescription));

        const answerDescription = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answerDescription);

        const answer = { sdp: answerDescription.sdp, type: answerDescription.type };
        await updateDoc(callDoc, { answer });

        onSnapshot(offerCandidates, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    peerConnection.addIceCandidate(candidate);
                }
            });
        });
    };

    const hangUp = () => {
        localStream?.getTracks().forEach((track) => track.stop());
        remoteStream?.getTracks().forEach((track) => track.stop());

        if (peerConnection) {
            peerConnection.close();
            setPeerConnection(null);
        }

        setLocalStream(null);
        setRemoteStream(null);
        setCallId('');
    };

    const handleJoin = (callId) => {
        setShow(!show);
        callId && answerCall(callId);
    };

    return (
        <div>
            {/* <h2>1. Start your Camera</h2> */}
            <div className='mainContainer'>
                {/* <div>
                    <h3>Local Stream</h3>
                    <video ref={webcamVideoRef} autoPlay playsInline></video>
                </div> */}
                <VideoContainer
                    refs={[webcamVideoRef, remoteVideoRef]}
                    ref={webcamVideoRef}></VideoContainer>
                {/* <div>
                    <h3>Remote Stream</h3>
                    <video ref={remoteVideoRef} autoPlay playsInline></video>
                </div> */}
            </div>
            <button onClick={startWebcam}>Start Webcam</button>

            <h2>2. Create a new Call</h2>
            <button onClick={createCall}>Create Call (Offer)</button>

            <h2>3. Join a Call</h2>
            <button onClick={handleJoin}>Join</button>
            <OverLay show={show} toggleVisibility={handleJoin}>
                <Form handleJoin={handleJoin} />
            </OverLay>

            <h2>4. Hang Up</h2>
            <button onClick={hangUp}>Hang Up</button>
            <button
                onClick={() => {
                    setShowVideo(!showVideo);
                    // (async () => {
                    //     const temp = await navigator.mediaDevices.getUserMedia({
                    //         video: false,
                    //         audio: true
                    //     });
                    //     setStream(temp);
                    // })();
                    // setStream(null);
                }}>
                Toggle Video
            </button>
            <button
                onClick={() => {
                    setSound(!sound);
                }}>
                {' '}
                Toggle Audio{' '}
            </button>
        </div>
    );
};

export default VideoCall;