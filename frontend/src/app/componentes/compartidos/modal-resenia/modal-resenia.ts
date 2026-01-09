import { Component, input, output, signal, ChangeDetectionStrategy, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icono } from '../icono/icono';
import { PerfilService } from '../../../servicios/perfil';
import { NotificacionService } from '../../../servicios/notificacion';

// ============================================
// COMPONENTE MODAL RESEÑA
// ============================================

@Component({
  selector: 'app-modal-resenia',
  standalone: true,
  imports: [Icono, FormsModule],
  templateUrl: './modal-resenia.html',
  styleUrl: './modal-resenia.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalResenia {
  private readonly perfilService = inject(PerfilService);
  private readonly notificacion = inject(NotificacionService);

  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly gimnasioId = input.required<number>();
  readonly gimnasioNombre = input.required<string>();

  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly cerrar = output<void>();
  readonly enviada = output<void>();

  // ----------------------------------------
  // Estado local
  // ----------------------------------------
  readonly valoracion = signal(0);
  readonly comentario = signal('');
  readonly enviando = signal(false);
  readonly estrellaHover = signal(0);

  readonly estrellas = [1, 2, 3, 4, 5];

  // ----------------------------------------
  // Keyboard
  // ----------------------------------------
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.onCerrar();
  }

  // ----------------------------------------
  // Métodos
  // ----------------------------------------
  seleccionarEstrella(valor: number): void {
    this.valoracion.set(valor);
  }

  hoverEstrella(valor: number): void {
    this.estrellaHover.set(valor);
  }

  salirHover(): void {
    this.estrellaHover.set(0);
  }

  esActiva(estrella: number): boolean {
    const hover = this.estrellaHover();
    const seleccionada = this.valoracion();
    return estrella <= (hover || seleccionada);
  }

  actualizarComentario(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.comentario.set(input.value);
  }

  puedeEnviar(): boolean {
    return this.valoracion() > 0 && this.comentario().trim().length > 0 && !this.enviando();
  }

  onEnviar(): void {
    if (!this.puedeEnviar()) {
      return;
    }

    this.enviando.set(true);

    this.perfilService.crearResenia(
      this.gimnasioId(),
      this.gimnasioNombre(),
      this.comentario().trim(),
      this.valoracion()
    ).subscribe({
      next: () => {
        this.enviando.set(false);
        this.notificacion.success('¡Reseña enviada correctamente!');
        this.enviada.emit();
        this.onCerrar();
      },
      error: (err) => {
        this.enviando.set(false);
        const mensaje = err.error?.mensaje ?? 'Error al enviar la reseña';
        this.notificacion.error(mensaje);
        console.error('Error enviando reseña:', err);
      }
    });
  }

  onCerrar(): void {
    this.cerrar.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-resenia')) {
      this.onCerrar();
    }
  }
}
