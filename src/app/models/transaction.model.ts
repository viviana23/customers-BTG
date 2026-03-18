/** Tipo de transacción: suscripción o cancelación */
export type TransactionType = 'SUBSCRIPTION' | 'CANCELLATION';

/** Método de notificación seleccionado al suscribirse */
export type NotificationMethod = 'email' | 'sms';

/** Representa una transacción registrada en el historial */
export interface Transaction {
  id: string;
  fundId: number;
  fundName: string;
  type: TransactionType;
  amount: number;
  date: Date;
  /** Solo presente en suscripciones */
  notificationMethod?: NotificationMethod;
}
