import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { App } from './app';
import { NotificacionService } from './servicios/notificacion';
import { TemaService } from './servicios/tema';
import { CargaService } from './servicios/carga';
import { ComunicacionService } from './servicios/comunicacion';
import { ModalService } from './servicios/modal';
import { EstadoService } from './servicios/estado';
import { AuthService } from './servicios/auth';
import { Boton } from './componentes/compartidos/boton/boton';
import { Spinner } from './componentes/compartidos/spinner/spinner';
import { Alerta } from './componentes/compartidos/alerta/alerta';
import { 
  passwordFuerte, 
  coincidenCampos, 
  nifValido, 
  telefonoEspanol, 
  codigoPostalEspanol, 
  rangoNumerico 
} from './servicios/validadores';
import { calcularFuerzaPassword } from './servicios/fuerza-password';

// ============================================
// TESTS COMPONENTE APP
// ============================================

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

// ============================================
// TESTS NOTIFICACION SERVICE
// ============================================

describe('NotificacionService', () => {
  let service: NotificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionService);
  });

  afterEach(() => {
    service.cerrar();
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
    expect(service.notificacion()?.mensaje).toBe('Test error');
  });

  it('should show warning notification', () => {
    service.warning('Test warning');
    expect(service.notificacion()?.tipo).toBe('warning');
    expect(service.notificacion()?.mensaje).toBe('Test warning');
  });

  it('should show info notification', () => {
    service.info('Test info');
    expect(service.notificacion()?.tipo).toBe('info');
    expect(service.notificacion()?.mensaje).toBe('Test info');
  });

  it('should close notification', () => {
    service.success('Test');
    service.cerrar();
    expect(service.notificacion()).toBeNull();
  });

  it('should replace previous notification immediately', () => {
    service.success('Primera');
    const primerIdId = service.notificacion()?.id;
    
    service.error('Segunda');
    const segundoId = service.notificacion()?.id;
    
    expect(segundoId).not.toBe(primerIdId);
    expect(service.notificacion()?.mensaje).toBe('Segunda');
    expect(service.notificacion()?.tipo).toBe('error');
  });

  it('should increment notification id', () => {
    service.info('Uno');
    const id1 = service.notificacion()?.id;
    
    service.info('Dos');
    const id2 = service.notificacion()?.id;
    
    service.info('Tres');
    const id3 = service.notificacion()?.id;
    
    expect(id2).toBe((id1 ?? 0) + 1);
    expect(id3).toBe((id2 ?? 0) + 1);
  });

  it('should use generic mostrar method', () => {
    service.mostrar('Mensaje genérico', 'warning');
    expect(service.notificacion()?.tipo).toBe('warning');
    expect(service.notificacion()?.mensaje).toBe('Mensaje genérico');
  });

  it('should use default type when not specified', () => {
    service.mostrar('Solo mensaje');
    expect(service.notificacion()?.tipo).toBe('info');
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

  it('should toggle theme from claro to oscuro', () => {
    if (service.tema() === 'oscuro') {
      service.alternar();
    }
    expect(service.tema()).toBe('claro');
    
    service.alternar();
    expect(service.tema()).toBe('oscuro');
  });

  it('should toggle theme from oscuro to claro', () => {
    if (service.tema() === 'claro') {
      service.alternar();
    }
    expect(service.tema()).toBe('oscuro');
    
    service.alternar();
    expect(service.tema()).toBe('claro');
  });

  it('esOscuro should return correct value', () => {
    if (service.tema() === 'claro') {
      expect(service.esOscuro()).toBeFalse();
      service.alternar();
      expect(service.esOscuro()).toBeTrue();
    } else {
      expect(service.esOscuro()).toBeTrue();
      service.alternar();
      expect(service.esOscuro()).toBeFalse();
    }
  });
});

// ============================================
// TESTS CARGA SERVICE
// ============================================

