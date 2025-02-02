import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import SleepVisualization from "./components/visualizations/SleepVisualization";
import Advanced3DScene from "./components/visualizations/three/Advanced3DScene";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/charts" element={<SleepVisualization />} />
        <Route path="/3d" element={<Advanced3DScene />} />
        <Route path="*" element={<Navigate to="/charts" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
