import { useRef, useEffect } from "react";
import * as THREE from "three";

const GREEN = "#19B000";

interface Props {
  className?: string;
}

export function LiquidMorph3D({ className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const container = containerRef.current;
    const W = container.clientWidth || 400;
    const H = container.clientHeight || 400;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 10);
    camera.position.set(0, 0, 3.8);

    const geo = new THREE.TorusKnotGeometry(0.85, 0.32, 180, 24);
    geo.computeVertexNormals();
    const basePos = geo.attributes.position.array.slice() as Float32Array;

    const mat = new THREE.MeshPhysicalMaterial({
      color: GREEN,
      metalness: 0.75,
      roughness: 0.25,
      emissive: GREEN,
      emissiveIntensity: 0.15,
      envMapIntensity: 1.8,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      transparent: true,
      opacity: 0.95,
      transmission: 0.05,
      thickness: 1.2,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.set(1, 1, 1);
    scene.add(mesh);

    const envTexture = (() => {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 256;
      const ctx = c.getContext("2d")!;
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, "#1a1a2e");
      grad.addColorStop(0.5, "#16213e");
      grad.addColorStop(1, "#0f0f1a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);
      const tex = new THREE.CanvasTexture(c);
      tex.mapping = THREE.EquirectangularReflectionMapping;
      return tex;
    })();
    scene.environment = envTexture;
    scene.background = null;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(GREEN, 1.2, 10);
    light1.position.set(4, 3, 4);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x0d1a0b, 0.4, 10);
    light2.position.set(-4, -2, -4);
    scene.add(light2);

    const light3 = new THREE.PointLight(0xffffff, 0.3, 10);
    light3.position.set(0, 4, -3);
    scene.add(light3);

    const particleCount = 60;
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.6 + Math.random() * 0.8;
      pPos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      pPos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.6;
      pPos[i * 3 + 2] = Math.cos(phi) * r;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: GREEN,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    const sparkleCount = 30;
    const sPos = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount; i++) {
      sPos[i * 3] = (Math.random() - 0.5) * 3.5;
      sPos[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      sPos[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    const sMat = new THREE.PointsMaterial({
      color: GREEN,
      size: 0.03,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true,
    });
    const sparkles = new THREE.Points(sGeo, sMat);
    scene.add(sparkles);

    const shadowGeo = new THREE.PlaneGeometry(4, 4);
    const shadowMat = new THREE.ShadowMaterial({
      opacity: 0.3,
      transparent: true,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.position.set(0, -1.3, 0);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = false;
    scene.add(shadowPlane);

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

    let animId: number;
    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      const t = time * 0.001;

      const pos = geo.attributes.position.array as Float32Array;
      const count = pos.length / 3;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const bx = basePos[i3];
        const by = basePos[i3 + 1];
        const bz = basePos[i3 + 2];

        const wave = Math.sin(bx * 2.5 + t * 0.8) * 0.035
          + Math.sin(by * 3 + t * 0.5) * 0.03
          + Math.sin(bz * 2 + t * 0.6) * 0.025;
        const wave2 = Math.sin(bx * 4 + t * 1.2) * 0.015
          + Math.sin(by * 5 + t * 0.9) * 0.012;

        pos[i3] = bx + bx * wave;
        pos[i3 + 1] = by + by * wave2;
        pos[i3 + 2] = bz + bz * wave;
      }
      geo.attributes.position.needsUpdate = true;
      geo.computeVertexNormals();

      const floatY = Math.sin(t * 0.6) * 0.12;
      const floatX = Math.cos(t * 0.4) * 0.05;
      mesh.position.x = mouseX + floatX;
      mesh.position.y = mouseY + floatY;
      mesh.rotation.x = Math.sin(t * 0.12) * 0.08;
      mesh.rotation.y = t * 0.2;
      mesh.rotation.z = Math.cos(t * 0.09) * 0.06;

      const pulse = 0.5 + Math.sin(t * 0.4) * 0.15;
      mat.emissiveIntensity = 0.1 + pulse * 0.2;
      mat.roughness = 0.25 + Math.sin(t * 0.3) * 0.12;
      mat.metalness = 0.7 + Math.sin(t * 0.2 + 1) * 0.15;
      mat.opacity = 0.92 + Math.sin(t * 0.25) * 0.06;

      const pPosAttr = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const angle = t * 0.15 + i * 0.1;
        const r = 1.6 + Math.sin(t * 0.2 + i) * 0.5;
        pPosAttr[i3] = Math.cos(angle) * r;
        pPosAttr[i3 + 1] = Math.sin(angle * 0.7 + t * 0.1) * r * 0.4;
        pPosAttr[i3 + 2] = Math.sin(angle) * r;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      const sPosAttr = sparkles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < sparkleCount; i++) {
        const i3 = i * 3;
        sPosAttr[i3] += Math.sin(t + i) * 0.001;
        sPosAttr[i3 + 1] += Math.cos(t * 0.7 + i) * 0.001;
        sPosAttr[i3 + 2] += Math.sin(t * 0.5 + i * 0.5) * 0.001;
      }
      sparkles.geometry.attributes.position.needsUpdate = true;

      camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.05;
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
      geo.dispose();
      mat.dispose();
      pGeo.dispose();
      pMat.dispose();
      sGeo.dispose();
      sMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      envTexture.dispose();
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
