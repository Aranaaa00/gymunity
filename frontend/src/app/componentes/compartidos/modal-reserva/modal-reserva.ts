import { Component, input, output, ChangeDetectionStrategy, HostListener, inject } from '@angular/core';
import { Icono } from '../icono/icono';
import { ReservasService } from '../../../servicios/reservas';

// ============================================
// COMPONENTE MODAL RESERVA
// ============================================

@Component({
  selector: 'app-modal-reserva',
  standalone: true,
  imports: [Icono],
  templateUrl: './modal-reserva.html',
  styleUrl: './modal-reserva.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalReserva {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly reservasService = inject(ReservasService);

  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly claseNombre = input.required<string>();
  readonly profesorNombre = input<string>('');

  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly confirmar = output<void>();
  readonly cancelar = output<void>();

  // ----------------------------------------
  // Estado desde servicio
  // ----------------------------------------
  readonly creditos = this.reservasService.creditos;
  readonly creditosRestantes = this.reservasService.creditosRestantes;
  readonly procesando = this.reservasService.procesando;

  // ----------------------------------------
  // Keyboard
  // ----------------------------------------
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.onCancelar();
  }

  // ----------------------------------------
  // Métodos
  // ----------------------------------------
  onConfirmar(): void {
    this.confirmar.emit();
  }

  onCancelar(): void {
    this.cancelar.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-reserva')) {
      this.onCancelar();
    }
  }
}
