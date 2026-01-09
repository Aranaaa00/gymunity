import { Component, input, output, ChangeDetectionStrategy, HostListener, inject, computed } from '@angular/core';
import { Icono } from '../icono/icono';
import { ReservasService } from '../../../servicios/reservas';
import { CREDITOS_MENSUALES } from '../../../servicios/perfil';

// ============================================
// CONSTANTES
// ============================================

const DIAS_SEMANA_NOMBRES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DIAS_SEMANA_ABREV = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];

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
  readonly diasSemana = input<string>('');
  readonly horaInicio = input<string>('');
  readonly horaFin = input<string>('');

  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly confirmar = output<string>();
  readonly cancelar = output<void>();

  // ----------------------------------------
  // Estado desde servicio
  // ----------------------------------------
  readonly procesando = this.reservasService.procesando;

  readonly creditosDespuesReserva = computed(() => {
    const actual = this.reservasService.creditos();
    const restantes = Math.max(0, actual - 1);
    return `${restantes}/${CREDITOS_MENSUALES}`;
  });

  // ----------------------------------------
  // Próxima fecha disponible
  // ----------------------------------------
  readonly proximaFecha = computed<Date>(() => {
    const diasStr = this.diasSemana();
    const hora = this.horaInicio();
    const hoy = new Date();
    
    const diasArray = this.parsearDiasSemana(diasStr);
    const horaClase = this.parsearHora(hora);

    // Buscar la próxima fecha válida
    for (let i = 0; i < 14; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      
      if (diasArray.length === 0 || diasArray.includes(fecha.getDay())) {
        if (horaClase) {
          fecha.setHours(horaClase.horas, horaClase.minutos, 0, 0);
        } else {
          fecha.setHours(10, 0, 0, 0);
        }
        
        if (fecha > hoy) {
          return fecha;
        }
      }
    }

    // Fallback: mañana a las 10
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);
    manana.setHours(10, 0, 0, 0);
    return manana;
  });

  readonly proximaFechaLabel = computed(() => {
    const fecha = this.proximaFecha();
    const nombreDia = DIAS_SEMANA_NOMBRES[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = fecha.toLocaleDateString('es-ES', { month: 'long' });
    const hora = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    return `${nombreDia} ${dia} de ${mes} a las ${hora}`;
  });

  readonly horarioTexto = computed(() => {
    const inicio = this.horaInicio();
    const fin = this.horaFin();
    
    if (inicio && fin) {
      return `${inicio.slice(0, 5)} - ${fin.slice(0, 5)}`;
    }
    return '';
  });

  // ----------------------------------------
  // Keyboard
  // ----------------------------------------
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.onCancelar();
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  onConfirmar(): void {
    this.confirmar.emit(this.proximaFecha().toISOString());
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

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private parsearDiasSemana(diasStr: string): number[] {
    if (!diasStr) return [];
    
    const diasLower = diasStr.toLowerCase();
    const resultado: number[] = [];

    DIAS_SEMANA_ABREV.forEach((abrev, index) => {
      if (diasLower.includes(abrev)) {
        resultado.push(index);
      }
    });

    if (resultado.length === 0) {
      const partes = diasStr.split(/[,\s]+/);
      partes.forEach(parte => {
        const idx = DIAS_SEMANA_NOMBRES.findIndex(
          d => d.toLowerCase().startsWith(parte.toLowerCase().slice(0, 3))
        );
        if (idx >= 0) {
          resultado.push(idx);
        }
      });
    }

    return resultado;
  }

  private parsearHora(horaStr: string): { horas: number; minutos: number } | null {
    if (!horaStr) return null;
    
    const partes = horaStr.split(':');
    if (partes.length >= 2) {
      return {
        horas: parseInt(partes[0], 10),
        minutos: parseInt(partes[1], 10)
      };
    }
    return null;
  }
}
