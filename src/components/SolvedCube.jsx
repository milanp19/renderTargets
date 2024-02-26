import React, { forwardRef, useRef } from "react";
import { useGLTF } from "@react-three/drei";

const SolvedCube = forwardRef(function SolvedCube(props, ref) {
  const { nodes, materials } = useGLTF("/models/rubiks_cube_solved.glb");
  return (
    <group {...props} dispose={null} ref={ref}>
      <group scale={0.01}>
        <mesh
          geometry={nodes.Baked_baked_0.geometry}
          material={materials.baked}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
      </group>
    </group>
  );
});

useGLTF.preload("/models/rubiks_cube_solved.glb");

export { SolvedCube };
