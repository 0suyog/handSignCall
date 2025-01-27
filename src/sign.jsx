import { useEffect, useState } from 'react';
const ml5 = window.ml5;
ml5.setBackend('webgl');
export const Sign = ({ video }) => {
    const [handPose, setHandPose] = useState(null);
    const [classifier, setClassifier] = useState(null);
    const [newWord, setNewWord] = useState(
        'LOADING... Please Wait For a while and This will be updated'
    );
    const [hands, setHands] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const classify = (hand) => {
        let data = [];
        for (let keypoint of hand.keypoints) {
            let x = hand.thumb_tip.x - keypoint.x;
            let y = hand.thumb_tip.y - keypoint.y;
            data.push(x);
            data.push(y);
        }
        classifier.classify(data, (result) => {
            setNewWord(result[0].label);
        });
    };
    useEffect(() => {
        let handPose;
        (async () => {
            video.current.onloadeddata = async () => {
                handPose = ml5.handPose();
                await handPose.ready;
                setHandPose(handPose);
                setNewWord('Loaded. Not Working Yet.');
                handPose.detectStart(video.current, (result) => {
                    result.length && setHands(result);
                });
            };
        })();
    }, [video]);

    useEffect(() => {
        if (handPose) {
            let options = {
                task: 'classification'
            };
            let classifier = ml5.neuralNetwork(options);
            let modelDetails = {
                model: 'models/model.json',
                metadata: 'models/model_meta.json',
                weights: 'models/model.weights.bin'
            };
            classifier.load(modelDetails, () => {
                setLoaded(true);
            });
            setClassifier(classifier);
        }
    }, [handPose]);
    useEffect(() => {
        for (let i in hands) {
            if (hands[i].confidence > 0.7) {
                let hand = hands[i];
                if (loaded) {
                    classify(hand);
                }
            }
        }
    }, [hands]);

    return (
        <>
            <p
                style={{
                    fontSize: '30px'
                }}>
                {newWord}
            </p>
        </>
    );
};
