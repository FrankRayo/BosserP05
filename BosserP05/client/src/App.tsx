import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="container-fluid">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
