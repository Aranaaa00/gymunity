import { TestBed } from '@angular/core/testing';
import { Boton } from './boton';

/**
 * Tests unitarios para el componente Boton.
 * Se testean las propiedades y valores por defecto sin renderizado completo
 * para evitar dependencias de iconos externos.
 */
describe('Boton', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Boton]
    }).compileComponents();
  });

  it('deberia crear el componente', () => {
    const fixture = TestBed.createComponent(Boton);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('deberia tener tipo button por defecto', () => {
    const fixture = TestBed.createComponent(Boton);
    const component = fixture.componentInstance;
    expect(component.tipo()).toBe('button');
  });

  it('deberia tener variante primary por defecto', () => {
    const fixture = TestBed.createComponent(Boton);
    const component = fixture.componentInstance;
    expect(component.variante()).toBe('primary');
  });

  it('deberia tener tamano md por defecto', () => {
    const fixture = TestBed.createComponent(Boton);
    const component = fixture.componentInstance;
    expect(component.tamano()).toBe('md');
  });

  it('deberia tener disabled false por defecto', () => {
    const fixture = TestBed.createComponent(Boton);
    const component = fixture.componentInstance;
    expect(component.disabled()).toBeFalse();
  });

  it('deberia tener cargando false por defecto', () => {
    const fixture = TestBed.createComponent(Boton);
    const component = fixture.componentInstance;
    expect(component.cargando()).toBeFalse();
  });

  it('deberia computar clases correctamente para variante primary', () => {
    const fixture = TestBed.createComponent(Boton);
    const component = fixture.componentInstance;
    const clases = component.clases();
    expect(clases).toContain('boton--primary');
    expect(clases).toContain('boton--md');
  });
});
