import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Tooltip } from './tooltip';

@Component({
  standalone: true,
  imports: [Tooltip],
  template: `<app-tooltip [texto]="texto" [posicion]="posicion" [retraso]="retraso">Contenido</app-tooltip>`
})
class TestHostComponent {
  texto = 'Tooltip de prueba';
  posicion: 'arriba' | 'abajo' | 'izquierda' | 'derecha' = 'arriba';
  retraso = 200;
}

describe('Tooltip', () => {
  let component: Tooltip;
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

  afterEach(() => {
    component.ngOnDestroy();
  });

  describe('creacion', () => {
    it('deberia crearse', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('inputs', () => {
    it('deberia recibir texto', () => {
      expect(component.texto()).toBe('Tooltip de prueba');
    });

    it('deberia tener posicion arriba por defecto', () => {
      expect(component.posicion()).toBe('arriba');
    });

    it('deberia tener retraso de 200ms por defecto', () => {
      expect(component.retraso()).toBe(200);
    });
  });

  describe('eventos', () => {
    it('deberia llamar onEnter al hacer mouseenter', () => {
      spyOn(component, 'onEnter');
      const elemento = fixture.debugElement.children[0].nativeElement;
      elemento.dispatchEvent(new MouseEvent('mouseenter'));
      expect(component.onEnter).toHaveBeenCalled();
    });

    it('deberia llamar onLeave al hacer mouseleave', () => {
      spyOn(component, 'onLeave');
      const elemento = fixture.debugElement.children[0].nativeElement;
      elemento.dispatchEvent(new MouseEvent('mouseleave'));
      expect(component.onLeave).toHaveBeenCalled();
    });

    it('deberia llamar onLeave al presionar Escape', () => {
      spyOn(component, 'onLeave');
      const elemento = fixture.debugElement.children[0].nativeElement;
      const evento = new KeyboardEvent('keydown', { key: 'Escape' });
      elemento.dispatchEvent(evento);
      expect(component.onLeave).toHaveBeenCalled();
    });
  });

  describe('sin texto', () => {
    it('no deberia mostrar tooltip sin texto', () => {
      hostComponent.texto = '';
      fixture.detectChanges();
      component.onEnter();
      expect(component.idTooltip()).toBeNull();
    });
  });

  describe('lifecycle', () => {
    it('deberia poder destruirse sin errores', () => {
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });
});
