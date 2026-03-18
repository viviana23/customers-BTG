/** Tipo de notificación toast */
export type ToastType = 'success' | 'error' | 'info';

/** Representa una notificación activa en pantalla */
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
