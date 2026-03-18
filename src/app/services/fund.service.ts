import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fund } from '../models/fund.model';

/**
 * Responsabilidad única: obtener los fondos disponibles desde la API.
 * Los errores HTTP son manejados de forma centralizada por httpErrorInterceptor.
 */
@Injectable({ providedIn: 'root' })
export class FundService {
  private readonly http = inject(HttpClient);

  /** Retorna los fondos disponibles desde el mock de API REST */
  getFunds(): Observable<Fund[]> {
    return this.http.get<Fund[]>('/mock-funds.json');
  }
}
