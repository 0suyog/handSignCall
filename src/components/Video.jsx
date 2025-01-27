import { forwardRef } from 'react';

const Video = forwardRef(({ label, width, height, muted }, ref) => {
    return (
        // <div>
        <div style={{ width: width || '380px', height: height || '380px' }}>
            {/* <h3>Local Stream</h3> */}
            <video
                ref={ref}
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%' }}
                width='640px'
                height='480px'
                muted={muted}></video>
        </div>
        // ;
        // </div>
    );
});

Video.displayName = 'Video';

export default Video;
