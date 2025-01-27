import { useEffect, useState } from 'react';
import { listenToNode } from './helper/chatting';
import { MessageBubble } from './MessageBubble';
import { MessageForm } from './sendMessageForm';
import styles from './MessageContainer.module.css';
export const MessageContainer = () => {
    useEffect(() => {
        listenToNode('9743052146', onNewMessage);
        let name = null;
        while (!name || name === 'null') {
            name = prompt('Get Name');
        }
        localStorage.setItem('user', name);
    }, []);

    const [messages, setMessages] = useState([]);
    const onNewMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };
    return (
        <>
            <div>
                <div className={styles.container}>
                    {messages.map((message) => {
                        const id = Object.keys(message)[0];
                        return <MessageBubble message={message} id={id} key={id} />;
                    })}
                </div>
                <MessageForm />
            </div>
        </>
    );
};
