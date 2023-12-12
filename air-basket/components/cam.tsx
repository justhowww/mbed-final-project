"use client";
import { useEffect, useRef, useState } from "react";
import {
  createDetector,
  SupportedModels,
} from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import { drawHands, fitToContainer, transformLandmarks } from "../lib/_utils";
import { useAnimationFrame } from "../lib/hook/_useAnimationFrame";
import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";
import GE from "../lib/gesture/_fivefingers";

tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm`
);

async function setupVideo() {
  const video = document.getElementById("video") as HTMLVideoElement;
  const stream = await window.navigator.mediaDevices.getUserMedia({
    video: { width: 400, height: 270 },
  });

  video.srcObject = stream;
  await new Promise<void>((resolve) => {
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

async function setupCanvas(video: HTMLVideoElement) {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  fitToContainer(canvas);
  const ctx = canvas.getContext("2d");

  canvas.width = video.width;
  canvas.height = video.height;

  return ctx;
}
export default function Cam() {
  const detectorRef = useRef<any>();
  const videoRef = useRef<HTMLVideoElement>();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    async function initialize() {
      videoRef.current = await setupVideo();
      const ctx = await setupCanvas(videoRef.current);
      detectorRef.current = await setupDetector();

      setCtx(ctx || undefined);
    }

    initialize();
  }, []);

  useAnimationFrame(async (delta: any) => {
    const hands = await detectorRef.current.estimateHands(videoRef.current, {
      FlipLeftRight: false,
    });
    if (hands.length > 0) {
      const estimatedGestures = GE.estimate(
        transformLandmarks(hands[0].keypoints3D),
        8
      );
      console.log(estimatedGestures.gestures);
    }
    if (ctx && videoRef.current) {
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
    }
    drawHands(hands, ctx);
  }, !!(detectorRef.current && videoRef.current && ctx));

  return (
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
  );
}
