import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

/**
 * Interceptor HTTP funcional que centraliza el manejo de errores de red.
 * Captura cualquier HttpErrorResponse, muestra un mensaje apropiado al usuario
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      toastService.error(getErrorMessage(error));
      return throwError(() => error);
    }),
  );
};

/** Traduce un HttpErrorResponse a un mensaje legible para el usuario */
function getErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'No se pudo conectar al servidor. Verifique su conexión a internet.';
  }
  switch (error.status) {
    case 400:
      return 'Solicitud inválida. Verifique los datos enviados.';
    case 401:
      return 'No autorizado. Por favor inicie sesión.';
    case 403:
      return 'No tiene permisos para realizar esta acción.';
    case 404:
      return 'El recurso solicitado no fue encontrado.';
    case 500:
      return 'Error interno del servidor. Intente más tarde.';
    default:
      return `Error inesperado (${error.status}). Intente de nuevo.`;
  }
}
