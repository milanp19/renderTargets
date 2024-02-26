import {
  Environment,
  OrbitControls,
  OrthographicCamera,
  Sky,
  useFBO,
  useHelper,
} from "@react-three/drei";
import { v4 as uuidv4 } from "uuid";

import { getFullscreenTriangle } from "./getFullScreenMesh";
import { createPortal, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { CameraHelper, DoubleSide, Scene, Vector3 } from "three";

import vertexShader from "../shaders/transitionvertex.glsl";
import fragmentShader from "../shaders/transitionfragment.glsl";
import { useControls } from "leva";

const Transition = () => {
  const scene1 = new Scene();
  const scene2 = new Scene();

  const renderTargetA = useFBO();
  const renderTargetB = useFBO();

  const screenMesh = useRef();
  const screenCamera = useRef();
  const cube = useRef();
  const sky = useRef();

  const { progress } = useControls({
    progress: { value: -1, min: -1, max: 1 },
  });

  useFrame(({ gl, camera }) => {
    sky.current.material.uniforms.sunPosition.value = new Vector3(10, 10, 0);
    gl.setRenderTarget(renderTargetA);
    gl.render(scene1, camera);

    sky.current.material.uniforms.sunPosition.value = new Vector3(0, -0.3, -10);
    gl.setRenderTarget(renderTargetB);
    gl.render(scene2, camera);

    screenMesh.current.material.uniforms.uTextureA.value =
      renderTargetA.texture;
    screenMesh.current.material.uniforms.uTextureB.value =
      renderTargetB.texture;
    screenMesh.current.material.uniforms.uProgress.value = progress;

    gl.setRenderTarget(null);
  });

  return (
    <>
      <OrbitControls />
      {createPortal(
        <>
          <Sky />
          <Environment preset="dawn" />
          <directionalLight args={[10, 10, 0]} intensity={1} />
          <ambientLight intensity={1} />
          <mesh>
            <boxGeometry />
            <meshBasicMaterial color={"red"} />
          </mesh>
        </>,
        scene1
      )}
      {createPortal(
        <>
          <Sky ref={sky} />
          <Environment preset="dawn" />
          <directionalLight args={[10, 10, 0]} intensity={1} />
          <ambientLight intensity={1} />
          <mesh>
            <sphereGeometry />
            <meshBasicMaterial color={"red"} />
          </mesh>
        </>,
        scene2
      )}
      <OrthographicCamera
        ref={screenCamera}
        left={-1}
        right={1}
        top={1}
        bottom={-1}
      />
      <mesh
        ref={screenMesh}
        geometry={getFullscreenTriangle()}
        frustumCulled={false}
      >
        <shaderMaterial
          key={uuidv4()}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            uTextureA: { value: null },
            uTextureB: { value: null },
            uProgress: { value: 0.0 },
          }}
        />
      </mesh>
    </>
  );
};

export default Transition;
