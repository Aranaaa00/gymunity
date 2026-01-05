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
INSERT INTO usuario (nombre_usuario, email, contrasenia, rol, fecha_registro, ciudad, avatar) VALUES
-- Profesores
('Carlos Martín', 'carlos@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Cádiz', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop&crop=face'),
('Javier Roldán', 'javier@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Sevilla', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'),
('Antonio Martínez', 'antonio@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Jerez de la Frontera', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'),
('Laura Fernández', 'laura@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Madrid', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'),
('Miguel Ángel Torres', 'miguel@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Barcelona', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face'),
('Ana García', 'ana@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Valencia', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face'),
-- Alumnos
('Silvia', 'silvia@email.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'ALUMNO', CURRENT_DATE, 'Cádiz', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'),
('Marcos', 'marcos@email.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'ALUMNO', CURRENT_DATE, 'Jerez de la Frontera', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'),
('Carla', 'carla@email.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'ALUMNO', CURRENT_DATE, 'Cádiz', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'),
('Diego Sánchez', 'diego@email.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'ALUMNO', CURRENT_DATE, 'Barcelona', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face'),
('Elena García', 'elena@email.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'ALUMNO', CURRENT_DATE, 'Madrid', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'),
('Arana_00', 'arana@email.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'ALUMNO', CURRENT_DATE, 'Jerez de la Frontera', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face')
ON CONFLICT (email) DO NOTHING;

-- Gimnasios (16 gimnasios para tener resultados completos)
INSERT INTO gimnasio (nombre, descripcion, ciudad, foto) VALUES
('Fitness Park', 'Para ayudarte a que te superes en cada sesión, nuestros clubs están equipados con material de calidad de última generación. Seleccionamos cuidadosamente a nuestros proveedores de equipamiento para que puedas entrenar como un verdadero atleta de élite con lo último de Technogym Pure Strength o ELEIKO.', 'Cádiz', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop'),
('Basic Fit', 'Centro deportivo con enfoque en Full Contact y defensa personal. Contamos con las mejores instalaciones y profesores certificados para tu entrenamiento.', 'Sevilla', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop'),
('Smart Fit', 'Gimnasio moderno con clases de MMA y Boxeo. Tecnología de última generación y entrenadores profesionales a tu disposición.', 'Jerez de la Frontera', 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&h=600&fit=crop'),
('Iron Gym', 'Centro de alto rendimiento especializado en artes marciales. Preparación física integral y competitiva.', 'Madrid', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop'),
('Fight Club Barcelona', 'Academia de combate con instalaciones de primer nivel. Especializados en técnicas de competición.', 'Barcelona', 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&h=600&fit=crop'),
('Warrior Gym', 'Especialistas en Muay Thai y Kickboxing. Ambiente familiar y profesional para todos los niveles.', 'Valencia', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop'),
('SynerGym', 'Gimnasio especializado en artes marciales mixtas y deportes de combate. Instalaciones de última generación con ring profesional y jaula de MMA.', 'Algeciras', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop'),
('GO! Fitness', 'Centro deportivo multidisciplinar con énfasis en Judo y Karate. Preparamos campeones desde 1998.', 'Jerez de la Frontera', 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop'),
('Enjoy!', 'Gimnasio boutique especializado en Boxeo y fitness funcional. Clases reducidas para máxima atención personalizada.', 'Cádiz', 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=600&fit=crop'),
('CrossFit Bahía', 'Box oficial de CrossFit con las mejores instalaciones de la bahía. Entrenamientos funcionales de alta intensidad.', 'Cádiz', 'https://images.unsplash.com/photo-1534368959876-26bf04f2c947?w=800&h=600&fit=crop'),
('Dojo Central', 'Academia tradicional de artes marciales japonesas. Karate, Judo y Aikido en un ambiente de respeto y disciplina.', 'Sevilla', 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&h=600&fit=crop'),
('Power House Gym', 'Gimnasio de culturismo y powerlifting. Equipamiento profesional para entrenamientos de fuerza.', 'Madrid', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=600&fit=crop'),
('Thai Boxing Academy', 'Academia especializada en Muay Thai con profesores tailandeses. Entrenamientos auténticos y técnica tradicional.', 'Barcelona', 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=600&fit=crop'),
('FitBox Valencia', 'Centro de fitness y boxeo recreativo. Clases de cardio boxing y entrenamientos para todos los niveles.', 'Valencia', 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&h=600&fit=crop'),
('MMA Factory', 'Fábrica de campeones de MMA. Entrenamiento integral: striking, grappling y conditioning.', 'Jerez de la Frontera', 'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&h=600&fit=crop'),
('Elite Training Center', 'Centro de entrenamiento de élite para deportistas profesionales y amateurs exigentes.', 'Madrid', 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=800&h=600&fit=crop')
ON CONFLICT DO NOTHING;

-- Clases
INSERT INTO clase (nombre, gimnasio_id, profesor_id, icono) VALUES
-- Fitness Park (gimnasio 1)
('Karate', 1, 1, '🥋'),
('Muay Thai', 1, 2, '🥊'),
('Jiu-Jitsu', 1, 3, '🤼'),
-- Basic Fit (gimnasio 2)
('Full Contact', 2, 2, '👊'),
('Defensa Personal', 2, 1, '🛡️'),
('Boxeo', 2, 3, '🥊'),
-- Smart Fit (gimnasio 3)
('MMA', 3, 1, '🤼'),
('Boxeo', 3, 2, '🥊'),
('Kickboxing', 3, 3, '🦵'),
-- Iron Gym (gimnasio 4)
('Crossfit', 4, 4, '💪'),
('Boxeo', 4, 1, '🥊'),
('MMA', 4, 2, '🤼'),
-- Fight Club Barcelona (gimnasio 5)
('Muay Thai', 5, 2, '🥊'),
('BJJ', 5, 4, '🥋'),
('Wrestling', 5, 3, '🤼'),
-- Warrior Gym (gimnasio 6)
('Kickboxing', 6, 4, '🦵'),
('Muay Thai', 6, 2, '🥊'),
('Boxeo', 6, 1, '🥊'),
-- SynerGym (gimnasio 7)
('MMA', 7, 5, '🤼'),
('Judo', 7, 3, '🥋'),
-- GO! Fitness (gimnasio 8)
('Judo', 8, 3, '🥋'),
('Karate', 8, 1, '🥋'),
-- Enjoy! (gimnasio 9)
('Boxeo', 9, 2, '🥊'),
-- CrossFit Bahía (gimnasio 10)
('Crossfit', 10, 4, '💪'),
-- Dojo Central (gimnasio 11)
('Karate', 11, 1, '🥋'),
('Judo', 11, 3, '🥋'),
('Aikido', 11, 6, '🥋'),
-- Power House Gym (gimnasio 12)
('Powerlifting', 12, 4, '🏋️'),
-- Thai Boxing Academy (gimnasio 13)
('Muay Thai', 13, 5, '🥊'),
-- FitBox Valencia (gimnasio 14)
('Boxeo', 14, 6, '🥊'),
('Cardio Boxing', 14, 6, '🥊'),
-- MMA Factory (gimnasio 15)
('MMA', 15, 5, '🤼'),
('Striking', 15, 2, '👊'),
('Grappling', 15, 3, '🤼'),
-- Elite Training Center (gimnasio 16)
('MMA', 16, 5, '🤼'),
('Boxeo', 16, 1, '🥊'),
('Crossfit', 16, 4, '💪');

-- Interacciones (usuarios apuntados a gimnasios con reseñas)
INSERT INTO interaccion (usuario_id, gimnasio_id, es_apuntado, resenia, fecha_interaccion) VALUES
-- Fitness Park (gimnasio 1)
(7, 1, true, 'Brutales instalaciones y servicios. Mucha calidad, muy buen rollo!', CURRENT_DATE),
(8, 1, true, 'Un lugar especial donde entrenar. Profesionales cercanos.', CURRENT_DATE),
(9, 1, true, 'Es un gimnasio familiar con un equipo fantástico.', CURRENT_DATE),
(10, 1, true, NULL, CURRENT_DATE),
(11, 1, true, NULL, CURRENT_DATE),
-- Basic Fit (gimnasio 2)
(7, 2, true, 'Muy buen gimnasio para principiantes en artes marciales.', CURRENT_DATE),
(8, 2, true, 'Los profesores tienen mucha paciencia y experiencia.', CURRENT_DATE),
-- Smart Fit (gimnasio 3)
(9, 3, true, 'Instalaciones modernas y muy limpias. Recomendado!', CURRENT_DATE),
(10, 3, true, 'Las clases de MMA son intensas y muy profesionales.', CURRENT_DATE),
-- Iron Gym (gimnasio 4)
(11, 4, true, 'Excelente para crossfit y entrenamiento funcional.', CURRENT_DATE),
(7, 4, true, 'Muy buen ambiente de entrenamiento y compañerismo.', CURRENT_DATE),
-- Fight Club Barcelona (gimnasio 5)
(8, 5, true, 'El mejor gimnasio de Barcelona para artes marciales.', CURRENT_DATE),
(10, 5, true, NULL, CURRENT_DATE),
-- Warrior Gym (gimnasio 6)
(9, 6, true, 'Especialistas en Muay Thai, muy recomendable.', CURRENT_DATE),
(11, 6, true, 'Ambiente familiar y profesores muy atentos.', CURRENT_DATE),
-- SynerGym (gimnasio 7)
(12, 7, true, 'El mejor gimnasio de la zona para MMA.', CURRENT_DATE),
(7, 7, true, 'Profesores de primer nivel y buen ambiente.', CURRENT_DATE),
-- GO! Fitness (gimnasio 8)
(8, 8, true, 'Excelente para aprender Judo desde cero.', CURRENT_DATE),
(12, 8, true, 'Instalaciones muy completas y trato familiar.', CURRENT_DATE),
-- Enjoy! (gimnasio 9)
(9, 9, true, 'Clases de boxeo muy divertidas y efectivas.', CURRENT_DATE),
-- CrossFit Bahía (gimnasio 10)
(10, 10, true, 'WODs brutales y muy buen ambiente de comunidad.', CURRENT_DATE),
-- Dojo Central (gimnasio 11)
(11, 11, true, 'Tradicional y auténtico. El mejor dojo de Sevilla.', CURRENT_DATE),
-- Power House Gym (gimnasio 12)
(7, 12, true, 'Para amantes del powerlifting, el mejor equipamiento.', CURRENT_DATE),
-- Thai Boxing Academy (gimnasio 13)
(8, 13, true, 'Los profesores tailandeses son increíbles. Técnica pura.', CURRENT_DATE),
-- FitBox Valencia (gimnasio 14)
(9, 14, true, 'Perfecto para cardio boxing sin contacto.', CURRENT_DATE),
-- MMA Factory (gimnasio 15)
(12, 15, true, 'El mejor gimnasio de MMA de Jerez. Muy completo.', CURRENT_DATE),
(10, 15, true, 'Preparación de competición de primer nivel.', CURRENT_DATE),
-- Elite Training Center (gimnasio 16)
(11, 16, true, 'Centro de élite, sin duda. Profesionales top.', CURRENT_DATE);

-- Inscripciones de alumnos en clases
INSERT INTO alumno_clase (alumno_id, clase_id, fecha_inscripcion) VALUES
(7, 1, CURRENT_DATE),
(7, 2, CURRENT_DATE),
(8, 1, CURRENT_DATE),
(8, 3, CURRENT_DATE),
(9, 2, CURRENT_DATE),
(9, 3, CURRENT_DATE),
(7, 4, CURRENT_DATE),
(8, 5, CURRENT_DATE),
(9, 7, CURRENT_DATE),
(10, 8, CURRENT_DATE),
(11, 10, CURRENT_DATE),
(7, 11, CURRENT_DATE),
(8, 13, CURRENT_DATE),
(10, 14, CURRENT_DATE),
(9, 16, CURRENT_DATE),
(11, 17, CURRENT_DATE),
(12, 19, CURRENT_DATE),
(12, 21, CURRENT_DATE);

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
