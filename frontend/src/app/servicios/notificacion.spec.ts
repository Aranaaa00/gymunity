import { TestBed } from '@angular/core/testing';
import { NotificacionService } from './notificacion';

describe('NotificacionService', () => {
  let service: NotificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionService);
  });

  afterEach(() => {
    service.cerrar();
  });

  it('deberia crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('deberia mostrar notificacion de exito', () => {
    service.success('Test exitoso');
    expect(service.notificacion()).toBeTruthy();
    expect(service.notificacion()?.tipo).toBe('success');
    expect(service.notificacion()?.mensaje).toBe('Test exitoso');
  });

  it('deberia mostrar notificacion de error', () => {
    service.error('Test error');
    expect(service.notificacion()?.tipo).toBe('error');
    expect(service.notificacion()?.mensaje).toBe('Test error');
  });

  it('deberia mostrar notificacion de warning', () => {
    service.warning('Test warning');
    expect(service.notificacion()?.tipo).toBe('warning');
    expect(service.notificacion()?.mensaje).toBe('Test warning');
  });

  it('deberia mostrar notificacion de info', () => {
    service.info('Test info');
    expect(service.notificacion()?.tipo).toBe('info');
    expect(service.notificacion()?.mensaje).toBe('Test info');
  });

  it('deberia cerrar la notificacion', () => {
    service.success('Test');
    service.cerrar();
    expect(service.notificacion()).toBeNull();
  });

  it('deberia reemplazar notificacion anterior inmediatamente', () => {
    service.success('Primera');
    const primerId = service.notificacion()?.id;
    
    service.error('Segunda');
    const segundoId = service.notificacion()?.id;
    
    expect(segundoId).not.toBe(primerId);
    expect(service.notificacion()?.mensaje).toBe('Segunda');
    expect(service.notificacion()?.tipo).toBe('error');
  });

  it('deberia incrementar el id de notificacion', () => {
    service.info('Uno');
    const id1 = service.notificacion()?.id;
    
    service.info('Dos');
    const id2 = service.notificacion()?.id;
    
    service.info('Tres');
    const id3 = service.notificacion()?.id;
    
    expect(id2).toBe((id1 ?? 0) + 1);
    expect(id3).toBe((id2 ?? 0) + 1);
  });

  it('deberia usar metodo generico mostrar', () => {
    service.mostrar('Mensaje generico', 'warning');
    expect(service.notificacion()?.tipo).toBe('warning');
    expect(service.notificacion()?.mensaje).toBe('Mensaje generico');
  });

  it('deberia usar tipo por defecto cuando no se especifica', () => {
    service.mostrar('Solo mensaje');
    expect(service.notificacion()?.tipo).toBe('info');
  });

  it('deberia manejar multiples notificaciones en cola', () => {
    service.success('Primera');
    service.error('Segunda');
    service.warning('Tercera');
    
    const notificaciones = service.notificaciones();
    expect(notificaciones.length).toBeGreaterThanOrEqual(1);
  });

  it('deberia cerrar notificacion por id especifico', () => {
    service.success('Test');
    const id = service.notificacion()?.id;
    
    if (id !== undefined) {
      service.cerrar(id);
    }
    
    expect(service.notificacion()).toBeNull();
  });
});
