import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// ============================================
// CONSTANTES
// ============================================

const PATRON_PASSWORD_FUERTE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/;
const PATRON_NIF = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
const PATRON_TELEFONO_ES = /^(\+34|0034|34)?[6789]\d{8}$/;
const PATRON_CODIGO_POSTAL_ES = /^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/;

const LONGITUD_MINIMA_PASSWORD_FUERTE = 8;

const LETRAS_NIF = 'TRWAGMYFPDXBNJZSQVHLCKE';

// ============================================
// MENSAJES DE ERROR
// ============================================

export const MENSAJES_VALIDACION = {
  passwordFuerte: 'La contraseña debe tener mayúsculas, minúsculas, números y caracteres especiales',
  passwordMismatch: 'Las contraseñas no coinciden',
  nifInvalido: 'NIF inválido',
  telefonoInvalido: 'Teléfono inválido',
  codigoPostalInvalido: 'Código postal inválido',
} as const;

// ============================================
// VALIDADORES SÍNCRONOS
// ============================================

/**
 * Valida que la contraseña sea fuerte:
 * - Mínimo 8 caracteres
 * - Al menos 1 mayúscula
 * - Al menos 1 minúscula
 * - Al menos 1 número
 * - Al menos 1 carácter especial (@$!%*?&.)
 */
export function passwordFuerte(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    const sinValor = !valor;
    const longitudCorrecta = valor?.length >= LONGITUD_MINIMA_PASSWORD_FUERTE;
    const patronValido = PATRON_PASSWORD_FUERTE.test(valor);
    const esValida = !sinValor && longitudCorrecta && patronValido;

    return esValida ? null : { passwordFuerte: true };
  };
}

/**
 * Valida que dos campos coincidan.
 * Se aplica a nivel de FormGroup.
 * 
 * @param campo1 - Nombre del primer campo
 * @param campo2 - Nombre del segundo campo
 */
export function coincidenCampos(campo1: string, campo2: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const control1 = control.get(campo1);
    const control2 = control.get(campo2);
    if (!control1 || !control2) return null;

    if (control1.value === control2.value) {
      const errorActual = control2.errors;
      if (errorActual?.['passwordMismatch']) {
        delete errorActual['passwordMismatch'];
        control2.setErrors(Object.keys(errorActual).length === 0 ? null : errorActual);
      }
      return null;
    }

    control2.setErrors({ ...control2.errors, passwordMismatch: true });
    return { passwordMismatch: true };
  };
}

/**
 * Valida formato de NIF español con letra correcta
 */
export function nifValido(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    const sinValor = !valor;
    
    if (sinValor) return null;

    const valorLimpio = valor.toUpperCase().trim();
    const formatoValido = PATRON_NIF.test(valorLimpio);
    
    if (!formatoValido) return { nifInvalido: true };

    const numero = parseInt(valorLimpio.substring(0, 8), 10);
    const letra = valorLimpio.charAt(8);
    const letraEsperada = LETRAS_NIF.charAt(numero % 23);
    const letraCorrecta = letra === letraEsperada;

    return letraCorrecta ? null : { nifInvalido: true };
  };
}

/**
 * Valida formato de teléfono español
 * Acepta: +34, 0034, 34 o directamente el número
 */
export function telefonoEspanol(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    const sinValor = !valor;
    
    if (sinValor) return null;

    const valorLimpio = valor.replace(/\s/g, '');
    const esValido = PATRON_TELEFONO_ES.test(valorLimpio);

    return esValido ? null : { telefonoInvalido: true };
  };
}

/**
 * Valida código postal español (5 dígitos entre 01000 y 52999)
 */
export function codigoPostalEspanol(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    const sinValor = !valor;
    
    if (sinValor) return null;

    const esValido = PATRON_CODIGO_POSTAL_ES.test(valor);

    return esValido ? null : { codigoPostalInvalido: true };
  };
}

/**
 * Valida que un valor numérico esté dentro de un rango
 * 
 * @param min - Valor mínimo permitido
 * @param max - Valor máximo permitido
 */
export function rangoNumerico(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    const sinValor = !valor && valor !== 0;
    
    if (sinValor) return null;

    const numero = Number(valor);
    const esNumeroValido = !isNaN(numero);
    
    if (!esNumeroValido) return { rangoNumerico: true };
    
    const estaEnRango = numero >= min && numero <= max;

    return estaEnRango ? null : { rangoNumerico: { min, max, actual: numero } };
  };
}
