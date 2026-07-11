import { useRef, useEffect } from "react";
import * as THREE from "three";

const FOOD_COLORS = {
  pepper: "#E53E30",
  tomato: "#DC2626",
  onion: "#E8D5B7",
  pickle: "#4A7C3F",
  cheese: "#FFD700",
  olive: "#2D5016",
};

interface Props {
  className?: string;
}

export function FloatingIngredients3D({ className }: Props) {
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

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 20);
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xff8844, 0.3);
    fillLight.position.set(-4, 2, -3);
    scene.add(fillLight);

    const meshGroup = new THREE.Group();
    scene.add(meshGroup);

    // ── Red Pepper (sphere + cone top) ──
    const pepperGroup = new THREE.Group();
    const pepperBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 16, 16),
      new THREE.MeshPhysicalMaterial({
        color: FOOD_COLORS.pepper,
        roughness: 0.6,
        metalness: 0.1,
        clearcoat: 0.3,
      })
    );
    pepperBody.scale.set(1, 0.85, 0.9);
    pepperGroup.add(pepperBody);
    const pepperStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.06, 0.12, 6),
      new THREE.MeshPhysicalMaterial({ color: "#2D5016", roughness: 0.9 })
    );
    pepperStem.position.y = 0.35;
    pepperGroup.add(pepperStem);
    pepperGroup.position.set(-2.2, 0.6, -0.5);
    meshGroup.add(pepperGroup);

    // ── Tomato (sphere) ──
    const tomatoGroup = new THREE.Group();
    const tomatoBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 16),
      new THREE.MeshPhysicalMaterial({
        color: FOOD_COLORS.tomato,
        roughness: 0.5,
        metalness: 0.05,
        clearcoat: 0.2,
      })
    );
    tomatoBody.scale.set(1, 0.88, 1);
    tomatoGroup.add(tomatoBody);
    const tomatoStem = new THREE.Mesh(
      new THREE.ConeGeometry(0.05, 0.06, 6),
      new THREE.MeshPhysicalMaterial({ color: "#2D5016", roughness: 0.9 })
    );
    tomatoStem.position.y = 0.28;
    tomatoGroup.add(tomatoStem);
    tomatoGroup.position.set(1.8, -0.3, -0.8);
    meshGroup.add(tomatoGroup);

    // ── Onion (torus/ring) ──
    const onionGroup = new THREE.Group();
    const onionOuter = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.08, 12, 24),
      new THREE.MeshPhysicalMaterial({
        color: FOOD_COLORS.onion,
        roughness: 0.7,
        metalness: 0.0,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      })
    );
    onionOuter.rotation.x = Math.PI / 2;
    onionGroup.add(onionOuter);
    const onionInner = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.04, 8, 20),
      new THREE.MeshPhysicalMaterial({
        color: "#C4A882",
        roughness: 0.8,
        metalness: 0.0,
        side: THREE.DoubleSide,
      })
    );
    onionInner.rotation.x = Math.PI / 2;
    onionInner.position.y = 0.02;
    onionGroup.add(onionInner);
    onionGroup.position.set(-1.5, -0.8, 0.3);
    meshGroup.add(onionGroup);

    // ── Pickle (elongated cylinder) ──
    const pickleGroup = new THREE.Group();
    const pickleBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.12, 0.5, 10),
      new THREE.MeshPhysicalMaterial({
        color: FOOD_COLORS.pickle,
        roughness: 0.6,
        metalness: 0.0,
      })
    );
    pickleBody.rotation.z = Math.PI / 3;
    pickleGroup.add(pickleBody);
    const pickleDot1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 6, 6),
      new THREE.MeshPhysicalMaterial({ color: "#2D5016", roughness: 0.8 })
    );
    pickleDot1.position.set(0.08, 0.08, 0.12);
    pickleGroup.add(pickleDot1);
    const pickleDot2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 6, 6),
      new THREE.MeshPhysicalMaterial({ color: "#2D5016", roughness: 0.8 })
    );
    pickleDot2.position.set(-0.06, -0.06, -0.1);
    pickleGroup.add(pickleDot2);
    pickleGroup.position.set(2.0, 0.8, 0.2);
    pickleGroup.rotation.z = 0.3;
    meshGroup.add(pickleGroup);

    // ── Cheese (box) ──
    const cheeseGroup = new THREE.Group();
    const cheeseBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.12, 0.25),
      new THREE.MeshPhysicalMaterial({
        color: FOOD_COLORS.cheese,
        roughness: 0.5,
        metalness: 0.0,
      })
    );
    cheeseGroup.add(cheeseBody);
    const cheeseHole1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 8),
      new THREE.MeshPhysicalMaterial({ color: "#E6C200", roughness: 0.6 })
    );
    cheeseHole1.position.set(0.08, 0.06, 0.06);
    cheeseGroup.add(cheeseHole1);
    const cheeseHole2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 8, 8),
      new THREE.MeshPhysicalMaterial({ color: "#E6C200", roughness: 0.6 })
    );
    cheeseHole2.position.set(-0.1, -0.04, -0.04);
    cheeseGroup.add(cheeseHole2);
    cheeseGroup.position.set(-1.0, 1.2, -0.5);
    cheeseGroup.rotation.z = 0.4;
    meshGroup.add(cheeseGroup);

    // ── Small floating particles ──
    const particleCount = 40;
    const pPos = new Float32Array(particleCount * 3);
    const pSizes = new Float32Array(particleCount);
    const pSpeeds: number[] = [];
    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 6;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 3;
      pSizes[i] = 0.008 + Math.random() * 0.015;
      pSpeeds.push(0.2 + Math.random() * 0.4);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("size", new THREE.BufferAttribute(pSizes, 1));
    const pMat = new THREE.PointsMaterial({
      color: "#FFD700",
      size: 0.015,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Color dots
    const dotCount = 20;
    const dPos = new Float32Array(dotCount * 3);
    const dColors = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
      dPos[i * 3] = (Math.random() - 0.5) * 5;
      dPos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      dPos[i * 3 + 2] = (Math.random() - 0.5) * 2;
      const col = new THREE.Color(
        Math.random() > 0.5 ? FOOD_COLORS.pepper : FOOD_COLORS.cheese
      );
      dColors[i * 3] = col.r;
      dColors[i * 3 + 1] = col.g;
      dColors[i * 3 + 2] = col.b;
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
    dGeo.setAttribute("color", new THREE.BufferAttribute(dColors, 3));
    const dMat = new THREE.PointsMaterial({
      size: 0.04,
      transparent: true,
      opacity: 0.2,
      vertexColors: true,
      sizeAttenuation: true,
    });
    const dots = new THREE.Points(dGeo, dMat);
    scene.add(dots);

    let mouseX = 0;
    let mouseY = 0;
    const handleMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseX = x * 0.08;
      mouseY = y * 0.08;
    };
    container.addEventListener("mousemove", handleMouse);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Float and rotate each food item
      const items = [
        { group: pepperGroup, speed: 0.6, rotSpeed: 0.4, xAmp: 0.15, yAmp: 0.12 },
        { group: tomatoGroup, speed: 0.5, rotSpeed: 0.35, xAmp: 0.12, yAmp: 0.15 },
        { group: onionGroup, speed: 0.4, rotSpeed: 0.3, xAmp: 0.18, yAmp: 0.1 },
        { group: pickleGroup, speed: 0.7, rotSpeed: 0.5, xAmp: 0.1, yAmp: 0.14 },
        { group: cheeseGroup, speed: 0.45, rotSpeed: 0.38, xAmp: 0.14, yAmp: 0.11 },
      ];

      items.forEach(({ group, speed, rotSpeed }, idx) => {
        const phase = idx * 1.2;
        group.position.x += Math.sin(t * speed + phase) * 0.002;
        group.position.y += Math.cos(t * speed * 0.7 + phase) * 0.002;
        group.position.z += Math.sin(t * speed * 0.5 + phase * 0.6) * 0.001;
        group.rotation.x += Math.sin(t * rotSpeed + phase) * 0.003;
        group.rotation.y += Math.cos(t * rotSpeed * 0.8 + phase) * 0.003;
        group.rotation.z += Math.sin(t * rotSpeed * 0.6 + phase * 0.5) * 0.002;
      });

      // Mouse response
      meshGroup.rotation.x += (mouseY - meshGroup.rotation.x) * 0.02;
      meshGroup.rotation.y += (mouseX - meshGroup.rotation.y) * 0.02;

      // Particles float
      const pPosAttr = particles.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        pPosAttr[i3 + 1] += Math.sin(t * pSpeeds[i] + i) * 0.0008;
        pPosAttr[i3] += Math.cos(t * pSpeeds[i] * 0.6 + i * 0.5) * 0.0005;
      }
      particles.geometry.attributes.position.needsUpdate = true;

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
  }, []);

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
