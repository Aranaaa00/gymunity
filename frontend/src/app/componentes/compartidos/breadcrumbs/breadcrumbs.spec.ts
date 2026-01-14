import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { Breadcrumbs } from './breadcrumbs';

describe('Breadcrumbs', () => {
  let component: Breadcrumbs;
  let fixture: ComponentFixture<Breadcrumbs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Breadcrumbs],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Breadcrumbs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('creacion', () => {
    it('deberia crearse', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('breadcrumbs', () => {
    it('deberia tener array de breadcrumbs', () => {
      expect(component.breadcrumbs()).toBeDefined();
      expect(Array.isArray(component.breadcrumbs())).toBeTrue();
    });

    it('deberia calcular mostrarBreadcrumbs', () => {
      expect(typeof component.mostrarBreadcrumbs()).toBe('boolean');
    });
  });

  describe('sin rutas', () => {
    it('no deberia mostrar breadcrumbs sin rutas', () => {
      expect(component.mostrarBreadcrumbs()).toBeFalse();
    });
  });
});
