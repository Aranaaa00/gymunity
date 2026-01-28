import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

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
  imports: [LucideAngularModule],
  templateUrl: './boton.html',
  styleUrl: './boton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Boton {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly tipo = input<TipoBoton>(TIPO_DEFAULT);
  readonly variante = input<VarianteBoton>(VARIANTE_DEFAULT);
  readonly tamano = input<TamanoBoton>(TAMANO_DEFAULT);
  readonly disabled = input<boolean>(false);
  readonly cargando = input<boolean>(false);
  readonly ariaLabel = input<string>('');
  readonly tabIndex = input<number | null>(null);

  // ----------------------------------------
  // Propiedades computadas
  // ----------------------------------------
  readonly clases = computed<string>(() => {
    const varianteActual = this.variante();
    const tamanoActual = this.tamano();

    return `boton--${varianteActual} boton--${tamanoActual}`;
  });
}
