import { Component, Input } from '@angular/core';
import { CardImage } from '../card-image/card-image';
import { Boton } from '../boton/boton';

export type CardVariant = 'vertical' | 'horizontal';

@Component({
  selector: 'app-card',
  imports: [CardImage, Boton],
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
})
export class Card {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() rating = '';
  @Input() imageSrc = '';
  @Input() imageAlt = '';
  @Input() actionText = '';
  @Input() variant: CardVariant = 'vertical';
}
