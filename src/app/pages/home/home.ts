import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FundService } from '../../services/fund.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';
import { FundCardComponent } from '../../components/fund-card/fund-card';
import { SubscriptionModalComponent, ModalResult } from '../../components/subscription-modal/subscription-modal';
import { CopCurrencyPipe } from '../../pipes/cop-currency.pipe';
import { formatCOP } from '../../utils/currency.utils';
import { Fund, FundCategory } from '../../models/fund.model';

type Filter = 'all' | FundCategory;

/**
 * Página principal. Muestra el saldo del usuario, los fondos disponibles
 * con opciones de filtrado, y gestiona el flujo de suscripción/cancelación.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FundCardComponent, SubscriptionModalComponent, CopCurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  private readonly fundService = inject(FundService);
  private readonly portfolioService = inject(PortfolioService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  funds = signal<Fund[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  /** Fondo seleccionado para mostrar el modal de suscripción */
  selectedFund = signal<Fund | null>(null);
  activeFilter = signal<Filter>('all');

  balance = this.portfolioService.balance;
  /** Saldo inicial del usuario, proveniente del mock de API */
  initialBalance = this.userService.user()!.balance;

  /** Lista de fondos filtrada por categoría */
  filteredFunds = computed(() => {
    const filter = this.activeFilter();
    const all = this.funds();
    return filter === 'all' ? all : all.filter(f => f.category === filter);
  });

  ngOnInit(): void {
    this.loadFunds();
  }

  /** Llama al servicio para obtener los fondos disponibles y actualiza el estado de carga/error */
  loadFunds(): void {
    this.loading.set(true);
    this.error.set(null);
    this.fundService.getFunds().subscribe({
      next: (funds) => {
        this.funds.set(funds);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar los fondos. Por favor, intente de nuevo.');
        this.loading.set(false);
      },
    });
  }

  /** Actualiza el filtro activo de categoría; el computed `filteredFunds` se recalcula automáticamente */
  setFilter(filter: Filter): void {
    this.activeFilter.set(filter);
  }

  /** Almacena el fondo seleccionado para mostrar el modal de confirmación de suscripción */
  openSubscribeModal(fund: Fund): void {
    this.selectedFund.set(fund);
  }

  /** Delega la cancelación a PortfolioService y notifica al usuario con un toast de éxito o error */
  handleCancelSubscription(fund: Fund): void {
    const result = this.portfolioService.cancelSubscription(fund);
    if (result.success) {
      this.toastService.success(
        `Cancelación exitosa. Se han devuelto ${formatCOP(fund.minimumAmount)} a su saldo.`
      );
    } else {
      this.toastService.error(`No está suscrito al fondo ${fund.name}.`);
    }
  }

  /** Recibe el resultado del modal: si fue confirmado, intenta la suscripción y muestra el toast correspondiente */
  handleModalClose(result: ModalResult): void {
    const fund = this.selectedFund();
    this.selectedFund.set(null);

    if (!result.confirmed || !fund || !result.notificationMethod) return;

    const actionResult = this.portfolioService.subscribe(fund, result.notificationMethod);
    if (actionResult.success) {
      const method = result.notificationMethod === 'email' ? 'correo electrónico' : 'SMS';
      this.toastService.success(
        `¡Suscripción exitosa al fondo ${fund.name}! Se le notificará por ${method}.`
      );
    } else {
      this.toastService.error(this.buildSubscribeError(fund, actionResult.errorCode));
    }
  }

  /** Construye el mensaje de error de suscripción según el código recibido */
  private buildSubscribeError(fund: Fund, errorCode?: string): string {
    switch (errorCode) {
      case 'INSUFFICIENT_BALANCE':
        return (
          `Saldo insuficiente para vincularse al fondo ${fund.name}. ` +
          `Se requieren ${formatCOP(fund.minimumAmount)} y su saldo es ${formatCOP(this.balance())}.`
        );
      case 'ALREADY_SUBSCRIBED':
        return `Ya está suscrito al fondo ${fund.name}.`;
      default:
        return 'No fue posible completar la suscripción.';
    }
  }
}
