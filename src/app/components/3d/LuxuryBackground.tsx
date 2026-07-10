"use client";

import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

export function LuxuryBackground() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      <ShaderGradientCanvas
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        pixelDensity={0.8}
        fov={45}
        pointerEvents="none"
      >
        <ShaderGradient
          type="waterPlane"
          animate="on"
          uSpeed={0.2}
          uStrength={1.2}
          uDensity={0.8}
          uFrequency={0.6}
          uAmplitude={0.4}
          color1="#000000"
          color2="#19B000"
          color3="#000000"
          reflection={0.4}
          wireframe={false}
          positionX={0}
          positionY={0}
          positionZ={0}
          rotationX={-20}
          rotationY={0}
          rotationZ={0}
          range="disabled"
        />
      </ShaderGradientCanvas>

      {/* Overlay gradient to fade the shader into the page */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
