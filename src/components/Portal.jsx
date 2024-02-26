import { Environment, OrbitControls, useFBO } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import { SolvedCube } from "./SolvedCube";
import { Cube } from "./Cube";
import { Vector2 } from "three";

import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";

const Portal = () => {
  const { camera } = useThree();
  const mesh = useRef();

  const cylinder1 = useRef();
  const cylinder2 = useRef();
  const unsolvedCube = useRef();
  const solvedCube = useRef();

  const renderTarget1 = useFBO();
  const renderTarget2 = useFBO();

  useEffect(() => {
    camera.position.set(0, 0, 10);
  }, []);

  const uniforms = useMemo(() => ({
    uTexture: { value: null },
    winResolution: {
      value: new Vector2(window.innerWidth, window.innerHeight).multiplyScalar(
        window.devicePixelRatio,
        2
      ),
    },
  }));
  useFrame(({ clock, gl, scene, camera }) => {
    cylinder1.current.material.forEach((material) => {
      if (material.type === "Shadermaterial") {
        cylinder1.current.material.uniforms.winResolution.value = new Vector2(
          window.innerWidth,
          window.innerHeight
        ).multiplyScalar(window.devicePixelRatio, 2);
      }
    });
    cylinder2.current.material.forEach((material) => {
      if (material.type === "Shadermaterial") {
        cylinder2.current.material.uniforms.winResolution.value = new Vector2(
          window.innerWidth,
          window.innerHeight
        ).multiplyScalar(window.devicePixelRatio, 2);
      }
    });

    solvedCube.current.visible = false;
    unsolvedCube.current.visible = true;

    gl.setRenderTarget(renderTarget1);
    gl.render(scene, camera);

    unsolvedCube.current.visible = false;
    solvedCube.current.visible = true;

    gl.setRenderTarget(renderTarget2);
    gl.render(scene, camera);

    const newXPos = Math.sin(clock.elapsedTime) * 4.0;
    solvedCube.current.position.x = newXPos;
    unsolvedCube.current.position.x = newXPos;

    gl.setRenderTarget(null);
  });

  return (
    <>
      <Environment preset="city" />
      <mesh position={[-4, 0, 0]} ref={cylinder1} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[3, 3, 8, 32]} />
        <shaderMaterial
          uniforms={{ ...uniforms, uTexture: { value: renderTarget1.texture } }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          attach={"material-0"}
        />
        <shaderMaterial
          uniforms={{ ...uniforms, uTexture: { value: renderTarget1.texture } }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          attach={"material-1"}
        />
        <meshBasicMaterial
          color={"green"}
          opacity={0}
          transparent
          attach={"material-2"}
        />
      </mesh>
      <mesh position={[4, 0, 0]} ref={cylinder2} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[3, 3, 8, 32]} />
        <shaderMaterial
          uniforms={{ ...uniforms, uTexture: { value: renderTarget2.texture } }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          attach={"material-0"}
        />
        <meshBasicMaterial
          color={"green"}
          opacity={0}
          transparent
          attach={"material-1"}
        />
        <shaderMaterial
          uniforms={{ ...uniforms, uTexture: { value: renderTarget2.texture } }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          attach={"material-2"}
        />
      </mesh>
      <mesh position={[0, 0, 0]} rotation-y={-Math.PI / 2}>
        <torusGeometry args={[3, 0.2, 16, 100]} />
      </mesh>
      <SolvedCube ref={solvedCube} position={[0, -1, 0]} scale={0.4} />
      <Cube ref={unsolvedCube} position={[0, 0.1, 0]} scale={18} />
      <OrbitControls />
    </>
  );
};

export default Portal;
