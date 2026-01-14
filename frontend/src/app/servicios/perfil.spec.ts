import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PerfilService, CREDITOS_MENSUALES } from './perfil';
import { AuthService } from './auth';
import { signal } from '@angular/core';

describe('PerfilService', () => {
  let service: PerfilService;
  let httpMock: HttpTestingController;
  let mockAuthService: { usuario: ReturnType<typeof signal> };

  beforeEach(() => {
    mockAuthService = {
      usuario: signal(null)
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PerfilService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PerfilService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('estado inicial', () => {
    it('deberia iniciar con creditos mensuales', () => {
      expect(service.creditos()).toBe(CREDITOS_MENSUALES);
    });

    it('deberia iniciar sin clases', () => {
      expect(service.clases().length).toBe(0);
    });

    it('deberia iniciar sin resenias', () => {
      expect(service.resenias().length).toBe(0);
    });

    it('deberia iniciar sin carga', () => {
      expect(service.cargando()).toBeFalse();
    });

    it('deberia iniciar sin error', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('computed properties', () => {
    it('deberia calcular creditosRestantes correctamente', () => {
      expect(service.creditosRestantes()).toBe(`${CREDITOS_MENSUALES}/${CREDITOS_MENSUALES}`);
    });

    it('deberia indicar que puede reservar mas con creditos disponibles', () => {
      expect(service.puedeReservarMas()).toBeTrue();
    });

    it('deberia calcular totalClases correctamente', () => {
      expect(service.totalClases()).toBe(0);
    });

    it('deberia calcular clasesCompletadas correctamente', () => {
      expect(service.clasesCompletadas()).toBe(0);
    });

    it('deberia calcular totalResenias correctamente', () => {
      expect(service.totalResenias()).toBe(0);
    });
  });

  describe('logrosPorCategoria', () => {
    it('deberia agrupar logros por categoria', () => {
      const mapa = service.logrosPorCategoria();
      expect(mapa.size).toBeGreaterThan(0);
    });

    it('deberia tener categoria Entrenamiento', () => {
      const mapa = service.logrosPorCategoria();
      expect(mapa.has('Entrenamiento')).toBeTrue();
    });

    it('deberia tener categoria Artes marciales', () => {
      const mapa = service.logrosPorCategoria();
      expect(mapa.has('Artes marciales')).toBeTrue();
    });

    it('deberia tener categoria Torneos', () => {
      const mapa = service.logrosPorCategoria();
      expect(mapa.has('Torneos')).toBeTrue();
    });

    it('deberia tener categoria Comunidad', () => {
      const mapa = service.logrosPorCategoria();
      expect(mapa.has('Comunidad')).toBeTrue();
    });
  });

  describe('logros', () => {
    it('deberia tener logros base', () => {
      expect(service.logros().length).toBeGreaterThan(0);
    });

    it('deberia tener logros sin desbloquear por defecto', () => {
      const todosDesbloqueados = service.logros().every(l => !l.desbloqueado);
      expect(todosDesbloqueados).toBeTrue();
    });

    it('deberia tener logros con id unico', () => {
      const ids = service.logros().map(l => l.id);
      const idsUnicos = new Set(ids);
      expect(idsUnicos.size).toBe(ids.length);
    });
  });

  describe('desbloquearLogro', () => {
    it('deberia desbloquear logro especifico', () => {
      const logroId = 'primera-clase';
      service.desbloquearLogro(logroId);
      
      const logro = service.logros().find(l => l.id === logroId);
      expect(logro?.desbloqueado).toBeTrue();
    });

    it('no deberia afectar otros logros', () => {
      service.desbloquearLogro('primera-clase');
      
      const otroLogro = service.logros().find(l => l.id === 'primera-semana');
      expect(otroLogro?.desbloqueado).toBeFalse();
    });
  });

  describe('estaInscrito', () => {
    it('deberia retornar false sin clases', () => {
      expect(service.estaInscrito(1)).toBeFalse();
    });
  });

  describe('categorias de logros', () => {
    it('deberia tener categoria Antiguedad', () => {
      const mapa = service.logrosPorCategoria();
      expect(mapa.has('Antigüedad')).toBeTrue();
    });

    it('deberia tener categoria Progreso personal', () => {
      const mapa = service.logrosPorCategoria();
      expect(mapa.has('Progreso personal')).toBeTrue();
    });
  });

  describe('inscribirEnClase', () => {
    it('deberia lanzar error si no hay usuario autenticado', () => {
      mockAuthService.usuario.set(null);
      expect(() => service.inscribirEnClase(1, '2024-01-15')).toThrowError('Usuario no autenticado');
    });

    it('deberia hacer peticion POST al inscribirse', () => {
      mockAuthService.usuario.set({ id: 1, email: 'test@test.com', nombre: 'Test' } as any);
      
      service.inscribirEnClase(1, '2024-01-15').subscribe();
      
      const req = httpMock.expectOne('/api/inscripciones');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        alumnoId: 1,
        claseId: 1,
        fechaClase: '2024-01-15'
      });
      req.flush({
        id: 100,
        claseId: 1,
        gimnasioId: 1,
        claseNombre: 'Yoga',
        gimnasioNombre: 'Gym1',
        profesorNombre: 'Prof1',
        fechaInscripcion: '2024-01-10',
        fechaClase: '2024-01-15',
        puedeReembolsar: true
      });
    });

    it('deberia agregar clase a lista al inscribirse', () => {
      mockAuthService.usuario.set({ id: 1, email: 'test@test.com', nombre: 'Test' } as any);
      
      service.inscribirEnClase(1, '2024-01-15').subscribe();
      
      const req = httpMock.expectOne('/api/inscripciones');
      req.flush({
        id: 100,
        claseId: 1,
        gimnasioId: 1,
        claseNombre: 'Yoga',
        gimnasioNombre: 'Gym1',
        profesorNombre: 'Prof1',
        fechaInscripcion: '2024-01-10',
        fechaClase: '2024-01-15',
        puedeReembolsar: true
      });
      
      expect(service.clases().length).toBe(1);
      expect(service.clases()[0].nombre).toBe('Yoga');
    });

    it('deberia reducir creditos al inscribirse', () => {
      mockAuthService.usuario.set({ id: 1, email: 'test@test.com', nombre: 'Test' } as any);
      const creditosAntes = service.creditos();
      
      service.inscribirEnClase(1, '2024-01-15').subscribe();
      
      const req = httpMock.expectOne('/api/inscripciones');
      req.flush({
        id: 100,
        claseId: 1,
        gimnasioId: 1,
        claseNombre: 'Yoga',
        gimnasioNombre: 'Gym1',
        profesorNombre: 'Prof1',
        fechaInscripcion: '2024-01-10',
        fechaClase: '2024-01-15',
        puedeReembolsar: true
      });
      
      expect(service.creditos()).toBe(creditosAntes - 1);
    });
  });

  describe('cancelarInscripcion', () => {
    it('deberia lanzar error si no hay usuario autenticado', () => {
      mockAuthService.usuario.set(null);
      expect(() => service.cancelarInscripcion(1)).toThrowError('Usuario no autenticado');
    });

    it('deberia hacer peticion DELETE al cancelar', () => {
      mockAuthService.usuario.set({ id: 1, email: 'test@test.com', nombre: 'Test' } as any);
      
      service.cancelarInscripcion(1).subscribe();
      
      const req = httpMock.expectOne('/api/inscripciones/alumno/1/clase/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({ reembolso: true });
    });
  });

  describe('crearResenia', () => {
    it('deberia lanzar error si no hay usuario autenticado', () => {
      mockAuthService.usuario.set(null);
      expect(() => service.crearResenia(1, 'Gym', 'Excelente', 5)).toThrowError('Usuario no autenticado');
    });

    it('deberia hacer peticion POST al crear resenia', () => {
      mockAuthService.usuario.set({ id: 1, email: 'test@test.com', nombre: 'Test' } as any);
      
      service.crearResenia(1, 'Gym1', 'Excelente servicio', 5).subscribe();
      
      const req = httpMock.expectOne('/api/interacciones/resenia');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        usuarioId: 1,
        gimnasioId: 1,
        texto: 'Excelente servicio',
        valoracion: 5
      });
      req.flush({
        id: 50,
        gimnasioId: 1,
        nombreGimnasio: 'Gym1',
        resenia: 'Excelente servicio',
        valoracion: 5,
        fechaInteraccion: '2024-01-10'
      });
    });

    it('deberia agregar resenia a lista', () => {
      mockAuthService.usuario.set({ id: 1, email: 'test@test.com', nombre: 'Test' } as any);
      
      service.crearResenia(1, 'Gym1', 'Excelente servicio', 5).subscribe();
      
      const req = httpMock.expectOne('/api/interacciones/resenia');
      req.flush({
        id: 50,
        gimnasioId: 1,
        nombreGimnasio: 'Gym1',
        resenia: 'Excelente servicio',
        valoracion: 5,
        fechaInteraccion: '2024-01-10'
      });
      
      expect(service.resenias().length).toBe(1);
      expect(service.resenias()[0].texto).toBe('Excelente servicio');
    });

    it('deberia desbloquear logros al crear resenia', () => {
      mockAuthService.usuario.set({ id: 1, email: 'test@test.com', nombre: 'Test' } as any);
      
      service.crearResenia(1, 'Gym1', 'Excelente', 5).subscribe();
      
      const req = httpMock.expectOne('/api/interacciones/resenia');
      req.flush({
        id: 50,
        gimnasioId: 1,
        nombreGimnasio: 'Gym1',
        resenia: 'Excelente',
        valoracion: 5,
        fechaInteraccion: '2024-01-10'
      });
      
      const logroPrimeraResenia = service.logros().find(l => l.id === 'primera-resenia');
      expect(logroPrimeraResenia?.desbloqueado).toBeTrue();
    });
  });

  describe('cargarReseniasGimnasio', () => {
    it('deberia hacer peticion GET para resenias de gimnasio', () => {
      service.cargarReseniasGimnasio(1).subscribe();
      
      const req = httpMock.expectOne('/api/interacciones/gimnasio/1/resenias');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('deberia retornar lista de resenias', () => {
      const reseniasMock = [
        { id: 1, texto: 'Bueno', valoracion: 4 },
        { id: 2, texto: 'Excelente', valoracion: 5 }
      ];
      
      let resultado: any[] = [];
      service.cargarReseniasGimnasio(1).subscribe(r => resultado = r);
      
      const req = httpMock.expectOne('/api/interacciones/gimnasio/1/resenias');
      req.flush(reseniasMock);
      
      expect(resultado.length).toBe(2);
    });
  });

  describe('cargarDatos', () => {
    it('no deberia cargar datos sin usuario', () => {
      mockAuthService.usuario.set(null);
      service.cargarDatos();
      httpMock.expectNone('/api/inscripciones/alumno/1');
    });

    it('deberia cargar inscripciones con usuario autenticado', () => {
      mockAuthService.usuario.set({ id: 1, email: 'test@test.com', nombre: 'Test' } as any);
      
      service.cargarDatos();
      
      const reqInscripciones = httpMock.expectOne('/api/inscripciones/alumno/1');
      expect(reqInscripciones.request.method).toBe('GET');
      reqInscripciones.flush([]);
      
      const reqInteracciones = httpMock.expectOne('/api/interacciones/usuario/1');
      expect(reqInteracciones.request.method).toBe('GET');
      reqInteracciones.flush([]);
    });

    it('deberia manejar error al cargar inscripciones', () => {
      mockAuthService.usuario.set({ id: 1, email: 'test@test.com', nombre: 'Test' } as any);
      
      service.cargarDatos();
      
      const reqInscripciones = httpMock.expectOne('/api/inscripciones/alumno/1');
      reqInscripciones.flush({ mensaje: 'Error' }, { status: 404, statusText: 'Not Found' });
      
      expect(service.error()).toBe('Error al cargar las clases');
      
      // Aún así espera la petición de interacciones
      const reqInteracciones = httpMock.expectOne('/api/interacciones/usuario/1');
      reqInteracciones.flush([]);
    });

    it('deberia manejar error al cargar interacciones', () => {
      mockAuthService.usuario.set({ id: 1, email: 'test@test.com', nombre: 'Test' } as any);
      
      service.cargarDatos();
      
      const reqInscripciones = httpMock.expectOne('/api/inscripciones/alumno/1');
      reqInscripciones.flush([]);
      
      const reqInteracciones = httpMock.expectOne('/api/interacciones/usuario/1');
      reqInteracciones.flush({ mensaje: 'Error' }, { status: 404, statusText: 'Not Found' });
      
      // No debe haber error en el service porque es silencioso
      expect(service.resenias().length).toBe(0);
    });
  });
});
