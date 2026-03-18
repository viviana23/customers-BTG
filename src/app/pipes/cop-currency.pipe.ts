import { Pipe, PipeTransform } from '@angular/core';
import { formatCOP } from '../utils/currency.utils';

/**
 * Responsabilidad única: transformar un número a moneda COP en plantillas HTML.
 * Delega el formateo a la función utilitaria formatCOP
 * Ej: {{ 500000 | cop }} => COP 500.000
 */
@Pipe({ name: 'cop', standalone: true })
export class CopCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    return formatCOP(value);
  }
}
