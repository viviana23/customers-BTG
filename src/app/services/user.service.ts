import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { User } from '../models/user.model';

/**
 * Cargar y exponer los datos del usuario.
 * Se inicializa antes de que arranque la app mediante provideAppInitializer.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly _user = signal<User | null>(null);

  /** Datos del usuario (disponibles tras la inicialización de la app) */
  readonly user = this._user.asReadonly();

  /** Carga el usuario desde el mock de API llamado por provideAppInitializer. */
  loadUser() {
    return this.http.get<User>('/mock-user.json').pipe(tap((user) => this._user.set(user)));
  }
}
