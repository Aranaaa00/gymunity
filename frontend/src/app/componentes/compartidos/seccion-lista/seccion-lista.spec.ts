import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeccionLista } from './seccion-lista';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [SeccionLista],
  template: `
    <app-seccion-lista
      [titulo]="titulo"
      [mostrarVerMas]="mostrarVerMas"
      [textoVerMas]="textoVerMas"
      (verMas)="onVerMas()"
    >
      <p>Contenido de prueba</p>
    </app-seccion-lista>
  `
})
class TestHostComponent {
  titulo = 'Mi Sección';
  mostrarVerMas = false;
  textoVerMas = 'Ver más';
  verMasLlamado = false;
  
  onVerMas(): void {
    this.verMasLlamado = true;
  }
}

describe('SeccionLista', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionLista, TestHostComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('deberia crear el componente', () => {
    const seccion = hostFixture.debugElement.children[0].componentInstance as SeccionLista;
    expect(seccion).toBeTruthy();
  });

  it('deberia recibir titulo', () => {
    const seccion = hostFixture.debugElement.children[0].componentInstance as SeccionLista;
    expect(seccion.titulo()).toBe('Mi Sección');
  });

  it('deberia tener mostrarVerMas false por defecto', () => {
    const seccion = hostFixture.debugElement.children[0].componentInstance as SeccionLista;
    expect(seccion.mostrarVerMas()).toBeFalse();
  });

  it('deberia tener textoVerMas por defecto', () => {
    hostComponent.textoVerMas = 'Ver todos';
    hostFixture.detectChanges();
    
    const seccion = hostFixture.debugElement.children[0].componentInstance as SeccionLista;
    expect(seccion.textoVerMas()).toBe('Ver todos');
  });

  it('deberia emitir verMas al llamar onVerMas', () => {
    const seccion = hostFixture.debugElement.children[0].componentInstance as SeccionLista;
    seccion.onVerMas();
    expect(hostComponent.verMasLlamado).toBeTrue();
  });

  it('deberia renderizar contenido proyectado', () => {
    const contenido = hostFixture.nativeElement.querySelector('p');
    expect(contenido.textContent).toBe('Contenido de prueba');
  });

  it('deberia mostrar boton cuando mostrarVerMas es true', () => {
    hostComponent.mostrarVerMas = true;
    hostFixture.detectChanges();
    
    const boton = hostFixture.nativeElement.querySelector('.seccion-lista__ver-mas');
    expect(boton).toBeTruthy();
  });
});
