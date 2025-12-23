-- ============================================
-- SCRIPT COMPLETO PARA INICIALIZAR LA BD DE PRODUCCIÓN
-- Gymunity - DigitalOcean
-- ============================================

-- ============================================
-- 1. CREAR TABLAS
-- ============================================

-- Tabla Usuario
CREATE TABLE IF NOT EXISTS usuario (
    id BIGSERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contrasenia VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('ALUMNO', 'PROFESOR', 'ADMIN')),
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    avatar VARCHAR(255),
    ciudad VARCHAR(255) NOT NULL,
    telefono_contacto VARCHAR(15)
);

-- Índices para Usuario
CREATE INDEX IF NOT EXISTS idx_usuario_ciudad ON usuario(ciudad);
CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuario(email);

-- Tabla Gimnasio
CREATE TABLE IF NOT EXISTS gimnasio (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(1000),
    foto VARCHAR(255),
    ciudad VARCHAR(255) NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(100)
);

-- Índices para Gimnasio
CREATE INDEX IF NOT EXISTS idx_gimnasio_ciudad ON gimnasio(ciudad);
CREATE INDEX IF NOT EXISTS idx_gimnasio_nombre ON gimnasio(nombre);

-- Tabla Clase
CREATE TABLE IF NOT EXISTS clase (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    profesor_id BIGINT REFERENCES usuario(id) ON DELETE SET NULL,
    gimnasio_id BIGINT NOT NULL REFERENCES gimnasio(id) ON DELETE CASCADE,
    icono VARCHAR(255)
);

