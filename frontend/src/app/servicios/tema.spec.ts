import { TestBed } from '@angular/core/testing';
import { TemaService } from './tema';

describe('TemaService', () => {
  let service: TemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemaService);
  });

  it('deberia crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('deberia tener un tema actual valido', () => {
    const tema = service.tema();
    expect(['claro', 'oscuro']).toContain(tema);
  });

  it('deberia alternar de claro a oscuro', () => {
    if (service.tema() === 'oscuro') {
      service.alternar();
    }
    expect(service.tema()).toBe('claro');
    
    service.alternar();
    expect(service.tema()).toBe('oscuro');
  });

  it('deberia alternar de oscuro a claro', () => {
    if (service.tema() === 'claro') {
      service.alternar();
    }
    expect(service.tema()).toBe('oscuro');
    
    service.alternar();
    expect(service.tema()).toBe('claro');
  });

  it('esOscuro deberia retornar valor correcto', () => {
    if (service.tema() === 'claro') {
      expect(service.esOscuro()).toBeFalse();
      service.alternar();
      expect(service.esOscuro()).toBeTrue();
    } else {
      expect(service.esOscuro()).toBeTrue();
      service.alternar();
      expect(service.esOscuro()).toBeFalse();
    }
  });

  it('deberia mantener consistencia entre tema() y esOscuro()', () => {
    const temaAntes = service.tema();
    service.alternar();
    const esOscuro = service.esOscuro();
    const tema = service.tema();
    
    if (esOscuro) {
      expect(tema).toBe('oscuro');
    } else {
      expect(tema).toBe('claro');
    }
    
    expect(tema).not.toBe(temaAntes);
  });

  it('deberia poder alternar multiples veces', () => {
    const temaInicial = service.tema();
    
    service.alternar();
    service.alternar();
    
    expect(service.tema()).toBe(temaInicial);
  });
});
