import { useExternalLink, useExternalScript } from "/lib/hooks/useScript";

import styles from "../../styles/Home.module.css";
import Simulation from "../../components/simulation";
import { useEffect, useRef, useState } from "react";
import {
  createDetector,
  SupportedModels,
} from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import { drawHands, transformLandmarks, fitToContainer } from "../../lib/utils";
import Link from "next/link";
import { useAnimationFrame } from "../../lib/hooks/useAnimationFrame";
import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";
import GE from "/lib/fivefingers";
import axios from "axios";
tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm`
);

async function setupVideo() {
  const video = document.getElementById("video");
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });

  video.srcObject = stream;
  await new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve();
    };
  });
  video.play();

  video.width = video.videoWidth;
  video.height = video.videoHeight;

  return video;
}

async function setupDetector() {
  const model = SupportedModels.MediaPipeHands;
  const detector = await createDetector(model, {
    runtime: "mediapipe",
    maxHands: 2,
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
  });

  return detector;
}

async function setupCanvas(video) {
  const handpose_canvas = document.getElementById("gesture");
  fitToContainer(handpose_canvas);

  const ctx = handpose_canvas.getContext("2d");

  handpose_canvas.width = video.width;
  handpose_canvas.height = video.height;

  return ctx;
}

export default function HandPoseDetection() {
  const detectorRef = useRef();
  const videoRef = useRef();
  const [ctx, setCtx] = useState();
  const [velocity, setVelocity] = useState([-0.05, 10, -3]);
  const [fingerDetection, setFingerDetection] = useState(null);
  const [bucket, setBucket] = useState(false);
  const [seed, setSeed] = useState(Math.random());
  const link1_state = useExternalLink("https://www.glowscript.org/css/ide.css");
  const link2_state = useExternalLink(
    "https://www.glowscript.org/css/redmond/2.1/jquery-ui.custom.css"
  );
  const script1_state = useExternalScript(
    "https://www.glowscript.org/lib/jquery/2.1/jquery.min.js"
  );
  const script2_state = useExternalScript(
    "https://www.glowscript.org/lib/jquery/2.1/jquery-ui.custom.min.js"
  );
  const script3_state = useExternalScript(
    "https://www.glowscript.org/package/glow.3.2.min.js"
  );

  useEffect(() => {
    async function initialize() {
      videoRef.current = await setupVideo();
      const ctx = await setupCanvas(videoRef.current);
      detectorRef.current = await setupDetector();

      setCtx(ctx);
    }

    initialize();
  }, []);
  useEffect(() => {
    console.log(bucket);
    if (bucket) {
      // Send http request to backend, score + 1
      var body = {
        score: true,
      };

      axios
        .post("/api/score", body)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      setBucket(false);
    }
  }, [bucket]);

  let checker = (arr) => arr.every((v) => v === true);

  useAnimationFrame(async (delta) => {
    const hands = await detectorRef.current.estimateHands(video, {
      flipHorizontal: false,
    });
    if (hands.length > 0) {
      // TODO: add right/left hand
      console.log(hands[0].handedness);
      const estimatedGestures = GE.estimate(
        transformLandmarks(hands[0].keypoints3D),
        9.5
      );
      if (
        estimatedGestures.gestures.length > 0 &&
        estimatedGestures.gestures[0].score >= 9
      ) {
        setFingerDetection(true);
        setSeed(Math.random());
      } else {
        setFingerDetection(false);
      }
      console.log(estimatedGestures.gestures);
    }

    ctx.clearRect(
      0,
      0,
      videoRef.current.videoWidth,
      videoRef.current.videoHeight
    );
    ctx.drawImage(
      videoRef.current,
      0,
      0,
      videoRef.current.videoWidth,
      videoRef.current.videoHeight
    );
    drawHands(hands, ctx);
  }, !!(detectorRef.current && videoRef.current && ctx));

  return (
    <div className="flex h-screen bg-white">
      <div className="flex flex-col w-3/4 p-4 border-r border-blue-500">
        <div className="flex flex-col items-center justify-center flex-grow border-4 border-blue-500">
          {link1_state === "ready" &&
          link2_state === "ready" &&
          script1_state === "ready" &&
          script2_state === "ready" &&
          script3_state === "ready" ? (
            <Simulation
              velocity={velocity}
              key={seed}
              isStatic={fingerDetection}
              setBucket={setBucket}
            />
          ) : (
            <></>
          )}
        </div>
        {/* Enter velocity */}
        <div className="flex-grow-0 p-4 border-4 border-blue-500">
          <label className="block">
            <span className="text-gray-700">Velocity</span>
            <input
              type="number"
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter velocity"
              value={velocity[0]}
              onChange={(e) =>
                setVelocity([Number(e.target.value), velocity[1], velocity[2]])
              }
            />

            <input
              type="number"
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter velocity"
              value={velocity[1]}
              onChange={(e) =>
                setVelocity([velocity[0], Number(e.target.value), velocity[2]])
              }
            />
            <input
              type="number"
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter velocity"
              value={velocity[2]}
              onChange={(e) =>
                setVelocity([velocity[0], velocity[1], Number(e.target.value)])
              }
            />
          </label>
          {/* a button for set end */}
          <button
            className="p-2 mt-4 text-white bg-blue-500 rounded-lg shadow-lg"
            onClick={() => {
              setSeed(Math.random());
            }}
          >
            retstart
          </button>
        </div>
      </div>
      <div className="flex flex-col w-1/4 p-4 space-y-4">
        <div className="p-4 border-4 border-blue-500">
          <h1 className="inline-block p-2 text-2xl font-bold text-white bg-blue-700 border-2 border-blue-500 rounded-lg shadow-lg">
            Score: 100
          </h1>
          <div className="inline-block p-2 mt-4 font-mono text-lg text-white bg-blue-700 border-2 border-blue-500 rounded-lg shadow-lg">
            <p>Time Remaining: 3:44</p>
          </div>
        </div>
        <div className="flex-grow" />
        <div className="p-4 border-4 border-blue-500">
          <h2>Your view:</h2>
          <div className="mt-2 border-4 border-blue-500 ">
            <canvas
              className="transform scaleX(-1) z-10 rounded-lg shadow-md "
              id="gesture"
            ></canvas>
            <video
              className="hidden transform scaleX(-1) "
              id="video"
              playsInline
            ></video>
          </div>
        </div>
      </div>
    </div>
  );
}
