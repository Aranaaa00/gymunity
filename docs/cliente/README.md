```
   ██████╗ ██╗   ██╗███╗   ███╗██╗   ██╗███╗   ██╗██╗████████╗██╗   ██╗
  ██╔════╝ ╚██╗ ██╔╝████╗ ████║██║   ██║████╗  ██║██║╚══██╔══╝╚██╗ ██╔╝
  ██║  ███╗ ╚████╔╝ ██╔████╔██║██║   ██║██╔██╗ ██║██║   ██║    ╚████╔╝ 
  ██║   ██║  ╚██╔╝  ██║╚██╔╝██║██║   ██║██║╚██╗██║██║   ██║     ╚██╔╝  
  ╚██████╔╝   ██║   ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██║   ██║      ██║   
   ╚═════╝    ╚═╝   ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝   ╚═╝      ╚═╝   
                                                          CLIENTE v1.0
```

---

# 🏋️ Documentación Técnica Frontend

**Stack:** Angular 21 · TypeScript · SCSS · Signals · RxJS

---

## 📖 Índice

| Sección | Contenido |
|---------|-----------|
| [🎯 Eventos](#-eventos) | Interacción usuario-app |
| [🧠 Servicios](#-servicios) | Lógica centralizada |
| [📝 Formularios](#-formularios) | Validación reactiva |
| [🗺️ Rutas](#-rutas) | Navegación SPA |
| [🌐 HTTP](#-http) | Comunicación API |

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

