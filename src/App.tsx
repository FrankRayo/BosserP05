import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/index";
import Dinosaur from "./pages/Dinosaur";
import About from "./pages/about"; // Import the About page
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/:selectedDinosaur" element={<Dinosaur />} />
        <Route path="/about" element={<About />} /> {/* Add the About route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;