import { useEffect, useState } from 'react';
import styles from './MessageBubble.module.css';
export const MessageBubble = ({ message }) => {
    const [type, setType] = useState(null);
    const [receivedMessage, setReceivedMessage] = useState(() => {
        const id = Object.keys(message)[0];
        return message[id];
    });

    useEffect(() => {
        if (receivedMessage.user === localStorage.getItem('user')) {
            setType('sent');
        } else {
            setType('received');
        }
    }, [receivedMessage]);

    return (
        <>
            <div className={type === 'sent' ? styles.sentMessage : styles.receivedMessage}>
                <span>{receivedMessage.message}</span>
                <br />
                <span>{`${new Date(receivedMessage.time).getHours()}:${new Date(
                    receivedMessage.time
                ).getMinutes()}`}</span>
            </div>
        </>
    );
};
