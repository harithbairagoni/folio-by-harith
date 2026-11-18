import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { batchScene } from "./batch-scene";

/** Authored workflow illustrations. No client geometry, records, or campaign data. */
export default function ArtifactScene({
  kind,
  state,
  reduced,
}: {
  kind: "land" | "research";
  state: number;
  reduced: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const active = useRef(state);
  const schedule = useRef<() => void>(() => {});
  useEffect(() => {
    active.current = state;
    if (host.current) host.current.dataset.settled = "false";
    schedule.current();
  }, [state]);
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
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.35));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-6, 6, 5, -5, 0.1, 60);
    camera.position.set(9, 11, 12);
    camera.lookAt(0, 0.4, 0);
    // Studio-owned key; paper, desk and terrain share its world coordinates.
    scene.add(new THREE.HemisphereLight(0xfff7df, 0x344a3d, 2));
    const key = new THREE.DirectionalLight(0xffedce, 3.2);
    key.position.set(-4, 10, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(768, 768);
    Object.assign(key.shadow.camera, {
      left: -7,
      right: 7,
      top: 7,
      bottom: -7,
      near: 1,
      far: 25,
    });
    key.shadow.normalBias = 0.025;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xe3eee0, 1.3);
    fill.position.set(7, 5, -5);
    scene.add(fill);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    room.dispose();
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.35;
    const root = new THREE.Group();
    root.rotation.y = -0.16;
    scene.add(root);
    const geometries = new Set<THREE.BufferGeometry>();
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];
    const mat = (color: number, roughness = 0.75, metalness = 0.05) => {
      const m = new THREE.MeshStandardMaterial({ color, roughness, metalness });
      materials.push(m);
      return m;
    };
    const paper = mat(0xfff6df),
      edge = mat(0xcbbd9d),
      green = mat(0x365345),
      sage = mat(0x94a483),
      brass = mat(0xc09a5e, 0.4, 0.4),
      stone = mat(0xd8cfb9),
      ink = mat(0x738372);
    const mesh = (
      g: THREE.BufferGeometry,
      m: THREE.Material,
      p: THREE.Object3D,
      x = 0,
      y = 0,
      z = 0,
    ) => {
      geometries.add(g);
      const o = new THREE.Mesh(g, m);
      o.position.set(x, y, z);
      o.castShadow = true;
      o.receiveShadow = true;
      p.add(o);
      return o;
    };
    const box = (
      w: number,
      h: number,
      d: number,
      m: THREE.Material,
      p: THREE.Object3D,
      x = 0,
      y = 0,
      z = 0,
    ) => mesh(new THREE.BoxGeometry(w, h, d), m, p, x, y, z);
    const rule = (
      p: THREE.Object3D,
      x: number,
      z: number,
      length: number,
      y: number,
      m = ink,
    ) => box(length, 0.008, 0.025, m, p, x, y, z);
    const line = (
      points: THREE.Vector3[],
      m: THREE.Material,
      p: THREE.Object3D,
      radius = 0.025,
    ) =>
      mesh(
        new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(points, false, "catmullrom", 0),
          32,
          radius,
          6,
          false,
        ),
        m,
        p,
      );
    const sheet = (
      p: THREE.Object3D,
      title: string,
      width = 1.75,
      depth = 2.15,
    ) => {
      const group = new THREE.Group();
      p.add(group);
      box(width, 0.035, depth, paper, group);
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 640;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#fff6df";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#365345";
      ctx.fillRect(42, 45, 48, 8);
      ctx.font = "600 28px sans-serif";
      ctx.fillText(title, 42, 110);
      ctx.fillStyle = "#c09a5e";
      ctx.fillRect(42, 142, 420, 2);
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = i % 3 === 0 ? "#9aa68e" : "#d3ccb9";
        ctx.fillRect(42, 190 + i * 44, i % 3 === 2 ? 260 : 420, 6);
      }
      const texture = new THREE.CanvasTexture(c);
      texture.colorSpace = THREE.SRGBColorSpace;
      textures.push(texture);
      const face = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.9,
      });
      materials.push(face);
      const top = mesh(
        new THREE.PlaneGeometry(width - 0.035, depth - 0.035),
        face,
        group,
        0,
        0.019,
        0,
      );
      top.rotation.x = -Math.PI / 2;
      return group;
    };
    const animations: ((s: number, alpha: number) => number)[] = [];
    const move = (object: THREE.Object3D, poses: number[][]) => {
      const targets = poses.map(([x,y,z]) => new THREE.Vector3(x,y,z));
      animations.push((s, alpha) => {
        const [, , , ry = 0] = poses[s];
        object.position.lerp(targets[s], alpha);
        object.rotation.y = THREE.MathUtils.lerp(object.rotation.y, ry, alpha);
        if (object.position.distanceTo(targets[s]) < 0.005) object.position.copy(targets[s]);
        if (Math.abs(object.rotation.y - ry) < 0.005) object.rotation.y = ry;
        return (
          object.position.distanceTo(targets[s]) +
          Math.abs(object.rotation.y - ry)
        );
      });
    };
    if (kind === "land") {
      box(7.5, 0.28, 5.1, stone, root, 0, -0.2, 0.5);
      box(7.35, 0.08, 4.95, sage, root, 0, -0.02, 0.5);
      for (let i = 0; i < 6; i++)
        rule(root, 0, -1.5 + i * 0.8, 7.2, 0.025, edge);
      box(7.3, 0.03, 0.45, paper, root, 0, 0.04, 1.95);
      const vertices = [
        [-2.8, -1.5],
        [-0.7, -1.75],
        [1.45, -0.7],
        [1.05, 1.05],
        [-2.15, 1.4],
      ];
      const shape = new THREE.Shape();
      vertices.forEach(([x, z], i) =>
        i ? shape.lineTo(x, -z) : shape.moveTo(x, -z),
      );
      shape.closePath();
      const parcel = mesh(
        new THREE.ExtrudeGeometry(shape, {
          depth: 0.12,
          bevelEnabled: true,
          bevelSize: 0.04,
          bevelThickness: 0.035,
          bevelSegments: 2,
          steps: 1,
        }),
        mat(0x6f8b61),
        root,
        0,
        0.08,
        0,
      );
      parcel.rotation.x = -Math.PI / 2;
      const loop = [...vertices, vertices[0]].map(
        ([x, z]) => new THREE.Vector3(x, 0.27, z),
      );
      line(loop, green, root, 0.03);
      for (const [x, z] of vertices) {
        box(0.11, 0.38, 0.11, green, root, x, 0.34, z);
        mesh(new THREE.SphereGeometry(0.09, 12, 8), brass, root, x, 0.55, z);
      }
      const comparison = new THREE.Group();
      root.add(comparison);
      const alt = vertices.map(
        ([x, z], i) =>
          new THREE.Vector3(x + (i === 2 || i === 3 ? 0.5 : 0), 0.3, z),
      );
      alt.push(alt[0]);
      const dashedMat = new THREE.LineDashedMaterial({
        color: 0xa75a37,
        dashSize: 0.15,
        gapSize: 0.08,
      });
      materials.push(dashedMat);
      const dashGeo = new THREE.BufferGeometry().setFromPoints(alt);
      geometries.add(dashGeo);
      const dashed = new THREE.Line(dashGeo, dashedMat);
      dashed.computeLineDistances();
      comparison.add(dashed);
      animations.push((s) => {
        comparison.visible = s === 1;
        return 0;
      });
      const titles = ["RECORDS", "FIELD REVIEW", "REVIEW REPORT"];
      titles.forEach((title, i) => {
        const doc = sheet(root, title);
        move(doc, [
          [1.65 + i * 0.35, 0.65 + i * 0.5, -0.75 + i * 0.45, -0.3 + i * 0.22],
          [2.5, 0.28 + i * 0.06, -0.4 + i * 0.1, 0.1],
          [0.65 + i * 0.06, 0.65 + i * 0.07, 0.65 + i * 0.08, -0.1],
        ]);
      });
      const tab = new THREE.Group();
      root.add(tab);
      box(0.8, 0.07, 0.28, brass, tab);
      move(tab, [
        [2.35, 1.85, -0.4],
        [2.5, 0.6, -1.3],
        [0.9, 0.95, -0.15],
      ]);
    } else {
      box(7.7, 0.25, 5.5, stone, root, 0, -0.1, 0);
      box(7.55, 0.06, 5.35, mat(0xb7bea8), root, 0, 0.06, 0);
      const folder = new THREE.Group();
      root.add(folder);
      folder.position.set(1.7, 0.14, -0.1);
      box(2.8, 0.07, 3.5, green, folder);
      for (let i = 0; i < 4; i++)
        box(2.6, 0.025, 3.3, paper, folder, 0, 0.055 + i * 0.025, 0);
      const briefing = sheet(folder, "LEADERSHIP BRIEF", 2.55, 3.2);
      briefing.position.y = 0.16;
      // Cover pivots along its bound edge and opens away from the document.
      const hinge = new THREE.Group();
      hinge.position.set(-1.4, 0.2, 0);
      folder.add(hinge);
      box(2.8, 0.06, 3.5, green, hinge, 1.4, 0, 0);
      box(0.5, 0.02, 1.8, brass, hinge, 1.4, 0.04, 0);
      animations.push((s, a) => {
        const target = s === 2 ? 2.8 : s === 1 ? 1.1 : 0.08;
        hinge.rotation.z = THREE.MathUtils.lerp(hinge.rotation.z, target, a);
        return Math.abs(hinge.rotation.z - target);
      });
      ["FIELD NOTES", "POLICY RESEARCH", "ANALYSIS"].forEach((title, i) => {
        const note = sheet(root, title, 1.7, 2);
        box(0.5, 0.025, 0.2, i === 1 ? brass : sage, note, 0.4, 0.045, -0.92);
        move(note, [
          [
            -2.25 + (i % 2) * 1.3,
            0.19 + i * 0.06,
            -1.5 + i * 1.35,
            [-0.25, 0.17, -0.1][i],
          ],
          [-2.2 + i * 0.3, 0.4 + i * 0.35, -0.85 + i * 0.6, 0],
          [-2.6 + i * 0.06, 0.18 + i * 0.07, 0.1 + i * 0.07, -0.08],
        ]);
      });
      const pen = box(0.09, 0.09, 2.1, green, root, 3.3, 0.19, 0.4);
      pen.rotation.y = -0.12;
      box(0.11, 0.1, 0.32, brass, root, 3.42, 0.19, -0.5);
    }
    const shadow = new THREE.ShadowMaterial({ opacity: 0.16 });
    materials.push(shadow);
    const ground = mesh(
      new THREE.PlaneGeometry(50, 50),
      shadow,
      scene,
      0,
      -0.42,
      0,
    );
    ground.rotation.x = -Math.PI / 2;
    ground.castShadow = false;
    batchScene(root, geometries);
    let frame = 0,
      visible = false,
      last = 0;
    const draw = () => {
      frame = 0;
      if (!visible || document.hidden) return;
      const now = performance.now();
      const alpha = reduced
        ? 1
        : 1 - Math.exp(-Math.min(now - last || 16, 150) / 38);
      last = now;
      let remaining = 0;
      animations.forEach((fn) => {
        remaining += fn(active.current, alpha);
      });
      renderer.render(scene, camera);
      container.dataset.ready = "true";
      container.dataset.state = String(active.current);
      container.dataset.settled = String(remaining < 0.015);
      container.dataset.drawCalls = String(renderer.info.render.calls);
      if (remaining >= 0.015) frame = requestAnimationFrame(draw);
    };
    const request = () => {
      if (!frame && visible && !document.hidden)
        frame = requestAnimationFrame(draw);
    };
    schedule.current = request;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) request();
      },
      { rootMargin: "150px" },
    );
    observer.observe(container);
    const resize = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
      const aspect = width / Math.max(1, height),
        size = aspect < 1 ? 4.9 : 4.0;
      camera.left = -size * aspect;
      camera.right = size * aspect;
      camera.top = size;
      camera.bottom = -size;
      camera.updateProjectionMatrix();
      request();
    });
    resize.observe(container);
    const visibility = () => {
      if (!document.hidden) request();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      schedule.current = () => {};
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [kind, reduced]);
  return (
    <div
      ref={host}
      className="artifact-canvas"
      data-kind={kind}
      aria-hidden="true"
    />
  );
}
