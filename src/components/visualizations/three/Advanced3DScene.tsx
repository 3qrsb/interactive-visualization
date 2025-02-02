import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import InteractiveModel from "./InteractiveModel";

const Advanced3DScene: React.FC = () => {
  return (
    <Canvas style={{ height: "100vh", background: "#f0f0f0" }}>
      <PerspectiveCamera makeDefault position={[1400, 200, 500]} fov={50} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OrbitControls target={[0, 0, 0]} />
      <InteractiveModel modelPath="/model/sh-60b_seahawk_helicopter/scene.gltf" />
    </Canvas>
  );
};

export default Advanced3DScene;
