import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth';

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

  it('deberia crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('no deberia estar autenticado inicialmente', () => {
    expect(service.estaAutenticado()).toBeFalse();
    expect(service.usuario()).toBeNull();
  });

  it('deberia tener token null inicialmente', () => {
    expect(service.obtenerToken()).toBeNull();
  });

  it('deberia hacer login exitosamente', fakeAsync(() => {
    let resultado = false;
    
    service.login('test@example.com', 'password123').subscribe(r => resultado = r);
    
    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'test@example.com',
      contrasenia: 'password123'
    });
    
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
    expect(service.usuario()?.nombreUsuario).toBe('testuser');
  }));

  it('deberia manejar error de login', fakeAsync(() => {
    let resultado = true;
    
    service.login('wrong@example.com', 'wrongpass').subscribe(r => resultado = r);
    
    const req = httpMock.expectOne('/api/auth/login');
    req.flush({ mensaje: 'Credenciales incorrectas' }, { status: 401, statusText: 'Unauthorized' });
    
    tick();
    
    expect(resultado).toBeFalse();
    expect(service.estaAutenticado()).toBeFalse();
  }));

  it('deberia cerrar sesion de usuario', fakeAsync(() => {
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

  it('deberia guardar credenciales cuando recordar esta habilitado', () => {
    service.guardarCredenciales('test@example.com', 'password123');
    
    expect(service.tieneCredencialesGuardadas()).toBeTrue();
    
    const credenciales = service.obtenerCredencialesGuardadas();
    expect(credenciales?.identifier).toBe('test@example.com');
    expect(credenciales?.password).toBe('password123');
  });

  it('deberia eliminar credenciales guardadas', () => {
    service.guardarCredenciales('test@example.com', 'password123');
    expect(service.tieneCredencialesGuardadas()).toBeTrue();
    
    service.eliminarCredencialesGuardadas();
    
    expect(service.tieneCredencialesGuardadas()).toBeFalse();
    expect(service.obtenerCredencialesGuardadas()).toBeNull();
  });

  it('deberia registrar usuario exitosamente', fakeAsync(() => {
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

  it('deberia manejar error de registro', fakeAsync(() => {
    let resultado = true;
    
    service.registrar({
      nombreUsuario: 'existing',
      email: 'existing@example.com',
      contrasenia: 'password123',
      ciudad: 'Madrid'
    }).subscribe(r => resultado = r);
    
    const req = httpMock.expectOne('/api/auth/register');
    req.flush({ mensaje: 'Email ya registrado' }, { status: 409, statusText: 'Conflict' });
    
    tick();
    
    expect(resultado).toBeFalse();
    expect(service.estaAutenticado()).toBeFalse();
  }));

  it('deberia verificar rol de usuario', fakeAsync(() => {
    service.login('admin@example.com', 'password123').subscribe();
    
    const req = httpMock.expectOne('/api/auth/login');
    req.flush({
      id: 1,
      nombreUsuario: 'admin',
      email: 'admin@example.com',
      rol: 'ADMIN',
      token: 'admin-token'
    });
    
    tick();
    
    expect(service.usuario()?.rol).toBe('ADMIN');
  }));

  it('deberia verificar rol de alumno', fakeAsync(() => {
    service.login('user@example.com', 'password123').subscribe();
    
    const req = httpMock.expectOne('/api/auth/login');
    req.flush({
      id: 1,
      nombreUsuario: 'user',
      email: 'user@example.com',
      rol: 'ALUMNO',
      token: 'user-token'
    });
    
    tick();
    
    expect(service.usuario()?.rol).toBe('ALUMNO');
  }));

  describe('manejo de errores especificos', () => {
    it('deberia manejar error 404 usuario no existe', fakeAsync(() => {
      service.login('noexiste@example.com', 'password').subscribe();
      
      const req = httpMock.expectOne('/api/auth/login');
      req.flush({}, { status: 404, statusText: 'Not Found' });
      
      tick();
      expect(service.error()).toContain('no existe');
    }));

    it('deberia manejar error 500', fakeAsync(() => {
      service.login('test@example.com', 'password').subscribe();
      
      const req = httpMock.expectOne('/api/auth/login');
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });
      
      tick();
      expect(service.error()).toBeTruthy();
    }));
  });

  describe('estado de carga', () => {
    it('deberia activar cargando durante login', fakeAsync(() => {
      service.login('test@example.com', 'password').subscribe();
      
      expect(service.cargando()).toBeTrue();
      
      const req = httpMock.expectOne('/api/auth/login');
      req.flush({ id: 1, email: 'test@example.com', token: 'token', nombreUsuario: 'test', rol: 'ALUMNO' });
      
      tick();
      expect(service.cargando()).toBeFalse();
    }));

    it('deberia activar cargando durante registro', fakeAsync(() => {
      service.registrar({ nombreUsuario: 'test', email: 'test@example.com', contrasenia: 'pass', ciudad: 'Madrid' }).subscribe();
      
      expect(service.cargando()).toBeTrue();
      
      const req = httpMock.expectOne('/api/auth/register');
      req.flush({ id: 1, email: 'test@example.com', token: 'token', nombreUsuario: 'test', rol: 'ALUMNO' });
      
      tick();
      expect(service.cargando()).toBeFalse();
    }));
  });

  describe('cambiarContrasenia', () => {
    it('deberia cambiar contrasenia exitosamente', fakeAsync(() => {
      // Primero hacer login
      service.login('test@example.com', 'password').subscribe();
      const loginReq = httpMock.expectOne('/api/auth/login');
      loginReq.flush({ id: 1, email: 'test@example.com', token: 'token', nombreUsuario: 'test', rol: 'ALUMNO' });
      tick();

      let resultado = false;
      service.cambiarContrasenia('oldpass', 'newpass').subscribe(r => resultado = r);

      const req = httpMock.expectOne('/api/usuarios/1/password');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({
        contraseniaActual: 'oldpass',
        contraseniaNueva: 'newpass'
      });
      req.flush({});

      tick();
      expect(resultado).toBeTrue();
    }));

    it('deberia manejar error al cambiar contrasenia', fakeAsync(() => {
      // Primero hacer login
      service.login('test@example.com', 'password').subscribe();
      const loginReq = httpMock.expectOne('/api/auth/login');
      loginReq.flush({ id: 1, email: 'test@example.com', token: 'token', nombreUsuario: 'test', rol: 'ALUMNO' });
      tick();

      let resultado = true;
      service.cambiarContrasenia('wrongpass', 'newpass').subscribe(r => resultado = r);

      const req = httpMock.expectOne('/api/usuarios/1/password');
      req.flush({ mensaje: 'Contraseña incorrecta' }, { status: 401, statusText: 'Unauthorized' });

      tick();
      expect(resultado).toBeFalse();
      expect(service.error()).toBeTruthy();
    }));

    it('deberia retornar false si no hay usuario logueado', fakeAsync(() => {
      let resultado = true;
      service.cambiarContrasenia('old', 'new').subscribe(r => resultado = r);
      tick();
      expect(resultado).toBeFalse();
    }));
  });
});

