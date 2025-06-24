import { MongoClient } from "../../deps.ts";

// Variables de entorno para la configuración de la base de datos
const MONGO_USERNAME = Deno.env.get("MONGO_USERNAME") || "fabiatronix2003";
const MONGO_PASSWORD = Deno.env.get("MONGO_PASSWORD") || "bosser123";
const MONGO_CLUSTER = Deno.env.get("MONGO_CLUSTER") || "cluster0.ldnjccq.mongodb.net";
const DB_NAME = Deno.env.get("DB_NAME") || "gestion_paquetes";

// Crear la URI de conexión para MongoDB Atlas
// IMPORTANTE: Incluir authMechanism=SCRAM-SHA-1 explícitamente
const mongoURI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/?retryWrites=true&w=majority&authSource=admin&authMechanism=SCRAM-SHA-1`;

console.log("🔐 Intentando conectar con usuario:", MONGO_USERNAME);
console.log("🌐 Cluster:", MONGO_CLUSTER);
console.log("🔗 Conectando a MongoDB Atlas...");

// Crear instancia del cliente
const client = new MongoClient();

// Función para conectar a MongoDB Atlas
async function connectToMongoDB() {
  try {
    console.log("🔗 URI de conexión:", mongoURI.replace(MONGO_PASSWORD!, "***"));
    
    // Conectar usando la URI de MongoDB Atlas
    await client.connect(mongoURI);
    
    // Seleccionar la base de datos
    const database = client.database(DB_NAME);
    
    // Test de conexión simple - intentar listar las colecciones
    try {
      await database.listCollectionNames();
      console.log("✅ Conectado exitosamente a MongoDB Atlas");
    } catch (_pingError) {
      console.log("⚠️ Conexión establecida pero sin poder hacer ping completo");
    }
    
    return database;
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB Atlas:");
    console.error("   Cluster:", MONGO_CLUSTER);
    console.error("   Usuario:", MONGO_USERNAME);
    console.error("   Base de datos:", DB_NAME);
    console.error("   Error detallado:", error);
    
    throw error;
  }
}

// Conectar inmediatamente y obtener la instancia de la base de datos
const db = await connectToMongoDB();

// Exportar colecciones
export const packages = db.collection("packages");
export const residents = db.collection("residents");
export const usuarios = db.collection("usuarios");

// Función para obtener la base de datos
export function getDatabase() {
  return db;
}

// Función para cerrar la conexión
export async function closeConnection(): Promise<void> {
  try {
    await client.close();
    console.log("🔌 Conexión a MongoDB cerrada");
  } catch (error) {
    console.error("❌ Error al cerrar la conexión:", error);
  }
}

export default db;
