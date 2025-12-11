import { Component, input, InputSignal } from '@angular/core';

// ============================================
// TIPOS
// ============================================

type TamanoImagen = 'sm' | 'md' | 'lg';
type VarianteImagen = 'vertical' | 'horizontal';

// ============================================
// CONSTANTES
// ============================================

const TAMANO_DEFECTO: TamanoImagen = 'md';
const VARIANTE_DEFECTO: VarianteImagen = 'vertical';

// ============================================
// COMPONENTE CARD IMAGE
// ============================================

@Component({
  selector: 'app-card-image',
  standalone: true,
  templateUrl: './card-image.html',
  styleUrls: ['./card-image.scss'],
})
export class CardImage {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly src: InputSignal<string> = input<string>('');
  readonly alt: InputSignal<string> = input<string>('');
  readonly size: InputSignal<TamanoImagen> = input<TamanoImagen>(TAMANO_DEFECTO);
  readonly variant: InputSignal<VarianteImagen> = input<VarianteImagen>(VARIANTE_DEFECTO);
}
