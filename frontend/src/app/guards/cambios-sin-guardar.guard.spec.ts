import { TestBed } from '@angular/core/testing';
import { cambiosSinGuardarGuard, ComponenteConCambios } from './cambios-sin-guardar.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('cambiosSinGuardarGuard', () => {
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = {} as RouterStateSnapshot;
  });

  it('deberia permitir salir si no hay cambios sin guardar', () => {
    const componente: ComponenteConCambios = {
      tieneCambiosSinGuardar: () => false
    };

    const resultado = cambiosSinGuardarGuard(componente, mockRoute, mockState, mockState);
    
    expect(resultado).toBe(true);
  });

  it('deberia mostrar confirm si hay cambios sin guardar', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    
    const componente: ComponenteConCambios = {
      tieneCambiosSinGuardar: () => true
    };

    const resultado = cambiosSinGuardarGuard(componente, mockRoute, mockState, mockState);
    
    expect(window.confirm).toHaveBeenCalledWith('¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.');
    expect(resultado).toBe(true);
  });

  it('deberia denegar si usuario cancela confirm', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    
    const componente: ComponenteConCambios = {
      tieneCambiosSinGuardar: () => true
    };

    const resultado = cambiosSinGuardarGuard(componente, mockRoute, mockState, mockState);
    
    expect(resultado).toBe(false);
  });

  it('deberia permitir salir si componente no implementa tieneCambiosSinGuardar', () => {
    const componente = {} as ComponenteConCambios;

    const resultado = cambiosSinGuardarGuard(componente, mockRoute, mockState, mockState);
    
    expect(resultado).toBe(true);
  });
});
