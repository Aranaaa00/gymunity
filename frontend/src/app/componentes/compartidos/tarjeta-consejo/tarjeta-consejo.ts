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

  readonly titulo: InputSignal<string> = input<string>('');
  readonly descripcion: InputSignal<string> = input<string>('');
  readonly categoria: InputSignal<string> = input<string>('');
  readonly icono: InputSignal<string> = input<string>('dumbbell');

  readonly iconoNombre = computed<NombreIcono>(() => {
    return this.icono() as NombreIcono;
  });

  readonly categoriaFormateada = computed<string>(() => {
    const cat = this.categoria();
    if (!cat) return '';
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
  });
}