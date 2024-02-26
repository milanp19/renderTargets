import { BufferGeometry, Float32BufferAttribute } from "three";

export const getFullscreenTriangle = () => {
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new Float32BufferAttribute([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0], 2)
  );
  geometry.setAttribute(
    "uv",
    new Float32BufferAttribute([0.0, 0.0, 2.0, 0.0, 0.0, 2.0], 2)
  );

  return geometry;
};
