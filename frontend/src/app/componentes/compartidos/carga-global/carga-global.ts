import { Component, inject } from '@angular/core';
import { CargaService } from '../../../servicios/carga';
import { Spinner } from '../spinner/spinner';

// ============================================
// COMPONENTE CARGA GLOBAL
// ============================================

@Component({
  selector: 'app-carga-global',
  standalone: true,
  imports: [Spinner],
  templateUrl: './carga-global.html',
  styleUrl: './carga-global.scss',
})
export class CargaGlobal {
  // ============================================
  // INYECCIONES
  // ============================================
  
  private readonly cargaService = inject(CargaService);
  
  // ============================================
  // SEÑALES PÚBLICAS
  // ============================================
  
  readonly cargando = this.cargaService.cargando;
  readonly porcentaje = this.cargaService.porcentajeGlobal;
  readonly mensaje = this.cargaService.mensajeGlobal;
}
