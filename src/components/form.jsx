// import React from 'react'

import { useState } from 'react';
function Form({ handleJoin }) {
    const [callId, setCallId] = useState('');
    return (
        <div>
            <form
                onClick={(e) => {
                    e.stopPropagation();
                }}
                onSubmit={(e) => {
                    e.preventDefault();
                    // answerCall();
                    callId !== '' && handleJoin(callId);
                }}>
                <input
                    value={callId}
                    onChange={(e) => setCallId(e.target.value)}
                    placeholder='Enter Call ID'
                    autoFocus
                />
                <button type='submit'>Answer</button>
            </form>
        </div>
    );
}

export default Form;
