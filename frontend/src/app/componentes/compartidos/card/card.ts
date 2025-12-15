import { Component, input, inject, InputSignal } from '@angular/core';
import { Router } from '@angular/router';
import { CardImage } from '../card-image/card-image';
import { Boton } from '../boton/boton';

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
  imports: [CardImage, Boton],
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
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
  readonly rating: InputSignal<string> = input<string>('');
  readonly imageSrc: InputSignal<string> = input<string>('');
  readonly imageAlt: InputSignal<string> = input<string>('');
  readonly actionText: InputSignal<string> = input<string>('');
  readonly variant: InputSignal<CardVariant> = input<CardVariant>(VARIANTE_DEFECTO);

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
