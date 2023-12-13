import styles from "../../styles/Home.module.css";
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

tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm`
);

async function setupVideo() {
  const video = document.getElementById("video");
  const stream = await window.navigator.mediaDevices.getUserMedia({
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
  const canvas = document.getElementById("canvas");
  fitToContainer(canvas);

  const ctx = canvas.getContext("2d");

  canvas.width = video.width;
  canvas.height = video.height;

  return ctx;
}

export default function HandPoseDetection() {
  const detectorRef = useRef();
  const videoRef = useRef();
  const [ctx, setCtx] = useState();

  useEffect(() => {
    async function initialize() {
      videoRef.current = await setupVideo();
      const ctx = await setupCanvas(videoRef.current);
      detectorRef.current = await setupDetector();

      setCtx(ctx);
    }

    initialize();
  }, []);

  useAnimationFrame(async (delta) => {
    const hands = await detectorRef.current.estimateHands(video, {
      flipHorizontal: false,
    });
    if (hands.length > 0) {
      const estimatedGestures = GE.estimate(
        transformLandmarks(hands[0].keypoints3D),
        8
      );
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
    <div className="flex h-screen">
      <div className="flex flex-col w-3/4 p-4 border-r border-blue-500">
        <div className="flex-grow border-4 border-blue-500"></div>
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
              id="canvas"
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
