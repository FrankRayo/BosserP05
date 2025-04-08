import { Link } from "react-router-dom";

export default function About() {
  return (
    <main>
      <h1>About the Dinosaur App</h1>
      <p>This app provides information about various dinosaurs. Explore and learn more!</p>
      <Link to="/" className="back-link">
        Go back to the homepage
      </Link>
    </main>
  );
}