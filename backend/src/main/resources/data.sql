-- Datos de prueba para Gymunity

-- Usuarios (Profesores y Alumnos)
-- Contraseña para todos: "password123" (encriptada con BCrypt)
INSERT INTO usuario (nombre_usuario, email, contrasenia, rol, fecha_registro, ciudad) VALUES
('Carlos Martinez', 'carlos@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Cádiz'),
('Ana García', 'ana@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Sevilla'),
('Pedro López', 'pedro@email.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'ALUMNO', CURRENT_DATE, 'Cádiz'),
('María Ruiz', 'maria@email.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'ALUMNO', CURRENT_DATE, 'Jerez'),
('Juan Torres', 'juan@email.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'ALUMNO', CURRENT_DATE, 'Cádiz');

-- Gimnasios
INSERT INTO gimnasio (nombre, descripcion, ciudad, foto) VALUES
('Fitness Park', 'Gimnasio especializado en artes marciales mixtas y boxeo', 'Cádiz', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop'),
('Basic Fit', 'Centro deportivo con enfoque en Full Contact y defensa personal', 'Sevilla', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop'),
('Enjoy!', 'Academia de boxeo y kickboxing para todos los niveles', 'Jerez', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop'),
('SynerGym', 'Especialistas en Judo y MMA con profesores titulados', 'Algeciras', 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&h=300&fit=crop'),
('Smart Fit', 'Gimnasio moderno con clases de MMA y Boxeo', 'Jerez', 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=400&h=300&fit=crop');

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
('MMA', 5, 2, '🤼');

-- Interacciones (usuarios apuntados a gimnasios con reseñas)
INSERT INTO interaccion (usuario_id, gimnasio_id, es_apuntado, resenia, fecha_interaccion) VALUES
(3, 1, true, 'Excelente gimnasio, los profesores son muy profesionales', CURRENT_DATE),
(4, 1, true, 'Muy buenas instalaciones y ambiente', CURRENT_DATE),
(5, 1, true, NULL, CURRENT_DATE),
(3, 2, true, 'Buen gimnasio para principiantes', CURRENT_DATE),
(4, 3, true, 'Me encanta el ambiente y las clases de kickboxing', CURRENT_DATE),
(5, 4, true, NULL, CURRENT_DATE);

-- Inscripciones de alumnos en clases
INSERT INTO alumno_clase (alumno_id, clase_id, fecha_inscripcion) VALUES
(3, 1, CURRENT_DATE),
(3, 2, CURRENT_DATE),
(4, 1, CURRENT_DATE),
(4, 6, CURRENT_DATE),
(5, 8, CURRENT_DATE);
