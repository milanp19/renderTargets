import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Sky,
  useFBO,
} from "@react-three/drei";
import { createPortal, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { Scene } from "three";

const Experience = () => {
  const renderTarget = useFBO();
  const meshRef = useRef();
  const otherCamera = useRef();

  const otherScene = new Scene();
  useFrame(({ gl, camera }) => {
    otherCamera.current.matrixWorldInverse.copy(camera.matrixWorldInverse);

    gl.setRenderTarget(renderTarget);
    gl.render(otherScene, otherCamera.current);
    meshRef.current.material.map = renderTarget.texture;

    gl.setRenderTarget(null);
  });
  return (
    <>
      <PerspectiveCamera manual ref={otherCamera} aspect={1.5 / 1} />
      <Sky sunPosition={[10, 10, 0]} />
      <Environment preset="sunset" />
      <mesh ref={meshRef}>
        <planeGeometry args={[3, 2]} />
      </mesh>
      {createPortal(
        <>
          <Environment preset="sunset" />
          <Sky sunPosition={[10, 10, 10]} />
          <mesh>
            <dodecahedronGeometry />
            <meshBasicMaterial color="red" />
          </mesh>
        </>,
        otherScene
      )}
      <OrbitControls />
    </>
  );
};

export default Experience;
