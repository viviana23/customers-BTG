import { Injectable, signal, computed, inject, WritableSignal, Signal } from '@angular/core';
import { Fund } from '../models/fund.model';
import { NotificationMethod } from '../models/transaction.model';
import { ActionResult } from '../models/action-result.model';
import { TransactionService } from './transaction.service';
import { UserService } from './user.service';

/**
 * Gestionar el estado del portafolio del usuario.
 * Controla el saldo, los fondos suscritos.
 * Delega el registro de transacciones a TransactionService.
 * El saldo inicial proviene de UserService (cargado desde el mock de API).
 */
@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly _balance: WritableSignal<number>;
  private readonly _subscribedFundIds = signal<Set<number>>(new Set<number>());

  private readonly transactionService = inject(TransactionService);
  private readonly userService = inject(UserService);

  /** Saldo actual del usuario (solo lectura) */
  readonly balance: Signal<number>;

  constructor() {
    // El saldo inicial viene del mock de usuario cargado por provideAppInitializer
    this._balance = signal(this.userService.user()!.balance);
    this.balance = this._balance.asReadonly();
  }

  /** Conjunto de IDs de fondos suscritos (solo lectura) */
  readonly subscribedFundIds = this._subscribedFundIds.asReadonly();

  /** Número de fondos suscritos actualmente */
  readonly subscribedCount = computed(() => this._subscribedFundIds().size);

  /** Verifica si el usuario está suscrito a un fondo específico */
  isSubscribed(fundId: number): boolean {
    return this._subscribedFundIds().has(fundId);
  }

  /**
   * Suscribe al usuario a un fondo.
   * Delega el registro histórico a TransactionService.
   */
  subscribe(fund: Fund, notificationMethod: NotificationMethod): ActionResult {
    if (this._subscribedFundIds().has(fund.id)) {
      return { success: false, errorCode: 'ALREADY_SUBSCRIBED' };
    }

    if (this._balance() < fund.minimumAmount) {
      return { success: false, errorCode: 'INSUFFICIENT_BALANCE' };
    }

    this._balance.update((b) => b - fund.minimumAmount);
    this._subscribedFundIds.update((ids) => {
      const updated = new Set(ids);
      updated.add(fund.id);
      return updated;
    });

    this.transactionService.record({
      fundId: fund.id,
      fundName: fund.name,
      type: 'SUBSCRIPTION',
      amount: fund.minimumAmount,
      notificationMethod,
    });

    return { success: true };
  }

  /**
   * Cancela la suscripción a un fondo.
   * Devuelve el monto al saldo y delega el registro a TransactionService.
   */
  cancelSubscription(fund: Fund): ActionResult {
    if (!this._subscribedFundIds().has(fund.id)) {
      return { success: false, errorCode: 'NOT_SUBSCRIBED' };
    }

    this._balance.update((b) => b + fund.minimumAmount);
    this._subscribedFundIds.update((ids) => {
      const updated = new Set(ids);
      updated.delete(fund.id);
      return updated;
    });

    this.transactionService.record({
      fundId: fund.id,
      fundName: fund.name,
      type: 'CANCELLATION',
      amount: fund.minimumAmount,
    });

    return { success: true };
  }
}
