import { Component, input, output, inject, computed } from '@angular/core';
import { Fund } from '../../models/fund.model';
import { PortfolioService } from '../../services/portfolio.service';
import { CopCurrencyPipe } from '../../pipes/cop-currency.pipe';

/**
 * Tarjeta que muestra la información de un fondo de inversión.
 * Permite suscribirse o cancelar la suscripción según el estado actual del usuario.
 */
@Component({
  selector: 'app-fund-card',
  standalone: true,
  imports: [CopCurrencyPipe],
  templateUrl: './fund-card.html',
  styleUrl: './fund-card.scss',
})
export class FundCardComponent {
  fund = input.required<Fund>();
  subscribe = output<Fund>();
  cancel = output<Fund>();

  private readonly portfolio = inject(PortfolioService);

  /** Indica si el usuario está actualmente suscrito a este fondo */
  isSubscribed = computed(() => this.portfolio.subscribedFundIds().has(this.fund().id));

  /** Indica si el usuario tiene saldo suficiente para suscribirse */
  canAfford = computed(() => this.portfolio.balance() >= this.fund().minimumAmount);

  /** Propaga el evento de suscripción al componente padre con el fondo actual */
  onSubscribe(): void {
    this.subscribe.emit(this.fund());
  }

  /** Propaga el evento de cancelación al componente padre con el fondo actual */
  onCancel(): void {
    this.cancel.emit(this.fund());
  }
}
