import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

/** Componente para mostrar notificaciones tipo snackbar en la esquina inferior derecha */
@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class ToastComponent {
  private toastService = inject(ToastService);

  /** Lista reactiva de notificaciones activas, proyectada desde ToastService */
  toasts = this.toastService.toasts;

  /** Cierra manualmente una notificación por su identificador único */
  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
