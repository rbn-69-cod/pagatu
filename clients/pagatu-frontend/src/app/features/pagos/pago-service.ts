import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagoResponse } from './pago.model';

@Injectable({ providedIn: 'root' })
export class PagoService {
  private readonly http = inject(HttpClient);

  buscarPorOrden(ordenId: number): Observable<PagoResponse> {
    return this.http.get<PagoResponse>(`${environment.apiBaseUrl}/api/v1/pagos/por-orden/${ordenId}`);
  }
}

