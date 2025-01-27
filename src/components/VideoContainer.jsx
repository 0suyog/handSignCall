import React, { forwardRef } from 'react';
import Video from './Video';
import styles from './VideoContainer.module.css';
const VideoContainer = forwardRef(({ refs }, ref) => {
    return (
        <div className={styles.container}>
            <Video ref={refs[0]} muted={true} />
            <Video ref={refs[1]} muted={false} />
        </div>
    );
});

export default VideoContainer;
