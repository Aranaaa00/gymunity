import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { httpHeadersInterceptor } from './http-headers.interceptor';

describe('httpHeadersInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpHeadersInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('deberia agregar Content-Type json por defecto', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush({});
  });

  it('deberia agregar Accept json por defecto', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Accept')).toBe('application/json');
    req.flush({});
  });

  it('deberia agregar Authorization si hay token en localStorage', () => {
    localStorage.setItem('gymunity_token', 'mi-token-test');

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mi-token-test');
    req.flush({});
  });

  it('no deberia agregar Authorization si no hay token', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('no deberia sobreescribir Content-Type si ya existe', () => {
    httpClient.get('/api/test', { 
      headers: { 'Content-Type': 'text/plain' } 
    }).subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Content-Type')).toBe('text/plain');
    req.flush({});
  });
});
