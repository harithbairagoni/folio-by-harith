import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { batchScene } from "./batch-scene";

/** Illustrative assembly, not a process simulation or an as-built plant model. */
export default function PlantScene({
  progress,
  selected,
  reduced,
}: {
  progress: MotionValue<number>;
  selected: number | null;
  reduced: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const selection = useRef(selected);
  const update = useRef<(() => void) | null>(null);
  useEffect(() => {
    selection.current = selected;
    update.current?.();
  }, [selected]);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(12, 10, 14);
    camera.lookAt(0, 1, 0);
    const env = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(env, 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.6;
    env.dispose();
    scene.add(new THREE.HemisphereLight(0xf4f2d9, 0x233d2e, 2.1));
    const key = new THREE.DirectionalLight(0xffe5b7, 3.5);
    key.position.set(-5, 10, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(768, 768);
    Object.assign(key.shadow.camera, {
      left: -8,
      right: 8,
      top: 8,
      bottom: -8,
      near: 1,
      far: 30,
    });
    key.shadow.normalBias = 0.035;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xb9cebc, 1.4);
    fill.position.set(7, 4, -5);
    scene.add(fill);

    const root = new THREE.Group();
    root.rotation.y = -0.18;
    scene.add(root);
    const civil = new THREE.Group(),
      mechanical = new THREE.Group(),
      clearances = new THREE.Group();
    root.add(civil, mechanical, clearances);
    const mats: THREE.MeshStandardMaterial[][] = [[], [], []];
    const material = (
      color: number,
      metalness: number,
      roughness: number,
      group: number,
    ) => {
      const m = new THREE.MeshStandardMaterial({ color, metalness, roughness });
      m.userData.originalColor = new THREE.Color(color);
      mats[group].push(m);
      return m;
    };
    const stone = material(0xc6bea3, 0.05, 0.85, 0);
    const darkStone = material(0x6f7863, 0.1, 0.8, 0);
    const silver = material(0xced6cd, 0.8, 0.3, 1);
    const metal = material(0x7f9b88, 0.72, 0.38, 1);
    const brass = material(0xba9555, 0.7, 0.34, 1);
    const paper = material(0xe9d8ad, 0.08, 0.72, 2);
    const paperEdge = material(0x536e4e, 0.12, 0.7, 2);
    const geo = new Set<THREE.BufferGeometry>();
    const mesh = (
      geometry: THREE.BufferGeometry,
      m: THREE.Material,
      parent: THREE.Object3D,
      x = 0,
      y = 0,
      z = 0,
    ) => {
      geo.add(geometry);
      const object = new THREE.Mesh(geometry, m);
      object.position.set(x, y, z);
      object.castShadow = true;
      object.receiveShadow = true;
      parent.add(object);
      return object;
    };
    const box = (
      w: number,
      h: number,
      d: number,
      m: THREE.Material,
      p: THREE.Object3D,
      x: number,
      y: number,
      z: number,
    ) => mesh(new THREE.BoxGeometry(w, h, d), m, p, x, y, z);
    const cylinder = (
      r: number,
      height: number,
      m: THREE.Material,
      p: THREE.Object3D,
      x: number,
      y: number,
      z: number,
    ) => mesh(new THREE.CylinderGeometry(r, r, height, 40), m, p, x, y, z);
    const pipe = (
      points: number[][],
      m: THREE.Material,
      p: THREE.Object3D,
      radius = 0.045,
    ) => {
      const path = new THREE.CurvePath<THREE.Vector3>();
      for (let i = 1; i < points.length; i++)
        path.add(
          new THREE.LineCurve3(
            new THREE.Vector3(...(points[i - 1] as [number, number, number])),
            new THREE.Vector3(...(points[i] as [number, number, number])),
          ),
        );
      return mesh(
        new THREE.TubeGeometry(path, points.length * 6, radius, 8, false),
        m,
        p,
      );
    };
    // The site slab is the fixed spatial reference, independent of inspection layers.
    box(9, 0.26, 6.1, stone, root, 0, 0, 0);
    box(8.65, 0.08, 5.75, darkStone, root, 0, 0.17, 0);
    // Foundation pads are visible independently of the equipment layer.
    for (const x of [-2.8, -1.15, 0.5])
      for (const z of [-0.8, 1.05])
        box(1.32, 0.2, 1.32, stone, civil, x, 0.3, z);
    for (let i = 0; i < 10; i++)
      box(0.015, 0.012, 5.5, stone, civil, -4.1 + i * 0.9, 0.22, 0);
    for (let i = 0; i < 7; i++)
      box(8.5, 0.012, 0.015, stone, civil, 0, 0.22, -2.7 + i * 0.9);
    box(1.55, 0.28, 2.65, stone, civil, 2.5, 0.35, -0.3);

    // Six fermentation vessels: cylindrical shells, domed heads, lower supports, and ring seams.
    for (const x of [-2.8, -1.15, 0.5])
      for (const z of [-0.8, 1.05]) {
        cylinder(0.54, 1.7, silver, mechanical, x, 1.45, z);
        const dome = mesh(
          new THREE.SphereGeometry(
            0.54,
            32,
            16,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2,
          ),
          silver,
          mechanical,
          x,
          2.3,
          z,
        );
        dome.scale.y = 0.42;
        cylinder(0.53, 0.09, metal, mechanical, x, 0.58, z);
        for (const h of [0.82, 1.55, 2.22]) {
          const ring = mesh(
            new THREE.TorusGeometry(0.546, 0.014, 6, 40),
            brass,
            mechanical,
            x,
            h,
            z,
          );
          ring.rotation.x = Math.PI / 2;
        }
        for (const dx of [-0.35, 0.35])
          for (const dz of [-0.25, 0.25])
            box(0.065, 0.35, 0.065, metal, mechanical, x + dx, 0.44, z + dz);
        cylinder(0.1, 0.08, brass, mechanical, x, 2.57, z);
        pipe(
          [
            [x, 2.57, z],
            [x, 2.83, z],
            [x, 2.83, -1.8],
          ],
          brass,
          mechanical,
          0.025,
        );
      }
    // Distillation tower with columns, platforms, bracing, and a visible access ladder.
    for (const x of [1.85, 3.15])
      for (const z of [-1.55, 0.95])
        box(0.075, 4.5, 0.075, metal, mechanical, x, 2.62, z);
    for (const h of [1.1, 2.4, 3.7, 4.7]) {
      box(1.55, 0.055, 2.75, metal, mechanical, 2.5, h, -0.3);
      for (const z of [-1.6, 1])
        pipe(
          [
            [1.75, h + 0.5, z],
            [3.25, h + 0.5, z],
          ],
          brass,
          mechanical,
          0.024,
        );
      for (const x of [1.75, 3.25])
        pipe(
          [
            [x, h, -1.6],
            [x, h + 0.5, -1.6],
            [x, h + 0.5, 1],
            [x, h, 1],
          ],
          brass,
          mechanical,
          0.024,
        );
    }
    cylinder(0.27, 3.9, silver, mechanical, 2.15, 2.6, -0.8);
    cylinder(0.23, 3.4, silver, mechanical, 2.85, 2.35, 0.25);
    for (let i = 0; i < 15; i++)
      pipe(
        [
          [1.7, 0.7 + i * 0.26, 1.08],
          [2, 0.7 + i * 0.26, 1.08],
        ],
        brass,
        mechanical,
        0.015,
      );
    pipe(
      [
        [1.7, 0.5, 1.08],
        [1.7, 4.5, 1.08],
      ],
      metal,
      mechanical,
      0.023,
    );
    pipe(
      [
        [2, 0.5, 1.08],
        [2, 4.5, 1.08],
      ],
      metal,
      mechanical,
      0.023,
    );
    pipe(
      [
        [-3.4, 0.7, 1.8],
        [1.1, 0.7, 1.8],
        [1.1, 1.4, 1.8],
        [2.85, 1.4, 1.8],
        [2.85, 1.4, 0.25],
      ],
      brass,
      mechanical,
      0.06,
    );
    pipe(
      [
        [-3.4, 0.93, 1.8],
        [-3.4, 0.93, -1.8],
        [2.15, 0.93, -1.8],
        [2.15, 3.9, -1.8],
        [2.15, 3.9, -0.8],
      ],
      silver,
      mechanical,
      0.045,
    );
    // A raised documentation tray encodes the approvals workstream, not actual licenses.
    box(2, 0.08, 1.3, paperEdge, clearances, -2.2, 0.35, -2.05);
    for (let i = 0; i < 3; i++) {
      const sheet = box(
        1.65,
        0.025,
        1.08,
        paper,
        clearances,
        -2.2 + i * 0.035,
        0.42 + i * 0.045,
        -2.05 + i * 0.035,
      );
      sheet.rotation.y = -0.1 + i * 0.05;
    }
    for (let i = 0; i < 5; i++)
      box(
        1.03,
        0.012,
        0.015,
        paperEdge,
        clearances,
        -2.3,
        0.58,
        -2.4 + i * 0.13,
      );
    box(0.3, 0.015, 0.24, paperEdge, clearances, -1.7, 0.58, -1.81);
    const ground = mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ opacity: 0.16 }),
      scene,
      0,
      -0.5,
      0,
    );
    ground.rotation.x = -Math.PI / 2;
    ground.castShadow = false;

    [root, civil, mechanical, clearances].forEach(group => batchScene(group, geo));
    let frame = 0,
      visible = true,
      current = progress.get(),
      target = current;
    let lastTime = 0;
    const draw = () => {
      frame = 0;
      if (!visible || document.hidden) return;
      const now = performance.now();
      const blend = reduced ? 1 : 1 - Math.exp(-Math.min(now - lastTime || 16, 150) / 38);
      lastTime = now;
      current = target;
      const assembled = THREE.MathUtils.smoothstep(current, 0.03, 0.88);
      const groups = [civil, mechanical, clearances];
      const lift = [0.9, 1.8, 2.5];
      let moving = current !== target;
      groups.forEach((group, i) => {
        const y = selection.current === null
          ? (reduced ? 0 : (1 - assembled) * lift[i])
          : selection.current === i ? (reduced ? 0.4 : assembled * lift[i]) : 0;
        group.position.y = THREE.MathUtils.lerp(group.position.y, y, blend);
        if (Math.abs(group.position.y - y) < 0.005) group.position.y = y;
        else moving = true;
      });
      clearances.position.z = 3.3;
      root.rotation.y = -0.18;
      mats.forEach((materials, i) =>
        materials.forEach((m) => {
          const original = m.userData.originalColor as THREE.Color;
          const color = original.clone().multiplyScalar(selection.current !== null && selection.current !== i ? 0.55 : 1);
          if (Math.abs(m.color.r - color.r) + Math.abs(m.color.g - color.g) + Math.abs(m.color.b - color.b) > 0.002) moving = true;
          m.color.lerp(color, blend);
        }),
      );
      renderer.render(scene, camera);
      container.dataset.drawCalls = String(renderer.info.render.calls);
      container.dataset.ready = "true";
      container.dataset.scVerifyState = `${civil.position.y.toFixed(3)}:${mechanical.position.y.toFixed(3)}:${clearances.position.y.toFixed(3)}:${selection.current}`;
      container.dataset.settled = String(!moving);
      if (moving) frame = requestAnimationFrame(draw);
    };
    const schedule = () => {
      if (!frame && visible && !document.hidden)
        frame = requestAnimationFrame(draw);
    };
    update.current = schedule;
    const unsubscribe = progress.on("change", (p) => {
      target = p;
      schedule();
    });
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible) schedule();
      },
      { rootMargin: "100px" },
    );
    observer.observe(container);
    const resize = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.position.set(12, 10, 14).multiplyScalar(width < 430 ? 1.12 : 1);
      camera.lookAt(0, 1.1, 0);
      camera.updateProjectionMatrix();
      schedule();
    });
    resize.observe(container);
    const visibility = () => {
      if (!document.hidden) schedule();
    };
    document.addEventListener("visibilitychange", visibility);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      update.current = null;
      geo.forEach((g) => g.dispose());
      mats.flat().forEach((m) => m.dispose());
      (ground.material as THREE.Material).dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progress, reduced]);
  return (
    <div
      ref={host}
      className="plant-canvas"
      role="img"
      aria-label="Illustrative 3D plant with foundations, six vessels, distillation structure, pipes, and documentation. Select workstreams using the adjacent buttons."
      data-sc-verify-state="loading"
    />
  );
}
