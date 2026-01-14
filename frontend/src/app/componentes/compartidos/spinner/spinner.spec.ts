import { TestBed } from '@angular/core/testing';
import { Spinner } from './spinner';

/**
 * Tests unitarios para el componente Spinner.
 * Se testean las propiedades computadas y valores por defecto sin renderizado completo
 * para evitar dependencias de iconos externos.
 */
describe('Spinner', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spinner]
    }).compileComponents();
  });

  it('deberia crear el componente', () => {
    const fixture = TestBed.createComponent(Spinner);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('deberia tener tamano md por defecto', () => {
    const fixture = TestBed.createComponent(Spinner);
    const component = fixture.componentInstance;
    expect(component.tamano()).toBe('md');
  });

  it('deberia computar tamano de icono correctamente para md', () => {
    const fixture = TestBed.createComponent(Spinner);
    const component = fixture.componentInstance;
    expect(component.iconoTamano()).toBe(40);
  });

  it('no deberia mostrar porcentaje por defecto', () => {
    const fixture = TestBed.createComponent(Spinner);
    const component = fixture.componentInstance;
    expect(component.mostrarPorcentaje()).toBeFalse();
  });

  it('deberia tener porcentaje null por defecto', () => {
    const fixture = TestBed.createComponent(Spinner);
    const component = fixture.componentInstance;
    expect(component.porcentaje()).toBeNull();
  });

  it('deberia tener texto vacio por defecto', () => {
    const fixture = TestBed.createComponent(Spinner);
    const component = fixture.componentInstance;
    expect(component.texto()).toBe('');
  });

  it('deberia tener overlay false por defecto', () => {
    const fixture = TestBed.createComponent(Spinner);
    const component = fixture.componentInstance;
    expect(component.overlay()).toBeFalse();
  });
});
