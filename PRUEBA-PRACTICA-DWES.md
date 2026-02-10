# Prueba Practica DWES - Consejos Fitness

## Endpoint creado

He creado el endpoint `GET /api/consejos` en un nuevo controlador `ConsejoController.java`. Este endpoint devuelve la lista de consejos fitness guardados en base de datos.

Lo he creado porque en el frontend ya tenia la pagina de consejos montada con su servicio y su componente, pero faltaba el controlador en el backend que sirviera los datos. Existian la entidad, el DTO, el repositorio y el servicio, pero no habia ningun `@RestController` que expusiera la ruta `/api/consejos`.

## Seguridad

En el `SecurityConfig.java` he configurado el endpoint para que requiera autenticacion:

```java
.requestMatchers(HttpMethod.GET, "/api/consejos/**").authenticated()
```

Esto significa que solo los usuarios logueados pueden ver los consejos. Si no tienes token, el backend devuelve un 401.

Tambien tuve que corregir el `JwtAuthenticationFilter` porque cuando un usuario tenia un token antiguo de una sesion anterior (y la base de datos se habia recreado), el filtro lanzaba una excepcion al intentar buscar ese usuario. Eso provocaba un 403 incluso en otros endpoints. Lo solucione envolviendo esa parte en un try-catch para que si falla simplemente continue sin autenticar.

## Como probarlo

### Opción 1: Con curl
Con la aplicacion levantada con Docker:

```bash
# Ver todos los consejos
curl http://localhost/api/consejos

# Filtrar por categoria
curl http://localhost/api/consejos?categoria=nutricion
```

### Opcion 2: Con Swagger

http://localhost:8080/swagger-ui/index.html

