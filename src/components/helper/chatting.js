import { getDatabase, limitToLast, onValue, push, query, ref, set } from 'firebase/database';
import { app } from '../../config';
const db = getDatabase(app);

// import { firebaseConfig } from '../../config';

export const addMessage = async (callId, message, uname, callBack) => {
    await push(ref(db, `${callId}/messages`), {
        user: uname,
        message: message,
        time: Date.now()
    });
    callBack();
};

export const listenToNode = (callId, callBack) => {
    const latestMessageQuery = query(ref(db, `${callId}/messages`), limitToLast(1));
    onValue(latestMessageQuery, (snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            callBack(snapshot.val());
            // console.log(callBack);
        }
    });
};
