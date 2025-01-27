let handPose;
let video;
let hands;
let hand;
let label = '';
let index = 0;
let loaded = false;

function preload() {
    handPose = ml5.handPose();
}

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    console.log(video);
    video.size(640, 480);
    video.hide();
    handPose.detectStart(video, (result) => (hands = result));
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
        loaded = true;
        console.log(classifier);
    });
}

function draw() {
    image(video, 0, 0);
    for (let i in hands) {
        if (hands[i].confidence > 0.7) {
            hand = hands[i];
            if (loaded) {
                classify(hand);
            }
            for (let finger = 0; finger < 5; finger++) {
                for (let joint = 1; joint <= 4; joint++) {
                    strokeWeight(5);
                    ellipse(
                        hand.keypoints[finger * 4 + joint].x,
                        hand.keypoints[finger * 4 + joint].y,
                        5
                    );
                }
            }
        }
    }
    push();
    textSize(30);
    fill('green');
    text(label, 50, 50);
    pop();
}

let completeTrainingData = [];

function classify(hand) {
    let data = [];
    for (let keypoint of hand.keypoints) {
        let x = hand.thumb_tip.x - keypoint.x;
        let y = hand.thumb_tip.y - keypoint.y;
        data.push(x);
        data.push(y);
    }
    classifier.classify(data, (result) => {
        label = result[0].label;
    });
}
