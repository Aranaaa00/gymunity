import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Galeria } from './galeria';

@Component({
  standalone: true,
  imports: [Galeria],
  template: `<app-galeria [imagenes]="imagenes" [alt]="alt" [maxMiniaturas]="maxMiniaturas"></app-galeria>`
})
class TestHostComponent {
  imagenes = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg'];
  alt = 'Imagen de prueba';
  maxMiniaturas = 4;
}

describe('Galeria', () => {
  let component: Galeria;
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
    component = fixture.debugElement.children[0].componentInstance;
  });

  describe('creacion', () => {
    it('deberia crearse', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('inputs', () => {
    it('deberia recibir imagenes', () => {
      expect(component.imagenes().length).toBe(5);
    });

    it('deberia recibir alt', () => {
      expect(component.alt()).toBe('Imagen de prueba');
    });

    it('deberia recibir maxMiniaturas', () => {
      expect(component.maxMiniaturas()).toBe(4);
    });
  });

  describe('computed', () => {
    it('deberia calcular imagenPrincipal correctamente', () => {
      expect(component.imagenPrincipal()).toBe('img1.jpg');
    });

    it('deberia cambiar imagenPrincipal al cambiar indice', () => {
      component.seleccionarImagen(2);
      expect(component.imagenPrincipal()).toBe('img3.jpg');
    });

    it('deberia calcular miniaturas correctamente', () => {
      expect(component.miniaturas().length).toBe(4);
    });

    it('deberia indicar que tiene miniaturas', () => {
      expect(component.tieneMiniaturas()).toBeTrue();
    });
  });

  describe('seleccionarImagen', () => {
    it('deberia actualizar indiceActivo', () => {
      component.seleccionarImagen(3);
      expect(component.indiceActivo()).toBe(3);
    });
  });

  describe('trackByIndex', () => {
    it('deberia retornar el indice', () => {
      expect(component.trackByIndex(5)).toBe(5);
    });
  });

  describe('sin imagenes', () => {
    it('deberia manejar array vacio', () => {
      hostComponent.imagenes = [];
      fixture.detectChanges();
      expect(component.imagenPrincipal()).toBe('');
      expect(component.tieneMiniaturas()).toBeFalse();
    });
  });

  describe('una sola imagen', () => {
    it('deberia no tener miniaturas con una imagen', () => {
      hostComponent.imagenes = ['unica.jpg'];
      fixture.detectChanges();
      expect(component.tieneMiniaturas()).toBeFalse();
    });
  });
});
