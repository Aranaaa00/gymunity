import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { autenticacionGuard, noAutenticadoGuard } from './autenticacion.guard';
import { AuthService } from '../servicios/auth';
import { signal } from '@angular/core';

describe('autenticacionGuard', () => {
  describe('cuando esta autenticado', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: AuthService, useValue: { estaAutenticado: signal(true) } },
          {
            provide: Router,
            useValue: {
              createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({} as UrlTree)
            }
          }
        ]
      });
    });

    it('deberia permitir acceso', () => {
      const result = TestBed.runInInjectionContext(() => autenticacionGuard({} as any, {} as any));
      expect(result).toBe(true);
    });
  });

  describe('cuando NO esta autenticado', () => {
    let router: Router;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: AuthService, useValue: { estaAutenticado: signal(false) } },
          {
            provide: Router,
            useValue: {
              createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({ toString: () => '/' } as UrlTree)
            }
          }
        ]
      });
      router = TestBed.inject(Router);
    });

    it('deberia redirigir a inicio', () => {
      const result = TestBed.runInInjectionContext(() => autenticacionGuard({} as any, {} as any));
      expect(result).not.toBe(true);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/']);
    });
  });
});

describe('noAutenticadoGuard', () => {
  describe('cuando NO esta autenticado', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: AuthService, useValue: { estaAutenticado: signal(false) } },
          {
            provide: Router,
            useValue: {
              createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({} as UrlTree)
            }
          }
        ]
      });
    });

    it('deberia permitir acceso', () => {
      const result = TestBed.runInInjectionContext(() => noAutenticadoGuard({} as any, {} as any));
      expect(result).toBe(true);
    });
  });

  describe('cuando esta autenticado', () => {
    let router: Router;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: AuthService, useValue: { estaAutenticado: signal(true) } },
          {
            provide: Router,
            useValue: {
              createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({ toString: () => '/' } as UrlTree)
            }
          }
        ]
      });
      router = TestBed.inject(Router);
    });

    it('deberia redirigir a inicio', () => {
      const result = TestBed.runInInjectionContext(() => noAutenticadoGuard({} as any, {} as any));
      expect(result).not.toBe(true);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/']);
    });
  });
});
