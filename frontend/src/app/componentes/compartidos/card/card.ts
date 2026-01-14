import { Component, input, inject, InputSignal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CardImage } from '../card-image/card-image';
import { Boton } from '../boton/boton';
import { LucideAngularModule } from 'lucide-angular';

// ============================================
// TIPOS
// ============================================

export type CardVariant = 'vertical' | 'horizontal';

// ============================================
// CONSTANTES
// ============================================

const VARIANTE_DEFECTO: CardVariant = 'vertical';

// ============================================
// COMPONENTE CARD
// ============================================

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CardImage, Boton, LucideAngularModule],
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly router = inject(Router);

  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly id: InputSignal<number | undefined> = input<number | undefined>();
  readonly title: InputSignal<string> = input<string>('');
  readonly subtitle: InputSignal<string> = input<string>('');
  readonly location: InputSignal<string> = input<string>('');
  readonly valoracion: InputSignal<number | null> = input<number | null>(null);
  readonly totalResenias: InputSignal<number> = input<number>(0);
  readonly imageSrc: InputSignal<string> = input<string>('');
  readonly imageAlt: InputSignal<string> = input<string>('');
  readonly actionText: InputSignal<string> = input<string>('');
  readonly variant: InputSignal<CardVariant> = input<CardVariant>(VARIANTE_DEFECTO);
  readonly priority: InputSignal<boolean> = input<boolean>(false);
  
  /** @deprecated Usar valoracion y totalResenias */
  readonly rating: InputSignal<string> = input<string>('');

  // ----------------------------------------
  // Computed
  // ----------------------------------------
  readonly tieneValoracion = computed(() => {
    const val = this.valoracion();
    const total = this.totalResenias();
    return val !== null && total > 0;
  });

  readonly valoracionFormateada = computed(() => {
    const val = this.valoracion();
    return val !== null ? val.toFixed(1) : '';
  });

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  navegarAGimnasio(): void {
    const idGimnasio = this.id();
    
    if (!idGimnasio) {
      return;
    }
    
    this.router.navigate(['/gimnasio', idGimnasio]);
  }
}