describe('CargaService', () => {
  let service: CargaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargaService);
    service.limpiar();
  });

  afterEach(() => {
    service.limpiar();
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

  it('should handle multiple loading states', () => {
    service.iniciar('carga1');
    service.iniciar('carga2');
    expect(service.cargando()).toBeTrue();
    
    service.finalizar('carga1');
    expect(service.cargando()).toBeTrue();
    
    service.finalizar('carga2');
    expect(service.cargando()).toBeFalse();
  });

  it('should track specific loading by id', () => {
    service.iniciar('api-call');
    expect(service.estaCargando('api-call')).toBeTrue();
    expect(service.estaCargando('otro')).toBeFalse();
    
    service.finalizar('api-call');
    expect(service.estaCargando('api-call')).toBeFalse();
  });

  it('should set custom message', () => {
    service.iniciar('test', 'Procesando datos...');
    const estado = service.obtenerEstado('test');
    expect(estado?.mensaje).toBe('Procesando datos...');
  });

  it('should update percentage', () => {
    service.iniciar('upload');
    service.actualizarPorcentaje('upload', 50);
    
    const estado = service.obtenerEstado('upload');
    expect(estado?.porcentaje).toBe(50);
  });

  it('should normalize percentage to valid range', () => {
    service.iniciar('test');
    
    service.actualizarPorcentaje('test', 150);
    expect(service.obtenerEstado('test')?.porcentaje).toBe(100);
    
    service.actualizarPorcentaje('test', -20);
    expect(service.obtenerEstado('test')?.porcentaje).toBe(0);
  });

  it('should update message with percentage', () => {
    service.iniciar('test', 'Inicial');
    service.actualizarPorcentaje('test', 50, 'Actualizado');
    
    expect(service.obtenerEstado('test')?.mensaje).toBe('Actualizado');
  });

  it('should calculate global percentage', () => {
    service.iniciar('a');
    service.iniciar('b');
    service.actualizarPorcentaje('a', 40);
    service.actualizarPorcentaje('b', 60);
    
    expect(service.porcentajeGlobal()).toBe(50);
  });

  it('should return last message as global message', () => {
    service.iniciar('primero', 'Mensaje 1');
    service.iniciar('segundo', 'Mensaje 2');
    
    expect(service.mensajeGlobal()).toBe('Mensaje 2');
  });

  it('should clear all loading states', () => {
    service.iniciar('uno');
    service.iniciar('dos');
    service.iniciar('tres');
    
    service.limpiar();
    expect(service.cargando()).toBeFalse();
  });

  it('should provide selectable signal for specific id', () => {
    const selector = service.seleccionar('dinamico');
    expect(selector()).toBeFalse();
    
    service.iniciar('dinamico');
    expect(selector()).toBeTrue();
    
    service.finalizar('dinamico');
    expect(selector()).toBeFalse();
  });

  it('should provide selectable percentage signal', () => {
    const selectorPorcentaje = service.seleccionarPorcentaje('progreso');
    expect(selectorPorcentaje()).toBe(0);
    
    service.iniciar('progreso');
    service.actualizarPorcentaje('progreso', 75);
    expect(selectorPorcentaje()).toBe(75);
  });

  it('should not update percentage for non-existent id', () => {
    service.actualizarPorcentaje('inexistente', 50);
    expect(service.obtenerEstado('inexistente')).toBeUndefined();
  });
});

// ============================================
// TESTS COMUNICACION SERVICE
// ============================================

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

  it('should emit events with object payload', (done) => {
    const payload = { id: 1, nombre: 'Test' };
    
    service.escuchar<typeof payload>('OBJETO_EVENT').subscribe(data => {
      expect(data.id).toBe(1);
      expect(data.nombre).toBe('Test');
      done();
    });
    
    service.emitir('OBJETO_EVENT', payload);
  });

  it('should filter events by type', (done) => {
    let contadorA = 0;
    let contadorB = 0;
    
    service.escuchar('EVENTO_A').subscribe(() => contadorA++);
    service.escuchar('EVENTO_B').subscribe(() => contadorB++);
    
    service.emitir('EVENTO_A', null);
    service.emitir('EVENTO_A', null);
    service.emitir('EVENTO_B', null);
    
    setTimeout(() => {
      expect(contadorA).toBe(2);
      expect(contadorB).toBe(1);
      done();
    }, 10);
  });
});

