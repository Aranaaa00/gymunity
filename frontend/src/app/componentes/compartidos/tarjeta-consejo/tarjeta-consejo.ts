import { Component, input, computed, InputSignal, ChangeDetectionStrategy } from '@angular/core';
import { Icono, NombreIcono } from '../icono/icono';

@Component({
  selector: 'app-tarjeta-consejo',
  standalone: true,
  imports: [Icono],
  templateUrl: './tarjeta-consejo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TarjetaConsejo {

  readonly titulo: InputSignal<string> = input<string>('Primer consejo');
  readonly descripcion: InputSignal<string> = input<string>('Si lees esto aprobaras el examen 100%');
  readonly categoria: InputSignal<string> = input<string>('Prueba');
  readonly icono: InputSignal<string> = input<string>('dumbell');

  readonly iconoNombre = computed<NombreIcono> (() => {
    return this.icono() as NombreIcono;
  });

  readonly categoriaFormateada = computed<string>(() => {
    const cat = this.categoria();
    if (!cat) return '';
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
  });
}