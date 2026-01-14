import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpBase } from './http-base';

describe('HttpBase', () => {
  let service: HttpBase;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HttpBase
      ]
    });

    service = TestBed.inject(HttpBase);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('get', () => {
    it('deberia hacer peticion GET', fakeAsync(() => {
      let resultado: any = null;
      service.get<{ data: string }>('/api/test').subscribe(data => resultado = data);

      const req = httpMock.expectOne('/api/test');
      expect(req.request.method).toBe('GET');
      req.flush({ data: 'test' });

      tick();
      expect(resultado).toEqual({ data: 'test' });
    }));

    it('deberia enviar parametros en GET', fakeAsync(() => {
      service.get('/api/test', { params: { id: '1' } }).subscribe();

      const req = httpMock.expectOne('/api/test?id=1');
      expect(req.request.method).toBe('GET');
      req.flush({});
    }));
  });

  describe('post', () => {
    it('deberia hacer peticion POST con datos', fakeAsync(() => {
      let resultado: any = null;
      const datos = { nombre: 'Test' };
      
      service.post<{ id: number }, typeof datos>('/api/test', datos).subscribe(data => resultado = data);

      const req = httpMock.expectOne('/api/test');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(datos);
      req.flush({ id: 1 });

      tick();
      expect(resultado).toEqual({ id: 1 });
    }));
  });

  describe('put', () => {
    it('deberia hacer peticion PUT con datos', fakeAsync(() => {
      let resultado: any = null;
      const datos = { nombre: 'Actualizado' };
      
      service.put<{ success: boolean }, typeof datos>('/api/test/1', datos).subscribe(data => resultado = data);

      const req = httpMock.expectOne('/api/test/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(datos);
      req.flush({ success: true });

      tick();
      expect(resultado).toEqual({ success: true });
    }));
  });

  describe('patch', () => {
    it('deberia hacer peticion PATCH con datos parciales', fakeAsync(() => {
      let resultado: any = null;
      const datos = { nombre: 'Parcial' };
      
      service.patch<{ success: boolean }, typeof datos>('/api/test/1', datos).subscribe(data => resultado = data);

      const req = httpMock.expectOne('/api/test/1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(datos);
      req.flush({ success: true });

      tick();
      expect(resultado).toEqual({ success: true });
    }));
  });

  describe('delete', () => {
    it('deberia hacer peticion DELETE', fakeAsync(() => {
      let resultado: any = null;
      
      service.delete<{ deleted: boolean }>('/api/test/1').subscribe(data => resultado = data);

      const req = httpMock.expectOne('/api/test/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({ deleted: true });

      tick();
      expect(resultado).toEqual({ deleted: true });
    }));
  });

  describe('manejo de errores', () => {
    it('deberia transformar error HTTP en ErrorApi', fakeAsync(() => {
      let errorCapturado: any = null;
      
      service.get('/api/test').subscribe({
        error: err => errorCapturado = err
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({ mensaje: 'No encontrado' }, { status: 404, statusText: 'Not Found' });

      tick();
      expect(errorCapturado).toBeTruthy();
      expect(errorCapturado.codigo).toBe(404);
    }));

    it('deberia incluir mensaje en error', fakeAsync(() => {
      let errorCapturado: any = null;
      
      service.get('/api/test').subscribe({
        error: err => errorCapturado = err
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({ mensaje: 'Error personalizado' }, { status: 400, statusText: 'Bad Request' });

      tick();
      expect(errorCapturado.mensaje).toBe('Error personalizado');
    }));
  });

  describe('getPaginado', () => {
    it('deberia agregar parametros de paginacion', fakeAsync(() => {
      service.getPaginado('/api/items', {}, { pagina: 2, limite: 20 }).subscribe();

      const req = httpMock.expectOne(r => r.url === '/api/items');
      expect(req.request.params.get('pagina')).toBe('2');
      expect(req.request.params.get('limite')).toBe('20');
      req.flush([]);
    }));

    it('deberia agregar filtros a la peticion', fakeAsync(() => {
      service.getPaginado('/api/items', { categoria: 'yoga' }, { pagina: 0, limite: 10 }).subscribe();

      const req = httpMock.expectOne(r => r.url === '/api/items');
      expect(req.request.params.get('categoria')).toBe('yoga');
      req.flush([]);
    }));

    it('deberia manejar ordenamiento', fakeAsync(() => {
      service.getPaginado('/api/items', {}, { ordenarPor: 'nombre', orden: 'asc' }).subscribe();

      const req = httpMock.expectOne(r => r.url === '/api/items');
      expect(req.request.params.get('ordenarPor')).toBe('nombre');
      expect(req.request.params.get('orden')).toBe('asc');
      req.flush([]);
    }));

    it('deberia manejar filtros con arrays', fakeAsync(() => {
      service.getPaginado('/api/items', { categorias: ['yoga', 'pilates'] }).subscribe();

      const req = httpMock.expectOne(r => r.url === '/api/items');
      expect(req.request.params.getAll('categorias')).toEqual(['yoga', 'pilates']);
      req.flush([]);
    }));

    it('deberia ignorar filtros null o undefined', fakeAsync(() => {
      service.getPaginado('/api/items', { categoria: null, otra: undefined, activo: true }).subscribe();

      const req = httpMock.expectOne(r => r.url === '/api/items');
      expect(req.request.params.has('categoria')).toBe(false);
      expect(req.request.params.has('otra')).toBe(false);
      expect(req.request.params.get('activo')).toBe('true');
      req.flush([]);
    }));

    it('deberia funcionar sin paginacion ni filtros', fakeAsync(() => {
      service.getPaginado('/api/items').subscribe();

      const req = httpMock.expectOne('/api/items');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    }));
  });

  describe('upload', () => {
    it('deberia hacer peticion POST con FormData', fakeAsync(() => {
      let resultado: any = null;
      const formData = new FormData();
      formData.append('file', new Blob(['test']), 'test.txt');
      
      service.upload<{ url: string }>('/api/upload', formData).subscribe(data => resultado = data);

      const req = httpMock.expectOne('/api/upload');
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBe(true);
      req.flush({ url: 'http://example.com/file.txt' });

      tick();
      expect(resultado).toEqual({ url: 'http://example.com/file.txt' });
    }));

    it('deberia configurar reportProgress en upload', fakeAsync(() => {
      const formData = new FormData();
      
      service.upload('/api/upload', formData).subscribe();

      const req = httpMock.expectOne('/api/upload');
      expect(req.request.reportProgress).toBe(true);
      req.flush({});
    }));
  });

  describe('opciones HTTP', () => {
    it('deberia enviar headers personalizados', fakeAsync(() => {
      service.get('/api/test', { 
        headers: { 'X-Custom': 'valor' } 
      }).subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.get('X-Custom')).toBe('valor');
      req.flush({});
    }));

    it('deberia soportar withCredentials', fakeAsync(() => {
      service.get('/api/test', { withCredentials: true }).subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.withCredentials).toBe(true);
      req.flush({});
    }));
  });

  describe('manejo de errores avanzado', () => {
    it('deberia manejar error sin mensaje', fakeAsync(() => {
      let errorCapturado: any = null;
      
      service.get('/api/test').subscribe({
        error: err => errorCapturado = err
      });

      const req = httpMock.expectOne('/api/test');
      req.flush(null, { status: 403, statusText: 'Forbidden' });

      tick();
      expect(errorCapturado).toBeTruthy();
      expect(errorCapturado.codigo).toBe(403);
    }));
  });
});