// ============================================
// TESTS VALIDADORES
// ============================================

describe('Validadores', () => {
  describe('passwordFuerte', () => {
    const validator = passwordFuerte();

    it('should accept strong password', () => {
      const control = new FormControl('Password1@');
      expect(validator(control)).toBeNull();
    });

    it('should reject password without uppercase', () => {
      const control = new FormControl('password1@');
      expect(validator(control)).toEqual({ passwordFuerte: true });
    });

    it('should reject password without lowercase', () => {
      const control = new FormControl('PASSWORD1@');
      expect(validator(control)).toEqual({ passwordFuerte: true });
    });

    it('should reject password without number', () => {
      const control = new FormControl('Password@');
      expect(validator(control)).toEqual({ passwordFuerte: true });
    });

    it('should reject password without special character', () => {
      const control = new FormControl('Password1');
      expect(validator(control)).toEqual({ passwordFuerte: true });
    });

    it('should reject short password', () => {
      const control = new FormControl('Pa1@');
      expect(validator(control)).toEqual({ passwordFuerte: true });
    });

    it('should reject empty password', () => {
      const control = new FormControl('');
      expect(validator(control)).toEqual({ passwordFuerte: true });
    });
  });

  describe('coincidenCampos', () => {
    it('should pass when fields match', () => {
      const form = new FormGroup({
        password: new FormControl('test123'),
        confirmar: new FormControl('test123')
      });
      
      const validator = coincidenCampos('password', 'confirmar');
      expect(validator(form)).toBeNull();
    });

    it('should fail when fields do not match', () => {
      const form = new FormGroup({
        password: new FormControl('test123'),
        confirmar: new FormControl('diferente')
      });
      
      const validator = coincidenCampos('password', 'confirmar');
      expect(validator(form)).toEqual({ passwordMismatch: true });
    });

    it('should return null if controls do not exist', () => {
      const form = new FormGroup({});
      const validator = coincidenCampos('inexistente1', 'inexistente2');
      expect(validator(form)).toBeNull();
    });
  });

  describe('nifValido', () => {
    const validator = nifValido();

    it('should accept valid NIF', () => {
      const control = new FormControl('12345678Z');
      expect(validator(control)).toBeNull();
    });

    it('should accept valid NIF lowercase', () => {
      const control = new FormControl('12345678z');
      expect(validator(control)).toBeNull();
    });

    it('should reject NIF with wrong letter', () => {
      const control = new FormControl('12345678A');
      expect(validator(control)).toEqual({ nifInvalido: true });
    });

    it('should reject NIF with invalid format', () => {
      const control = new FormControl('1234567ZZ');
      expect(validator(control)).toEqual({ nifInvalido: true });
    });

    it('should accept empty value', () => {
      const control = new FormControl('');
      expect(validator(control)).toBeNull();
    });
  });

  describe('telefonoEspanol', () => {
    const validator = telefonoEspanol();

    it('should accept valid mobile number', () => {
      const control = new FormControl('612345678');
      expect(validator(control)).toBeNull();
    });

    it('should accept number with +34 prefix', () => {
      const control = new FormControl('+34612345678');
      expect(validator(control)).toBeNull();
    });

    it('should accept landline number', () => {
      const control = new FormControl('912345678');
      expect(validator(control)).toBeNull();
    });

    it('should reject invalid number', () => {
      const control = new FormControl('123456');
      expect(validator(control)).toEqual({ telefonoInvalido: true });
    });

    it('should accept empty value', () => {
      const control = new FormControl('');
      expect(validator(control)).toBeNull();
    });
  });

  describe('codigoPostalEspanol', () => {
    const validator = codigoPostalEspanol();

    it('should accept valid postal code', () => {
      const control = new FormControl('28001');
      expect(validator(control)).toBeNull();
    });

    it('should accept border values', () => {
      expect(validator(new FormControl('01001'))).toBeNull();
      expect(validator(new FormControl('52999'))).toBeNull();
    });

    it('should reject invalid postal code', () => {
      const control = new FormControl('00000');
      expect(validator(control)).toEqual({ codigoPostalInvalido: true });
    });

    it('should reject code above range', () => {
      const control = new FormControl('53000');
      expect(validator(control)).toEqual({ codigoPostalInvalido: true });
    });

    it('should accept empty value', () => {
      const control = new FormControl('');
      expect(validator(control)).toBeNull();
    });
  });

  describe('rangoNumerico', () => {
    const validator = rangoNumerico(0, 100);

    it('should accept value in range', () => {
      const control = new FormControl(50);
      expect(validator(control)).toBeNull();
    });

    it('should accept boundary values', () => {
      expect(validator(new FormControl(0))).toBeNull();
      expect(validator(new FormControl(100))).toBeNull();
    });

    it('should reject value below range', () => {
      const control = new FormControl(-5);
      expect(validator(control)).toEqual({ rangoNumerico: { min: 0, max: 100, actual: -5 } });
    });

    it('should reject value above range', () => {
      const control = new FormControl(150);
      expect(validator(control)).toEqual({ rangoNumerico: { min: 0, max: 100, actual: 150 } });
    });

    it('should reject non-numeric value', () => {
      const control = new FormControl('abc');
      expect(validator(control)).toEqual({ rangoNumerico: true });
    });

    it('should accept empty value', () => {
      const control = new FormControl('');
      expect(validator(control)).toBeNull();
    });
  });
});

