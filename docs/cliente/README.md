```
   ██████╗ ██╗   ██╗███╗   ███╗██╗   ██╗███╗   ██╗██╗████████╗██╗   ██╗
  ██╔════╝ ╚██╗ ██╔╝████╗ ████║██║   ██║████╗  ██║██║╚══██╔══╝╚██╗ ██╔╝
  ██║  ███╗ ╚████╔╝ ██╔████╔██║██║   ██║██╔██╗ ██║██║   ██║    ╚████╔╝ 
  ██║   ██║  ╚██╔╝  ██║╚██╔╝██║██║   ██║██║╚██╗██║██║   ██║     ╚██╔╝  
  ╚██████╔╝   ██║   ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██║   ██║      ██║   
   ╚═════╝    ╚═╝   ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝   ╚═╝      ╚═╝   
                                                          
```

---

# 🏋️ Documentación Técnica Frontend

**Stack:** Angular 21 · TypeScript · SCSS · Signals · RxJS

---

## 📖 Índice

| Sección | Contenido |
|---------|-----------|
| [⚡ Gestión de Estado](#-gestión-de-estado) | Signals, patrón, optimización |
| [🎯 Eventos](#-eventos) | Interacción usuario-app |
| [🧠 Servicios](#-servicios) | Lógica centralizada |
| [📝 Formularios](#-formularios) | Validación reactiva |
| [🗺️ Rutas](#-rutas) | Navegación SPA |
| [🌐 HTTP](#-http) | Comunicación API |

---

# ⚡ Gestión de Estado

## Patrón Elegido: Servicios + Signals

Tras evaluar las distintas alternativas disponibles en Angular, nos decantamos por usar **Signals** como mecanismo de reactividad. La decisión no fue arbitraria: probamos BehaviorSubject en un par de componentes y NgRx en un prototipo previo, pero para el alcance de Gymunity ninguno encajaba tan bien.

```
┌─────────────────────────────────────────────────────────────┐
│              PATRÓN: SERVICIOS + SIGNALS                    │
├─────────────────────────────────────────────────────────────┤
│   signal()          → Estado mutable (privado)              │
│   .asReadonly()     → Lectura desde componentes             │
│   computed()        → Valores derivados                     │
│   effect()          → Sincronizar con localStorage, etc.    │
└─────────────────────────────────────────────────────────────┘
```

## ¿Por qué Signals y no otra cosa?

Cuando empezamos el proyecto barajamos tres caminos:

| Aspecto | Signals | BehaviorSubject | NgRx |
|---------|:-------:|:---------------:|:----:|
| Curva de aprendizaje | Baja | Media | Alta |
| Código necesario | Poco | Moderado | Mucho |
| Peso en bundle | Mínimo | Incluido en RxJS | ~15 KB extra |
| Detección de cambios | Funciona solo | Hay que empujar | Hay que empujar |
| Depuración | Angular DevTools | Consola | Redux DevTools |

La realidad es que NgRx está pensado para aplicaciones bastante más grandes. Tiene su gracia el time-travel debugging, pero el precio es escribir actions, reducers, effects y selectors por cada funcionalidad. Para un CRUD de gimnasios y reservas nos pareció matar moscas a cañonazos.

BehaviorSubject lo conocíamos bien de otros proyectos. Funciona, pero obliga a gestionar suscripciones manualmente (o meter el `async` pipe en todas partes). Con Signals, Angular detecta los cambios él solo y el código queda más limpio.

## Cómo está organizado

Cada servicio encapsula su propio estado y expone solo lecturas:

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

# 🎯 Eventos

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

# 🧠 Servicios

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

# 📝 Formularios

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

# 🗺️ Rutas

## Mapa

```
                    GYMUNITY
                       │
    ┌──────┬───────┬───┴───┬────────┬──────┐
    ▼      ▼       ▼       ▼        ▼      ▼
   /    /busqueda  /gym/:id  /perfil  /config  /**
                      │        🔒       🔒     404
                   Resolver
```

## Tabla

| Ruta | Lazy | Guard | Resolver |
|------|:----:|:-----:|:--------:|
| `/` | ✓ | - | - |
| `/busqueda` | ✓ | - | - |
| `/gimnasio/:id` | ✓ | - | ✓ |
| `/perfil` | ✓ | 🔒 | - |
| `/configuracion` | ✓ | 🔒 | - |
| `/**` | ✓ | - | - |

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

# 🌐 HTTP

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

# 🎨 Componentes

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

# 📁 Estructura

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

# 🧪 Tests

```bash
# Ejecutar tests (requiere Firefox)
$env:FIREFOX_BIN = "ruta/a/firefox.exe"
ng test --watch=false
```

Test ubicado en `src/app/app.spec.ts`

---

# ✅ Checklist

```
[✓] ViewChild, ElementRef, Renderer2
[✓] Eventos: click, keydown, focus, blur
[✓] Componentes: menú, modal, acordeón, tabs, tooltip, toast
[✓] Theme switcher (sistema + localStorage)
[✓] Servicios: Comunicación, Estado, Notificaciones, Carga
[✓] Formularios reactivos + FormArray
[✓] Validadores síncronos (5) + asíncronos (2)
[✓] 8 rutas + lazy loading + PreloadAllModules
[✓] Guards: CanActivate, CanDeactivate
[✓] Resolver: gimnasioResolver
[✓] CRUD HTTP completo
[✓] Interceptores: headers, error, logging
[✓] Interfaces TypeScript
[✓] Tests unitarios
```

---

<p align="center"><b>Gymunity</b> · Angular 21 </p>

