import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
import { CopCurrencyPipe } from '../../pipes/cop-currency.pipe';

/** Barra de navegación principal con saldo del usuario y enlaces de rutas */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CopCurrencyPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  private readonly portfolio = inject(PortfolioService);

  /** Saldo actual del usuario, enlazado desde PortfolioService */
  balance = this.portfolio.balance;

  /** Número de fondos suscritos actualmente, usado para el badge del navbar */
  subscribedCount = this.portfolio.subscribedCount;
}
