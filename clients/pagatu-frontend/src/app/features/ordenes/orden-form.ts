import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductoService } from '../catalogo/producto-service';
import { Producto } from '../catalogo/producto.model';
import { OrdenService } from './orden-service';
import { OrdenRequest, OrdenResponse } from './orden.model';

@Component({
  selector: 'app-orden-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './orden-form.html',
  styles: [`
    .form-group { margin-bottom: 1rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    input, select { width: 100%; max-width: 400px; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.25rem; }
    button { padding: 0.5rem 1rem; background-color: #2563eb; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-weight: 500; }
    button:disabled { background-color: #9ca3af; cursor: not-allowed; }
    .status-badge { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: bold; background: #fef08a; color: #854d0e; }
    .alert-success { background: #dcfce7; border: 1px solid #86efac; color: #166534; padding: 1rem; border-radius: 0.25rem; margin-top: 1rem; }
  `]
})
export class OrdenForm implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly ordenService = inject(OrdenService);
  private readonly router = inject(Router);

  protected readonly productos = signal<Producto[]>([]);
  protected readonly idProductoSeleccionado = signal<number | null>(null);
  protected readonly cantidad = signal<number>(1);
  protected readonly metodoPago = signal<string>('YAPE_PLIN');
  protected readonly guardando = signal<boolean>(false);
  protected readonly ordenCreada = signal<OrdenResponse | null>(null);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.productoService.listar().subscribe({
      next: (prods) => {
        this.productos.set(prods);
        if (prods.length > 0) {
          this.idProductoSeleccionado.set(prods[0].id);
        }
      },
      error: () => this.error.set('No se pudo cargar la lista de productos')
    });
  }

  crearOrden(): void {
    const idProd = this.idProductoSeleccionado();
    if (!idProd) return;

    this.guardando.set(true);
    this.error.set(null);

    const request: OrdenRequest = {
      metodoPago: this.metodoPago(),
      detalles: [{
        idProducto: idProd,
        cantidad: this.cantidad()
      }]
    };

    this.ordenService.crear(request).subscribe({
      next: (resp) => {
        this.guardando.set(false);
        this.ordenCreada.set(resp);
      },
      error: (err) => {
        this.guardando.set(false);
        this.error.set(err.error?.message || 'Error al crear la orden');
      }
    });
  }
}

