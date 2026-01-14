import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { httpErrorInterceptor } from './http-error.interceptor';
import { Router } from '@angular/router';

describe('httpErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    localStorage.clear();
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('deberia pasar peticiones exitosas', () => {
    let resultado: any;
    httpClient.get('/api/test').subscribe(data => resultado = data);

    const req = httpMock.expectOne('/api/test');
    req.flush({ success: true });

    expect(resultado).toEqual({ success: true });
  });

  describe('errores que no reintentan', () => {
    it('no deberia reintentar en error 400', fakeAsync(() => {
      let errorCapturado: any;
      httpClient.get('/api/test').subscribe({
        error: err => errorCapturado = err
      });

      const req = httpMock.expectOne('/api/test');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
      
      tick();
      expect(errorCapturado.status).toBe(400);
    }));

    it('no deberia reintentar en error 401', fakeAsync(() => {
      let errorCapturado: any;
      httpClient.get('/api/test').subscribe({
        error: err => errorCapturado = err
      });

      const req = httpMock.expectOne('/api/test');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      
      tick();
      expect(errorCapturado.status).toBe(401);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    }));

    it('no deberia reintentar en error 403', fakeAsync(() => {
      let errorCapturado: any;
      httpClient.get('/api/test').subscribe({
        error: err => errorCapturado = err
      });

      const req = httpMock.expectOne('/api/test');
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
      
      tick();
      expect(errorCapturado.status).toBe(403);
    }));

    it('no deberia reintentar en error 404', fakeAsync(() => {
      let errorCapturado: any;
      httpClient.get('/api/test').subscribe({
        error: err => errorCapturado = err
      });

      const req = httpMock.expectOne('/api/test');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
      
      tick();
      expect(errorCapturado.status).toBe(404);
    }));

    it('no deberia reintentar en error 422', fakeAsync(() => {
      let errorCapturado: any;
      httpClient.get('/api/test').subscribe({
        error: err => errorCapturado = err
      });

      const req = httpMock.expectOne('/api/test');
      req.flush('Unprocessable Entity', { status: 422, statusText: 'Unprocessable Entity' });
      
      tick();
      expect(errorCapturado.status).toBe(422);
    }));
  });

  describe('manejo de error 401', () => {
    it('deberia limpiar sesion en error 401', fakeAsync(() => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('usuario', 'test-user');

      httpClient.get('/api/test').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/test');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      
      tick();
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('usuario')).toBeNull();
    }));

    it('deberia navegar a inicio en error 401', fakeAsync(() => {
      httpClient.get('/api/test').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/test');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      
      tick();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    }));
  });
});
