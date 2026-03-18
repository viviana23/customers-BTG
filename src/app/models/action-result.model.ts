/** Códigos de error posibles al operar sobre un fondo */
export type ActionErrorCode = 'ALREADY_SUBSCRIBED' | 'INSUFFICIENT_BALANCE' | 'NOT_SUBSCRIBED';

/**
 * Resultado de una operación sobre el portafolio.
 */
export interface ActionResult {
  success: boolean;
  errorCode?: ActionErrorCode;
}
