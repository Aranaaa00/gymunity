import { Component, input, InputSignal, signal } from '@angular/core';

// ============================================
// TIPOS
// ============================================

type VarianteImagen = 'vertical' | 'horizontal';

// ============================================
// CONSTANTES
// ============================================

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
  readonly variant: InputSignal<VarianteImagen> = input<VarianteImagen>(VARIANTE_DEFECTO);

  // ----------------------------------------
  // Estado
  // ----------------------------------------
  readonly imageError = signal<boolean>(false);

  // ----------------------------------------
  // Métodos
  // ----------------------------------------
  onImageError(): void {
    this.imageError.set(true);
  }
}
