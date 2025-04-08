import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { Dino } from "../types.ts";

export default function Index() {
  const [dinosaurs, setDinosaurs] = useState<Dino[]>([]);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/dinosaurs/`);
      const allDinosaurs = (await response.json()) as Dino[];
      setDinosaurs(allDinosaurs);
    })();
  }, []);

  return (
    <main>
      <h1>Welcome to the Dinosaur app</h1>
      <p>Click on a dinosaur below to learn more.</p>
      
      {/* About button on top */}
      <div className="about-container">
        <button onClick={() => navigate("/about")} className="about-button">
          Learn About This App
        </button>
      </div>

      {/* List of dinosaurs */}
      <div className="dinosaurs-container">
        {dinosaurs.map((dinosaur: Dino) => (
          <Link
            to={`/${dinosaur.name.toLowerCase()}`}
            key={dinosaur.name}
            className="dinosaur"
          >
            {dinosaur.name}
          </Link>
        ))}
      </div>
    </main>
  );
}