# Gymunity

**Una plataforma para que los atletas encuentren su gimnasio perfecto y se conecten con la comunidad del deporte.**

Gymunity es más que una simple app de búsqueda: te permite explorar gimnasios de artes marciales, leer reseñas reales de otros alumnos, descubrir torneos y conocer a los profesores antes de apuntarte. Todo diseñado para ser accesible desde cualquier dispositivo y para cualquier persona, incluyendo usuarios con discapacidad.

**[Ver la web en producción](https://clownfish-app-puttm.ondigitalocean.app/)**

---

## Índice

1. [Componente multimedia](#componente-multimedia-añadido)
2. [Resultados de auditoría de accesibilidad](#resultados-de-auditoría-de-accesibilidad)
3. [Inicio rápido](#inicio-rápido)
4. [Stack tecnológico](#stack-tecnológico)
5. [Arquitectura](#arquitectura)
6. [Documentación](#documentación)
7. [Desarrollo](#desarrollo)

---

## Componente multimedia añadido

**Tipo:** Galería de imágenes interactiva

**Descripción:** Cada gimnasio tiene su propia galería fotográfica que muestra las instalaciones (ring, sacos, zona de cardio, etc.) con navegación por miniaturas y texto alternativo descriptivo para accesibilidad.

**Características:**
- Navegación con teclado (Tab + Enter)
- Texto alternativo detallado en cada imagen
- Transiciones suaves y responsive
- Compatible con lectores de pantalla (NVDA, JAWS)

---

## Resultados de auditoría de accesibilidad

Gymunity ha sido auditado y corregido para cumplir con las WCAG 2.1 nivel AA, el estándar exigido por la normativa española y europea.

| Herramienta | Puntuación inicial | Puntuación final | Mejora |
|-------------|-------------------|------------------|--------|
| Lighthouse | 91/100 | 100/100 | +9 puntos |
| WAVE | 2 errores | 0 errores | -2 errores |
| TAW | 11 problemas | 0 problemas | -11 problemas |

**Nivel de conformidad alcanzado:** WCAG 2.1 Nivel AA

### Verificación realizada
- ✅ Auditoría con Lighthouse, WAVE y TAW
- ✅ Test con lector de pantalla (NVDA en Chrome, Firefox y Edge)
- ✅ Test de navegación por teclado completo
- ✅ Verificación cross-browser (Chrome, Firefox, Edge)

**[Ver análisis completo de accesibilidad →](./docs/accesibilidad/README.md)**

---

## Inicio rápido

**Requisitos:** Docker y Docker Compose instalados en tu máquina.

```bash
# Clonar el repositorio
git clone <repository-url>
cd gymunity

# Levantar todos los servicios (frontend, backend y base de datos)
docker compose up -d --build

# Abrir en el navegador
open http://localhost
```

La primera construcción tarda unos 2-3 minutos mientras descarga las imágenes y compila todo. Las siguientes veces son casi instantáneas gracias al sistema de caché de Docker.

---

## Stack tecnológico

### Frontend
- **Angular 19** con Signals para reactividad y SSR (Server-Side Rendering) para mejor SEO
- **TypeScript** con configuración estricta para evitar bugs
- **SCSS** con arquitectura modular (ITCSS + BEM) para estilos escalables
- **Lucide Icons** para iconografía consistente
- **HTML5 semántico** con landmarks y ARIA para accesibilidad

### Backend
- **Spring Boot 3.x** con Java 21
- **PostgreSQL 16** como base de datos relacional
- **Swagger/OpenAPI** para documentación automática de la API
- **Spring Security** para proteger los endpoints

### Infraestructura y DevOps
- **Docker multi-stage builds** para imágenes optimizadas
- **Alpine Linux** (imágenes base ligeras de ~50MB)
- **Docker Compose** para orquestar los 3 servicios
- **DigitalOcean App Platform** para despliegue continuo

---

## Arquitectura

La app está dividida en tres servicios que se comunican entre sí:

```
frontend/          # Angular app con SSR
├── src/app/
│   ├── componentes/   # Componentes reutilizables (botones, cards, modals)
│   ├── paginas/       # Vistas principales (home, gimnasio, perfil)
│   ├── servicios/     # Lógica de negocio y llamadas a la API
│   └── modelos/       # Interfaces TypeScript (Gimnasio, Usuario, Clase)
└── src/styles/        # Sistema de diseño modular con SCSS

backend/           # Spring Boot REST API
├── src/main/java/
│   └── com/gymunity/
│       ├── config/    # Configuración de seguridad y JWT
│       ├── modelos/   # Entidades JPA (mapean a tablas de BD)
│       ├── repos/     # Repositories para acceso a datos
│       └── servicios/ # Lógica de negocio del backend
└── resources/
    └── data.sql       # Datos iniciales (gimnasios de prueba)
```

**Flujo de una petición:**
1. El usuario hace clic en un botón del frontend
2. Angular hace una petición HTTP al backend
3. Spring Boot valida el JWT y procesa la petición
4. PostgreSQL devuelve los datos
5. El backend formatea la respuesta JSON
6. Angular actualiza la vista con los datos

---

## Documentación

### Para desarrolladores
- [**Documentación de accesibilidad**](docs/accesibilidad/README.md) → Análisis WCAG 2.1, correcciones aplicadas, tests con lector de pantalla
- [**Documentación de diseño**](docs/design/DOCUMENTACION.md) → Sistema de diseño, guías visuales, tokens de color
- [**Documentación del cliente**](docs/cliente/README.md) → Estructura del frontend, componentes, rutas

### Comandos útiles para Docker

```bash
# Ver logs de todos los servicios en tiempo real
docker compose logs -f

# Ver logs solo del backend
docker compose logs -f backend

# Reiniciar un servicio específico sin parar los demás
docker compose restart backend

# Limpiar todo (contenedores, volúmenes y redes)
docker compose down -v

# Rebuild completo sin usar caché (si algo va mal)
docker compose build --no-cache
```

---

## Desarrollo local

Si quieres desarrollar sin Docker (más rápido para ver cambios en caliente):

### Frontend en local

```bash
cd frontend
npm install
npm start
```

El frontend arranca en `http://localhost:4200` y se conecta automáticamente al backend que esté corriendo en Docker.

### Backend en local

Para correr el backend fuera de Docker necesitas tener instalado:
- **Java 21** (JDK de Eclipse Temurin recomendado)
- **PostgreSQL** corriendo (puedes usar solo el contenedor de BD de Docker)

```bash
# Levantar solo la base de datos
docker compose up db -d

cd backend
./mvnw spring-boot:run
```

El backend arranca en `http://localhost:8080` y la documentación de la API estará en `http://localhost:8080/swagger-ui.html`

---

## Autor

**Nombre:** Manuel Arana 
**Curso:** 2º DAW - Desarrollo de Aplicaciones Web  
**Módulo:** Diseño de Interfaces Web (DIW)  
**Año académico:** 2025-2026

---
