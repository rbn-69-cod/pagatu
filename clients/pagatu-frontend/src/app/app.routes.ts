import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { rolGuard } from './core/guards/rol-guard';

export const routes: Routes = [
  {
    path: 'auth/callback',
    loadComponent: () => import('./core/auth/auth-callback').then((m) => m.AuthCallback),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: '',
        loadComponent: () => import('./core/inicio/inicio').then((m) => m.Inicio),
      },
      {
        path: 'categorias',
        loadComponent: () => import('./features/catalogo/categoria-list').then((m) => m.CategoriaList),
      },
      {
        path: 'categorias/nueva',
        canActivate: [rolGuard('ADMIN')],
        loadComponent: () => import('./features/catalogo/categoria-form').then((m) => m.CategoriaForm),
      },
      {
        path: 'categorias/:id/editar',
        canActivate: [rolGuard('ADMIN')],
        loadComponent: () => import('./features/catalogo/categoria-form').then((m) => m.CategoriaForm),
      },
      {
        path: 'ordenes/nueva',
        loadComponent: () => import('./features/ordenes/orden-form').then((m) => m.OrdenForm),
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./features/pedidos/mis-pedidos').then((m) => m.MisPedidos),
      },
    ],
  },
];