import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">BosserP05</h2>
      <ul className="space-y-4">
        <li><Link to="/" className="hover:text-blue-400">🏠 Home</Link></li>
      </ul>
    </div>
  );
}
