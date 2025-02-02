import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";

interface InteractiveModelProps {
  modelPath: string;
}

const InteractiveModel: React.FC<InteractiveModelProps> = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.2;
    }
  });

  const handlePointerOver = () => {
    const scale = modelRef.current?.scale;
    if (scale) {
      gsap.to(scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.3 });
    }
  };

  const handlePointerOut = () => {
    const scale = modelRef.current?.scale;
    if (scale) {
      gsap.to(scale, { x: 1, y: 1, z: 1, duration: 0.3 });
    }
  };

  const handleClick = () => {
    modelRef.current?.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (
          mesh.material &&
          (mesh.material as THREE.MeshStandardMaterial).color
        ) {
          gsap.to((mesh.material as THREE.MeshStandardMaterial).color, {
            r: Math.random(),
            g: Math.random(),
            b: Math.random(),
            duration: 0.5,
          });
        }
      }
    });
  };

  return (
    <primitive
      ref={modelRef}
      object={scene}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
};

export default InteractiveModel;
