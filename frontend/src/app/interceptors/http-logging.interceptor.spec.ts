import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { httpLoggingInterceptor } from './http-logging.interceptor';

describe('httpLoggingInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let consoleSpy: jasmine.Spy;

  beforeEach(() => {
    consoleSpy = spyOn(console, 'log');

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpLoggingInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deberia pasar la peticion al siguiente handler', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.method).toBe('GET');
    req.flush({ data: 'test' });
  });

  it('deberia manejar respuestas exitosas', () => {
    let resultado: any;
    httpClient.get('/api/test').subscribe(data => resultado = data);

    const req = httpMock.expectOne('/api/test');
    req.flush({ success: true });

    expect(resultado).toEqual({ success: true });
  });

  it('deberia manejar peticiones POST', () => {
    httpClient.post('/api/test', { nombre: 'test' }).subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ nombre: 'test' });
    req.flush({ id: 1 });
  });

  it('deberia manejar errores HTTP', () => {
    let errorCapturado: any;
    httpClient.get('/api/test').subscribe({
      error: err => errorCapturado = err
    });

    const req = httpMock.expectOne('/api/test');
    req.flush('Error', { status: 404, statusText: 'Not Found' });

    expect(errorCapturado.status).toBe(404);
  });
});
