import { LiquidMetal } from "@paper-design/shaders-react";

interface Props {
  className?: string;
}

export function LiquidBrandLogo({ className }: Props) {
  return (
    <LiquidMetal
      className={className}
      style={{
        width: "100%",
        height: "100%",
        boxShadow: "4px 4px 0 rgba(0,0,0,0.15)",
      }}
      colorBack="#000000"
      colorTint="#19B000"
      shape="metaballs"
      speed={1.2}
      distortion={0.3}
      softness={0.6}
      contour={0.7}
      repetition={5}
      shiftRed={0.5}
      shiftBlue={-0.3}
      angle={45}
    />
  );
}
