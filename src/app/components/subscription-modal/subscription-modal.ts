import { Component, input, output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Fund } from '../../models/fund.model';
import { NotificationMethod } from '../../models/transaction.model';
import { CopCurrencyPipe } from '../../pipes/cop-currency.pipe';

/**
 * Datos retornados al cerrar el modal de suscripción.
 * Si `confirmed` es false, `notificationMethod` será undefined.
 */
export interface ModalResult {
  confirmed: boolean;
  notificationMethod?: NotificationMethod;
}

/**
 * Modal de confirmación de suscripción a un fondo.
 * Permite al usuario seleccionar el método de notificación (email o SMS).
 */
@Component({
  selector: 'app-subscription-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CopCurrencyPipe],
  templateUrl: './subscription-modal.html',
  styleUrl: './subscription-modal.scss',
})
export class SubscriptionModalComponent {
  /** Fondo al que se quiere suscribir el usuario */
  fund = input.required<Fund>();

  /** Emite el resultado al cerrarse: confirmación o cancelación con método de notificación */
  close = output<ModalResult>();

  private fb = inject(FormBuilder);

  /** Formulario reactivo con el método de notificación seleccionado (email por defecto) */
  form = this.fb.group({
    notificationMethod: ['email' as NotificationMethod, Validators.required],
  });

  /** Confirma la suscripción si el formulario es válido y emite el resultado al padre */
  confirm(): void {
    if (this.form.valid) {
      this.close.emit({
        confirmed: true,
        notificationMethod: this.form.value.notificationMethod as NotificationMethod,
      });
    }
  }

  /** Cancela el flujo sin realizar ninguna acción y cierra el modal */
  onCancel(): void {
    this.close.emit({ confirmed: false });
  }

  /** Cierra el modal al hacer clic en el backdrop */
  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onCancel();
    }
  }
}
