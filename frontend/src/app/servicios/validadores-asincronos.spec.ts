import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { ValidadoresAsincronos } from './validadores-asincronos';
import { Observable } from 'rxjs';

describe('ValidadoresAsincronos', () => {
  let service: ValidadoresAsincronos;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ValidadoresAsincronos
      ]
    });

    service = TestBed.inject(ValidadoresAsincronos);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('emailUnico', () => {
    it('deberia retornar null para valor vacio', fakeAsync(() => {
      const validator = service.emailUnico();
      const control = new FormControl('');
      
      let resultado: any = undefined;
      (validator(control) as Observable<any>).subscribe((r: any) => resultado = r);
      
      tick(600);
      expect(resultado).toBeNull();
    }));

    it('deberia retornar error si email existe', fakeAsync(() => {
      const validator = service.emailUnico();
      const control = new FormControl('test@email.com');
      
      let resultado: any = undefined;
      (validator(control) as Observable<any>).subscribe((r: any) => resultado = r);
      
      tick(600);
      const req = httpMock.expectOne(r => r.url.includes('/api/usuarios/verificar/email/'));
      req.flush(true);
      
      tick();
      expect(resultado).toEqual({ emailNoDisponible: true });
    }));

    it('deberia retornar null si email no existe', fakeAsync(() => {
      const validator = service.emailUnico();
      const control = new FormControl('nuevo@email.com');
      
      let resultado: any = undefined;
      (validator(control) as Observable<any>).subscribe((r: any) => resultado = r);
      
      tick(600);
      const req = httpMock.expectOne(r => r.url.includes('/api/usuarios/verificar/email/'));
      req.flush(false);
      
      tick();
      expect(resultado).toBeNull();
    }));
  });

  describe('usernameUnico', () => {
    it('deberia retornar null para valor vacio', fakeAsync(() => {
      const validator = service.usernameUnico();
      const control = new FormControl('');
      
      let resultado: any = undefined;
      (validator(control) as Observable<any>).subscribe((r: any) => resultado = r);
      
      tick(600);
      expect(resultado).toBeNull();
    }));

    it('deberia retornar error si username existe', fakeAsync(() => {
      const validator = service.usernameUnico();
      const control = new FormControl('usuario123');
      
      let resultado: any = undefined;
      (validator(control) as Observable<any>).subscribe((r: any) => resultado = r);
      
      tick(600);
      const req = httpMock.expectOne(r => r.url.includes('/api/usuarios/verificar/username/'));
      req.flush(true);
      
      tick();
      expect(resultado).toEqual({ usernameNoDisponible: true });
    }));

    it('deberia retornar null si username no existe', fakeAsync(() => {
      const validator = service.usernameUnico();
      const control = new FormControl('nuevousuario');
      
      let resultado: any = undefined;
      (validator(control) as Observable<any>).subscribe((r: any) => resultado = r);
      
      tick(600);
      const req = httpMock.expectOne(r => r.url.includes('/api/usuarios/verificar/username/'));
      req.flush(false);
      
      tick();
      expect(resultado).toBeNull();
    }));

    it('deberia ignorar validacion si username es igual al valor actual', fakeAsync(() => {
      const validator = service.usernameUnico('miusuario');
      const control = new FormControl('miusuario');
      
      let resultado: any = undefined;
      (validator(control) as Observable<any>).subscribe((r: any) => resultado = r);
      
      tick(600);
      expect(resultado).toBeNull();
    }));

    it('deberia ignorar validacion si username es igual al valor actual (case insensitive)', fakeAsync(() => {
      const validator = service.usernameUnico('MiUsuario');
      const control = new FormControl('miusuario');
      
      let resultado: any = undefined;
      (validator(control) as Observable<any>).subscribe((r: any) => resultado = r);
      
      tick(600);
      expect(resultado).toBeNull();
    }));
  });

  describe('emailUnico con valorActual', () => {
    it('deberia ignorar validacion si email es igual al valor actual', fakeAsync(() => {
      const validator = service.emailUnico('test@email.com');
      const control = new FormControl('test@email.com');
      
      let resultado: any = undefined;
      (validator(control) as Observable<any>).subscribe((r: any) => resultado = r);
      
      tick(600);
      expect(resultado).toBeNull();
    }));

    it('deberia ignorar validacion si email es igual al valor actual (case insensitive)', fakeAsync(() => {
      const validator = service.emailUnico('TEST@EMAIL.COM');
      const control = new FormControl('test@email.com');
      
      let resultado: any = undefined;
      (validator(control) as Observable<any>).subscribe((r: any) => resultado = r);
      
      tick(600);
      expect(resultado).toBeNull();
    }));
  });

  describe('ciudadExiste', () => {
    it('deberia retornar null para valor vacio', fakeAsync(() => {
      const validator = service.ciudadExiste();
      const control = new FormControl('');
      
      let resultado: any = undefined;
      (validator(control) as Observable<any>).subscribe((r: any) => resultado = r);
      
      tick(600);
      expect(resultado).toBeNull();
    }));

    it('deberia retornar null para valor muy corto', fakeAsync(() => {
      const validator = service.ciudadExiste();
      const control = new FormControl('a');
      
      let resultado: any = undefined;
      (validator(control) as Observable<any>).subscribe((r: any) => resultado = r);
      
      tick(600);
      expect(resultado).toBeNull();
    }));

    it('deberia retornar null si ciudad existe', fakeAsync(() => {
      const validator = service.ciudadExiste();
      const control = new FormControl('Madrid');
      
      let resultado: any = undefined;
      (validator(control) as Observable<any>).subscribe((r: any) => resultado = r);
      
      tick(600);
      const req = httpMock.expectOne(r => r.url.includes('/api/usuarios/verificar/ciudad/'));
      req.flush({ existe: true, nombre: 'Madrid' });
      
      tick();
      expect(resultado).toBeNull();
    }));

    it('deberia retornar error si ciudad no existe', fakeAsync(() => {
      const validator = service.ciudadExiste();
      const control = new FormControl('CiudadFalsa');
      
      let resultado: any = undefined;
      (validator(control) as Observable<any>).subscribe((r: any) => resultado = r);
      
      tick(600);
      const req = httpMock.expectOne(r => r.url.includes('/api/usuarios/verificar/ciudad/'));
      req.flush({ existe: false, nombre: '' });
      
      tick();
      expect(resultado).toEqual({ ciudadNoExiste: true });
    }));
  });
});
