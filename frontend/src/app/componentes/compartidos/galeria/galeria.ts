import { Component, input, signal, computed, ChangeDetectionStrategy } from '@angular/core';

// ============================================
// COMPONENTE GALERÍA
// ============================================

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [],
  templateUrl: './galeria.html',
  styleUrl: './galeria.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Galeria {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly imagenes = input.required<readonly string[]>();
  readonly alt = input<string>('Imagen de galería');
  readonly caption = input<string>('');  // Leyenda visible para figcaption
  readonly maxMiniaturas = input<number>(4);

  // ----------------------------------------
  // Estado interno
  // ----------------------------------------
  readonly indiceActivo = signal<number>(0);

  // ----------------------------------------
  // Computed
  // ----------------------------------------
  readonly imagenPrincipal = computed(() => {
    const imgs = this.imagenes();
    const indice = this.indiceActivo();
    return imgs[indice] || imgs[0] || '';
  });

  readonly miniaturas = computed(() => {
    const imgs = this.imagenes();
    const max = this.maxMiniaturas();
    return imgs.slice(0, max);
  });

  readonly tieneMiniaturas = computed(() => this.imagenes().length > 1);

  readonly descripciones = input<readonly string[]>([]);

  readonly captionActivo = computed(() => {
    const nombre = this.caption() || this.alt();
    const indice = this.indiceActivo();
    const descs = this.descripciones();
    const descripcion = descs[indice] || 'Vista de las instalaciones';
    return `${nombre} - ${descripcion}`;
  });

  // ----------------------------------------
  // Métodos
  // ----------------------------------------
  seleccionarImagen(indice: number): void {
    this.indiceActivo.set(indice);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
