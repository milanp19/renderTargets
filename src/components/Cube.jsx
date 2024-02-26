import React, { forwardRef, useRef } from "react";
import { useGLTF } from "@react-three/drei";

const Cube = forwardRef(function Cube(props, ref) {
  const { nodes, materials } = useGLTF("/models/rubiks_cube.glb");
  return (
    <group {...props} dispose={null} ref={ref}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={1.154}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.RubixCube_RubixCube_0.geometry}
            material={materials.RubixCube}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          />
        </group>
      </group>
    </group>
  );
});

useGLTF.preload("/models/rubiks_cube.glb");

export { Cube };
