import { Component, input, computed } from '@angular/core';

// ============================================
// TIPOS
// ============================================

export type TipoBoton = 'button' | 'submit';
export type VarianteBoton = 'primary' | 'secondary' | 'ghost' | 'danger';
export type TamanoBoton = 'sm' | 'md' | 'lg';

// ============================================
// CONSTANTES
// ============================================

const TIPO_DEFAULT: TipoBoton = 'button';
const VARIANTE_DEFAULT: VarianteBoton = 'primary';
const TAMANO_DEFAULT: TamanoBoton = 'md';

// ============================================
// COMPONENTE BOTÓN
// ============================================

@Component({
  selector: 'app-boton',
  standalone: true,
  templateUrl: './boton.html',
  styleUrl: './boton.scss',
})
export class Boton {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly tipo = input<TipoBoton>(TIPO_DEFAULT);
  readonly variante = input<VarianteBoton>(VARIANTE_DEFAULT);
  readonly tamano = input<TamanoBoton>(TAMANO_DEFAULT);
  readonly disabled = input<boolean>(false);

  // ----------------------------------------
  // Propiedades computadas
  // ----------------------------------------
  readonly clases = computed<string>(() => {
    const varianteActual = this.variante();
    const tamanoActual = this.tamano();

    return `boton--${varianteActual} boton--${tamanoActual}`;
  });
}
