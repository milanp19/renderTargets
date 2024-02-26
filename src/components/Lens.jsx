import {
  ContactShadows,
  Environment,
  PerspectiveCamera,
  Sky,
  useFBO,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import { Color, MathUtils, MeshBasicMaterial, Vector2 } from "three";
import { v4 as uuidv4 } from "uuid";

import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";

const Lens = () => {
  const lens = useRef();
  const mesh1 = useRef();
  const mesh2 = useRef();
  const mesh3 = useRef();
  const mesh4 = useRef();

  const renderTarget = useFBO();

  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 3);
    camera.rotation.set(0, 0, 0);
  }, []);

  const uniforms = useMemo(() => ({
    uTexture: {
      value: null,
    },
    winResolution: {
      value: new Vector2(window.innerWidth, window.innerHeight).multiplyScalar(
        window.devicePixelRatio,
        2
      ),
    },
  }));

  useFrame((state) => {
    const { scene, camera, gl, pointer } = state;

    const viewport = state.viewport.getCurrentViewport(camera, [0, 0, 2]);

    lens.current.position.x = MathUtils.lerp(
      lens.current.position.x,
      (pointer.x * viewport.width) / 2,
      0.1
    );
    lens.current.position.y = MathUtils.lerp(
      lens.current.position.y,
      (pointer.y * viewport.height) / 2,
      0.1
    );

    const oldMaterialMesh3 = mesh3.current.material;
    const oldMaterialMesh4 = mesh4.current.material;

    mesh1.current.visible = false;
    mesh2.current.visible = true;

    mesh3.current.material = new MeshBasicMaterial();
    mesh3.current.material.color = new Color("#000000");
    mesh3.current.material.wireframe = true;

    mesh4.current.material = new MeshBasicMaterial();
    mesh4.current.material.color = new Color("#000000");
    mesh4.current.material.wireframe = true;

    gl.setRenderTarget(renderTarget);
    gl.render(scene, camera);

    lens.current.material.uniforms.uTexture.value = renderTarget.texture;
    lens.current.material.uniforms.winResolution.value = new Vector2(
      window.innerWidth,
      window.innerHeight
    ).multiplyScalar(window.devicePixelRatio, 2);

    mesh1.current.visible = true;
    mesh2.current.visible = false;

    mesh3.current.material = oldMaterialMesh3;
    mesh3.current.material.wireframe = false;

    mesh4.current.material = oldMaterialMesh4;
    mesh4.current.material.wireframe = false;

    gl.setRenderTarget(null);
  });
  return (
    <>
      <PerspectiveCamera manual position={[0, 0, 8]} />
      <Sky sunPosition={[10, 10, 0]} />
      <Environment preset="sunset" />
      <directionalLight args={[10, 10, 0]} intensity={1} />
      <ambientLight intensity={0.5} />
      <ContactShadows
        frames={1}
        scale={10}
        position={[0, -2, 0]}
        blur={4}
        opacity={0.2}
      />
      <mesh ref={lens} scale={0.13} position={[0, 0, 2.5]}>
        <sphereGeometry args={[1, 128]} />
        <shaderMaterial
          key={uuidv4()}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
          wireframe={false}
        />
      </mesh>
      <group>
        <mesh ref={mesh2} scale={0.7}>
          <torusGeometry args={[1, 0.25, 16, 100]} />
          <meshPhysicalMaterial
            roughness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            color="#73B9ED"
          />
        </mesh>
        <mesh ref={mesh1} scale={0.7}>
          <dodecahedronGeometry args={[1]} />
          <meshPhysicalMaterial
            roughness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            color="#73B9ED"
          />
        </mesh>
        <mesh ref={mesh3} position={[-3, 1, -2]}>
          <icosahedronGeometry args={[1, 8, 8]} />
          <meshPhysicalMaterial
            roughness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            color="#73B9ED"
          />
        </mesh>
        <mesh ref={mesh4} position={[3, -1, -2]}>
          <icosahedronGeometry args={[1, 8, 8]} />
          <meshPhysicalMaterial
            roughness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            color="#73B9ED"
          />
        </mesh>
      </group>
    </>
  );
};

export default Lens;
