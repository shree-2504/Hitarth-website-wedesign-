'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type BuildingConfig = {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  floors: number;
  start: number;
  end: number;
};

const BUILDINGS: BuildingConfig[] = [
  { x: -34, z: -6, w: 4, d: 4, h: 14, floors: 6, start: 0.0, end: 0.18 },
  { x: -27, z: 3, w: 3, d: 3, h: 9, floors: 4, start: 0.03, end: 0.14 },
  { x: -19, z: -10, w: 5, d: 5, h: 22, floors: 9, start: 0.06, end: 0.42 },
  { x: -10, z: 5, w: 3.4, d: 3.4, h: 11, floors: 5, start: 0.14, end: 0.28 },
  { x: -2, z: -4, w: 6, d: 6, h: 26, floors: 10, start: 0.2, end: 0.55 },
  { x: 8, z: 6, w: 3, d: 3, h: 8, floors: 3, start: 0.3, end: 0.42 },
  { x: 16, z: -8, w: 4.6, d: 4.6, h: 18, floors: 7, start: 0.38, end: 0.66 },
  { x: 24, z: 3, w: 2.6, d: 2.6, h: 7, floors: 2, start: 0.48, end: 0.58 },
  { x: 32, z: -6, w: 5.4, d: 5.4, h: 24, floors: 8, start: 0.55, end: 0.85 },
  { x: 40, z: 5, w: 3, d: 3, h: 10, floors: 4, start: 0.62, end: 0.75 },
  { x: 48, z: -3, w: 4.4, d: 4.4, h: 17, floors: 6, start: 0.72, end: 1.0 },
];

function clamp01(v: number) {
  return Math.min(Math.max(v, 0), 1);
}
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function makeSkyTexture() {
  const c = document.createElement('canvas');
  c.width = 8;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#F2E7D3');
  g.addColorStop(0.55, '#E7D4BB');
  g.addColorStop(1, '#CAB8A0');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 8, 256);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

export default function Skyline() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallScreen = window.innerWidth < 640;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallScreen ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Unlit "drafting sketch" scene: no lights, flat line-art buildings —
    // reads as an animated architectural elevation drawing rather than a
    // rendered 3D scene.
    const scene = new THREE.Scene();
    scene.background = makeSkyTexture();
    scene.fog = new THREE.Fog(0xcab8a0, 40, 150);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );
    camera.position.set(-34, 10, 46);

    const grid = new THREE.GridHelper(400, isSmallScreen ? 40 : 80, 0x857861, 0xdccbae);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.4;
    grid.position.y = 0.01;
    scene.add(grid);

    type Runtime = BuildingConfig & {
      riseGroup: THREE.Group;
      floorRings: { mesh: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>; th: number }[];
    };

    const buildings: Runtime[] = BUILDINGS.map((b) => {
      const group = new THREE.Group();
      group.position.set(b.x, 0, b.z);
      scene.add(group);

      // Everything that should "rise" together — the outline and its floor
      // rings — lives inside riseGroup, so scaling one Y value grows the
      // whole building coherently instead of just a fill mesh underneath a
      // static full-height outline.
      const riseGroup = new THREE.Group();
      riseGroup.scale.y = 0.001;
      group.add(riseGroup);

      const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(b.w, b.h, b.d));
      edgeGeo.translate(0, b.h / 2, 0);
      const edges = new THREE.LineSegments(
        edgeGeo,
        new THREE.LineBasicMaterial({ color: 0x101211, transparent: true, opacity: 0.6 })
      );
      riseGroup.add(edges);

      const floorRings: { mesh: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>; th: number }[] = [];
      for (let f = 1; f <= b.floors; f++) {
        const fy = (f / (b.floors + 1)) * b.h;
        const ringGeo = new THREE.EdgesGeometry(
          new THREE.BoxGeometry(b.w + 0.02, 0.02, b.d + 0.02)
        );
        const ringMat = new THREE.LineBasicMaterial({
          color: 0x857861,
          transparent: true,
          opacity: 0,
        });
        const ring = new THREE.LineSegments(ringGeo, ringMat);
        ring.position.y = fy;
        riseGroup.add(ring);
        floorRings.push({ mesh: ring, th: f / (b.floors + 1) });
      }

      return { ...b, riseGroup, floorRings };
    });

    let targetProgress = 0;
    let progress = 0;

    function computeTargetProgress() {
      const lenis = (window as any).__lenis;
      if (lenis && typeof lenis.scroll === 'number' && lenis.limit) {
        targetProgress = clamp01(lenis.scroll / lenis.limit);
      } else {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        targetProgress = scrollable > 0 ? clamp01(window.scrollY / scrollable) : 0;
      }
    }

    function updateBuildings(p: number) {
      buildings.forEach((b) => {
        const local = clamp01((p - b.start) / (b.end - b.start));
        const eased = smoothstep(local);
        b.riseGroup.scale.y = Math.max(0.001, eased);
        b.floorRings.forEach((fr) => {
          fr.mesh.material.opacity = clamp01((local - fr.th) * 6) * 0.9;
        });
      });
    }

    const X_MIN = -36;
    const X_MAX = 50;

    function updateCamera(p: number) {
      const camX = X_MIN + p * (X_MAX - X_MIN);
      camera.position.x = camX;
      camera.position.y = 9 + Math.sin(p * Math.PI) * 2;
      camera.lookAt(camX + 8, 6, 0);
    }

    let rafId = 0;
    let visible = true;

    function animate() {
      rafId = requestAnimationFrame(animate);
      if (!visible) return;

      if (reduceMotion) {
        progress = 1;
      } else {
        progress += (targetProgress - progress) * 0.07;
      }
      updateBuildings(progress);
      updateCamera(progress);
      renderer.render(scene, camera);
    }

    computeTargetProgress();
    if (reduceMotion) {
      updateBuildings(1);
      updateCamera(0.5);
      renderer.render(scene, camera);
    }
    animate();

    const onScroll = () => computeTargetProgress();
    window.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    const onVisibility = () => {
      visible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
