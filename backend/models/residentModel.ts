import { Bson } from "../deps.ts"; 

export interface Resident {
  _id?: Bson.ObjectId;
  nombre: string;
  departamento: string;
  telefono: string;
  email: string;
}
