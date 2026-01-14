import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

/**
 * Tests del componente principal App.
 * Los tests de servicios y componentes individuales estan en sus respectivos archivos .spec.ts:
 * - servicios/notificacion.spec.ts
 * - servicios/tema.spec.ts
 * - servicios/carga.spec.ts
 * - servicios/comunicacion.spec.ts
 * - servicios/modal.spec.ts
 * - servicios/estado.spec.ts
 * - servicios/auth.spec.ts
 * - servicios/validadores.spec.ts
 * - servicios/fuerza-password.spec.ts
 * - servicios/gimnasios-api.spec.ts
 * - componentes/compartidos/boton/boton.spec.ts
 * - componentes/compartidos/spinner/spinner.spec.ts
 */
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

  it('deberia crear la aplicacion', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
