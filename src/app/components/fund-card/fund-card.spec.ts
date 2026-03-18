import { render, screen, fireEvent } from '@testing-library/angular';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { FundCardComponent } from './fund-card';
import { PortfolioService } from '../../services/portfolio.service';
import { Fund } from '../../models/fund.model';

const FUND: Fund = {
  id: 1,
  name: 'FPV_BTG_PACTUAL_RECAUDADORA',
  minimumAmount: 75_000,
  category: 'FPV',
};

/**
 * Crea un mock mínimo de PortfolioService que satisface las lecturas del componente.
 * Solo expone las dos signals que FundCardComponent consume.
 */
function mockPortfolio(opts: { subscribedIds?: number[]; balance?: number } = {}) {
  return {
    subscribedFundIds: signal(new Set<number>(opts.subscribedIds ?? [])),
    balance: signal(opts.balance ?? 500_000),
  };
}

/**
 * Helper que renderiza FundCardComponent con la configuración deseada.
 */
function setup(portfolioOpts: { subscribedIds?: number[]; balance?: number } = {}) {
  return render(FundCardComponent, {
    inputs: { fund: FUND },
    providers: [{ provide: PortfolioService, useValue: mockPortfolio(portfolioOpts) }],
  });
}

describe('FundCardComponent', () => {
  describe('renderizado de datos del fondo', () => {
    it('muestra el nombre del fondo', async () => {
      await setup();
      expect(screen.getByText(FUND.name)).toBeTruthy();
    });

    it('muestra la categoría del fondo', async () => {
      await setup();
      expect(screen.getByText('FPV')).toBeTruthy();
    });

    it('muestra el monto mínimo formateado en COP', async () => {
      await setup();
      // La pipe CopCurrencyPipe formatea 75000 => $ 75.000 en locale es-CO
      expect(screen.getByText(/75\.000/)).toBeTruthy();
    });
  });

  describe('estado no suscrito', () => {
    it('muestra el botón "Suscribirse" habilitado cuando hay saldo suficiente', async () => {
      await setup({ balance: 500_000 });

      const btn = screen.getByRole('button', { name: /Suscribirse/i }) as HTMLButtonElement;

      expect(btn).toBeTruthy();
      expect(btn.disabled).toBe(false);
    });

    it('deshabilita "Suscribirse" y muestra alerta cuando el saldo es insuficiente', async () => {
      await setup({ balance: 50_000 }); // menor al mínimo de $75.000

      const btn = screen.getByRole('button', { name: /Suscribirse/i }) as HTMLButtonElement;

      expect(btn.disabled).toBe(true);
      expect(screen.getByRole('alert')).toBeTruthy();
    });
  });

  describe('estado suscrito', () => {
    it('muestra el badge "Suscrito" y el botón de cancelación', async () => {
      await setup({ subscribedIds: [FUND.id] });

      expect(screen.getByText('Suscrito')).toBeTruthy();
      expect(screen.getByRole('button', { name: /Cancelar suscripción/i })).toBeTruthy();
    });

    it('no muestra el botón "Suscribirse" cuando ya está suscrito', async () => {
      await setup({ subscribedIds: [FUND.id] });

      expect(screen.queryByRole('button', { name: /Suscribirse/i })).toBeNull();
    });
  });

  describe('outputs', () => {
    it('emite el fondo al output "subscribe" al hacer clic en "Suscribirse"', async () => {
      const { fixture } = await setup();
      const spy = vi.fn();
      fixture.componentInstance.subscribe.subscribe(spy);

      fireEvent.click(screen.getByRole('button', { name: /Suscribirse/i }));

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(FUND);
    });

    it('emite el fondo al output "cancel" al hacer clic en "Cancelar suscripción"', async () => {
      const { fixture } = await setup({ subscribedIds: [FUND.id] });
      const spy = vi.fn();
      fixture.componentInstance.cancel.subscribe(spy);

      fireEvent.click(screen.getByRole('button', { name: /Cancelar suscripción/i }));

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(FUND);
    });
  });
});
