import { TestBed } from '@angular/core/testing';
import { ComunicacionService } from './comunicacion';

describe('ComunicacionService', () => {
  let service: ComunicacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComunicacionService);
  });

  it('deberia crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('deberia emitir y recibir eventos', (done) => {
    service.escuchar<string>('TEST_EVENT').subscribe(data => {
      expect(data).toBe('test-data');
      done();
    });
    service.emitir('TEST_EVENT', 'test-data');
  });

  it('deberia emitir eventos con payload de objeto', (done) => {
    const payload = { id: 1, nombre: 'Test' };
    
    service.escuchar<typeof payload>('OBJETO_EVENT').subscribe(data => {
      expect(data.id).toBe(1);
      expect(data.nombre).toBe('Test');
      done();
    });
    
    service.emitir('OBJETO_EVENT', payload);
  });

  it('deberia filtrar eventos por tipo', (done) => {
    let contadorA = 0;
    let contadorB = 0;
    
    service.escuchar('EVENTO_A').subscribe(() => contadorA++);
    service.escuchar('EVENTO_B').subscribe(() => contadorB++);
    
    service.emitir('EVENTO_A', null);
    service.emitir('EVENTO_A', null);
    service.emitir('EVENTO_B', null);
    
    setTimeout(() => {
      expect(contadorA).toBe(2);
      expect(contadorB).toBe(1);
      done();
    }, 10);
  });

  it('deberia emitir eventos sin payload', (done) => {
    service.escuchar('EVENTO_VACIO').subscribe(data => {
      expect(data).toBeNull();
      done();
    });
    service.emitir('EVENTO_VACIO', null);
  });

  it('deberia manejar multiples suscriptores al mismo evento', (done) => {
    let contador1 = 0;
    let contador2 = 0;
    
    service.escuchar('EVENTO_MULTI').subscribe(() => contador1++);
    service.escuchar('EVENTO_MULTI').subscribe(() => contador2++);
    
    service.emitir('EVENTO_MULTI', null);
    
    setTimeout(() => {
      expect(contador1).toBe(1);
      expect(contador2).toBe(1);
      done();
    }, 10);
  });

  it('deberia emitir eventos con arrays', (done) => {
    const payload = [1, 2, 3, 4, 5];
    
    service.escuchar<number[]>('ARRAY_EVENT').subscribe(data => {
      expect(data.length).toBe(5);
      expect(data[0]).toBe(1);
      done();
    });
    
    service.emitir('ARRAY_EVENT', payload);
  });
});
