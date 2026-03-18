import { Injectable, signal } from '@angular/core';
import { Transaction } from '../models/transaction.model';

/**
 * Gestionar el historial de transacciones del usuario.
 */
@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly _transactions = signal<Transaction[]>([]);

  /** Historial de transacciones en orden descendente (solo lectura) */
  readonly transactions = this._transactions.asReadonly();

  /** Registra una nueva transacción en el historial */
  record(transaction: Omit<Transaction, 'id' | 'date'>): void {
    this._transactions.update((ts) => [
      { ...transaction, id: crypto.randomUUID(), date: new Date() },
      ...ts,
    ]);
  }
}
