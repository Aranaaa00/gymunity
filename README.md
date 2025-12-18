# Gymunity

**Plataforma para conectar atletas con su gimnasio ideal.**

---

## Índice

1. [Inicio rápido](#inicio-rápido)
2. [Stack tecnológico](#stack-tecnológico)
3. [Arquitectura](#arquitectura)
4. [Documentación](#documentación)
5. [Desarrollo](#desarrollo)

---

## Inicio rápido

Requisitos: Docker y Docker Compose instalados.

```bash
# Clonar el proyecto
git clone <repository-url>
cd gymunity

# Levantar todos los servicios
docker compose up -d --build

# Acceder a la aplicación
open http://localhost
```

La primera construcción tarda 2-3 minutos. Las siguientes son casi instantáneas gracias al cacheo de capas.

---

## Stack tecnológico

### Frontend
- Angular 18 con Signals y SSR
- TypeScript con configuración estricta
- SCSS con arquitectura modular
- Lucide Icons

### Backend
- Spring Boot 3.x
- Java 21
- PostgreSQL 16
- JWT Authentication

### Infraestructura
- Docker multi-stage builds
- Alpine Linux para imágenes ligeras
- Docker Compose para orquestación

---

## Arquitectura

```
frontend/          # Angular app con SSR
├── src/app/
│   ├── componentes/   # Componentes reutilizables
│   ├── paginas/       # Vistas/rutas
│   ├── servicios/     # Lógica de negocio
│   └── modelos/       # Interfaces TypeScript
└── src/styles/        # Sistema de diseño

backend/           # Spring Boot REST API
├── src/main/java/
│   └── com/gymunity/
│       ├── config/    # Configuración
│       ├── modelos/   # Entidades JPA
│       ├── repos/     # Repositories
│       └── servicios/ # Lógica de negocio
└── resources/
    └── data.sql       # Datos iniciales
```

---

## Documentación

### Para desarrolladores
- [**Documentación del cliente**](docs/cliente/README.md) → Estructura del frontend, componentes, rutas
- [**Documentación de diseño**](docs/design/DOCUMENTACION.md) → Sistema de diseño, guías visuales, tokens

### Comandos útiles

```bash
# Ver logs en tiempo real
docker compose logs -f

# Reiniciar un servicio específico
docker compose restart backend

# Limpiar todo (volúmenes incluidos)
docker compose down -v

# Rebuild sin caché
docker compose build --no-cache
```

---

## Desarrollo

### Frontend local

```bash
cd frontend
npm install
npm start
```

El frontend se conecta automáticamente al backend en Docker.

### Backend local

Para ejecutar el backend fuera de Docker, necesitas:
- Java 21 instalado
- PostgreSQL corriendo (puedes usar solo el servicio de BD de Docker)

```bash
# Solo levantar PostgreSQL
docker compose up db -d

cd backend
./mvnw spring-boot:run
```

---

**Proyecto académico** · Desarrollo de Aplicaciones Web · 2024-2025
