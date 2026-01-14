import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ModalService } from './modal';
import { NotificacionService } from './notificacion';

describe('ModalService', () => {
  let service: ModalService;
  let mockNotificacion: jasmine.SpyObj<NotificacionService>;

  beforeEach(() => {
    mockNotificacion = jasmine.createSpyObj('NotificacionService', ['info', 'success', 'error', 'warning']);

    TestBed.configureTestingModule({
      providers: [
        { provide: NotificacionService, useValue: mockNotificacion }
      ]
    });
    service = TestBed.inject(ModalService);
  });

  afterEach(() => {
    service.cerrar();
  });

  it('deberia crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('deberia no tener modal activo inicialmente', () => {
    expect(service.modalActivo()).toBeNull();
  });

  it('deberia abrir modal de login', () => {
    service.abrirLogin();
    expect(service.modalActivo()).toBe('login');
  });

  it('deberia abrir modal de registro', () => {
    service.abrirRegistro();
    expect(service.modalActivo()).toBe('registro');
  });

  it('deberia cerrar modal', () => {
    service.abrirLogin();
    expect(service.modalActivo()).toBe('login');
    
    service.cerrar();
    expect(service.modalActivo()).toBeNull();
  });

  it('deberia cambiar entre modales', () => {
    service.abrirLogin();
    expect(service.modalActivo()).toBe('login');
    
    service.abrirRegistro();
    expect(service.modalActivo()).toBe('registro');
  });

  it('deberia indicar si hay modal abierto con modalActivo()', () => {
    expect(service.modalActivo()).toBeNull();
    
    service.abrirLogin();
    expect(service.modalActivo()).not.toBeNull();
    
    service.cerrar();
    expect(service.modalActivo()).toBeNull();
  });

  it('deberia alternar entre login y registro', () => {
    service.abrirLogin();
    expect(service.modalActivo()).toBe('login');
    
    service.abrirRegistro();
    expect(service.modalActivo()).toBe('registro');
    
    service.abrirLogin();
    expect(service.modalActivo()).toBe('login');
  });

  describe('requerirRegistro', () => {
    it('deberia mostrar notificacion info', fakeAsync(() => {
      service.requerirRegistro();
      expect(mockNotificacion.info).toHaveBeenCalledWith('Debes registrarte para realizar esta acción');
      tick(2100);
    }));

    it('deberia abrir modal de registro despues de delay', fakeAsync(() => {
      service.requerirRegistro();
      expect(service.modalActivo()).toBeNull();
      
      tick(2100);
      expect(service.modalActivo()).toBe('registro');
    }));
  });

  describe('manejo de scroll', () => {
    it('deberia deshabilitar scroll al abrir modal', () => {
      service.abrirLogin();
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('deberia habilitar scroll al cerrar modal', () => {
      service.abrirLogin();
      service.cerrar();
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('manejo de tecla Escape', () => {
    it('deberia cerrar modal con tecla Escape', () => {
      service.abrirLogin();
      expect(service.modalActivo()).toBe('login');
      
      const evento = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(evento);
      
      expect(service.modalActivo()).toBeNull();
    });

    it('no deberia cerrar con otra tecla', () => {
      service.abrirLogin();
      expect(service.modalActivo()).toBe('login');
      
      const evento = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(evento);
      
      expect(service.modalActivo()).toBe('login');
    });
  });
});
