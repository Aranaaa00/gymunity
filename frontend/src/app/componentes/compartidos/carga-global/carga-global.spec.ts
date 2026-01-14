import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CargaGlobal } from './carga-global';
import { CargaService } from '../../../servicios/carga';
import { signal } from '@angular/core';

describe('CargaGlobal', () => {
  let component: CargaGlobal;
  let fixture: ComponentFixture<CargaGlobal>;
  let mockCargaService: {
    cargando: ReturnType<typeof signal>;
    porcentajeGlobal: ReturnType<typeof signal>;
    mensajeGlobal: ReturnType<typeof signal>;
  };

  beforeEach(async () => {
    mockCargaService = {
      cargando: signal(false),
      porcentajeGlobal: signal(0),
      mensajeGlobal: signal('Cargando...')
    };

    await TestBed.configureTestingModule({
      imports: [CargaGlobal],
      providers: [
        { provide: CargaService, useValue: mockCargaService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CargaGlobal);
    component = fixture.componentInstance;
  });

  it('deberia crearse', () => {
    expect(component).toBeTruthy();
  });

  it('deberia exponer estado de carga', () => {
    expect(component.cargando()).toBeFalse();
  });

  it('deberia exponer porcentaje', () => {
    expect(component.porcentaje()).toBe(0);
  });

  it('deberia exponer mensaje', () => {
    expect(component.mensaje()).toBe('Cargando...');
  });

  it('deberia actualizar cuando el servicio cambia', () => {
    mockCargaService.cargando.set(true);
    mockCargaService.porcentajeGlobal.set(50);
    mockCargaService.mensajeGlobal.set('Procesando...');

    expect(component.cargando()).toBeTrue();
    expect(component.porcentaje()).toBe(50);
    expect(component.mensaje()).toBe('Procesando...');
  });
});
