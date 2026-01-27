-- ============================================
-- DATOS INICIALES - GYMUNITY
-- ============================================
-- Este script se ejecuta automáticamente con SQL_INIT_MODE=always
-- o manualmente en DigitalOcean con: psql "host=... sslmode=require" -f data.sql

-- Forzar codificación UTF-8 para tildes
SET client_encoding = 'UTF8';

-- ============================================
-- LIMPIAR DATOS PREVIOS (para sincronizar IDs)
-- ============================================
-- Eliminar interacciones primero (depende de gimnasio y usuario)
DELETE FROM interaccion WHERE id IS NOT NULL;
-- Eliminar alumno_clase (depende de clase y usuario)
DELETE FROM alumno_clase WHERE id IS NOT NULL;
-- Eliminar clases (depende de gimnasio y profesor)
DELETE FROM clase WHERE id > 0;
-- Eliminar gimnasios
DELETE FROM gimnasio WHERE id > 0;
-- Eliminar profesores
DELETE FROM usuario WHERE rol = 'PROFESOR';

-- Reiniciar secuencias para que los IDs empiecen desde 1
ALTER SEQUENCE IF EXISTS usuario_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS gimnasio_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS clase_id_seq RESTART WITH 1;

-- ============================================
-- PROFESORES (IDs 1-6)
-- ============================================
-- Password: password123 (BCrypt)