-- Tabla Interaccion
CREATE TABLE IF NOT EXISTS interaccion (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    gimnasio_id BIGINT NOT NULL REFERENCES gimnasio(id) ON DELETE CASCADE,
    es_apuntado BOOLEAN NOT NULL DEFAULT FALSE,
    resenia VARCHAR(1000),
    valoracion INTEGER CHECK (valoracion >= 1 AND valoracion <= 5),
    fecha_interaccion DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Índices para Interaccion
CREATE INDEX IF NOT EXISTS idx_interaccion_usuario ON interaccion(usuario_id);
CREATE INDEX IF NOT EXISTS idx_interaccion_gimnasio ON interaccion(gimnasio_id);

-- Tabla Alumno_Clase
CREATE TABLE IF NOT EXISTS alumno_clase (
    id BIGSERIAL PRIMARY KEY,
    alumno_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    clase_id BIGINT NOT NULL REFERENCES clase(id) ON DELETE CASCADE,
    fecha_inscripcion DATE NOT NULL DEFAULT CURRENT_DATE
);

-- ============================================
-- 2. INSERTAR DATOS DE EJEMPLO
-- ============================================

-- Usuarios (Profesores y Alumnos)
-- Contraseña para todos: "password123" (encriptada con BCrypt)
INSERT INTO usuario (nombre_usuario, email, contrasenia, rol, fecha_registro, ciudad) VALUES
('Carlos Martinez', 'carlos@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Cádiz'),
('Ana García', 'ana@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Sevilla'),
('Pedro López', 'pedro@email.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'ALUMNO', CURRENT_DATE, 'Cádiz'),
('María Ruiz', 'maria@email.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'ALUMNO', CURRENT_DATE, 'Jerez'),
('Juan Torres', 'juan@email.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'ALUMNO', CURRENT_DATE, 'Cádiz'),
('Laura Fernández', 'laura@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Madrid'),
('Diego Sánchez', 'diego@email.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'ALUMNO', CURRENT_DATE, 'Barcelona')
ON CONFLICT (email) DO NOTHING;

-- Gimnasios (6 gimnasios para tener al menos 3 populares y 3 recientes)
INSERT INTO gimnasio (nombre, descripcion, ciudad, foto) VALUES
('Fitness Park', 'Gimnasio especializado en artes marciales mixtas y boxeo', 'Cádiz', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop'),
('Basic Fit', 'Centro deportivo con enfoque en Full Contact y defensa personal', 'Sevilla', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop'),
('Enjoy!', 'Academia de boxeo y kickboxing para todos los niveles', 'Jerez', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop'),
('SynerGym', 'Especialistas en Judo y MMA con profesores titulados', 'Algeciras', 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&h=300&fit=crop'),
('Smart Fit', 'Gimnasio moderno con clases de MMA y Boxeo', 'Jerez', 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=400&h=300&fit=crop'),
('Iron Gym', 'Centro de alto rendimiento especializado en artes marciales', 'Madrid', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop'),
('Fight Club Barcelona', 'Academia de combate con instalaciones de primer nivel', 'Barcelona', 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop'),
('Warrior Gym', 'Especialistas en Muay Thai y Kickboxing', 'Valencia', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop')
ON CONFLICT DO NOTHING;

-- Clases
INSERT INTO clase (nombre, gimnasio_id, profesor_id, icono) VALUES
('Boxeo', 1, 1, '🥊'),
('Karate', 1, 1, '🥋'),
('MMA', 1, 2, '🤼'),
('Full Contact', 2, 2, '👊'),
('Defensa Personal', 2, 1, '🛡️'),
('Boxeo', 3, 1, '🥊'),
('Kickboxing', 3, 2, '🦵'),
('Judo', 4, 2, '🥋'),
('MMA', 4, 1, '🤼'),
('Boxeo', 5, 1, '🥊'),
('MMA', 5, 2, '🤼'),
('Crossfit', 6, 6, '💪'),
('Boxeo', 6, 1, '🥊'),
('Muay Thai', 7, 2, '🥊'),
('BJJ', 7, 6, '🥋'),
('Kickboxing', 8, 6, '🦵'),
('Muay Thai', 8, 2, '🥊');

-- Interacciones (usuarios apuntados a gimnasios con reseñas)
INSERT INTO interaccion (usuario_id, gimnasio_id, es_apuntado, resenia, fecha_interaccion) VALUES
(3, 1, true, 'Excelente gimnasio, los profesores son muy profesionales', CURRENT_DATE),
(4, 1, true, 'Muy buenas instalaciones y ambiente', CURRENT_DATE),
(5, 1, true, 'Gran lugar para entrenar boxeo', CURRENT_DATE),
(3, 2, true, 'Buen gimnasio para principiantes', CURRENT_DATE),
(4, 3, true, 'Me encanta el ambiente y las clases de kickboxing', CURRENT_DATE),
(5, 4, true, 'Profesores muy cualificados', CURRENT_DATE),
(7, 5, true, 'Instalaciones modernas y limpias', CURRENT_DATE),
(7, 6, true, 'Excelente para crossfit', CURRENT_DATE),
(3, 6, true, 'Muy buen ambiente de entrenamiento', CURRENT_DATE),
(4, 7, true, 'El mejor gimnasio de Barcelona', CURRENT_DATE),
(5, 7, true, NULL, CURRENT_DATE),
(7, 8, true, 'Especialistas en Muay Thai', CURRENT_DATE);

-- Inscripciones de alumnos en clases
INSERT INTO alumno_clase (alumno_id, clase_id, fecha_inscripcion) VALUES
(3, 1, CURRENT_DATE),
(3, 2, CURRENT_DATE),
(4, 1, CURRENT_DATE),
(4, 6, CURRENT_DATE),
(5, 8, CURRENT_DATE),
(7, 12, CURRENT_DATE),
(7, 14, CURRENT_DATE),
(3, 13, CURRENT_DATE),
(4, 15, CURRENT_DATE),
(5, 16, CURRENT_DATE);

-- ============================================
-- 3. VERIFICACIÓN
-- ============================================

-- Verificar que se insertaron los datos
SELECT 'TABLAS CREADAS EXITOSAMENTE' AS mensaje;
SELECT COUNT(*) AS total_usuarios FROM usuario;
SELECT COUNT(*) AS total_gimnasios FROM gimnasio;
SELECT COUNT(*) AS total_clases FROM clase;
SELECT COUNT(*) AS total_interacciones FROM interaccion;
SELECT COUNT(*) AS total_inscripciones FROM alumno_clase;

-- Ver los gimnasios insertados
SELECT id, nombre, ciudad FROM gimnasio ORDER BY id;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- CONTRASEÑA DE TODOS LOS USUARIOS: password123
-- ============================================
