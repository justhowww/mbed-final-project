import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";
import Cam from "@/components/cam";
tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm`
);
export default function Home() {
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
          <Cam />
        </div>
      </div>
    </div>
  );
}
