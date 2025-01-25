// import React from 'react';
import FriendsSection from './components/FriendsSection';
import VideoCall from './components/VideoCall';

function App() {
    return (
        <div className='appContainer'>
                    <div className="leftsidebar">
            <FriendsSection/>
        </div>
            <div>
            <h1 className='title'>Video Call Application</h1>
            <VideoCall />
        </div>
        <div className="rightsidebar">
            <FriendsSection/>
        </div>
        </div>
    );
}

export default App;
