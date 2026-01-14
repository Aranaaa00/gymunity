import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { gimnasioResolver } from './gimnasio.resolver';
import { Router, ActivatedRouteSnapshot, ParamMap } from '@angular/router';
import { GimnasiosApiService } from '../servicios/gimnasios-api';
import { of, throwError, Observable, isObservable } from 'rxjs';

describe('gimnasioResolver', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockGimnasiosService: jasmine.SpyObj<GimnasiosApiService>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockParamMap: jasmine.SpyObj<ParamMap>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockGimnasiosService = jasmine.createSpyObj('GimnasiosApiService', ['obtenerPorId']);
    mockParamMap = jasmine.createSpyObj('ParamMap', ['get']);

    mockRoute = {
      paramMap: mockParamMap
    } as unknown as ActivatedRouteSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: GimnasiosApiService, useValue: mockGimnasiosService }
      ]
    });
  });

  it('deberia obtener gimnasio por id valido', fakeAsync(() => {
    const gimnasioMock = { id: 1, nombre: 'Test Gym' };
    mockParamMap.get.and.returnValue('1');
    mockGimnasiosService.obtenerPorId.and.returnValue(of(gimnasioMock as any));

    let resultado: any;
    TestBed.runInInjectionContext(() => {
      const res = gimnasioResolver(mockRoute, {} as any);
      if (isObservable(res)) {
        res.subscribe((data: any) => resultado = data);
      }
    });

    tick();
    expect(resultado).toEqual(gimnasioMock);
    expect(mockGimnasiosService.obtenerPorId).toHaveBeenCalledWith(1);
  }));

  it('deberia navegar a 404 si no hay id en ruta', fakeAsync(() => {
    mockParamMap.get.and.returnValue(null);

    let resultado: any;
    TestBed.runInInjectionContext(() => {
      const res = gimnasioResolver(mockRoute, {} as any);
      if (isObservable(res)) {
        res.subscribe((data: any) => resultado = data);
      }
    });

    tick();
    expect(resultado).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/404']);
  }));

  it('deberia navegar a 404 si id no es numero', fakeAsync(() => {
    mockParamMap.get.and.returnValue('abc');

    let resultado: any;
    TestBed.runInInjectionContext(() => {
      const res = gimnasioResolver(mockRoute, {} as any);
      if (isObservable(res)) {
        res.subscribe((data: any) => resultado = data);
      }
    });

    tick();
    expect(resultado).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/404']);
  }));

  it('deberia navegar a 404 si servicio falla', fakeAsync(() => {
    mockParamMap.get.and.returnValue('1');
    mockGimnasiosService.obtenerPorId.and.returnValue(throwError(() => new Error('Error')));

    let resultado: any;
    TestBed.runInInjectionContext(() => {
      const res = gimnasioResolver(mockRoute, {} as any);
      if (isObservable(res)) {
        res.subscribe((data: any) => resultado = data);
      }
    });

    tick();
    expect(resultado).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/404']);
  }));
});
