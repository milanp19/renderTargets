import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import Experience from "./components/Experience";
import Scene from "./components/Experience2";
import Lens from "./components/Lens";
import { useControls } from "leva";
import Portal from "./components/Portal";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import Transition from "./components/Transition";

function App() {
  const { scenes } = useControls({
    scenes: {
      value: 1,
      options: { scene1: 1, scene2: 2, scene3: 3, scene4: 4, scene5: 5 },
    },
  });

  return (
    <Canvas camera={{ position: [0, 0, 3] }} dpr={[1, 2]}>
      {scenes === 1 ? (
        <Experience />
      ) : scenes === 2 ? (
        <Scene />
      ) : scenes === 3 ? (
        <Lens />
      ) : scenes === 4 ? (
        <Portal />
      ) : (
        <Transition />
      )}

      <OrbitControls />
    </Canvas>
  );
}

export default App;
