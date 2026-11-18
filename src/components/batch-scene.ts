import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/** Batch only direct, static mesh children: animated parent groups stay independent. */
export function batchScene(parent: THREE.Object3D, owned: Set<THREE.BufferGeometry>) {
  const batches = new Map<THREE.Material, THREE.Mesh[]>();
  for (const child of parent.children) {
    if (!(child instanceof THREE.Mesh) || Array.isArray(child.material)) continue;
    const list = batches.get(child.material) || [];
    list.push(child); batches.set(child.material, list);
  }
  for (const [material, meshes] of batches) {
    if (meshes.length < 2) continue;
    const parts = meshes.map(mesh => { mesh.updateMatrix(); return mesh.geometry.clone().applyMatrix4(mesh.matrix); });
    const geometry = mergeGeometries(parts);
    parts.forEach(g => g.dispose());
    if (!geometry) continue;
    owned.add(geometry);
    const merged = new THREE.Mesh(geometry, material);
    merged.castShadow = true; merged.receiveShadow = true;
    meshes.forEach(mesh => parent.remove(mesh)); parent.add(merged);
  }
}
