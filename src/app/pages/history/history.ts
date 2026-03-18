import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { CopCurrencyPipe } from '../../pipes/cop-currency.pipe';

/** Página de historial de transacciones del usuario */
@Component({
  selector: 'app-history',
  standalone: true,
  imports: [DatePipe, CopCurrencyPipe],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class HistoryComponent {
  private readonly transactionService = inject(TransactionService);

  /** Lista de transacciones del usuario en orden cronológico descendente */
  transactions = this.transactionService.transactions;
}
