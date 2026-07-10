"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, RoundedBox } from "@react-three/drei";
import { Suspense } from "react";

function RotatingMesh() {
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <RoundedBox args={[2.2, 2.2, 2.2]} radius={0.35} smoothness={8} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#19B000"
          metalness={0.85}
          roughness={0.08}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          reflectivity={1}
          envMapIntensity={1.5}
        />
      </RoundedBox>
    </Float>
  );
}

function FallbackBox() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#19B000" />
    </mesh>
  );
}

interface Props {
  className?: string;
}

export function Chef3DCanvas({ className }: Props) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <pointLight position={[-3, -3, 2]} intensity={0.5} color="#19B000" />
        <Suspense fallback={<FallbackBox />}>
          <RotatingMesh />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
