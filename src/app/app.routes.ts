/**
 * Definición de rutas de la aplicación con lazy loading.
 * Cada página se carga bajo demanda para reducir el bundle inicial.
 * La ruta vacía redirige a /fondos; cualquier ruta desconocida también.
 */
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'fondos',
    pathMatch: 'full',
  },
  {
    path: 'fondos',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
    title: 'Fondos disponibles - BTG',
  },
  {
    path: 'historial',
    loadComponent: () => import('./pages/history/history').then((m) => m.HistoryComponent),
    title: 'Historial de transacciones - BTG',
  },
  {
    path: '**',
    redirectTo: 'fondos',
  },
];
