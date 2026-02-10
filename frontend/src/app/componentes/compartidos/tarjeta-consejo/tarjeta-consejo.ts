import { Component, input, computed, InputSignal, ChangeDetectionStrategy } from '@angular/core';
import { Icono, NombreIcono } from '../icono/icono';

@Component({
  selector: 'app-tarjeta-consejo',
  standalone: true,
  imports: [Icono],
  templateUrl: './tarjeta-consejo.html',
  styleUrl: './tarjeta-consejo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TarjetaConsejo {

  readonly titulo: InputSignal<string> = input<string>('');
  readonly descripcion: InputSignal<string> = input<string>('');
  readonly categoria: InputSignal<string> = input<string>('');
  readonly icono: InputSignal<string> = input<string>('dumbell');

  /*readonly iconoNombre = computed<NombreIcono> (() => {
    return this.icono as NombreIcono;
  });*/
    
}
