import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TarjetaConsejo } from '../../componentes/compartidos/tarjeta-consejo/tarjeta-consejo';
import { ConsejosApiService } from '../../servicios/consejos-api';

@Component({
  selector: 'app-consejos',
  standalone: true,
  imports: [TarjetaConsejo],
  templateUrl: './consejos.html',
  styleUrl: './consejos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Consejos implements OnInit {

  readonly consejosService = inject(ConsejosApiService);

  ngOnInit(): void {
    this.consejosService.obtenerTodos().subscribe();
  }
}