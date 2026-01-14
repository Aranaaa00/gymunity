```
   ██████╗ ██╗   ██╗███╗   ███╗██╗   ██╗███╗   ██╗██╗████████╗██╗   ██╗
  ██╔════╝ ╚██╗ ██╔╝████╗ ████║██║   ██║████╗  ██║██║╚══██╔══╝╚██╗ ██╔╝
  ██║  ███╗ ╚████╔╝ ██╔████╔██║██║   ██║██╔██╗ ██║██║   ██║    ╚████╔╝ 
  ██║   ██║  ╚██╔╝  ██║╚██╔╝██║██║   ██║██║╚██╗██║██║   ██║     ╚██╔╝  
  ╚██████╔╝   ██║   ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██║   ██║      ██║   
   ╚═════╝    ╚═╝   ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝   ╚═╝      ╚═╝   
                                                          
```
Enlace a la web: https://clownfish-app-puttm.ondigitalocean.app/

---

# Documentacion Tecnica Frontend

**Stack tecnologico:** Angular 21, TypeScript, SCSS, Signals, RxJS

---

## Indice

| Seccion | Contenido |
|---------|-----------|
| [Instalacion y Configuracion](#instalacion-y-configuracion) | Requisitos, setup, comandos |
| [Arquitectura](#arquitectura) | Estructura del proyecto |
| [Gestion de Estado](#gestion-de-estado) | Signals, patron, optimizacion |
| [Eventos](#eventos) | Interaccion usuario-aplicacion |
| [Servicios](#servicios) | Logica centralizada |
| [Formularios](#formularios) | Validacion reactiva |
| [Rutas](#rutas) | Navegacion SPA |
| [HTTP](#http) | Comunicacion con API |
| [Componentes](#componentes) | Interfaz de usuario reutilizable |
| [Testing](#testing) | Tests unitarios, integracion, coverage |
| [Optimizacion y Rendimiento](#optimizacion-y-rendimiento) | Lighthouse, bundles, lazy loading |
| [Despliegue](#despliegue) | Build de produccion, configuracion |
| [Decisiones Tecnicas](#decisiones-tecnicas) | Justificacion de elecciones |
| [Guia de Contribucion](#guia-de-contribucion) | Estandares de desarrollo |
| [Changelog](#changelog) | Historial de versiones |

---

# Instalacion y Configuracion

## Requisitos previos

| Herramienta | Version minima |
|-------------|----------------|
| Node.js | 20.x o superior |
| npm | 10.x o superior |
| Angular CLI | 21.x |

## Instalacion

```bash
# Clonar el repositorio
git clone <url-repositorio>
cd gymunity/frontend

# Instalar dependencias
npm install
```

## Comandos disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm start` | Inicia el servidor de desarrollo en http://localhost:4200 |
| `npm run build` | Genera el build de produccion |
| `npm test` | Ejecuta los tests unitarios |
| `npm test -- --code-coverage` | Ejecuta tests con reporte de cobertura |

## Variables de entorno

En produccion, el servidor SSR utiliza la variable `BACKEND_URL` para configurar el proxy hacia el backend:

```bash
BACKEND_URL=http://backend:8080
```

---

# Arquitectura

## Estructura del proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── componentes/compartidos/  # Componentes UI reutilizables
│   │   ├── directivas/               # Directivas personalizadas
│   │   ├── guards/                   # Proteccion de rutas
│   │   ├── interceptors/             # Middleware HTTP
│   │   ├── layout/                   # Header, Footer, Main
│   │   ├── modelos/                  # Interfaces TypeScript
│   │   ├── paginas/                  # Vistas principales
│   │   ├── resolvers/                # Precarga de datos
│   │   ├── servicios/                # Logica de negocio
│   │   ├── app.routes.ts             # Configuracion de rutas
│   │   └── app.config.ts             # Configuracion de la aplicacion
│   ├── styles/                       # Variables SCSS globales
│   └── assets/                       # Recursos estaticos
├── angular.json                      # Configuracion Angular CLI
├── package.json                      # Dependencias
└── Dockerfile                        # Contenedor de produccion
```

---

# Gestion de Estado

## Patron Elegido: Servicios con Signals

Tras evaluar las distintas alternativas disponibles en Angular, se opto por utilizar Signals como mecanismo de reactividad. La decision se baso en un analisis comparativo donde se probaron BehaviorSubject y NgRx en prototipos previos, determinando que para el alcance de Gymunity, Signals ofrecia el mejor equilibrio entre simplicidad y funcionalidad.

```
┌─────────────────────────────────────────────────────────────┐
│              PATRON: SERVICIOS + SIGNALS                    │
├─────────────────────────────────────────────────────────────┤
│   signal()          - Estado mutable (privado)              │
│   .asReadonly()     - Lectura desde componentes             │
│   computed()        - Valores derivados                     │
│   effect()          - Sincronizar con localStorage, etc.    │
└─────────────────────────────────────────────────────────────┘
```

## Comparativa de alternativas evaluadas

| Aspecto | Signals | BehaviorSubject | NgRx |
|---------|:-------:|:---------------:|:----:|
| Curva de aprendizaje | Baja | Media | Alta |
| Codigo necesario | Poco | Moderado | Mucho |
| Peso en bundle | Minimo | Incluido en RxJS | Aproximadamente 15 KB extra |
| Deteccion de cambios | Automatica | Manual | Manual |
| Depuracion | Angular DevTools | Consola | Redux DevTools |

NgRx esta orientado a aplicaciones de mayor escala donde el time-travel debugging justifica el boilerplate adicional de actions, reducers, effects y selectors. Para un sistema de gestion de gimnasios y reservas, esta complejidad resultaba desproporcionada.

BehaviorSubject es funcional pero requiere gestion manual de suscripciones o el uso extensivo del pipe async. Con Signals, Angular detecta los cambios automaticamente y el codigo resulta mas limpio y mantenible.

## Organizacion del estado

Cada servicio encapsula su propio estado y expone unicamente lecturas:

```
┌─────────────────────────────────────────────────────────────┐
│                    SERVICIOS (Singleton)                    │
├─────────────────────────────────────────────────────────────┤
│  GimnasiosApiService                                        │
│  ├── _gimnasios = signal([])          ← privado             │
│  ├── gimnasios = _gimnasios.asReadonly()                    │
│  └── hayGimnasios = computed(...)     ← derivado            │
│                                                             │
│  AuthService                                                │
│  ├── _usuario = signal(null)                                │
│  └── estaAutenticado = computed(...)                        │
│                                                             │
│  ReservasService                                            │
│  ├── _creditos = signal(12)                                 │
│  └── creditosRestantes = computed(...)                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               COMPONENTES (OnPush)                          │
├─────────────────────────────────────────────────────────────┤
│  Leen los signals directamente en el template:              │
│  @if (gimnasiosService.cargando()) { ... }                  │
│  @for (gym of gimnasios(); track gym.id) { ... }            │
└─────────────────────────────────────────────────────────────┘
```

Los componentes nunca modifican el estado directamente; llaman a métodos del servicio que hacen la lógica y actualizan el signal.

## Comparativa en detalle

### Opción A: Signals (la que usamos)

```typescript
// gimnasios-api.ts
private readonly _gimnasios = signal<GimnasioCard[]>([]);
readonly gimnasios = this._gimnasios.asReadonly();

crear(datos: GimnasioRequest): Observable<GimnasioCard> {
  return this.http.post<GimnasioCard>(API_URL, datos).pipe(
    tap((nuevo) => this._gimnasios.update(lista => [nuevo, ...lista]))
  );
}
```

Ventajas: poco código, se integra bien con Angular 17+.  
Limitaciones: sin time-travel debugging (aunque tampoco lo necesitaba).

### Opción B: BehaviorSubject

```typescript
private gimnasios$ = new BehaviorSubject<GimnasioCard[]>([]);
readonly gimnasios = this.gimnasios$.asObservable();
```

Lo probamos al principio. Funciona pero tuvimos que añadir `| async` en todos los templates o gestionar suscripciones con `takeUntil`. Al final era más verboso sin aportar nada extra.

### Opción C: NgRx

Montamos un prototipo con store, actions y effects. La estructura era impecable para escalar, pero el boilerplate era desproporcionado. Para añadir una feature nueva tocaba crear 4-5 archivos. Lo descartamos pronto.

## Optimizaciones aplicadas

No basta con elegir Signals; hay que usarlos bien para que la app vuele.

### OnPush en todos los componentes

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

Angular solo re-renderiza si cambian los inputs o los signals. Esto reduce bastante las comprobaciones innecesarias.

### TrackBy en listas

```html
@for (gym of gimnasios(); track gym.id) { ... }
```

Evita recrear el DOM entero cuando cambia un elemento. Angular reutiliza los nodos que ya existen.

### Debounce en búsqueda

```typescript
this._busquedaSubject.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap((termino) => this.buscar(termino))
).subscribe();
```

Sin esto, cada pulsación dispararía una petición HTTP. Con 300ms de espera agrupamos las teclas y solo lanzamos una llamada al parar de escribir.

### Limpieza de suscripciones

```typescript
// Forma preferida en Angular 16+
this.datos$.pipe(takeUntilDestroyed()).subscribe();
```

O con Subject cuando hay más control:

```typescript
private destruir$ = new Subject<void>();
ngOnDestroy() {
  this.destruir$.next();
  this.destruir$.complete();
}
```

### Computed para cálculos derivados

```typescript
readonly totalGimnasios = computed(() => this._gimnasios().length);
```

Se cachea automáticamente. Solo recalcula si alguna dependencia cambia.

## Flujo de datos resumido

```
Usuario → Componente → Servicio → API
                          │
                          ▼
                      signal.update()
                          │
                          ▼
                  Angular detecta cambio
                          │
                          ▼
                  Re-render (OnPush)
```

---

# Eventos

## Flujo

```
    USUARIO                COMPONENTE              SERVICIO
       │                       │                       │
       │──── click/tecla ─────►│                       │
       │                       │──── emitir() ────────►│
       │                       │                       │──── signal ────► OTROS
       │                       │◄──── escuchar() ──────│
```

## Teclado

| Tecla | Acción | Dónde |
|:-----:|--------|-------|
| `ESC` | Cerrar | Modal, Menú, Toast |
| `← →` | Navegar | Tabs |
| `⏎ ␣` | Activar | Acordeón, Botones |
| `Tab` | Focus | Todos (a11y) |

## Navegadores

```
Chrome ✓   Firefox ✓   Edge ✓   Safari ✓   Opera ✓
```

---

# Servicios

## Arquitectura

```
┌─────────────────────────────────────┐
│           SERVICIOS                 │
│  Estado · Notif · Carga · Tema      │
│         │                           │
│    ┌────┴────┐                      │
│    │ SIGNALS │ ← Reactividad        │
│    └────┬────┘                      │
└─────────┼───────────────────────────┘
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
  Comp   Comp   Comp
```

## Core

| Servicio | Uso |
|----------|-----|
| `ComunicacionService` | `emitir('evento', data)` / `escuchar('evento')` |
| `EstadoService` | `establecer('key', val)` / `seleccionar('key')` |
| `NotificacionService` | `success()` `error()` `warning()` `info()` |
| `CargaService` | `iniciar(id)` / `finalizar(id)` |
| `TemaService` | `alternar()` claro ↔ oscuro |
| `ModalService` | `abrirLogin()` / `cerrar()` |

## Regla

```
COMPONENTES = UI (template, eventos)
SERVICIOS   = Lógica, estado, HTTP
MODELOS     = Interfaces TypeScript
```

---

# Formularios

## Validadores Síncronos

| Validador | Valida |
|-----------|--------|
| `passwordFuerte` | A-Z, a-z, 0-9, especiales |
| `coincidenCampos` | password === confirmPassword |
| `nifValido` | DNI español con letra |
| `telefonoEspanol` | +34 + 9 dígitos |
| `codigoPostalEspanol` | 01000-52999 |

## Validadores Asíncronos

| Validador | Debounce |
|-----------|:--------:|
| `emailUnico` | 500ms |
| `usernameUnico` | 500ms |

```typescript
// Ejemplo real: validadores-asincronos.ts
emailUnico(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const email = control.value;
    if (!email) return of(null);

    return timer(500).pipe(
      switchMap(() => this.verificarEmailEnBD(email)),
      map((existe) => existe ? { emailNoDisponible: true } : null),
      catchError(() => of(null))
    );
  };
}

// Uso en formulario
this.fb.group({
  email: ['', [Validators.required, Validators.email], 
              [this.validadores.emailUnico()]]
});
```

## FormArray

```typescript
// Campos dinámicos
agregarRed(): void {
  this.redesSociales.push(this.fb.group({
    plataforma: ['Instagram'],
    url: ['', Validators.pattern(/^https?:\/\/.+/)]
  }));
}
```

## Fuerza Password

```
░░░░░░░░░░  Débil      0-39%
████░░░░░░  Media      40-64%
███████░░░  Fuerte     65-84%
██████████  Muy Fuerte 85-100%
```

---

# Rutas

## Mapa de rutas

```
                    GYMUNITY
                       │
    ┌──────┬───────┬───┴───┬────────┬──────┐
    ▼      ▼       ▼       ▼        ▼      ▼
   /    /busqueda  /gym/:id  /perfil  /config  /**
                      │     [Guard]  [Guard]   404
                   Resolver
```

## Tabla de rutas

| Ruta | Lazy Loading | Guard | Resolver |
|------|:------------:|:-----:|:--------:|
| `/` | Si | - | - |
| `/busqueda` | Si | - | - |
| `/gimnasio/:id` | Si | - | Si |
| `/perfil` | Si | AutenticacionGuard | - |
| `/configuracion` | Si | AutenticacionGuard | - |
| `/**` | Si | - | - |

## Guards

```typescript
autenticacionGuard     → !auth ? redirect('/') : true
cambiosSinGuardarGuard → cambios ? confirm() : true
```

## Lazy Loading

```typescript
// app.routes.ts - Todas las rutas usan lazy loading
{
  path: 'gimnasio/:id',
  loadComponent: () => import('./paginas/gimnasio/gimnasio')
    .then((m) => m.GimnasioPage),
  resolve: { gimnasio: gimnasioResolver },
}

// app.config.ts - Estrategia de precarga
provideRouter(routes, withPreloading(PreloadAllModules))
```

**Estrategia:** `PreloadAllModules` carga el módulo inicial rápidamente y luego precarga los demás en background mientras el usuario navega.

---

# HTTP

## Endpoints

| Método | Ruta | Acción |
|:------:|------|--------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Registro |
| GET | `/api/gimnasios` | Listar |
| GET | `/api/gimnasios/:id` | Detalle |
| POST | `/api/gimnasios` | Crear |
| PUT | `/api/gimnasios/:id` | Actualizar |
| DELETE | `/api/gimnasios/:id` | Eliminar |

## Interceptores

```
Request → [Logging] → [Headers] → [Error] → API
              │           │          │
              │           │          └► Retry 2x (5xx)
              │           └► Bearer token
              └► Console coloreado
```

## Interfaces

```typescript
// Usuario con roles
interface Usuario {
  id: number;
  nombreUsuario: string;
  email: string;
  rol: 'ALUMNO' | 'PROFESOR' | 'ADMIN';
  ciudad?: string;
}

// Card de gimnasio (listados)
interface GimnasioCard {
  id: number;
  nombre: string;
  ciudad: string;
  foto: string;  // URL de imagen
  disciplinas: string;
  valoracionMedia: number | null;
  totalResenias: number;
}

// Detalle completo de gimnasio
interface GimnasioDetalle {
  id: number;
  nombre: string;
  descripcion: string;
  ciudad: string;
  foto: string;
  clases: Clase[];
  resenias: Resenia[];
  valoracionMedia: number | null;
  totalApuntados: number;
}

// Clase de un gimnasio
interface Clase {
  id: number;
  nombre: string;
  icono: string;
  profesorNombre: string;
}
```

## Errores

```
5xx/Red  → Retry 2x (backoff)
401      → Limpiar sesión + redirect /
Otros    → catchError → signal error()
```

## Estados UI

| Estado | Signal | UI |
|--------|--------|-----|
| Cargando | `cargando()` | Spinner |
| Error | `error()` | Mensaje |
| Vacío | `!hayDatos()` | Empty state |
| Éxito | `datos()` | Contenido |

---

# Componentes

| Componente | Features |
|------------|----------|
| **Header** | Hamburguesa, ESC, click-fuera |
| **Modal** | Focus trap, ESC, overlay |
| **Acordeón** | Único/múltiple, teclado |
| **Tabs** | Flechas, Home/End |
| **Tooltip** | Posición auto, delay |
| **Toast** | Auto-dismiss, tipos |

## Z-Index

```
5 Toast
4 Loading
3 Modal
2 Header
1 Overlay
0 Base
```

---

# Estructura

```
app/
├── componentes/compartidos/  # UI
├── guards/                   # Protección rutas
├── interceptors/             # HTTP middleware
├── layout/                   # Header, Footer
├── modelos/                  # Interfaces
├── paginas/                  # Vistas
├── resolvers/                # Precarga
├── servicios/                # Lógica
├── app.routes.ts
└── app.config.ts
```

---

# Testing

## Testing Unitario

Los tests unitarios se distribuyen en archivos `.spec.ts` junto a cada componente o servicio. Se utiliza Jasmine como framework de testing y Karma como test runner, con ChromeHeadless como navegador de ejecucion.

### Ejecucion de tests

```bash
# Ejecutar tests sin modo watch
npm test -- --no-watch

# Ejecutar tests con reporte de coverage
npm test -- --no-watch --code-coverage
```

### Tests de componentes

Se han desarrollado tests para los siguientes componentes:

| Componente | Descripcion |
|------------|-------------|
| Boton | Creacion, valores por defecto, clases computadas |
| Spinner | Creacion, tamano, icono, porcentaje |
| AreaTexto | Inputs, eventos, validaciones |
| Selector | Opciones, seleccion, estados |
| Tabs | Navegacion, seleccion activa |
| CardImage | Carga de imagenes, fallback |
| Galeria | Imagenes, miniaturas, navegacion |
| Tooltip | Posicionamiento, contenido |
| Breadcrumbs | Rutas, navegacion |
| SeccionBienvenida | Renderizado, inputs |
| SeccionLista | Listados, ver mas |
| CargaGlobal | Estado de carga |

### Tests de servicios

| Servicio | Funcionalidades testeadas |
|----------|---------------------------|
| NotificacionService | Tipos de notificacion, cierre, reemplazo, IDs |
| TemaService | Alternancia claro/oscuro, persistencia |
| CargaService | Estados de carga, porcentajes, mensajes |
| ComunicacionService | Emision y escucha de eventos, filtrado |
| ModalService | Apertura/cierre de modales, cambio entre modales |
| EstadoService | CRUD de estado, tipos de datos, selectores |
| AuthService | Login, logout, registro, credenciales, errores |
| ValidadoresService | Validadores sincronos personalizados |
| FuerzaPasswordService | Calculo de fuerza de contrasena |
| GimnasiosApiService | CRUD HTTP, paginacion, busqueda |
| PerfilService | Inscripciones, creditos, resenias, logros |
| ReservasService | Reservar, cancelar, verificar |
| HttpBaseService | Peticiones HTTP, reintentos, errores |
| ValidadoresAsincronos | Email unico, username unico |

### Tests de guards e interceptores

| Elemento | Funcionalidades testeadas |
|----------|---------------------------|
| AutenticacionGuard | Redireccion si no autenticado |
| CambiosSinGuardarGuard | Confirmacion antes de salir |
| GimnasioResolver | Precarga de datos |
| HttpHeadersInterceptor | Cabeceras de peticion |
| HttpLoggingInterceptor | Logging de peticiones |
| HttpErrorInterceptor | Manejo de errores HTTP |
| `Boton` | 3 | Creacion, valores por defecto, clases computadas |
| `Spinner` | 4 | Creacion, tamano por defecto, tamano de icono, porcentaje |
| `Alerta` | 4 | Creacion, tipo por defecto, cerrable, emision de evento cerrar |

**Boton Component:**
- Verifica la creacion correcta del componente
- Comprueba valores por defecto: tipo='button', variante='primary', tamano='md', disabled=false, cargando=false
- Valida que las clases CSS se computan correctamente segun variante y tamano

**Spinner Component:**
- Verifica la creacion del componente
- Comprueba que el tamano por defecto es 'md'
- Valida el calculo del tamano del icono (40px para md)
- Confirma que mostrarPorcentaje es false por defecto

**Alerta Component:**
- Verifica la creacion del componente
- Comprueba que el tipo por defecto es 'info'
- Valida que cerrable es true por defecto
- Comprueba la emision del evento cerrar

### Tests de servicios

| Servicio | Tests | Funcionalidades cubiertas |
|----------|:-----:|---------------------------|
| `NotificacionService` | 10 | Tipos de notificacion, cierre, reemplazo, IDs |
| `TemaService` | 5 | Alternancia claro/oscuro, persistencia |
| `CargaService` | 14 | Estados de carga, porcentajes, mensajes |
| `ComunicacionService` | 4 | Emision y escucha de eventos, filtrado |
| `ModalService` | 5 | Apertura/cierre de modales, cambio entre modales |
| `EstadoService` | 8 | CRUD de estado, tipos de datos, selectores |
| `AuthService` | 8 | Login, logout, registro, credenciales guardadas |

**NotificacionService:**
- Creacion del servicio
- Mostrar notificacion de tipo success, error, warning, info
- Cerrar notificacion
- Reemplazo inmediato de notificacion anterior
- Incremento de ID de notificacion
- Uso del metodo generico mostrar()
- Tipo por defecto cuando no se especifica

**TemaService:**
- Creacion del servicio
- Verificacion del tema actual (claro/oscuro)
- Alternancia de claro a oscuro
- Alternancia de oscuro a claro
- Valor correcto de esOscuro()

**CargaService:**
- Creacion del servicio
- Toggle del estado de carga
- Manejo de multiples estados de carga simultaneos
- Tracking de carga especifica por ID
- Mensaje personalizado
- Actualizacion de porcentaje
- Normalizacion de porcentaje a rango valido (0-100)
- Actualizacion de mensaje con porcentaje
- Calculo de porcentaje global
- Mensaje global (ultimo mensaje)
- Limpieza de todos los estados
- Selector de signal para ID especifico
- Selector de porcentaje por ID
- No actualizar porcentaje para ID inexistente

**ComunicacionService:**
- Creacion del servicio
- Emision y recepcion de eventos
- Emision de eventos con payload de objeto
- Filtrado de eventos por tipo

**ModalService:**
- Creacion del servicio
- Sin modal activo inicialmente
- Apertura de modal login
- Apertura de modal registro
- Cierre de modal
- Cambio entre modales

**EstadoService:**
- Creacion del servicio
- Retorno undefined para clave inexistente
- Set y get de valores
- Actualizacion de valores existentes
- Eliminacion de valores
- Limpieza de todos los valores
- Selector de signal
- Manejo de diferentes tipos de datos (string, number, boolean, array, object)

**AuthService:**
- Creacion del servicio
- No autenticado inicialmente
- Token null inicialmente
- Login exitoso con mock HTTP
- Manejo de error de login
- Logout de usuario
- Guardado y recuperacion de credenciales
- Registro de usuario exitoso

### Tests de validadores

| Validador | Tests | Casos cubiertos |
|-----------|:-----:|-----------------|
| `passwordFuerte` | 13 | Requisitos de complejidad, caracteres especiales |
| `coincidenCampos` | 3 | Campos coincidentes, no coincidentes, inexistentes |
| `nifValido` | 7 | NIFs validos, letra incorrecta, formato invalido |
| `telefonoEspanol` | 8 | Movil, fijo, prefijos +34/0034/34 |
| `codigoPostalEspanol` | 5 | Rango valido 01001-52999 |
| `rangoNumerico` | 8 | Rangos positivos, negativos, decimales |

### Tests de fuerza de password

| Funcion | Tests | Casos cubiertos |
|---------|:-----:|-----------------|
| `calcularFuerzaPassword` | 12 | Niveles debil/media/fuerte/muy-fuerte, puntuacion, mensajes |

### Tests de pipes personalizados

El proyecto no implementa pipes personalizados. Toda la transformacion de datos se realiza mediante:
- Funciones puras en los servicios
- Computed signals para valores derivados
- Metodos de componentes para transformaciones especificas del template

---

## Testing de Integracion

### Tests de flujos completos

El archivo `app.spec.ts` incluye tests de integracion que verifican flujos completos de la aplicacion:

**Flujo de autenticacion (AuthService):**
```
1. Usuario no autenticado inicialmente
2. Login con credenciales → Peticion POST /api/auth/login
3. Respuesta exitosa → Usuario autenticado, token almacenado
4. Logout → Usuario null, token eliminado
```

**Flujo de registro:**
```
1. Envio de datos de registro → POST /api/auth/register
2. Respuesta exitosa → Usuario autenticado automaticamente
3. Token y datos de usuario disponibles
```

**Flujo de credenciales guardadas:**
```
1. Guardar credenciales → localStorage
2. Verificar existencia → tieneCredencialesGuardadas()
3. Recuperar credenciales → obtenerCredencialesGuardadas()
4. Eliminar credenciales → eliminarCredencialesGuardadas()
```

### Mocks de servicios HTTP

Se utiliza `HttpTestingController` de `@angular/common/http/testing` para simular respuestas HTTP:

```typescript
// Configuracion del TestBed
TestBed.configureTestingModule({
  providers: [
    provideRouter([]),
    provideHttpClient(),
    provideHttpClientTesting()
  ]
});

// Obtencion del controller de mocks
httpMock = TestBed.inject(HttpTestingController);

// Intercepcion de peticion
const req = httpMock.expectOne('/api/auth/login');
expect(req.request.method).toBe('POST');

// Simulacion de respuesta exitosa
req.flush({
  id: 1,
  nombreUsuario: 'testuser',
  email: 'test@example.com',
  rol: 'ALUMNO',
  token: 'fake-jwt-token'
});

// Simulacion de error
req.flush(
  { mensaje: 'Credenciales incorrectas' }, 
  { status: 401, statusText: 'Unauthorized' }
);

// Verificacion de peticiones pendientes
afterEach(() => {
  httpMock.verify();
});
```

### Testing de formularios reactivos

Los validadores de formularios se testean de forma aislada y en contexto de FormGroup:

**Validadores sincronos individuales:**
```typescript
// Test de validador con FormControl
const control = new FormControl('Password1@');
expect(passwordFuerte()(control)).toBeNull();

const controlInvalido = new FormControl('password');
expect(passwordFuerte()(controlInvalido)).toEqual({ passwordFuerte: true });
```

**Validadores de grupo (coincidenCampos):**
```typescript
// Test de validador a nivel de FormGroup
const form = new FormGroup({
  password: new FormControl('test123'),
  confirmar: new FormControl('test123')
});

const validator = coincidenCampos('password', 'confirmar');
expect(validator(form)).toBeNull();

// Con campos que no coinciden
form.get('confirmar')?.setValue('diferente');
expect(validator(form)).toEqual({ passwordMismatch: true });
```

**Casos edge testeados:**
- Valores vacios
- Valores en limites (codigo postal 01001 y 52999)
- Caracteres especiales en NIF
- Prefijos telefonicos (+34, 0034, 34)
- Rangos numericos negativos y decimales

---

## Cobertura de Tests

### Resumen de coverage

| Metrica | Porcentaje |
|---------|:----------:|
| **Statements** | 69.17% |
| **Branches** | 51.63% |
| **Functions** | 65.05% |
| **Lines** | 69.19% |

El coverage supera ampliamente el minimo requerido del 50% en todas las metricas.

### Cobertura por modulo

| Modulo | Statements | Lines |
|--------|:----------:|:-----:|
| Servicios | 85.24% | 85.18% |
| Componentes compartidos | 72.30% | 71.95% |
| Layout | 78.65% | 79.12% |
| Validadores | 100% | 100% |
| Utilidades | 100% | 100% |

### Componentes con cobertura alta (>80%)

| Componente/Servicio | Statements |
|---------------------|:----------:|
| NotificacionService | 100% |
| CargaService | 100% |
| TemaService | 100% |
| ModalService | 100% |
| EstadoService | 100% |
| Boton | 100% |
| Footer | 100% |
| Main | 100% |
| Alerta | 91.66% |
| Header | 88.23% |

### Generacion del reporte de coverage

```bash
# Generar reporte HTML
ng test --watch=false --code-coverage

# El reporte se genera en:
# frontend/coverage/index.html
```

---

## Verificacion Cross-Browser

### Navegadores objetivo

Angular compila el proyecto para los siguientes navegadores segun la configuracion por defecto:

| Navegador | Version minima | Estado |
|-----------|:--------------:|:------:|
| Chrome | 122+ | Soportado |
| Firefox | 121+ | Soportado |
| Edge | 122+ | Soportado |
| Safari | 17.4+ | Soportado |
| Opera | 108+ | Soportado |

### Configuracion de compilacion

El proyecto utiliza la configuracion por defecto de Angular CLI:
- **Target ES2022**: Compatible con navegadores modernos
- **Zone.js**: Unico polyfill incluido para deteccion de cambios

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "preserve"
  }
}
```

```json
// angular.json - polyfills
{
  "polyfills": ["zone.js"]
}
```

### Pruebas realizadas

| Navegador | Version probada | Resultado |
|-----------|:---------------:|:---------:|
| Chrome | 131.0.6778 | Sin incidencias |
| Firefox | 134.0 | Sin incidencias |
| Edge | 131.0.2903 | Sin incidencias |
| Safari | No disponible | - |

### Incompatibilidades documentadas

**Safari (basado en WebKit):**
- No se dispone de acceso a Safari para pruebas directas (requiere macOS)
- Las funcionalidades de CSS utilizadas (Grid, Flexbox, Custom Properties) tienen soporte completo en Safari 17.4+
- Container Queries: Soporte completo desde Safari 16.0

**Consideraciones generales:**
- El proyecto no utiliza APIs experimentales que requieran polyfills adicionales
- Todas las funcionalidades de Angular utilizadas son estables y compatibles con los navegadores objetivo
- Los iconos (Phosphor Icons) utilizan fuentes web con soporte universal
- Las transiciones y animaciones CSS utilizan propiedades estandar

### Polyfills aplicados

| Polyfill | Proposito |
|----------|-----------|
| `zone.js` | Deteccion de cambios de Angular (obligatorio) |

No se han requerido polyfills adicionales. Las funcionalidades modernas de JavaScript (ES2022) tienen soporte nativo en todos los navegadores objetivo.

### Verificacion de compilacion

```bash
# Compilar para produccion
ng build --configuration production

# La compilacion genera bundles optimizados para navegadores objetivo
# Sin errores ni warnings de compatibilidad
```

---

# Optimizacion y Rendimiento

## Analisis con Lighthouse

Se realizaron auditorias de rendimiento con Lighthouse, obteniendo los siguientes resultados:

| Metrica | Desktop | Mobile |
|---------|:-------:|:------:|
| Performance | 82 | 75 |
| Accessibility | 91 | 92 |
| Best Practices | 100 | 100 |
| SEO | 91 | 91 |

### Metricas de rendimiento detalladas

**Desktop:**
| Metrica | Valor |
|---------|-------|
| First Contentful Paint | 0.6s |
| Largest Contentful Paint | 0.9s |
| Total Blocking Time | 90ms |
| Speed Index | 0.6s |

**Mobile:**
| Metrica | Valor |
|---------|-------|
| First Contentful Paint | 2.6s |
| Largest Contentful Paint | 3.6s |
| Total Blocking Time | 10ms |
| Speed Index | 2.6s |

## Optimizaciones aplicadas

### Imagenes

- Atributos `width` y `height` explicitos para prevenir Cumulative Layout Shift (CLS)
- Atributo `fetchpriority="high"` en imagenes criticas (hero, galeria principal)
- Atributo `loading="lazy"` en imagenes no criticas
- Atributo `decoding="async"` para decodificacion no bloqueante
- Formato WebP para imagenes de fondo con diferentes resoluciones segun dispositivo

### Lazy Loading

Todas las rutas implementan lazy loading mediante `loadComponent()`:

```typescript
{
  path: 'gimnasio/:id',
  loadComponent: () => import('./paginas/gimnasio/gimnasio')
    .then((m) => m.GimnasioPage),
}
```

Estrategia de precarga: `PreloadAllModules` carga el modulo inicial y precarga los demas en segundo plano.

### Tree Shaking

La configuracion de produccion tiene habilitada la optimizacion completa, eliminando codigo no utilizado del bundle final.

## Tamano de bundles

| Tipo | Tamano (raw) | Tamano (gzip) |
|------|:------------:|:-------------:|
| Initial bundle | 540 KB | 138 KB |
| Lazy chunks | Variable | Variable |

Detalle de chunks principales:

| Chunk | Tamano |
|-------|--------|
| chunk-Z6CAJUY2.js (vendor) | 301 KB |
| styles-27QQLSGT.css | 73 KB |
| main.js | 60 KB |
| polyfills.js | 35 KB |

---

# Despliegue

## Build de produccion

```bash
ng build --configuration production
```

El build genera los siguientes artefactos en `dist/frontend/`:
- `browser/`: Archivos estaticos para el cliente
- `server/`: Servidor SSR Node.js

## Configuracion del servidor

El servidor de produccion (`server.ts`) implementa:

1. **Proxy API**: Redirige peticiones `/api/*` al backend
2. **Archivos estaticos**: Servidos con cache de 1 año
3. **Fallback SPA**: Angular SSR maneja todas las rutas no estaticas

```typescript
// Proxy hacia el backend
const backendUrl = process.env['BACKEND_URL'] || 'http://localhost:8080';
app.use(createProxyMiddleware({
  target: backendUrl,
  pathFilter: '/api',
}));

// Archivos estaticos con cache
app.use(express.static(browserDistFolder, {
  maxAge: '1y',
}));

// Fallback Angular SSR
app.use((req, res, next) => {
  angularApp.handle(req).then((response) =>
    response ? writeResponseToNodeResponse(response, res) : next()
  );
});
```

## Docker

El proyecto incluye un `Dockerfile` para despliegue en contenedores:

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["node", "dist/frontend/server/server.mjs"]
```

## Variables de entorno en produccion

| Variable | Descripcion | Valor por defecto |
|----------|-------------|-------------------|
| `BACKEND_URL` | URL del servidor backend | http://localhost:8080 |
| `PORT` | Puerto del servidor SSR | 8080 |

---

# Decisiones Tecnicas

## Angular 21 con Signals

Se eligio Angular 21 por su soporte nativo de Signals, que simplifica la gestion de estado reactivo sin necesidad de librerias externas como NgRx. Esta decision reduce el tamano del bundle y la complejidad del codigo.

## SCSS con variables globales

Se utiliza SCSS con un sistema de variables centralizado en `/styles/` para mantener consistencia visual y facilitar cambios de tema (claro/oscuro). Las variables incluyen:
- Colores semanticos
- Espaciados estandarizados
- Tipografia escalable

## Componentes standalone

Todos los componentes son standalone, eliminando la necesidad de NgModules y facilitando el tree shaking. Cada componente declara explicitamente sus dependencias.

## Change Detection OnPush

Todos los componentes utilizan `ChangeDetectionStrategy.OnPush` para optimizar el rendimiento. Angular solo re-renderiza cuando cambian los inputs o los signals.

## Server-Side Rendering (SSR)

Se implemento SSR con `@angular/ssr` para mejorar el SEO y el tiempo de carga inicial. El servidor Express maneja tanto el renderizado como el proxy al backend.

## Validadores personalizados

Se desarrollaron validadores sincronos y asincronos propios para requisitos especificos del dominio espanol (NIF, telefono, codigo postal) en lugar de usar librerias externas.

---

# Guia de Contribucion

## Estandares de codigo

### TypeScript

- Utilizar tipos estrictos, evitar `any`
- Preferir interfaces sobre types cuando sea posible
- Documentar funciones publicas con comentarios descriptivos

### SCSS

- No utilizar `!important`
- Utilizar variables de `/styles/` para colores, espaciados y tipografia
- Seguir el orden de propiedades establecido: posicionamiento, display, box model, fondo, borde, tipografia, efectos, transiciones

### HTML

- Utilizar etiquetas semanticas (header, main, section, article, etc.)
- No utilizar divs genericos
- Incluir atributos de accesibilidad cuando sea necesario

## Estructura de commits

```
tipo(ambito): descripcion breve

[cuerpo opcional]
```

Tipos permitidos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Flujo de trabajo

1. Crear rama desde `main` con nombre descriptivo
2. Desarrollar la funcionalidad
3. Ejecutar tests: `npm test`
4. Crear pull request con descripcion detallada
5. Esperar revision y aprobacion
6. Merge a `main`

---

# Changelog

## Version 1.0.0 (Enero 2026)

### Funcionalidades principales

- Sistema de autenticacion con login y registro
- Listado y busqueda de gimnasios
- Pagina de detalle de gimnasio con galeria, profesores, torneos y resenias
- Sistema de reservas con creditos mensuales
- Perfil de usuario con historial de clases y logros
- Panel de configuracion de cuenta
- Tema claro/oscuro con persistencia

### Componentes desarrollados

- Header con menu responsive
- Modal de autenticacion
- Sistema de notificaciones toast
- Formularios con validacion reactiva
- Galeria de imagenes
- Acordeon y tabs accesibles
- Tooltips informativos

### Testing

- 414 tests unitarios
- Cobertura de codigo: 69.17% statements
- Tests de integracion con mocks HTTP
- Verificacion cross-browser documentada

### Rendimiento

- Lighthouse Performance: 82 (desktop) / 75 (mobile)
- Lazy loading en todas las rutas
- Optimizacion de imagenes con atributos de rendimiento
- Build de produccion: 540 KB initial bundle (138 KB gzip)

---

<p align="center"><b>Gymunity</b> - Angular 21</p>

