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
He creado un componentes llamado tarjeta-consejo, el cual lo que almacena es su titulo, junto su descripción e icono, y el tema de que trata. En el caso de que en la base de datos no se encuentre ningún consejo, por defecto aparecerá un mensaje diciendolo

