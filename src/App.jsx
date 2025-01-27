// import React from 'react';
// import VideoCall from './components/VideoCall';

// import { useEffect } from 'react';
import { MessageContainer } from './components/MessageContainer';
import FriendsSection from './components/FriendsSection';
import VideoCall from './components/VideoCall';
import { Sign } from './sign';
import { useRef } from 'react';
// import 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.1/addons/p5.sound.min.js';
// import 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.1/p5.js';
// import 'https://unpkg.com/ml5@1.2.1/dist/ml5.js';
// import Sketch from './modelSketch/sketch';
// import Sketch from './modelSketch/sketch';

function App() {
    // useEffect(() => {
    //     listenToNode('9743052146');
    // }, []);
    const webcamVideoRef = useRef(null);
    return (
        // <div>
        <>
            <Sign video={webcamVideoRef} />
            <MessageContainer />
            <div className='appContainer'>
                <div className='leftsidebar'>
                    <FriendsSection />
                </div>
                <div>
                    <h1 className='title'>Video Call Application</h1>
                    <VideoCall webcamVideoRef={webcamVideoRef} />
                    {/* <div>
            <Sketch></Sketch>
            </div> */}
                </div>
                <div className='rightsidebar'>
                    <FriendsSection />
                </div>
            </div>
        </>
        // {
        //     /* <h1>Video Call Application</h1>
        //     <VideoCall /> */
        // }
        // <MessageContainer />
        //     {/* <div/> */}
        // <div className='appContainer'>
        //             <div className="leftsidebar">
        //     <FriendsSection/>
        // </div>
        //     <div>
        //     <h1 className='title'>Video Call Application</h1>
        //     <VideoCall />
        //     {/* <div>
        //     <Sketch></Sketch>
        //     </div> */}
        // </div>
        // <div className="rightsidebar">
        //     <FriendsSection/>
        // </div>
        // </div>
    );
}

export default App;
