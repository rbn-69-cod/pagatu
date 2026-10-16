import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrdenService } from '../ordenes/orden-service';
import { PagoService } from '../pagos/pago-service';
import { AuthService } from '../../core/auth/auth-service';
import { OrdenResponse } from '../ordenes/orden.model';
import { PagoResponse } from '../pagos/pago.model';

export interface PedidoConPago {
  orden: OrdenResponse;
  pago: PagoResponse | null;
}

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-pedidos.html',
  styles: [`
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left; }
    th { background-color: #f9fafb; font-weight: 600; }
    .badge-pending { background-color: #fef08a; color: #854d0e; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: bold; animation: pulse 2s infinite; }
    .badge-paid { background-color: #dcfce7; color: #166534; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: bold; }
    .badge-canceled { background-color: #fee2e2; color: #991b1b; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: bold; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  `]
})
export class MisPedidos implements OnInit, OnDestroy {
  private readonly ordenService = inject(OrdenService);
  private readonly pagoService = inject(PagoService);
  protected readonly auth = inject(AuthService);
  protected readonly pedidos = signal<PedidoConPago[]>([]);
  protected readonly cargando = signal<boolean>(true);
  private intervalo?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.cargar();
    this.intervalo = setInterval(() => this.refrescarPendientes(), 3000);
  }

  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  private cargar(): void {
    this.ordenService.listar().subscribe({
      next: (ordenes) => {
        this.cargando.set(false);
        const subUsuario = this.auth.idCliente();
        // Filtrar del lado del cliente por el sub del token
        const propias = subUsuario ? ordenes.filter((o) => o.idCliente === subUsuario) : ordenes;
        const lista: PedidoConPago[] = propias.map((orden) => ({ orden, pago: null }));
        this.pedidos.set(lista);

        // Consultar pagos para las órdenes que ya terminaron su proceso
        for (const item of lista) {
          if (item.orden.estado !== 'PENDIENTE_PAGO') {
            this.consultarPago(item.orden.id);
          }
        }
      },
      error: () => this.cargando.set(false)
    });
  }

  private refrescarPendientes(): void {
    const pendientes = this.pedidos().filter((p) => p.orden.estado === 'PENDIENTE_PAGO');
    for (const pendiente of pendientes) {
      this.ordenService.obtener(pendiente.orden.id).subscribe((actualizada) => {
        if (actualizada.estado !== 'PENDIENTE_PAGO') {
          this.consultarPago(actualizada.id);
        }
        this.pedidos.update((lista) =>
          lista.map((p) => (p.orden.id === actualizada.id ? { ...p, orden: actualizada } : p)),
        );
      });
    }
  }

  private consultarPago(ordenId: number): void {
    this.pagoService.buscarPorOrden(ordenId).subscribe({
      next: (pagoResp) => {
        this.pedidos.update((lista) =>
          lista.map((p) => (p.orden.id === ordenId ? { ...p, pago: pagoResp } : p)),
        );
      },
      error: () => {}
    });
  }
}

