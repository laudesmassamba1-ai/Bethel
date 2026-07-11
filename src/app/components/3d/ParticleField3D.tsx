import { useRef, useEffect } from "react";
import * as THREE from "three";

interface Props {
  className?: string;
  particleCount?: number;
  color?: string;
  accentColor?: string;
}

export function ParticleField3D({
  className,
  particleCount = 2000,
  color = "#19B000",
  accentColor = "#FFFFFF",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const container = containerRef.current;
    const W = container.clientWidth || 600;
    const H = container.clientHeight || 500;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 30);
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    const mainColor = new THREE.Color(color);
    const secondColor = new THREE.Color(accentColor);

    // ── Spiral galaxy particles ──
    const spiralCount = Math.floor(particleCount * 0.6);
    const spiralPositions = new Float32Array(spiralCount * 3);
    const spiralColors = new Float32Array(spiralCount * 3);
    const spiralSizes = new Float32Array(spiralCount);
    const spiralSpeeds: number[] = [];
    const spiralOffsets: number[] = [];

    const arms = 3;
    const armSpread = 0.4;
    const radius = 3.5;

    for (let i = 0; i < spiralCount; i++) {
      const arm = i % arms;
      const angleOffset = (arm / arms) * Math.PI * 2;
      const r = Math.random() * radius;
      const angle = r * 1.2 + angleOffset;
      const spread = (Math.random() - 0.5) * armSpread * (r / radius + 0.3);

      spiralPositions[i * 3] = Math.cos(angle + spread) * r;
      spiralPositions[i * 3 + 1] = Math.sin(angle + spread) * r * 0.6;
      spiralPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

      const mix = r / radius;
      const col = mainColor.clone().lerp(secondColor, mix * 0.5);
      col.multiplyScalar(0.6 + Math.random() * 0.4);
      spiralColors[i * 3] = col.r;
      spiralColors[i * 3 + 1] = col.g;
      spiralColors[i * 3 + 2] = col.b;

      spiralSizes[i] = 0.02 + Math.random() * 0.06;
      spiralSpeeds.push(0.05 + Math.random() * 0.1);
      spiralOffsets.push(Math.random() * Math.PI * 2);
    }

    const spiralGeo = new THREE.BufferGeometry();
    spiralGeo.setAttribute("position", new THREE.BufferAttribute(spiralPositions, 3));
    spiralGeo.setAttribute("color", new THREE.BufferAttribute(spiralColors, 3));
    spiralGeo.setAttribute("size", new THREE.BufferAttribute(spiralSizes, 1));

    const spiralMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const spiralPoints = new THREE.Points(spiralGeo, spiralMat);
    scene.add(spiralPoints);

    // ── Floating glow dots ──
    const glowCount = Math.floor(particleCount * 0.25);
    const glowPositions = new Float32Array(glowCount * 3);
    const glowSizes = new Float32Array(glowCount);
    const glowPhases: number[] = [];
    const glowSpeeds: number[] = [];

    for (let i = 0; i < glowCount; i++) {
      glowPositions[i * 3] = (Math.random() - 0.5) * 7;
      glowPositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      glowPositions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      glowSizes[i] = 0.01 + Math.random() * 0.03;
      glowPhases.push(Math.random() * Math.PI * 2);
      glowSpeeds.push(0.2 + Math.random() * 0.3);
    }

    const glowGeo = new THREE.BufferGeometry();
    glowGeo.setAttribute("position", new THREE.BufferAttribute(glowPositions, 3));
    glowGeo.setAttribute("size", new THREE.BufferAttribute(glowSizes, 1));

    const glowMat = new THREE.PointsMaterial({
      color: mainColor,
      size: 0.025,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const glowPoints = new THREE.Points(glowGeo, glowMat);
    scene.add(glowPoints);

    // ── Shooting stars ──
    const shootingCount = 8;
    const shootingData: {
      position: THREE.Vector3;
      velocity: THREE.Vector3;
      life: number;
      maxLife: number;
      mesh: THREE.Mesh;
    }[] = [];

    const shootingMat = new THREE.MeshBasicMaterial({
      color: secondColor,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < shootingCount; i++) {
      const geo = new THREE.SphereGeometry(0.015, 4, 4);
      const mesh = new THREE.Mesh(geo, shootingMat.clone());
      mesh.visible = false;
      scene.add(mesh);
      shootingData.push({
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 2 + Math.random() * 3,
        mesh,
      });
    }

    // ── Mouse interaction ──
    let mouseX = 0;
    let mouseY = 0;
    const handleMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseX = x * 0.15;
      mouseY = y * 0.15;
    };
    container.addEventListener("mousemove", handleMouse);

    // ── Animation loop ──
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotate spiral galaxy slowly
      spiralPoints.rotation.y += 0.0008;
      spiralPoints.rotation.x = Math.sin(t * 0.05) * 0.02;

      // Mouse parallax on spiral
      spiralPoints.rotation.x += (mouseY * 0.02 - spiralPoints.rotation.x) * 0.01;
      spiralPoints.rotation.y += (mouseX * 0.02 - spiralPoints.rotation.y) * 0.01;

      // Glow dots float
      const gPos = glowPoints.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < glowCount; i++) {
        const i3 = i * 3;
        gPos[i3 + 1] += Math.sin(t * glowSpeeds[i] + glowPhases[i]) * 0.0006;
        gPos[i3] += Math.cos(t * glowSpeeds[i] * 0.7 + glowPhases[i]) * 0.0004;
      }
      glowPoints.geometry.attributes.position.needsUpdate = true;

      // Pulse opacity on glow
      glowMat.opacity = 0.12 + Math.sin(t * 0.3) * 0.08;

      // Shooting stars
      for (const s of shootingData) {
        s.life -= 0.01;
        if (s.life <= 0) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.3 + Math.random() * 0.5;
          s.position.set(
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 2 - 1
          );
          s.velocity.set(
            Math.cos(angle) * speed * 0.5,
            Math.sin(angle) * speed * 0.3 + 0.1,
            (Math.random() - 0.5) * 0.2
          );
          s.life = s.maxLife;
          s.mesh.visible = true;
          s.mesh.position.copy(s.position);
        }
        s.position.add(s.velocity);
        s.velocity.multiplyScalar(0.99);
        s.mesh.position.copy(s.position);
        const lifePct = s.life / s.maxLife;
        (s.mesh.material as THREE.MeshBasicMaterial).opacity = lifePct * 0.6;
        s.mesh.scale.setScalar(1 + (1 - lifePct) * 2);
        if (lifePct < 0.05) s.mesh.visible = false;
      }

      camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(animate);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      container.removeEventListener("mousemove", handleMouse);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [particleCount, color, accentColor]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
