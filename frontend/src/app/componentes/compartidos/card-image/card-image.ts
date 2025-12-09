
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-image',
  templateUrl: './card-image.html',
  styleUrls: ['./card-image.scss'],
})
export class CardImage {
  @Input() src = '';
  @Input() alt = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'vertical' | 'horizontal' = 'vertical';
}
