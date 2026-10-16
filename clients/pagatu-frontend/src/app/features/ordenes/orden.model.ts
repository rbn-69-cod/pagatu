export interface DetalleOrdenRequest {
  idProducto: number;
  cantidad: number;
}

export interface OrdenRequest {
  metodoPago: string;
  detalles: DetalleOrdenRequest[];
}

export interface DetalleOrdenResponse {
  idProducto: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface OrdenResponse {
  id: number;
  idCliente: string;
  fechaCreacion: string;
  estado: string;
  total: number;
  detalles: DetalleOrdenResponse[];
}

