import { useState } from 'react';
import { addMessage } from './helper/chatting';

export const MessageForm = () => {
    const [message, setMessage] = useState('');
    const [uname, setUname] = useState(localStorage.getItem('user'));
    const callId = '9743052146';
    const callBack = () => {
        console.log('messageSent');
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        addMessage(callId, message, uname, callBack);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    autoFocus
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                    }}
                    required
                />
                <button>Send message</button>
            </form>
        </>
    );
};
