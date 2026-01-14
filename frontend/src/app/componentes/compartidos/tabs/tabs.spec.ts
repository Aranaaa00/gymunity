import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Tabs } from './tabs';

@Component({
  standalone: true,
  imports: [Tabs],
  template: `<app-tabs [pestanas]="pestanas" [tabActivo]="tabActivo" (tabCambiado)="onTabCambiado($event)"></app-tabs>`
})
class TestHostComponent {
  pestanas = ['Tab 1', 'Tab 2', 'Tab 3'];
  tabActivo = 0;
  tabCambiado = -1;
  onTabCambiado(indice: number) {
    this.tabCambiado = indice;
    this.tabActivo = indice;
  }
}

describe('Tabs', () => {
  let component: Tabs;
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
    it('deberia recibir pestanas', () => {
      expect(component.pestanas().length).toBe(3);
    });

    it('deberia tener tabActivo inicial', () => {
      expect(component.tabActivo()).toBe(0);
    });
  });

  describe('seleccionarTab', () => {
    it('deberia emitir tabCambiado al seleccionar', () => {
      component.seleccionarTab(1);
      expect(hostComponent.tabCambiado).toBe(1);
    });

    it('no deberia emitir para indice negativo', () => {
      hostComponent.tabCambiado = -1;
      component.seleccionarTab(-1);
      expect(hostComponent.tabCambiado).toBe(-1);
    });

    it('no deberia emitir para indice fuera de rango', () => {
      hostComponent.tabCambiado = -1;
      component.seleccionarTab(10);
      expect(hostComponent.tabCambiado).toBe(-1);
    });
  });

  describe('navegacion por teclado', () => {
    it('deberia ir a la derecha con ArrowRight', () => {
      const evento = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      component.onKeydown(evento);
      expect(hostComponent.tabCambiado).toBe(1);
    });

    it('deberia ir a la izquierda con ArrowLeft', () => {
      hostComponent.tabActivo = 1;
      fixture.detectChanges();
      const evento = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      component.onKeydown(evento);
      expect(hostComponent.tabCambiado).toBe(0);
    });

    it('deberia ir al primero con Home', () => {
      hostComponent.tabActivo = 2;
      fixture.detectChanges();
      const evento = new KeyboardEvent('keydown', { key: 'Home' });
      component.onKeydown(evento);
      expect(hostComponent.tabCambiado).toBe(0);
    });

    it('deberia ir al ultimo con End', () => {
      const evento = new KeyboardEvent('keydown', { key: 'End' });
      component.onKeydown(evento);
      expect(hostComponent.tabCambiado).toBe(2);
    });

    it('deberia hacer wrap de derecha a izquierda', () => {
      hostComponent.tabActivo = 2;
      fixture.detectChanges();
      const evento = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      component.onKeydown(evento);
      expect(hostComponent.tabCambiado).toBe(0);
    });

    it('deberia hacer wrap de izquierda a derecha', () => {
      hostComponent.tabActivo = 0;
      fixture.detectChanges();
      const evento = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      component.onKeydown(evento);
      expect(hostComponent.tabCambiado).toBe(2);
    });

    it('deberia ignorar teclas no reconocidas', () => {
      hostComponent.tabCambiado = -1;
      const evento = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onKeydown(evento);
      expect(hostComponent.tabCambiado).toBe(-1);
    });
  });

  describe('sin pestanas', () => {
    it('no deberia emitir sin pestanas', () => {
      hostComponent.pestanas = [];
      hostComponent.tabCambiado = -1;
      fixture.detectChanges();
      const evento = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      component.onKeydown(evento);
      expect(hostComponent.tabCambiado).toBe(-1);
    });
  });
});
