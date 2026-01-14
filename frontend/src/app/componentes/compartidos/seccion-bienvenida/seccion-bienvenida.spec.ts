import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeccionBienvenida } from './seccion-bienvenida';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [SeccionBienvenida],
  template: `
    <app-seccion-bienvenida
      [tituloLineas]="titulo"
      [subtituloLineas]="subtitulo"
      [textoBoton]="boton"
      (accion)="onAccion()"
    />
  `
})
class TestHostComponent {
  titulo = ['Bienvenido', 'a Gymunity'];
  subtitulo = ['Tu plataforma', 'de artes marciales'];
  boton = 'Empezar ahora';
  accionLlamada = false;
  
  onAccion(): void {
    this.accionLlamada = true;
  }
}

describe('SeccionBienvenida', () => {
  let component: SeccionBienvenida;
  let fixture: ComponentFixture<SeccionBienvenida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionBienvenida]
    }).compileComponents();

    fixture = TestBed.createComponent(SeccionBienvenida);
    component = fixture.componentInstance;
  });

  it('deberia crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('deberia tener valores por defecto vacios', () => {
    expect(component.tituloLineas()).toEqual([]);
    expect(component.subtituloLineas()).toEqual([]);
    expect(component.textoBoton()).toBe('');
  });

  describe('con TestHost', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;

    beforeEach(async () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });

    it('deberia recibir titulo lineas', () => {
      const seccion = hostFixture.debugElement.children[0].componentInstance as SeccionBienvenida;
      expect(seccion.tituloLineas()).toEqual(['Bienvenido', 'a Gymunity']);
    });

    it('deberia recibir subtitulo lineas', () => {
      const seccion = hostFixture.debugElement.children[0].componentInstance as SeccionBienvenida;
      expect(seccion.subtituloLineas()).toEqual(['Tu plataforma', 'de artes marciales']);
    });

    it('deberia recibir texto boton', () => {
      const seccion = hostFixture.debugElement.children[0].componentInstance as SeccionBienvenida;
      expect(seccion.textoBoton()).toBe('Empezar ahora');
    });

    it('deberia emitir accion al hacer click en el boton', () => {
      const boton = hostFixture.nativeElement.querySelector('button');
      if (boton) {
        boton.click();
        expect(hostComponent.accionLlamada).toBeTrue();
      }
    });
  });
});
