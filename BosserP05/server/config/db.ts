import { MongoClient } from "../../deps.ts";
import type { Package } from "../models/packageModel.ts";
import type { Resident } from "../models/residentModel.ts";
import type { Usuario } from "../models/userModel.ts"; 

const client = new MongoClient();
await client.connect("mongodb://127.0.0.1:27017");

const db = client.database("gestion_paquetes");

// Tipamos las colecciones
export const packages = db.collection<Package>("packages");
export const residents = db.collection<Resident>("residents");
export const usuarios = db.collection<Usuario>("usuarios");

export default db; 