// ============================================
// TESTS FUERZA PASSWORD
// ============================================

describe('calcularFuerzaPassword', () => {
  it('should return debil for empty password', () => {
    const resultado = calcularFuerzaPassword('');
    expect(resultado.nivel).toBe('debil');
    expect(resultado.porcentaje).toBe(0);
  });

  it('should return debil for very weak password', () => {
    const resultado = calcularFuerzaPassword('abc');
    expect(resultado.nivel).toBe('debil');
  });

  it('should return media for moderate password', () => {
    const resultado = calcularFuerzaPassword('Password');
    expect(resultado.nivel).toBe('media');
  });

  it('should return fuerte for strong password', () => {
    const resultado = calcularFuerzaPassword('Password1@');
    expect(resultado.nivel).toBe('fuerte');
  });

  it('should return muy-fuerte for very strong password', () => {
    const resultado = calcularFuerzaPassword('Password1@Extra');
    expect(resultado.nivel).toBe('muy-fuerte');
  });

  it('should increase points for length', () => {
    const corta = calcularFuerzaPassword('Aa1@');
    const larga = calcularFuerzaPassword('Aa1@xxxxxxxxxxxxxxxx');
    expect(larga.porcentaje).toBeGreaterThan(corta.porcentaje);
  });

  it('should provide appropriate message', () => {
    expect(calcularFuerzaPassword('a').mensaje).toBe('Contraseña débil');
    expect(calcularFuerzaPassword('Password1@').mensaje).toBe('Contraseña fuerte');
  });

  it('should cap percentage at 100', () => {
    const resultado = calcularFuerzaPassword('VeryLongPassword1234567890@');
    expect(resultado.porcentaje).toBeLessThanOrEqual(100);
  });
});

// ============================================
// TESTS MODAL SERVICE
// ============================================

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  afterEach(() => {
    service.cerrar();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should have no active modal initially', () => {
    expect(service.modalActivo()).toBeNull();
  });

  it('should open login modal', () => {
    service.abrirLogin();
    expect(service.modalActivo()).toBe('login');
  });

  it('should open registro modal', () => {
    service.abrirRegistro();
    expect(service.modalActivo()).toBe('registro');
  });

  it('should close modal', () => {
    service.abrirLogin();
    expect(service.modalActivo()).toBe('login');
    
    service.cerrar();
    expect(service.modalActivo()).toBeNull();
  });

  it('should switch between modals', () => {
    service.abrirLogin();
    expect(service.modalActivo()).toBe('login');
    
    service.abrirRegistro();
    expect(service.modalActivo()).toBe('registro');
  });
});

