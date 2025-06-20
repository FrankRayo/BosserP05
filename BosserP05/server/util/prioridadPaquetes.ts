import type { Package } from "../models/packageModel.ts";

export function obtenerPaquetesPrioritarios(paquetes: Package[]): Package[] {
  const ahora = new Date();
  return paquetes.filter(pkg => {
    if (pkg.estado !== "Pendiente" || pkg.notificado) return false;

    const fechaRecepcion = new Date(pkg.fecha_recepcion);
    const horasEnBodega = (ahora.getTime() - fechaRecepcion.getTime()) / (1000 * 60 * 60);
    const minutosEnBodega =
      (ahora.getTime() - fechaRecepcion.getTime()) / (1000 * 60);

    // Umbral fijo de 5 minutos para todos los paquetes
    return minutosEnBodega >= 5;

    //switch (pkg.tipo) {
      //case "Urgente":
        //return horasEnBodega >= 2;
      //case "Congelado":
        //return horasEnBodega >= 0.5;
      //case "Frágil":
        //return horasEnBodega >= 6;
      //default:
        
        //return horasEnBodega >= 24; // Otros tipos se consideran prioritarios si llevan más de 24 horas en recepción
    //}
  });
}