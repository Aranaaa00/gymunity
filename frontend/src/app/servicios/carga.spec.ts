import { TestBed } from '@angular/core/testing';
import { CargaService } from './carga';

describe('CargaService', () => {
  let service: CargaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargaService);
    service.limpiar();
  });

  afterEach(() => {
    service.limpiar();
  });

  it('deberia crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('deberia alternar estado de carga', () => {
    expect(service.cargando()).toBeFalse();
    service.iniciar('test');
    expect(service.cargando()).toBeTrue();
    service.finalizar('test');
    expect(service.cargando()).toBeFalse();
  });

  it('deberia manejar multiples estados de carga', () => {
    service.iniciar('carga1');
    service.iniciar('carga2');
    expect(service.cargando()).toBeTrue();
    
    service.finalizar('carga1');
    expect(service.cargando()).toBeTrue();
    
    service.finalizar('carga2');
    expect(service.cargando()).toBeFalse();
  });

  it('deberia rastrear carga especifica por id', () => {
    service.iniciar('api-call');
    expect(service.estaCargando('api-call')).toBeTrue();
    expect(service.estaCargando('otro')).toBeFalse();
    
    service.finalizar('api-call');
    expect(service.estaCargando('api-call')).toBeFalse();
  });

  it('deberia establecer mensaje personalizado', () => {
    service.iniciar('test', 'Procesando datos...');
    const estado = service.obtenerEstado('test');
    expect(estado?.mensaje).toBe('Procesando datos...');
  });

  it('deberia actualizar porcentaje', () => {
    service.iniciar('upload');
    service.actualizarPorcentaje('upload', 50);
    
    const estado = service.obtenerEstado('upload');
    expect(estado?.porcentaje).toBe(50);
  });

  it('deberia normalizar porcentaje a rango valido', () => {
    service.iniciar('test');
    
    service.actualizarPorcentaje('test', 150);
    expect(service.obtenerEstado('test')?.porcentaje).toBe(100);
    
    service.actualizarPorcentaje('test', -20);
    expect(service.obtenerEstado('test')?.porcentaje).toBe(0);
  });

  it('deberia actualizar mensaje con porcentaje', () => {
    service.iniciar('test', 'Inicial');
    service.actualizarPorcentaje('test', 50, 'Actualizado');
    
    expect(service.obtenerEstado('test')?.mensaje).toBe('Actualizado');
  });

  it('deberia calcular porcentaje global', () => {
    service.iniciar('a');
    service.iniciar('b');
    service.actualizarPorcentaje('a', 40);
    service.actualizarPorcentaje('b', 60);
    
    expect(service.porcentajeGlobal()).toBe(50);
  });

  it('deberia retornar ultimo mensaje como mensaje global', () => {
    service.iniciar('primero', 'Mensaje 1');
    service.iniciar('segundo', 'Mensaje 2');
    
    expect(service.mensajeGlobal()).toBe('Mensaje 2');
  });

  it('deberia limpiar todos los estados de carga', () => {
    service.iniciar('uno');
    service.iniciar('dos');
    service.iniciar('tres');
    
    service.limpiar();
    expect(service.cargando()).toBeFalse();
  });

  it('deberia proveer signal seleccionable para id especifico', () => {
    const selector = service.seleccionar('dinamico');
    expect(selector()).toBeFalse();
    
    service.iniciar('dinamico');
    expect(selector()).toBeTrue();
    
    service.finalizar('dinamico');
    expect(selector()).toBeFalse();
  });

  it('deberia proveer signal de porcentaje seleccionable', () => {
    const selectorPorcentaje = service.seleccionarPorcentaje('progreso');
    expect(selectorPorcentaje()).toBe(0);
    
    service.iniciar('progreso');
    service.actualizarPorcentaje('progreso', 75);
    expect(selectorPorcentaje()).toBe(75);
  });

  it('no deberia actualizar porcentaje para id inexistente', () => {
    service.actualizarPorcentaje('inexistente', 50);
    expect(service.obtenerEstado('inexistente')).toBeUndefined();
  });

  it('deberia retornar 0 como porcentaje global sin cargas activas', () => {
    expect(service.porcentajeGlobal()).toBe(0);
  });

  it('deberia retornar mensaje por defecto sin cargas', () => {
    expect(service.mensajeGlobal()).toBe('Cargando...');
  });
});
