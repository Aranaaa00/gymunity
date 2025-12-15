import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { NotificacionService } from './servicios/notificacion';
import { TemaService } from './servicios/tema';
import { CargaService } from './servicios/carga';
import { ComunicacionService } from './servicios/comunicacion';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

describe('NotificacionService', () => {
  let service: NotificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should show success notification', () => {
    service.success('Test exitoso');
    expect(service.notificacion()).toBeTruthy();
    expect(service.notificacion()?.tipo).toBe('success');
    expect(service.notificacion()?.mensaje).toBe('Test exitoso');
  });

  it('should show error notification', () => {
    service.error('Test error');
    expect(service.notificacion()?.tipo).toBe('error');
  });

  it('should close notification', () => {
    service.success('Test');
    service.cerrar();
    expect(service.notificacion()).toBeNull();
  });
});

describe('TemaService', () => {
  let service: TemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemaService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should have a current theme', () => {
    const tema = service.tema();
    expect(['claro', 'oscuro']).toContain(tema);
  });
});

describe('CargaService', () => {
  let service: CargaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargaService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle loading state', () => {
    expect(service.cargando()).toBeFalse();
    service.iniciar('test');
    expect(service.cargando()).toBeTrue();
    service.finalizar('test');
    expect(service.cargando()).toBeFalse();
  });
});

describe('ComunicacionService', () => {
  let service: ComunicacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComunicacionService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should emit and receive events', (done) => {
    service.escuchar<string>('TEST_EVENT').subscribe(data => {
      expect(data).toBe('test-data');
      done();
    });
    service.emitir('TEST_EVENT', 'test-data');
  });
});