INSERT INTO usuario (id, nombre_usuario, email, contrasenia, rol, fecha_registro, ciudad, avatar) VALUES
(1, 'Carlos Martín', 'carlos@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Cádiz', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop&crop=face'),
(2, 'Javier Roldán', 'javier@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Sevilla', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'),
(3, 'Antonio Martínez', 'antonio@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Jerez de la Frontera', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'),
(4, 'Laura Fernández', 'laura@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Madrid', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'),
(5, 'Miguel Ángel Torres', 'miguel@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Barcelona', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face'),
(6, 'Ana García', 'ana@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Valencia', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face')
ON CONFLICT (id) DO UPDATE SET
  nombre_usuario = EXCLUDED.nombre_usuario,
  email = EXCLUDED.email,
  contrasenia = EXCLUDED.contrasenia,
  rol = EXCLUDED.rol,
  ciudad = EXCLUDED.ciudad,
  avatar = EXCLUDED.avatar;

-- Actualizar secuencia de usuarios para que nuevos usuarios empiecen desde 7
SELECT setval('usuario_id_seq', 6, true);

-- ============================================
-- GIMNASIOS
-- ============================================

INSERT INTO gimnasio (id, nombre, descripcion, ciudad, foto, fotos_galeria, descripciones_galeria, torneos_info) VALUES
(1, 'Fitness Park', 'Centro deportivo de élite equipado con tecnología Technogym y ELEIKO. Amplia zona de peso libre, cardio de última generación y espacios dedicados para artes marciales. Contamos con ring profesional y zona de sparring.', 'Cádiz', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=600&fit=crop', 'Sala de máquinas principal,Entrenamiento de dominadas,Clase de boxeo,Interior moderno,Zona de sacos', 'Campeonato de Karate|2026-03-15|Karate;Open de Muay Thai|2026-04-20|Muay Thai'),
(2, 'Basic Fit', 'Gimnasio especializado en deportes de contacto y defensa personal. Instalaciones modernas con tatami olímpico, sacos de boxeo profesionales y equipo de protección de alta calidad para entrenamientos seguros.', 'Sevilla', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&h=600&fit=crop', 'Sala principal amplia,Entrenamiento funcional,Zona de cardio,Práctica con saco', 'Copa Full Contact Sevilla|2026-02-28|Full Contact;Torneo de Defensa Personal|2026-05-10|Defensa Personal'),
(3, 'Smart Fit', 'Centro de MMA y deportes de combate con jaula profesional homologada. Entrenadores certificados internacionalmente y programas adaptados desde principiantes hasta competidores profesionales.', 'Jerez de la Frontera', 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&h=600&fit=crop', 'Entrenamiento de boxeo,Rack de mancuernas,Rutina de fuerza,Combate MMA,Sesión de sparring', 'Campeonato MMA Jerez|2026-03-22|MMA;Open de Kickboxing|2026-06-15|Kickboxing'),
(4, 'Iron Gym', 'Gimnasio de alto rendimiento para atletas exigentes. Zona de halterofilia olímpica, CrossFit box certificado y área de combate. Preparación física integral para competiciones nacionales e internacionales.', 'Madrid', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1596357395217-80de13130e92?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1534368959876-26bf04f2c947?w=800&h=600&fit=crop', 'Levantamiento de peso,Ejercicio con barra,Zona de kettlebells,Box de CrossFit', 'Madrid Open CrossFit|2026-04-05|Crossfit;Campeonato de Boxeo Madrid|2026-07-20|Boxeo'),
(5, 'Fight Club Barcelona', 'Academia de combate con más de 15 años de experiencia formando campeones. Especialistas en Muay Thai, BJJ y Wrestling con metodología tailandesa y brasileña auténtica.', 'Barcelona', 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop', 'Entrenamiento intensivo,Sacos de boxeo,Golpeo al saco,Práctica de MMA,Zona de recuperación', 'Barcelona Open Muay Thai|2026-03-10|Muay Thai;Campeonato BJJ Cataluña|2026-05-25|BJJ'),
(6, 'Warrior Gym', 'Centro familiar de artes marciales donde conviven todas las edades y niveles. Ambiente acogedor con instalaciones profesionales. Programas específicos para niños, adultos y competidores.', 'Valencia', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=800&h=600&fit=crop', 'Área de cardio,Sala de entrenamiento,Ejercicio de dominadas,Clase grupal', 'Torneo Kickboxing Valencia|2026-04-12|Kickboxing;Open Muay Thai Comunidad|2026-06-08|Muay Thai'),
(7, 'SynerGym', 'Complejo deportivo integral con ring de boxeo, jaula de MMA y tatami de 200m². Vestuarios premium con sauna y zona de recuperación. El gimnasio más completo del Campo de Gibraltar.', 'Algeciras', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1534368959876-26bf04f2c947?w=800&h=600&fit=crop', 'Zona de cardio,Sala de máquinas,Sacos en línea,Entrenamiento de boxeo,Área CrossFit', 'Copa MMA Gibraltar|2026-05-15|MMA;Campeonato de Judo Sur|2026-07-10|Judo'),
(8, 'GO! Fitness', 'Academia tradicional de artes marciales japonesas fundada en 1998. Formamos campeones regionales y nacionales en Judo y Karate. Dojo auténtico con valores de disciplina y respeto.', 'Jerez de la Frontera', 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=800&h=600&fit=crop', 'Cardio en cinta,Entrenamiento funcional,Práctica de boxeo,Instalaciones modernas', 'Campeonato Judo Andalucía|2026-03-28|Judo;Torneo Karate Jerez|2026-05-18|Karate'),
(9, 'Enjoy!', 'Gimnasio boutique con grupos reducidos de máximo 8 personas. Atención 100% personalizada en boxeo y fitness funcional. Ideal para quienes buscan resultados rápidos con seguimiento individual.', 'Cádiz', 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop', 'Entrenamiento con barra,Rack de pesas,Rutina de fuerza,Sesión de boxeo,Batidos proteicos', 'Torneo Boxeo Amateur Cádiz|2026-04-25|Boxeo'),
(10, 'CrossFit Bahía', 'Box oficial de CrossFit con coaches certificados Level 2. Comunidad activa con más de 200 miembros. Competiciones internas mensuales y preparación para Opens y Sanctionals.', 'Cádiz', 'https://images.unsplash.com/photo-1534368959876-26bf04f2c947?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1534368959876-26bf04f2c947?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1520334363269-e3f3b3d5b14a?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop', 'Box de entrenamiento,Anillas de gimnasia,Battle ropes,Levantamiento olímpico', 'CrossFit Open Bahía|2026-02-15|Crossfit;Throwdown Cádiz|2026-06-20|Crossfit'),
(11, 'Dojo Central', 'Escuela tradicional de artes marciales con linaje directo de maestros japoneses. Karate Shotokan, Judo Kodokan y Aikido Aikikai. Ambiente de respeto y desarrollo integral del practicante.', 'Sevilla', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&h=600&fit=crop', 'Sala de entrenamiento,Zona de cardio,Sacos de boxeo,Práctica de MMA,Sesión de sparring', 'Campeonato Karate Sevilla|2026-03-05|Karate;Open Judo Andalucía|2026-05-30|Judo;Copa Aikido|2026-08-15|Aikido'),
(12, 'Power House Gym', 'Templo del culturismo y la fuerza. Equipamiento Hammer Strength, plataformas de powerlifting y zona de strongman. Donde entrenan los atletas más fuertes de la capital.', 'Madrid', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1596357395217-80de13130e92?w=800&h=600&fit=crop', 'Ejercicio de dominadas,Entrenamiento funcional,Mancuernas ordenadas,Zona de kettlebells', 'Campeonato Powerlifting Madrid|2026-04-18|Powerlifting'),
(13, 'Thai Boxing Academy', 'La única academia en España con maestros tailandeses residentes. Metodología auténtica de los campos de Muay Thai de Bangkok. Organizamos viajes de entrenamiento a Tailandia.', 'Barcelona', 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop', 'Sacos de Muay Thai,Golpeo al saco,Combate en ring,Zona de recuperación', 'Barcelona Muay Thai Championship|2026-03-20|Muay Thai;Spain Muay Thai Open|2026-07-05|Muay Thai'),
(14, 'FitBox Valencia', 'Centro de boxeo recreativo y fitness. Clases de cardio boxing, técnica de boxeo y preparación física. Ambiente motivador sin contacto, perfecto para ponerse en forma divirtiéndose.', 'Valencia', 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=800&h=600&fit=crop', 'Entrenamiento con saco,Sacos en fila,Zona de cardio,Sala amplia,Interior moderno', 'Torneo Boxeo Amateur Valencia|2026-04-08|Boxeo;Copa Cardio Boxing|2026-06-12|Cardio Boxing'),
(15, 'MMA Factory', 'Fábrica de luchadores profesionales. Equipo técnico con experiencia en UFC, Bellator y ONE Championship. Programa de desarrollo desde amateur hasta profesional con gestión de carreras.', 'Jerez de la Frontera', 'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&h=600&fit=crop', 'Combate en jaula,Zona de sacos,Práctica de striking,Área de descanso,Sesión de sparring', 'Jerez MMA Pro|2026-03-30|MMA;Grappling Championship|2026-05-22|Grappling;Striking Wars|2026-08-10|Striking'),
(16, 'Elite Training Center', 'Centro de entrenamiento para deportistas de élite y ejecutivos exigentes. Instalaciones exclusivas con aforo limitado. Programas de rendimiento, recuperación y nutrición personalizados.', 'Madrid', 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1596357395217-80de13130e92?w=800&h=600&fit=crop', 'Rutina de fuerza,Ejercicio con barra,Dominadas asistidas,Kettlebells premium', 'Elite MMA Championship|2026-04-15|MMA;Madrid Fight Night|2026-06-25|Boxeo;CrossFit Elite|2026-09-05|Crossfit')
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  ciudad = EXCLUDED.ciudad,
  foto = EXCLUDED.foto,
  fotos_galeria = EXCLUDED.fotos_galeria,
  descripciones_galeria = EXCLUDED.descripciones_galeria,
  torneos_info = EXCLUDED.torneos_info;

-- Actualizar secuencia de gimnasios
SELECT setval('gimnasio_id_seq', 16, true);

-- ============================================
-- CLASES
-- ============================================

INSERT INTO clase (id, nombre, gimnasio_id, profesor_id, icono, dias_semana, hora_inicio, hora_fin) VALUES
-- Fitness Park (1)
(1, 'Karate', 1, 1, 'martial-arts', 'Lunes, Miércoles', '18:00', '19:30'),
(2, 'Muay Thai', 1, 2, 'boxing-glove', 'Martes, Jueves', '19:00', '20:30'),
(3, 'Jiu-Jitsu', 1, 3, 'wrestling', 'Viernes', '17:00', '18:30'),
-- Basic Fit (2)
(4, 'Full Contact', 2, 2, 'fist', 'Lunes, Miércoles, Viernes', '20:00', '21:30'),
(5, 'Defensa Personal', 2, 1, 'shield', 'Sábado', '10:00', '12:00'),
(6, 'Boxeo', 2, 3, 'boxing-glove', 'Martes, Jueves', '18:00', '19:30'),
-- Smart Fit (3)
(7, 'MMA', 3, 1, 'wrestling', 'Lunes, Miércoles', '19:00', '20:30'),
(8, 'Boxeo', 3, 2, 'boxing-glove', 'Martes, Jueves', '20:00', '21:00'),
(9, 'Kickboxing', 3, 3, 'kick', 'Viernes', '18:00', '19:30'),
-- Iron Gym (4)
(10, 'Crossfit', 4, 4, 'dumbbell', 'Lunes a Viernes', '07:00', '08:00'),
(11, 'Boxeo', 4, 1, 'boxing-glove', 'Martes, Jueves', '19:00', '20:30'),
(12, 'MMA', 4, 2, 'wrestling', 'Sábado', '11:00', '13:00'),
-- Fight Club Barcelona (5)
(13, 'Muay Thai', 5, 2, 'boxing-glove', 'Lunes, Miércoles', '20:00', '21:30'),
(14, 'BJJ', 5, 4, 'martial-arts', 'Martes, Jueves', '19:00', '20:30'),
(15, 'Wrestling', 5, 3, 'wrestling', 'Viernes', '18:00', '20:00'),
-- Warrior Gym (6)
(16, 'Kickboxing', 6, 4, 'kick', 'Lunes, Miércoles', '18:00', '19:30'),
(17, 'Muay Thai', 6, 2, 'boxing-glove', 'Martes, Jueves', '19:00', '20:30'),
(18, 'Boxeo', 6, 1, 'boxing-glove', 'Sábado', '10:00', '12:00'),
-- SynerGym (7)
(19, 'MMA', 7, 5, 'wrestling', 'Lunes, Miércoles, Viernes', '19:00', '21:00'),
(20, 'Judo', 7, 3, 'martial-arts', 'Martes, Jueves', '18:00', '19:30'),
-- GO! Fitness (8)
(21, 'Judo', 8, 3, 'martial-arts', 'Lunes, Miércoles', '17:00', '18:30'),
(22, 'Karate', 8, 1, 'martial-arts', 'Martes, Jueves', '18:00', '19:30'),
-- Enjoy! (9)
(23, 'Boxeo', 9, 2, 'boxing-glove', 'Lunes a Viernes', '19:00', '20:30'),
-- CrossFit Bahía (10)
(24, 'Crossfit', 10, 4, 'dumbbell', 'Lunes a Sábado', '07:00', '20:00'),
-- Dojo Central (11)
(25, 'Karate', 11, 1, 'martial-arts', 'Lunes, Miércoles', '18:00', '19:30'),
(26, 'Judo', 11, 3, 'martial-arts', 'Martes, Jueves', '19:00', '20:30'),
(27, 'Aikido', 11, 6, 'martial-arts', 'Viernes', '17:00', '19:00'),
-- Power House Gym (12)
(28, 'Powerlifting', 12, 4, 'barbell', 'Lunes, Miércoles, Viernes', '18:00', '20:00'),
-- Thai Boxing Academy (13)
(29, 'Muay Thai', 13, 5, 'boxing-glove', 'Lunes a Viernes', '18:00', '21:00'),
-- FitBox Valencia (14)
(30, 'Boxeo', 14, 6, 'boxing-glove', 'Martes, Jueves', '19:00', '20:30'),
(31, 'Cardio Boxing', 14, 6, 'boxing-glove', 'Lunes, Miércoles', '18:00', '19:00'),
-- MMA Factory (15)
(32, 'MMA', 15, 5, 'wrestling', 'Lunes, Miércoles, Viernes', '19:00', '21:00'),
(33, 'Striking', 15, 2, 'fist', 'Martes, Jueves', '20:00', '21:30'),
(34, 'Grappling', 15, 3, 'wrestling', 'Sábado', '10:00', '12:00'),
-- Elite Training Center (16)
(35, 'MMA', 16, 5, 'wrestling', 'Lunes a Viernes', '18:00', '20:00'),
(36, 'Boxeo', 16, 1, 'boxing-glove', 'Martes, Jueves', '20:00', '21:30'),
(37, 'Crossfit', 16, 4, 'dumbbell', 'Lunes, Miércoles, Viernes', '07:00', '08:00')
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  gimnasio_id = EXCLUDED.gimnasio_id,
  profesor_id = EXCLUDED.profesor_id,
  icono = EXCLUDED.icono,
  dias_semana = EXCLUDED.dias_semana,
  hora_inicio = EXCLUDED.hora_inicio,
  hora_fin = EXCLUDED.hora_fin;

-- Actualizar secuencia de clases
SELECT setval('clase_id_seq', 37, true);
