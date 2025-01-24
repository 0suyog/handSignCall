import React, { createRef, forwardRef, useImperativeHandle, useRef } from 'react';
import Video from './Video';

const VideoContainer = forwardRef(({ refs }, ref) => {
    const webcamVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    return (
        <div>
            <Video ref={refs[0]} muted={true} />
            <Video ref={refs[1]} muted={false} />
        </div>
    );
});

export default VideoContainer;
