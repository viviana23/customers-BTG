import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../models/toast.model';

/** Mostrar notificaciones tipo toast*/
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);

  /** Lista de toasts activos (solo lectura) */
  readonly toasts = this._toasts.asReadonly();

  /** Muestra un toast y lo descarta automáticamente después del tiempo indicado */
  show(message: string, type: ToastType = 'info', duration = 4000): void {
    const id = crypto.randomUUID();
    this._toasts.update((ts) => [...ts, { id, message, type }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  /** Muestra un toast de exito */
  success(message: string): void {
    this.show(message, 'success');
  }

  /** Muestra un toast de error con mayor duración */
  error(message: string): void {
    this.show(message, 'error', 6000);
  }

  /** Descarta un toast por su ID */
  dismiss(id: string): void {
    this._toasts.update((ts) => ts.filter((t) => t.id !== id));
  }
}
