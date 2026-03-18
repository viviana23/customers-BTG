/**
 * Configuración global de la aplicación.
 * Define los providers raíz: router, HttpClient con interceptor de errores,
 * y el inicializador que carga los datos del usuario antes del primer render.
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { httpErrorInterceptor } from './interceptors/http-error.interceptor';
import { UserService } from './services/user.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    // Carga los datos del usuario antes de que arranque la app
    provideAppInitializer(() => inject(UserService).loadUser()),
  ]
};