// ============================================
// TESTS ESTADO SERVICE
// ============================================

describe('EstadoService', () => {
  let service: EstadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadoService);
    service.limpiar();
  });

  afterEach(() => {
    service.limpiar();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return undefined for non-existent key', () => {
    expect(service.obtener('inexistente')).toBeUndefined();
  });

  it('should set and get values', () => {
    service.establecer('usuario', { nombre: 'Test' });
    expect(service.obtener('usuario')).toEqual({ nombre: 'Test' });
  });

  it('should update existing values', () => {
    service.establecer('contador', 1);
    expect(service.obtener('contador')).toBe(1);
    
    service.establecer('contador', 5);
    expect(service.obtener('contador')).toBe(5);
  });

  it('should delete values', () => {
    service.establecer('temp', 'valor');
    expect(service.obtener('temp')).toBe('valor');
    
    service.eliminar('temp');
    expect(service.obtener('temp')).toBeUndefined();
  });

  it('should clear all values', () => {
    service.establecer('a', 1);
    service.establecer('b', 2);
    service.establecer('c', 3);
    
    service.limpiar();
    
    expect(service.obtener('a')).toBeUndefined();
    expect(service.obtener('b')).toBeUndefined();
    expect(service.obtener('c')).toBeUndefined();
  });

  it('should provide selectable signal', () => {
    const selector = service.seleccionar<number>('dinamico');
    expect(selector()).toBeUndefined();
    
    service.establecer('dinamico', 42);
    expect(selector()).toBe(42);
    
    service.eliminar('dinamico');
    expect(selector()).toBeUndefined();
  });

  it('should handle different data types', () => {
    service.establecer('string', 'texto');
    service.establecer('number', 123);
    service.establecer('boolean', true);
    service.establecer('array', [1, 2, 3]);
    service.establecer('object', { key: 'value' });
    
    expect(service.obtener('string')).toBe('texto');
    expect(service.obtener('number')).toBe(123);
    expect(service.obtener('boolean')).toBe(true);
    expect(service.obtener('array')).toEqual([1, 2, 3]);
    expect(service.obtener('object')).toEqual({ key: 'value' });
  });
});

// ============================================
// TESTS AUTH SERVICE
// ============================================

import { HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should not be authenticated initially', () => {
    expect(service.estaAutenticado()).toBeFalse();
    expect(service.usuario()).toBeNull();
  });

  it('should have null token initially', () => {
    expect(service.obtenerToken()).toBeNull();
  });

  it('should login successfully', fakeAsync(() => {
    let resultado = false;
    
    service.login('test@example.com', 'password123').subscribe(r => resultado = r);
    
    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    
    req.flush({
      id: 1,
      nombreUsuario: 'testuser',
      email: 'test@example.com',
      rol: 'ALUMNO',
      token: 'fake-jwt-token'
    });
    
    tick();
    
    expect(resultado).toBeTrue();
    expect(service.estaAutenticado()).toBeTrue();
    expect(service.usuario()?.email).toBe('test@example.com');
  }));

  it('should handle login error', fakeAsync(() => {
    let resultado = true;
    
    service.login('wrong@example.com', 'wrongpass').subscribe(r => resultado = r);
    
    const req = httpMock.expectOne('/api/auth/login');
    req.flush({ mensaje: 'Credenciales incorrectas' }, { status: 401, statusText: 'Unauthorized' });
    
    tick();
    
    expect(resultado).toBeFalse();
    expect(service.estaAutenticado()).toBeFalse();
  }));

  it('should logout user', fakeAsync(() => {
    service.login('test@example.com', 'password123').subscribe();
    
    const req = httpMock.expectOne('/api/auth/login');
    req.flush({
      id: 1,
      nombreUsuario: 'testuser',
      email: 'test@example.com',
      rol: 'ALUMNO',
      token: 'fake-jwt-token'
    });
    
    tick();
    expect(service.estaAutenticado()).toBeTrue();
    
    service.cerrarSesion();
    
    expect(service.estaAutenticado()).toBeFalse();
    expect(service.usuario()).toBeNull();
    expect(service.obtenerToken()).toBeNull();
  }));

  it('should save credentials when recordar is enabled', () => {
    service.guardarCredenciales('test@example.com', 'password123');
    
    expect(service.tieneCredencialesGuardadas()).toBeTrue();
    
    const credenciales = service.obtenerCredencialesGuardadas();
    expect(credenciales?.identifier).toBe('test@example.com');
    expect(credenciales?.password).toBe('password123');
  });

  it('should delete saved credentials', () => {
    service.guardarCredenciales('test@example.com', 'password123');
    expect(service.tieneCredencialesGuardadas()).toBeTrue();
    
    service.eliminarCredencialesGuardadas();
    
    expect(service.tieneCredencialesGuardadas()).toBeFalse();
    expect(service.obtenerCredencialesGuardadas()).toBeNull();
  });

  it('should register user successfully', fakeAsync(() => {
    let resultado = false;
    
    service.registrar({
      nombreUsuario: 'newuser',
      email: 'new@example.com',
      contrasenia: 'password123',
      ciudad: 'Barcelona'
    }).subscribe(r => resultado = r);
    
    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    
    req.flush({
      id: 2,
      nombreUsuario: 'newuser',
      email: 'new@example.com',
      rol: 'ALUMNO',
      ciudad: 'Barcelona',
      token: 'new-jwt-token'
    });
    
    tick();
    
    expect(resultado).toBeTrue();
    expect(service.estaAutenticado()).toBeTrue();
    expect(service.usuario()?.email).toBe('new@example.com');
  }));
});

// ============================================
// TESTS ADICIONALES VALIDADORES
// ============================================

describe('Validadores adicionales', () => {
  describe('nifValido edge cases', () => {
    const validator = nifValido();

    it('should validate multiple valid NIFs', () => {
      expect(validator(new FormControl('00000000T'))).toBeNull();
      expect(validator(new FormControl('99999999R'))).toBeNull();
    });

    it('should handle NIF with spaces', () => {
      const control = new FormControl(' 12345678Z ');
      expect(validator(control)).toBeNull();
    });
  });

  describe('telefonoEspanol edge cases', () => {
    const validator = telefonoEspanol();

    it('should accept different prefixes', () => {
      expect(validator(new FormControl('0034612345678'))).toBeNull();
      expect(validator(new FormControl('34612345678'))).toBeNull();
    });

    it('should accept numbers starting with 7, 8, 9', () => {
      expect(validator(new FormControl('712345678'))).toBeNull();
      expect(validator(new FormControl('812345678'))).toBeNull();
      expect(validator(new FormControl('912345678'))).toBeNull();
    });
  });

  describe('rangoNumerico edge cases', () => {
    it('should work with negative ranges', () => {
      const validator = rangoNumerico(-100, -10);
      expect(validator(new FormControl(-50))).toBeNull();
      expect(validator(new FormControl(-5))).toBeTruthy();
    });

    it('should work with decimal numbers', () => {
      const validator = rangoNumerico(0, 1);
      expect(validator(new FormControl(0.5))).toBeNull();
    });
  });

  describe('passwordFuerte edge cases', () => {
    const validator = passwordFuerte();

    it('should accept different special characters', () => {
      expect(validator(new FormControl('Password1!'))).toBeNull();
      expect(validator(new FormControl('Password1%'))).toBeNull();
      expect(validator(new FormControl('Password1*'))).toBeNull();
      expect(validator(new FormControl('Password1?'))).toBeNull();
      expect(validator(new FormControl('Password1&'))).toBeNull();
      expect(validator(new FormControl('Password1.'))).toBeNull();
    });

    it('should accept exactly 8 characters', () => {
      expect(validator(new FormControl('Pass1@ab'))).toBeNull();
    });
  });
});

