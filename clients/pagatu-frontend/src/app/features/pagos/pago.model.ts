export interface PagoResponse {
  id: number;
  ordenId: number;
  monto: number;
  metodoPago: string;
  estado: string;
  fechaPago: string;
}

