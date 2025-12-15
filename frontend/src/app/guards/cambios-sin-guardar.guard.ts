import { CanDeactivateFn } from '@angular/router';

// ============================================
// TIPOS
// ============================================

export interface ComponenteConCambios {
  tieneCambiosSinGuardar(): boolean;
}

// ============================================
// CONSTANTES
// ============================================

const MENSAJE_CONFIRMACION = '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.';

// ============================================
// GUARD
// ============================================

export const cambiosSinGuardarGuard: CanDeactivateFn<ComponenteConCambios> = (componente): boolean => {
  const tieneCambios = componente.tieneCambiosSinGuardar?.() ?? false;

  return tieneCambios ? confirm(MENSAJE_CONFIRMACION) : true;
};
