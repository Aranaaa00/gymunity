import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth';
import { catchError, tap, of, finalize, Observable, map } from 'rxjs';
import type { InscripcionResponse, InscripcionRequest, InteraccionResponse, Resenia, CancelacionResponse, CancelacionRequest } from '../modelos';

// ============================================
// TIPOS
// ============================================

export interface ClaseReservada {
  readonly id: number;
  readonly claseId: number;
  readonly gimnasioId: number;
  readonly nombre: string;
  readonly gimnasio: string;
  readonly profesor: string;
  readonly fechaInscripcion: string;
  readonly fechaClase: string;
  readonly puedeReembolsar: boolean;
  readonly completada: boolean;
}

export interface Logro {
  readonly id: string;
  readonly nombre: string;
  readonly categoria: string;
  readonly icono: string;
  readonly desbloqueado: boolean;
}

export interface ReseniaPerfil {
  readonly id: number;
  readonly texto: string;
  readonly gimnasioNombre: string;
  readonly gimnasioId: number;
  readonly valoracion: number;
  readonly fecha: string;
}

export interface ReseniaRequest {
  readonly usuarioId: number;
  readonly gimnasioId: number;
  readonly texto: string;
  readonly valoracion: number;
}

// ============================================
// CONSTANTES
// ============================================

export const CREDITOS_MENSUALES = 12;

const LOGROS_BASE: readonly Logro[] = [
  { id: 'primera-clase', nombre: 'Primera clase', categoria: 'Entrenamiento', icono: 'zap', desbloqueado: false },
  { id: 'primera-semana', nombre: 'Primera semana', categoria: 'Entrenamiento', icono: 'flame', desbloqueado: false },
  { id: 'primer-mes', nombre: 'Primer mes', categoria: 'Entrenamiento', icono: 'trophy', desbloqueado: false },
  { id: 'primer-cinturon', nombre: 'Primer cinturón', categoria: 'Artes marciales', icono: 'award', desbloqueado: false },
  { id: 'certificacion', nombre: 'Certificación de nivel', categoria: 'Artes marciales', icono: 'shield', desbloqueado: false },
  { id: 'seminario', nombre: 'Participación en seminario', categoria: 'Artes marciales', icono: 'star', desbloqueado: false },
  { id: 'primer-torneo', nombre: 'Primer torneo', categoria: 'Torneos', icono: 'target', desbloqueado: false },
  { id: 'primer-podio', nombre: 'Primer podio', categoria: 'Torneos', icono: 'medal', desbloqueado: false },
  { id: 'campeonato', nombre: 'Primer campeonato', categoria: 'Torneos', icono: 'crown', desbloqueado: false },
  { id: 'primera-resenia', nombre: 'Primera reseña', categoria: 'Comunidad', icono: 'message-circle', desbloqueado: false },
  { id: 'primera-valoracion', nombre: 'Primera valoración', categoria: 'Comunidad', icono: 'star', desbloqueado: false },
  { id: 'ayuda-alumno', nombre: 'Has ayudado a otro alumno', categoria: 'Comunidad', icono: 'users', desbloqueado: false },
  { id: 'tres-meses', nombre: 'Tres meses en Gymunity', categoria: 'Antigüedad', icono: 'clock', desbloqueado: false },
  { id: 'primer-mes-gym', nombre: 'Primer mes en Gymunity', categoria: 'Antigüedad', icono: 'calendar', desbloqueado: false },
  { id: 'fundador', nombre: 'Miembro fundador', categoria: 'Antigüedad', icono: 'gem', desbloqueado: false },
  { id: 'elegir-gimnasio', nombre: 'Has elegido tu gimnasio', categoria: 'Progreso personal', icono: 'map-pin', desbloqueado: false },
  { id: 'cambio-disciplina', nombre: 'Has cambiado de disciplina', categoria: 'Progreso personal', icono: 'refresh-cw', desbloqueado: false },
  { id: 'objetivo-personal', nombre: 'Primer objetivo personal', categoria: 'Progreso personal', icono: 'target', desbloqueado: false },
];

const CATEGORIAS_ORDEN = [
  'Entrenamiento',
  'Artes marciales',
  'Torneos',
  'Comunidad',
  'Antigüedad',
  'Progreso personal'
] as const;

