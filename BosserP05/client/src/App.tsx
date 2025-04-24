import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.tsx";
import Home from "./pages/Home.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <div className="ml-64 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
