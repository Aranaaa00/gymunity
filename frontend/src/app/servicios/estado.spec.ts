import { TestBed } from '@angular/core/testing';
import { EstadoService } from './estado';

describe('EstadoService', () => {
  let service: EstadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadoService);
    service.limpiar();
  });

  afterEach(() => {
    service.limpiar();
  });

  it('deberia crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('deberia retornar undefined para clave inexistente', () => {
    expect(service.obtener('inexistente')).toBeUndefined();
  });

  it('deberia establecer y obtener valores', () => {
    service.establecer('usuario', { nombre: 'Test' });
    expect(service.obtener('usuario')).toEqual({ nombre: 'Test' });
  });

  it('deberia actualizar valores existentes', () => {
    service.establecer('contador', 1);
    expect(service.obtener('contador')).toBe(1);
    
    service.establecer('contador', 5);
    expect(service.obtener('contador')).toBe(5);
  });

  it('deberia eliminar valores', () => {
    service.establecer('temp', 'valor');
    expect(service.obtener('temp')).toBe('valor');
    
    service.eliminar('temp');
    expect(service.obtener('temp')).toBeUndefined();
  });

  it('deberia limpiar todos los valores', () => {
    service.establecer('a', 1);
    service.establecer('b', 2);
    service.establecer('c', 3);
    
    service.limpiar();
    
    expect(service.obtener('a')).toBeUndefined();
    expect(service.obtener('b')).toBeUndefined();
    expect(service.obtener('c')).toBeUndefined();
  });

  it('deberia proveer signal seleccionable', () => {
    const selector = service.seleccionar<number>('dinamico');
    expect(selector()).toBeUndefined();
    
    service.establecer('dinamico', 42);
    expect(selector()).toBe(42);
    
    service.eliminar('dinamico');
    expect(selector()).toBeUndefined();
  });

  it('deberia manejar diferentes tipos de datos', () => {
    service.establecer('string', 'texto');
    service.establecer('number', 123);
    service.establecer('boolean', true);
    service.establecer('array', [1, 2, 3]);
    service.establecer('object', { key: 'value' });
    
    expect(service.obtener('string')).toBe('texto');
    expect(service.obtener('number')).toBe(123);
    expect(service.obtener('boolean')).toBe(true);
    expect(service.obtener('array')).toEqual([1, 2, 3]);
    expect(service.obtener('object')).toEqual({ key: 'value' });
  });

  it('deberia manejar valores null', () => {
    service.establecer('nulo', null);
    expect(service.obtener('nulo')).toBeNull();
  });

  it('deberia manejar valores undefined explicitamente', () => {
    service.establecer('indefinido', undefined);
    expect(service.obtener('indefinido')).toBeUndefined();
  });

  it('deberia manejar objetos anidados', () => {
    const objetoAnidado = {
      nivel1: {
        nivel2: {
          valor: 'profundo'
        }
      }
    };
    service.establecer('anidado', objetoAnidado);
    const recuperado = service.obtener<typeof objetoAnidado>('anidado');
    expect(recuperado?.nivel1?.nivel2?.valor).toBe('profundo');
  });

  it('deberia manejar arrays de objetos', () => {
    const array = [{ id: 1 }, { id: 2 }, { id: 3 }];
    service.establecer('arrayObjetos', array);
    const recuperado = service.obtener<typeof array>('arrayObjetos');
    expect(recuperado?.length).toBe(3);
    expect(recuperado?.[1]?.id).toBe(2);
  });
});
