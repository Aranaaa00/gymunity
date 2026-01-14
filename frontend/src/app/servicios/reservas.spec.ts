import { TestBed } from '@angular/core/testing';
import { ReservasService } from './reservas';
import { AuthService } from './auth';
import { NotificacionService } from './notificacion';
import { PerfilService } from './perfil';
import { ModalService } from './modal';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('ReservasService', () => {
  let service: ReservasService;
  let mockAuth: { usuario: ReturnType<typeof signal>; estaAutenticado: ReturnType<typeof signal> };
  let mockNotificacion: jasmine.SpyObj<NotificacionService>;
  let mockPerfil: {
    creditos: ReturnType<typeof signal>;
    creditosRestantes: () => string;
    clases: ReturnType<typeof signal>;
    inscribirEnClase: jasmine.Spy;
    cancelarInscripcion: jasmine.Spy;
    estaInscrito: jasmine.Spy;
  };
  let mockModal: jasmine.SpyObj<ModalService>;

  beforeEach(() => {
    mockAuth = {
      usuario: signal({ id: 1, email: 'test@test.com' }),
      estaAutenticado: signal(true)
    };

    mockNotificacion = jasmine.createSpyObj('NotificacionService', ['success', 'error', 'warning', 'info']);

    mockPerfil = {
      creditos: signal(10),
      creditosRestantes: () => '10/12',
      clases: signal([]),
      inscribirEnClase: jasmine.createSpy('inscribirEnClase'),
      cancelarInscripcion: jasmine.createSpy('cancelarInscripcion'),
      estaInscrito: jasmine.createSpy('estaInscrito').and.returnValue(false)
    };

    mockModal = jasmine.createSpyObj('ModalService', ['requerirRegistro', 'abrirLogin', 'cerrarModal']);

    TestBed.configureTestingModule({
      providers: [
        ReservasService,
        { provide: AuthService, useValue: mockAuth },
        { provide: NotificacionService, useValue: mockNotificacion },
        { provide: PerfilService, useValue: mockPerfil },
        { provide: ModalService, useValue: mockModal }
      ]
    });

    service = TestBed.inject(ReservasService);
  });

  describe('estado inicial', () => {
    it('deberia iniciar sin procesar', () => {
      expect(service.procesando()).toBeFalse();
    });

    it('deberia exponer creditos del perfil', () => {
      expect(service.creditos()).toBe(10);
    });

    it('deberia exponer creditosRestantes del perfil', () => {
      expect(service.creditosRestantes()).toBe('10/12');
    });
  });

  describe('puedeReservar', () => {
    it('deberia poder reservar cuando tiene creditos y esta autenticado', () => {
      expect(service.puedeReservar()).toBeTrue();
    });

    it('no deberia poder reservar sin autenticar', () => {
      mockAuth.estaAutenticado = signal(false);
      // Necesita nuevo servicio para que tome el valor actualizado
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ReservasService,
          { provide: AuthService, useValue: { ...mockAuth, estaAutenticado: signal(false) } },
          { provide: NotificacionService, useValue: mockNotificacion },
          { provide: PerfilService, useValue: mockPerfil },
          { provide: ModalService, useValue: mockModal }
        ]
      });
      const nuevoService = TestBed.inject(ReservasService);
      expect(nuevoService.puedeReservar()).toBeFalse();
    });
  });

  describe('clasesReservadasIds', () => {
    it('deberia retornar set vacio sin clases', () => {
      expect(service.clasesReservadasIds().size).toBe(0);
    });
  });

  describe('estaReservada', () => {
    it('deberia verificar inscripcion en perfil', () => {
      service.estaReservada(1);
      expect(mockPerfil.estaInscrito).toHaveBeenCalledWith(1);
    });

    it('deberia retornar false si no esta inscrito', () => {
      mockPerfil.estaInscrito.and.returnValue(false);
      expect(service.estaReservada(1)).toBeFalse();
    });

    it('deberia retornar true si esta inscrito', () => {
      mockPerfil.estaInscrito.and.returnValue(true);
      expect(service.estaReservada(1)).toBeTrue();
    });
  });

  describe('reservarClase', () => {
    it('deberia abrir modal si no esta autenticado', () => {
      mockAuth.estaAutenticado = signal(false);
      const nuevoService = TestBed.inject(ReservasService);
      nuevoService.reservarClase(1, 'Yoga', '2024-01-15');
      expect(mockModal.requerirRegistro).toHaveBeenCalled();
    });

    it('deberia mostrar warning si ya esta reservada', () => {
      mockPerfil.estaInscrito.and.returnValue(true);
      service.reservarClase(1, 'Yoga', '2024-01-15');
      expect(mockNotificacion.warning).toHaveBeenCalled();
    });

    it('deberia llamar a inscribirEnClase si puede reservar', () => {
      mockPerfil.inscribirEnClase.and.returnValue(of({}));
      service.reservarClase(1, 'Yoga', '2024-01-15');
      expect(mockPerfil.inscribirEnClase).toHaveBeenCalledWith(1, '2024-01-15');
    });

    it('deberia mostrar success al reservar correctamente', () => {
      mockPerfil.inscribirEnClase.and.returnValue(of({}));
      service.reservarClase(1, 'Yoga', '2024-01-15');
      expect(mockNotificacion.success).toHaveBeenCalled();
    });

    it('deberia mostrar error si falla la reserva', () => {
      mockPerfil.inscribirEnClase.and.returnValue(throwError(() => ({ error: { mensaje: 'Error' } })));
      service.reservarClase(1, 'Yoga', '2024-01-15');
      expect(mockNotificacion.error).toHaveBeenCalled();
    });
  });

  describe('cancelarReserva', () => {
    it('deberia llamar a cancelarInscripcion del perfil', () => {
      mockPerfil.cancelarInscripcion.and.returnValue(of({ reembolso: true }));
      service.cancelarReserva(1);
      expect(mockPerfil.cancelarInscripcion).toHaveBeenCalledWith(1);
    });

    it('deberia mostrar success con reembolso', () => {
      mockPerfil.cancelarInscripcion.and.returnValue(of({ reembolso: true }));
      service.cancelarReserva(1);
      expect(mockNotificacion.success).toHaveBeenCalled();
    });

    it('deberia mostrar info sin reembolso', () => {
      mockPerfil.cancelarInscripcion.and.returnValue(of({ reembolso: false }));
      service.cancelarReserva(1);
      expect(mockNotificacion.info).toHaveBeenCalled();
    });

    it('deberia mostrar error si falla la cancelacion', () => {
      mockPerfil.cancelarInscripcion.and.returnValue(throwError(() => ({ error: { mensaje: 'Error' } })));
      service.cancelarReserva(1);
      expect(mockNotificacion.error).toHaveBeenCalled();
    });
  });
});
