## 1. Routing y Navegación

### Nueva ruta creada
```bash
{
    path: 'consejos',
    loadComponent: () => import('./paginas/consejos/consejos').then((m) => m.Consejos),
    data: { breadcrumb: 'Consejos', titulo: 'Consejos Fitness' },
},
```
### Integración

He implementado el acceso a esta nueva ruta a través del desplegable del usuario cuando esta iniciado la sesión, es decir, paa ver estos consejos DEBES de tener un usuario registrado.

### Lazy Loading

Al usar loadComponent, hacemos que esta nueva ruta se convierta en lazy loading. Con esto, se permite que la carga de la página sea mas rápida ya que la consrucción de la página va dividida por paquetes de producción en trozos más pequeños

## 2. Arquitectura de Componentes

### Componente Padre (Consejos)
Es el componente contenedor. Inyecta el servicio y en el `ngOnInit` llama trae los datos del backend. En la vista controla el flujo: si no hay consejos muestra un mensaje, y si los hay los recorre con `@for` y renderiza un hijo por cada uno.

### Componente Hijo (TarjetaConsejo)
Es un componente standalone que recibe los datos del padre mediante `input()` signals (titulo, descripcion, categoria, icono). Solo se encarga de pintar la tarjeta, no tiene logica de negocio.

### Tipado
Los datos estan tipados con la interfaz `Consejo` definida en `app/modelos/index.ts`. No se usa any en ningun sitio.

## 3. Instrucciones de ejecucion

```bash
docker compose up -d --build
```

Entrar en http://localhost, iniciar sesion y pulsar en "Consejos" en el menu de usuario.

### Documentacion:
[Pagina oficial de Angular](https://angular.dev)