// ============================================
// SERVICIO
// ============================================

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  private readonly _clases = signal<ClaseReservada[]>([]);
  private readonly _resenias = signal<ReseniaPerfil[]>([]);
  private readonly _logros = signal<Logro[]>([...LOGROS_BASE]);
  private readonly _creditos = signal(CREDITOS_MENSUALES);
  private readonly _cargando = signal(false);
  private readonly _error = signal<string | null>(null);
  private _datosInicializados = false;

  constructor() {
    effect(() => {
      const usuario = this.auth.usuario();
      if (usuario && !this._datosInicializados) {
        this._datosInicializados = true;
        this.cargarDatos();
      } else if (!usuario) {
        this._datosInicializados = false;
        this.reiniciarDatos();
      }
    });
  }

  private reiniciarDatos(): void {
    this._clases.set([]);
    this._resenias.set([]);
    this._logros.set([...LOGROS_BASE]);
    this._creditos.set(CREDITOS_MENSUALES);
    this._error.set(null);
  }
  readonly clases = this._clases.asReadonly();
  readonly resenias = this._resenias.asReadonly();
  readonly logros = this._logros.asReadonly();
  readonly creditos = this._creditos.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly error = this._error.asReadonly();

  readonly creditosRestantes = computed(() => {
    return `${this._creditos()}/${CREDITOS_MENSUALES}`;
  });

  readonly puedeReservarMas = computed(() => this._creditos() > 0);

  readonly logrosPorCategoria = computed(() => {
    const logros = this._logros();
    const mapa = new Map<string, Logro[]>();

    for (const categoria of CATEGORIAS_ORDEN) {
      mapa.set(categoria, []);
    }

    for (const logro of logros) {
      const lista = mapa.get(logro.categoria);
      if (lista) {
        lista.push(logro);
      }
    }

    return mapa;
  });

  readonly totalClases = computed(() => this._clases().length);
  readonly clasesCompletadas = computed(() => this._clases().filter(c => c.completada).length);
  readonly totalResenias = computed(() => this._resenias().length);

  // ----------------------------------------
  // Cargar datos desde API
  // ----------------------------------------
  cargarDatos(): void {
    const usuario = this.auth.usuario();
    if (!usuario) {
      return;
    }

    this._cargando.set(true);
    this._error.set(null);

    // Cargar inscripciones
    this.http.get<InscripcionResponse[]>(`/api/inscripciones/alumno/${usuario.id}`)
      .pipe(
        tap(inscripciones => this.procesarInscripciones(inscripciones)),
        catchError(err => {
          this._error.set('Error al cargar las clases');
          console.error('Error cargando clases:', err);
          return of([]);
        }),
        finalize(() => this._cargando.set(false))
      )
      .subscribe();

    // Cargar reseñas del usuario (desde interacciones)
    this.http.get<InteraccionResponse[]>(`/api/interacciones/usuario/${usuario.id}`)
      .pipe(
        tap(interacciones => this.procesarResenias(interacciones)),
        catchError(err => {
          console.error('Error cargando reseñas:', err);
          return of([]);
        })
      )
      .subscribe();
  }

  // ----------------------------------------
  // Inscribir en clase (API real)
  // ----------------------------------------
  inscribirEnClase(claseId: number, fechaClase: string): Observable<InscripcionResponse> {
    const usuario = this.auth.usuario();
    if (!usuario) {
      throw new Error('Usuario no autenticado');
    }

    const request: InscripcionRequest = {
      alumnoId: usuario.id,
      claseId,
      fechaClase
    };

    return this.http.post<InscripcionResponse>('/api/inscripciones', request)
      .pipe(
        tap(inscripcion => {
          const ahora = new Date();
          const nuevaClase: ClaseReservada = {
            id: inscripcion.id,
            claseId: inscripcion.claseId,
            gimnasioId: inscripcion.gimnasioId,
            nombre: inscripcion.claseNombre,
            gimnasio: inscripcion.gimnasioNombre,
            profesor: inscripcion.profesorNombre,
            fechaInscripcion: inscripcion.fechaInscripcion,
            fechaClase: inscripcion.fechaClase,
            puedeReembolsar: inscripcion.puedeReembolsar,
            completada: new Date(inscripcion.fechaClase) < ahora
          };
          this._clases.update(lista => [...lista, nuevaClase]);
          this._creditos.update(c => Math.max(0, c - 1));
          this.actualizarLogros();
        })
      );
  }

  // ----------------------------------------
  // Cancelar inscripción (API real)
  // ----------------------------------------
  cancelarInscripcion(claseId: number): Observable<CancelacionResponse> {
    const usuario = this.auth.usuario();
    if (!usuario) {
      throw new Error('Usuario no autenticado');
    }

    const request: CancelacionRequest = {
      alumnoId: usuario.id,
      claseId
    };

    return this.http.delete<CancelacionResponse>('/api/inscripciones', { body: request })
      .pipe(
        tap((response) => {
          this._clases.update(lista => lista.filter(c => c.claseId !== claseId));
          if (response.reembolso) {
            this._creditos.update(c => Math.min(CREDITOS_MENSUALES, c + 1));
          }
        })
      );
  }

  // ----------------------------------------
  // Verificar si está inscrito
  // ----------------------------------------
  estaInscrito(claseId: number): boolean {
    return this._clases().some(c => c.claseId === claseId);
  }

  // ----------------------------------------
  // Logros
  // ----------------------------------------
  desbloquearLogro(logroId: string): void {
    this._logros.update(lista =>
      lista.map(l => l.id === logroId ? { ...l, desbloqueado: true } : l)
    );
  }

  private actualizarLogros(): void {
    const totalClases = this._clases().length;
    const totalResenias = this._resenias().length;
    
    if (totalClases >= 1) {
      this.desbloquearLogro('primera-clase');
    }
    if (totalResenias >= 1) {
      this.desbloquearLogro('primera-resenia');
    }
  }

  // ----------------------------------------
  // Reseñas
  // ----------------------------------------
  crearResenia(gimnasioId: number, gimnasioNombre: string, texto: string, valoracion: number): Observable<InteraccionResponse> {
    const usuario = this.auth.usuario();
    if (!usuario) {
      throw new Error('Usuario no autenticado');
    }

    const request: ReseniaRequest = {
      usuarioId: usuario.id,
      gimnasioId,
      texto,
      valoracion
    };

    return this.http.post<InteraccionResponse>('/api/interacciones/resenia', request)
      .pipe(
        tap(interaccion => {
          const nuevaResenia: ReseniaPerfil = {
            id: interaccion.id,
            texto: interaccion.resenia ?? texto,
            gimnasioNombre: interaccion.nombreGimnasio ?? gimnasioNombre,
            gimnasioId,
            valoracion: interaccion.valoracion ?? valoracion,
            fecha: interaccion.fechaInteraccion ?? new Date().toISOString().split('T')[0]
          };
          this._resenias.update(lista => [nuevaResenia, ...lista]);
          this.desbloquearLogro('primera-resenia');
          this.desbloquearLogro('primera-valoracion');
        })
      );
  }

  // ----------------------------------------
  // Procesar respuestas API
  // ----------------------------------------
  private procesarInscripciones(inscripciones: InscripcionResponse[]): void {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59);

    const clases: ClaseReservada[] = inscripciones.map(ins => ({
      id: ins.id,
      claseId: ins.claseId,
      gimnasioId: ins.gimnasioId,
      nombre: ins.claseNombre,
      gimnasio: ins.gimnasioNombre,
      profesor: ins.profesorNombre,
      fechaInscripcion: ins.fechaInscripcion,
      fechaClase: ins.fechaClase,
      puedeReembolsar: ins.puedeReembolsar,
      completada: new Date(ins.fechaClase) < ahora
    }));

    // Calcular créditos usados solo del mes actual
    const clasesDelMes = clases.filter(c => {
      const fechaClase = new Date(c.fechaClase);
      return fechaClase >= inicioMes && fechaClase <= finMes;
    });

    this._clases.set(clases);
    this._creditos.set(Math.max(0, CREDITOS_MENSUALES - clasesDelMes.length));

    if (clases.length > 0) {
      this.desbloquearLogro('primera-clase');
    }
  }

  private procesarResenias(interacciones: InteraccionResponse[]): void {
    const resenias: ReseniaPerfil[] = interacciones
      .filter(i => i.resenia)
      .map(i => ({
        id: i.id,
        texto: i.resenia!,
        gimnasioNombre: i.nombreGimnasio,
        gimnasioId: i.gimnasioId,
        valoracion: i.valoracion ?? 0,
        fecha: i.fechaInteraccion
      }));

    this._resenias.set(resenias);

    if (resenias.length > 0) {
      this.desbloquearLogro('primera-resenia');
      this.desbloquearLogro('primera-valoracion');
    }
  }

  // ----------------------------------------
  // Cargar reseñas de un gimnasio
  // ----------------------------------------
  cargarReseniasGimnasio(gimnasioId: number): Observable<Resenia[]> {
    return this.http.get<Resenia[]>(`/api/interacciones/gimnasio/${gimnasioId}/resenias`);
  }
}
