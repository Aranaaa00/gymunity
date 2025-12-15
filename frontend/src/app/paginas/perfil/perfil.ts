import { Component, inject } from '@angular/core';
import { AuthService } from '../../servicios/auth';
import { ComponenteConCambios } from '../../guards/cambios-sin-guardar.guard';
import { Icono } from '../../componentes/compartidos/icono/icono';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [Icono],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements ComponenteConCambios {
  readonly usuario = inject(AuthService).usuario;

  tieneCambiosSinGuardar(): boolean {
    return false;
  }
}
