// ============================================
// TIPOS
// ============================================

export type NivelFuerza = 'debil' | 'media' | 'fuerte' | 'muy-fuerte';

export interface ResultadoFuerza {
  readonly nivel: NivelFuerza;
  readonly porcentaje: number;
  readonly mensaje: string;
}

// ============================================
// CONSTANTES
// ============================================

const MENSAJES_FUERZA: Readonly<Record<NivelFuerza, string>> = {
  'debil': 'Contraseña débil',
  'media': 'Contraseña media',
  'fuerte': 'Contraseña fuerte',
  'muy-fuerte': 'Contraseña muy fuerte',
} as const;

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

export function calcularFuerzaPassword(password: string): ResultadoFuerza {
  if (!password) {
    return { nivel: 'debil', porcentaje: 0, mensaje: '' };
  }

  let puntos = 0;

  // Longitud (hasta 45 puntos)
  if (password.length >= 8) puntos += 15;
  if (password.length >= 12) puntos += 10;
  if (password.length >= 16) puntos += 10;
  if (password.length >= 20) puntos += 10;

  // Minúsculas (15 puntos)
  if (/[a-z]/.test(password)) puntos += 15;

  // Mayúsculas (15 puntos)
  if (/[A-Z]/.test(password)) puntos += 15;

  // Números (15 puntos)
  if (/\d/.test(password)) puntos += 15;

  // Caracteres especiales (15 puntos)
  if (/[@$!%*?&.]/.test(password)) puntos += 15;

  const porcentaje = Math.min(puntos, 100);
  const nivel = obtenerNivel(porcentaje);
  const mensaje = MENSAJES_FUERZA[nivel];

  return { nivel, porcentaje, mensaje };
}

// ============================================
// HELPERS
// ============================================

function obtenerNivel(porcentaje: number): NivelFuerza {
  if (porcentaje >= 85) return 'muy-fuerte';
  if (porcentaje >= 65) return 'fuerte';
  if (porcentaje >= 40) return 'media';
  return 'debil';
}
