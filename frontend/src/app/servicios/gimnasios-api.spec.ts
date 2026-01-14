import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { GimnasiosApiService } from './gimnasios-api';

describe('GimnasiosApiService', () => {
  let service: GimnasiosApiService;
  let httpMock: HttpTestingController;

  const mockGimnasios = [
    { id: 1, nombre: 'Gym A', ciudad: 'Madrid', foto: 'a.jpg', disciplinas: 'Boxeo', valoracionMedia: 4.5, totalResenias: 10 },
    { id: 2, nombre: 'Gym B', ciudad: 'Barcelona', foto: 'b.jpg', disciplinas: 'Judo', valoracionMedia: 4.0, totalResenias: 5 }
  ];

  const mockGimnasioDetalle = {
    id: 1,
    nombre: 'Gym A',
    descripcion: 'Descripcion del gimnasio',
    ciudad: 'Madrid',
    foto: 'a.jpg',
    clases: [],
    resenias: [],
    valoracionMedia: 4.5,
    totalApuntados: 100
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(GimnasiosApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deberia crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('deberia tener estado inicial correcto', () => {
    expect(service.gimnasios()).toEqual([]);
    expect(service.gimnasioActual()).toBeNull();
    expect(service.cargando()).toBeFalse();
    expect(service.error()).toBeNull();
  });

  describe('obtenerTodos', () => {
    it('deberia obtener lista de gimnasios', fakeAsync(() => {
      let resultado: readonly any[] = [];
      
      service.obtenerTodos().subscribe(r => resultado = r);
      
      const req = httpMock.expectOne(req => req.url === '/api/gimnasios');
      expect(req.request.method).toBe('GET');
      req.flush(mockGimnasios);
      
      tick();
      
      expect(resultado.length).toBe(2);
      expect(service.gimnasios().length).toBe(2);
    }));

    it('deberia establecer cargando durante peticion', fakeAsync(() => {
      service.obtenerTodos().subscribe();
      
      expect(service.cargando()).toBeTrue();
      
      const req = httpMock.expectOne(req => req.url === '/api/gimnasios');
      req.flush(mockGimnasios);
      
      tick();
      
      expect(service.cargando()).toBeFalse();
    }));

    it('deberia manejar error en obtenerTodos', fakeAsync(() => {
      let resultado: any = null;
      
      service.obtenerTodos().subscribe(data => resultado = data);
      
      // Usar 404 que no se reintenta
      const req = httpMock.expectOne(req => req.url === '/api/gimnasios');
      req.flush({ mensaje: 'No encontrado' }, { status: 404, statusText: 'Not Found' });
      
      tick();
      
      // El servicio captura el error internamente y devuelve array vacio
      expect(resultado).toEqual([]);
    }));
  });

  describe('obtenerPorId', () => {
    it('deberia obtener detalle de gimnasio', fakeAsync(() => {
      let resultado: any = null;
      
      service.obtenerPorId(1).subscribe(r => resultado = r);
      
      const req = httpMock.expectOne('/api/gimnasios/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockGimnasioDetalle);
      
      tick();
      
      expect(resultado).toBeTruthy();
      expect(resultado.id).toBe(1);
      expect(service.gimnasioActual()?.id).toBe(1);
    }));

    it('deberia manejar error en obtenerPorId', fakeAsync(() => {
      service.obtenerPorId(999).subscribe();
      
      const req = httpMock.expectOne('/api/gimnasios/999');
      req.flush({ mensaje: 'No encontrado' }, { status: 404, statusText: 'Not Found' });
      
      tick();
      
      expect(service.error()).toBeTruthy();
    }));
  });

  describe('crear', () => {
    it('deberia crear nuevo gimnasio', fakeAsync(() => {
      const nuevoGym = { nombre: 'Gym Nuevo', ciudad: 'Valencia', descripcion: 'Test' };
      const respuesta = { id: 3, ...nuevoGym, foto: '', disciplinas: '', valoracionMedia: null, totalResenias: 0 };
      
      let resultado: any = null;
      service.crear(nuevoGym as any).subscribe(r => resultado = r);
      
      const req = httpMock.expectOne('/api/gimnasios');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(nuevoGym);
      req.flush(respuesta);
      
      tick();
      
      expect(resultado).toBeTruthy();
      expect(resultado.id).toBe(3);
    }));

    it('deberia agregar gimnasio creado a la lista', fakeAsync(() => {
      // Primero cargamos gimnasios existentes
      service.obtenerTodos().subscribe();
      const reqList = httpMock.expectOne(req => req.url === '/api/gimnasios');
      reqList.flush(mockGimnasios);
      tick();
      
      expect(service.gimnasios().length).toBe(2);
      
      // Ahora creamos uno nuevo
      const nuevoGym = { nombre: 'Gym Nuevo', ciudad: 'Valencia', descripcion: 'Test' };
      const respuesta = { id: 3, nombre: 'Gym Nuevo', ciudad: 'Valencia', foto: '', disciplinas: '', valoracionMedia: null, totalResenias: 0 };
      
      service.crear(nuevoGym as any).subscribe();
      
      const reqCreate = httpMock.expectOne('/api/gimnasios');
      reqCreate.flush(respuesta);
      tick();
      
      expect(service.gimnasios().length).toBe(3);
    }));
  });

  describe('actualizar', () => {
    it('deberia actualizar gimnasio existente', fakeAsync(() => {
      const datosActualizados = { nombre: 'Gym Actualizado', ciudad: 'Madrid', descripcion: 'Actualizado' };
      const respuesta = { id: 1, ...datosActualizados, foto: '', disciplinas: '', valoracionMedia: 4.5, totalResenias: 10 };
      
      let resultado: any = null;
      service.actualizar(1, datosActualizados as any).subscribe(r => resultado = r);
      
      const req = httpMock.expectOne('/api/gimnasios/1');
      expect(req.request.method).toBe('PUT');
      req.flush(respuesta);
      
      tick();
      
      expect(resultado).toBeTruthy();
      expect(resultado.nombre).toBe('Gym Actualizado');
    }));
  });

  describe('eliminar', () => {
    it('deberia eliminar gimnasio', fakeAsync(() => {
      // Primero cargamos gimnasios
      service.obtenerTodos().subscribe();
      const reqList = httpMock.expectOne(req => req.url === '/api/gimnasios');
      reqList.flush(mockGimnasios);
      tick();
      
      let resultado = false;
      service.eliminar(1).subscribe(r => resultado = r);
      
      const req = httpMock.expectOne('/api/gimnasios/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
      
      tick();
      
      expect(resultado).toBeTrue();
      expect(service.gimnasios().find(g => g.id === 1)).toBeUndefined();
    }));

    it('deberia manejar error en eliminar', fakeAsync(() => {
      let resultado = true;
      service.eliminar(999).subscribe(r => resultado = r);
      
      const req = httpMock.expectOne('/api/gimnasios/999');
      req.flush({ mensaje: 'No encontrado' }, { status: 404, statusText: 'Not Found' });
      
      tick();
      
      expect(resultado).toBeFalse();
    }));
  });

  describe('buscar', () => {
    it('deberia buscar gimnasios por filtros', fakeAsync(() => {
      const filtros = { nombre: 'Gym', ciudad: 'Madrid' };
      
      service.buscar(filtros).subscribe();
      
      const req = httpMock.expectOne(req => req.url.includes('/api/gimnasios/buscar'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('nombre')).toBe('Gym');
      expect(req.request.params.get('ciudad')).toBe('Madrid');
      req.flush([mockGimnasios[0]]);
      
      tick();
      
      expect(service.gimnasios().length).toBe(1);
    }));
  });

  describe('signals computados', () => {
    it('hayGimnasios deberia ser false inicialmente', () => {
      expect(service.hayGimnasios()).toBeFalse();
    });

    it('hayGimnasios deberia ser true con gimnasios', fakeAsync(() => {
      service.obtenerTodos().subscribe();
      
      const req = httpMock.expectOne(req => req.url === '/api/gimnasios');
      req.flush(mockGimnasios);
      tick();
      
      expect(service.hayGimnasios()).toBeTrue();
    }));

    it('totalGimnasios deberia reflejar cantidad', fakeAsync(() => {
      service.obtenerTodos().subscribe();
      
      const req = httpMock.expectOne(req => req.url === '/api/gimnasios');
      req.flush(mockGimnasios);
      tick();
      
      expect(service.totalGimnasios()).toBe(2);
    }));
  });

  describe('limpiar', () => {
    it('deberia limpiar gimnasio actual', fakeAsync(() => {
      service.obtenerPorId(1).subscribe();
      
      const req = httpMock.expectOne('/api/gimnasios/1');
      req.flush(mockGimnasioDetalle);
      tick();
      
      expect(service.gimnasioActual()).toBeTruthy();
      
      service.limpiarGimnasioActual();
      
      expect(service.gimnasioActual()).toBeNull();
    }));

    it('deberia limpiar filtros', () => {
      service.actualizarFiltros({ ciudad: 'Madrid' });
      expect(service.filtros().ciudad).toBe('Madrid');
      
      service.limpiarFiltros();
      expect(service.filtros()).toEqual({});
    });
  });

  describe('obtenerPopulares', () => {
    it('deberia obtener gimnasios populares', fakeAsync(() => {
      let resultado: readonly any[] = [];
      
      service.obtenerPopulares().subscribe(r => resultado = r);
      
      const req = httpMock.expectOne('/api/gimnasios/populares');
      expect(req.request.method).toBe('GET');
      req.flush(mockGimnasios);
      
      tick();
      
      expect(resultado.length).toBe(2);
    }));
  });

  describe('obtenerRecientes', () => {
    it('deberia obtener gimnasios recientes', fakeAsync(() => {
      let resultado: readonly any[] = [];
      
      service.obtenerRecientes().subscribe(r => resultado = r);
      
      const req = httpMock.expectOne('/api/gimnasios/recientes');
      expect(req.request.method).toBe('GET');
      req.flush(mockGimnasios);
      
      tick();
      
      expect(resultado.length).toBe(2);
    }));
  });

  describe('obtenerPorCiudad', () => {
    it('deberia obtener gimnasios por ciudad', fakeAsync(() => {
      let resultado: readonly any[] = [];
      
      service.obtenerPorCiudad('Madrid').subscribe(r => resultado = r);
      
      const req = httpMock.expectOne(req => req.url.includes('/api/gimnasios/buscar'));
      expect(req.request.params.get('ciudad')).toBe('Madrid');
      req.flush([mockGimnasios[0]]);
      
      tick();
      
      expect(resultado.length).toBe(1);
    }));
  });

  describe('crear', () => {
    it('deberia crear un gimnasio', fakeAsync(() => {
      const nuevoGim = { nombre: 'Nuevo Gym', ciudad: 'Sevilla', direccion: 'Calle 1' };
      let resultado: any = null;
      
      service.crear(nuevoGim as any).subscribe(r => resultado = r);
      
      const req = httpMock.expectOne('/api/gimnasios');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(nuevoGim);
      req.flush({ ...nuevoGim, id: 3 });
      
      tick();
      
      expect(resultado.id).toBe(3);
    }));

    it('deberia manejar error al crear', fakeAsync(() => {
      let resultado: any = 'no-llamado';
      
      service.crear({ nombre: 'Test' } as any).subscribe(r => resultado = r);
      
      const req = httpMock.expectOne('/api/gimnasios');
      req.flush({ mensaje: 'Error' }, { status: 400, statusText: 'Bad Request' });
      
      tick();
      
      expect(resultado).toBeNull();
    }));
  });

  describe('actualizar', () => {
    it('deberia actualizar un gimnasio', fakeAsync(() => {
      const datosActualizados = { nombre: 'Gym Actualizado', ciudad: 'Madrid', direccion: 'Calle 2' };
      let resultado: any = null;
      
      service.actualizar(1, datosActualizados as any).subscribe(r => resultado = r);
      
      const req = httpMock.expectOne('/api/gimnasios/1');
      expect(req.request.method).toBe('PUT');
      req.flush({ ...datosActualizados, id: 1 });
      
      tick();
      
      expect(resultado.nombre).toBe('Gym Actualizado');
    }));
  });

  describe('eliminar', () => {
    it('deberia eliminar un gimnasio', fakeAsync(() => {
      let resultado: boolean = false;
      
      service.eliminar(1).subscribe(r => resultado = r);
      
      const req = httpMock.expectOne('/api/gimnasios/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
      
      tick();
      
      expect(resultado).toBeTrue();
    }));

    it('deberia retornar false en error', fakeAsync(() => {
      let resultado: boolean = true;
      
      service.eliminar(999).subscribe(r => resultado = r);
      
      const req = httpMock.expectOne('/api/gimnasios/999');
      req.flush({ mensaje: 'No encontrado' }, { status: 404, statusText: 'Not Found' });
      
      tick();
      
      expect(resultado).toBeFalse();
    }));
  });

  describe('limpiarGimnasioActual', () => {
    it('deberia limpiar gimnasio actual', () => {
      service.limpiarGimnasioActual();
      expect(service.gimnasioActual()).toBeNull();
    });
  });

  describe('refrescar', () => {
    it('deberia refrescar obteniendo todos', fakeAsync(() => {
      let resultado: readonly any[] = [];
      
      service.refrescar().subscribe(r => resultado = r);
      
      const req = httpMock.expectOne(req => req.url === '/api/gimnasios');
      req.flush(mockGimnasios);
      
      tick();
      
      expect(resultado.length).toBe(2);
    }));
  });
});
