import React, { useEffect, useRef, useState } from "react";
import * as ml5 from "ml5";
import "p5/lib/addons/p5.dom";

const Sketch = () => {
  const canvasRef = useRef(null);
  const [label, setLabel] = useState("");
  const [hands, setHands] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef(null);
  const handPose = useRef(null);
  const classifier = useRef(null);

  useEffect(() => {
    const preload = () => {
      handPose.current = ml5.handPose();
    };

    const setup = () => {
      const canvas = canvasRef.current;
      const video = document.createElement("video");
      video.width = 640;
      video.height = 480;
      video.autoplay = true;
      videoRef.current = video;

      // Start capturing video
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch(console.error);

      // Start handPose detection
      handPose.current.detectStart(video, (results) => {
        setHands(results);
      });

      // Load classifier model
      const options = {
        task: "classification",
      };
      classifier.current = ml5.neuralNetwork(options);
      const modelDetails = {
        model: "./model.json",
        metadata: "./model_meta.json",
        weights: "./model.weights.bin",
      };

      classifier.current.load(modelDetails, () => {
        setLoaded(true);
        console.log("Classifier loaded!");
      });
    };

    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, 640, 480);

        hands.forEach((hand) => {
          if (hand.confidence > 0.7) {
            // Draw keypoints
            for (let finger = 0; finger < 5; finger++) {
              for (let joint = 1; joint <= 4; joint++) {
                ctx.beginPath();
                ctx.arc(
                  hand.keypoints[finger * 4 + joint].x,
                  hand.keypoints[finger * 4 + joint].y,
                  5,
                  0,
                  2 * Math.PI
                );
                ctx.fillStyle = "green";
                ctx.fill();
              }
            }

            // Perform classification if model is loaded
            if (loaded) {
              classify(hand);
            }
          }
        });
      }

      // Display label
      ctx.font = "30px Arial";
      ctx.fillStyle = "green";
      ctx.fillText(label, 50, 50);

      requestAnimationFrame(draw);
    };

    const classify = (hand) => {
      const data = hand.keypoints.flatMap((keypoint) => {
        const x = hand.thumb_tip.x - keypoint.x;
        const y = hand.thumb_tip.y - keypoint.y;
        return [x, y];
      });

      classifier.current.classify(data, (result) => {
        setLabel(result[0].label);
      });
    };

    preload();
    setup();
    draw();
  }, [hands, label, loaded]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ border: "1px solid black" }}
      ></canvas>
    </div>
  );
};

export default Sketch;