// ============================================
// TESTS ADICIONALES FUERZA PASSWORD
// ============================================

describe('calcularFuerzaPassword edge cases', () => {
  it('should handle null-like values', () => {
    const resultado = calcularFuerzaPassword('');
    expect(resultado.nivel).toBe('debil');
    expect(resultado.mensaje).toBe('');
  });

  it('should calculate points for each character type', () => {
    const soloMinusculas = calcularFuerzaPassword('abcdefgh');
    const conMayusculas = calcularFuerzaPassword('abcdeFGH');
    const conNumeros = calcularFuerzaPassword('abcdeFG1');
    const conEspeciales = calcularFuerzaPassword('abcdeFG1@');
    
    expect(soloMinusculas.porcentaje).toBeLessThan(conMayusculas.porcentaje);
    expect(conMayusculas.porcentaje).toBeLessThan(conNumeros.porcentaje);
    expect(conNumeros.porcentaje).toBeLessThan(conEspeciales.porcentaje);
  });

  it('should give bonus for long passwords', () => {
    const longitud8 = calcularFuerzaPassword('Aa1@xxxx');
    const longitud12 = calcularFuerzaPassword('Aa1@xxxxxxxx');
    const longitud16 = calcularFuerzaPassword('Aa1@xxxxxxxxxxxx');
    const longitud20 = calcularFuerzaPassword('Aa1@xxxxxxxxxxxxxxxx');
    
    expect(longitud8.porcentaje).toBeLessThan(longitud12.porcentaje);
    expect(longitud12.porcentaje).toBeLessThan(longitud16.porcentaje);
    expect(longitud16.porcentaje).toBeLessThan(longitud20.porcentaje);
  });
});

// ============================================
// TESTS COMPONENTES
// ============================================

describe('Boton Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Boton]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Boton);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have default values', () => {
    const fixture = TestBed.createComponent(Boton);
    const component = fixture.componentInstance;
    
    expect(component.tipo()).toBe('button');
    expect(component.variante()).toBe('primary');
    expect(component.tamano()).toBe('md');
    expect(component.disabled()).toBeFalse();
    expect(component.cargando()).toBeFalse();
  });

  it('should compute classes correctly', () => {
    const fixture = TestBed.createComponent(Boton);
    const component = fixture.componentInstance;
    
    expect(component.clases()).toContain('boton--primary');
    expect(component.clases()).toContain('boton--md');
  });
});

describe('Spinner Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spinner]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Spinner);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have default tamano', () => {
    const fixture = TestBed.createComponent(Spinner);
    const component = fixture.componentInstance;
    expect(component.tamano()).toBe('md');
  });

  it('should compute icon size correctly', () => {
    const fixture = TestBed.createComponent(Spinner);
    const component = fixture.componentInstance;
    expect(component.iconoTamano()).toBe(40);
  });

  it('should not show percentage by default', () => {
    const fixture = TestBed.createComponent(Spinner);
    const component = fixture.componentInstance;
    expect(component.mostrarPorcentaje()).toBeFalse();
  });
});

describe('Alerta Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alerta]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Alerta);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have default type info', () => {
    const fixture = TestBed.createComponent(Alerta);
    const component = fixture.componentInstance;
    expect(component.tipo()).toBe('info');
  });

  it('should be cerrable by default', () => {
    const fixture = TestBed.createComponent(Alerta);
    const component = fixture.componentInstance;
    expect(component.cerrable()).toBeTrue();
  });

  it('should emit cerrar output', () => {
    const fixture = TestBed.createComponent(Alerta);
    const component = fixture.componentInstance;
    
    let closed = false;
    component.cerrar.subscribe(() => closed = true);
    
    component.cerrar.emit();
    expect(closed).toBeTrue();
  });
});
