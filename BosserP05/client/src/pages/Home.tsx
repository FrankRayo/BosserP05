import { useState } from "react";
import type { Package } from "../../../server/models/packageModel.ts";


export default function Home() {
  const [mode, setMode] = useState<"inicio" | "conserje" | "login_residente" | "residente_home">("inicio");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pendingPackages, setPendingPackages] = useState<Package[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/verify_resident", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (result.success) {
      setPendingPackages(result.packages);
      setMode("residente_home");
      setMessage(`Tienes ${result.packages.length} paquete(s) pendiente(s).`);
    } else {
      setMessage("Correo incorrecto o sin paquetes pendientes.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {mode === "inicio" && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Selecciona Modo de Ingreso</h1>
          <button
            type="button"
            onClick={() => setMode("conserje")}
            className="px-4 py-2 bg-blue-600 text-white rounded mr-4"
          >
            Modo Conserjería
          </button>
          <button
            type="button"
            onClick={() => setMode("login_residente")}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Modo Residente
          </button>
        </div>
      )}

      {mode === "login_residente" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Ingreso de Residente</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
            <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded">
              Ingresar
            </button>
          </form>
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
      )}

      {mode === "conserje" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Registrar nuevo paquete</h2>
          <form
            action="/api/paquetes"
            method="POST"
            className="space-y-4"
          >
            <input name="tracking_id" placeholder="Tracking ID" required className="w-full p-2 border rounded" />
            <input name="destinatario" placeholder="Correo del destinatario" required className="w-full p-2 border rounded" />
            <input name="departamento" placeholder="Departamento" required className="w-full p-2 border rounded" />
            <select name="tipo" className="w-full p-2 border rounded">
              <option value="Normal">Normal</option>
              <option value="Congelado">Congelado</option>
              <option value="Frágil">Frágil</option>
              <option value="Urgente">Urgente</option>
            </select>
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
              Registrar Paquete
            </button>
          </form>
        </div>
      )}

      {mode === "residente_home" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Resumen de Paquetes Pendientes</h2>
          {message && <p className="mb-2">{message}</p>}
          {pendingPackages.length > 0 ? (
            <ul className="list-disc list-inside">
              {pendingPackages.map((pkg, i) => (
                <li key={i}>
                  <strong>{pkg.tracking_id}</strong> - Tipo: {pkg.tipo}, Departamento: {pkg.departamento}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes paquetes pendientes.</p>
          )}
        </div>
      )}
    </div>
  );
}
