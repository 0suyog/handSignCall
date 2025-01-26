// import React from 'react';
// import VideoCall from './components/VideoCall';

import { useEffect } from 'react';
import { MessageForm } from './components/sendMessageForm';
import { listenToNode } from './components/helper/chatting';
import { MessageContainer } from './components/MessageContainer';

function App() {
    // useEffect(() => {
    //     listenToNode('9743052146');
    // }, []);
    return (
        <div>
            {/* <h1>Video Call Application</h1>
            <VideoCall /> */}
            <MessageContainer />
        </div>
    );
}

export default App;
