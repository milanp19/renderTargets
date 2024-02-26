import {
  OrbitControls,
  Sky,
  Environment,
  useFBO,
  ContactShadows,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas, useFrame, createPortal } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";

const ScreenCoordinates = () => {
  const mesh = useRef();
  const otherMesh = useRef();
  const otherCamera = useRef();
  const otherScene = new THREE.Scene();

  const renderTarget = useFBO();

  const uniforms = useMemo(() => ({
    uTexture: { value: null },
    winResolution: {
      value: new THREE.Vector2(
        window.innerWidth,
        window.innerHeight
      ).multiplyScalar(Math.min(window.devicePixelRatio, 2)),
    },
  }));

  useFrame((state) => {
    const { gl, clock } = state;
    // otherCamera.current.lookAt(0, 0, 0);

    gl.setRenderTarget(renderTarget);
    gl.render(otherScene, otherCamera.current);

    mesh.current.material.uniforms.uTexture.value = renderTarget.texture;
    mesh.current.material.uniforms.winResolution.value = new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    ).multiplyScalar(Math.min(window.devicePixelRatio, 2));

    otherMesh.current.rotation.x = Math.cos(clock.elapsedTime / 2);
    otherMesh.current.rotation.y = Math.sin(clock.elapsedTime / 2);
    otherMesh.current.rotation.z = Math.sin(clock.elapsedTime / 2);

    gl.setRenderTarget(null);
  });

  return (
    <>
      <OrbitControls attach="orbitControls" />
      {createPortal(
        <>
          <PerspectiveCamera
            makeDefault
            manual
            ref={otherCamera}
            position={[0, 0, 16]}
          />
          <Sky sunPosition={[10, 10, 0]} />
          <Environment preset="sunset" />
          <directionalLight args={[10, 10, 0]} intensity={1} />
          <ambientLight intensity={0.5} />
          <ContactShadows
            frames={1}
            scale={10}
            position={[0, -2, 0]}
            blur={8}
            opacity={0.75}
          />
          <group>
            <mesh ref={otherMesh}>
              <dodecahedronGeometry args={[1]} />
              <meshPhysicalMaterial
                roughness={0}
                clearcoat={1}
                clearcoatRoughness={0}
                color="#73B9ED"
              />
            </mesh>
            <mesh position={[-3, 1, -2]}>
              <dodecahedronGeometry args={[1]} />
              <meshPhysicalMaterial
                roughness={0}
                clearcoat={1}
                clearcoatRoughness={0}
                color="#73B9ED"
              />
            </mesh>
            <mesh position={[3, -1, -2]}>
              <dodecahedronGeometry args={[1]} />
              <meshPhysicalMaterial
                roughness={0}
                clearcoat={1}
                clearcoatRoughness={0}
                color="#73B9ED"
              />
            </mesh>
          </group>
        </>,
        otherScene
      )}
      <mesh ref={mesh} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <shaderMaterial
          key={uuidv4()}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
          wireframe={false}
        />
      </mesh>
    </>
  );
};

const Scene = () => {
  return (
    <>
      <ScreenCoordinates />
      <OrbitControls />
    </>
  );
};

export default Scene;
