-- ============================================
-- DATOS INICIALES - GYMUNITY
-- ============================================
-- Codificación: UTF-8
-- Este script se ejecuta automáticamente con SQL_INIT_MODE=always

-- ============================================
-- PROFESORES
-- ============================================
-- Password: password123 (BCrypt)

INSERT INTO usuario (nombre_usuario, email, contrasenia, rol, fecha_registro, ciudad, avatar) VALUES
('Carlos Martín', 'carlos@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Cádiz', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop&crop=face'),
('Javier Roldán', 'javier@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Sevilla', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'),
('Antonio Martínez', 'antonio@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Jerez de la Frontera', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'),
('Laura Fernández', 'laura@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Madrid', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'),
('Miguel Ángel Torres', 'miguel@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Barcelona', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face'),
('Ana García', 'ana@gym.com', '$2a$10$b07PRgcoB1hG8q93mzozHePYRPs4mrMx3lEgbsC.hSIka/BiMkwWW', 'PROFESOR', CURRENT_DATE, 'Valencia', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- GIMNASIOS
-- ============================================

INSERT INTO gimnasio (nombre, descripcion, ciudad, foto) VALUES
('Fitness Park', 'Centro deportivo de élite equipado con tecnología Technogym y ELEIKO. Amplia zona de peso libre, cardio de última generación y espacios dedicados para artes marciales. Contamos con ring profesional y zona de sparring.', 'Cádiz', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop'),
('Basic Fit', 'Gimnasio especializado en deportes de contacto y defensa personal. Instalaciones modernas con tatami olímpico, sacos de boxeo profesionales y equipo de protección de alta calidad para entrenamientos seguros.', 'Sevilla', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop'),
('Smart Fit', 'Centro de MMA y deportes de combate con jaula profesional homologada. Entrenadores certificados internacionalmente y programas adaptados desde principiantes hasta competidores profesionales.', 'Jerez de la Frontera', 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&h=600&fit=crop'),
('Iron Gym', 'Gimnasio de alto rendimiento para atletas exigentes. Zona de halterofilia olímpica, CrossFit box certificado y área de combate. Preparación física integral para competiciones nacionales e internacionales.', 'Madrid', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop'),
('Fight Club Barcelona', 'Academia de combate con más de 15 años de experiencia formando campeones. Especialistas en Muay Thai, BJJ y Wrestling con metodología tailandesa y brasileña auténtica.', 'Barcelona', 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&h=600&fit=crop'),
('Warrior Gym', 'Centro familiar de artes marciales donde conviven todas las edades y niveles. Ambiente acogedor con instalaciones profesionales. Programas específicos para niños, adultos y competidores.', 'Valencia', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop'),
('SynerGym', 'Complejo deportivo integral con ring de boxeo, jaula de MMA y tatami de 200m². Vestuarios premium con sauna y zona de recuperación. El gimnasio más completo del Campo de Gibraltar.', 'Algeciras', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop'),
('GO! Fitness', 'Academia tradicional de artes marciales japonesas fundada en 1998. Formamos campeones regionales y nacionales en Judo y Karate. Dojo auténtico con valores de disciplina y respeto.', 'Jerez de la Frontera', 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop'),
('Enjoy!', 'Gimnasio boutique con grupos reducidos de máximo 8 personas. Atención 100% personalizada en boxeo y fitness funcional. Ideal para quienes buscan resultados rápidos con seguimiento individual.', 'Cádiz', 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=600&fit=crop'),
('CrossFit Bahía', 'Box oficial de CrossFit con coaches certificados Level 2. Comunidad activa con más de 200 miembros. Competiciones internas mensuales y preparación para Opens y Sanctionals.', 'Cádiz', 'https://images.unsplash.com/photo-1534368959876-26bf04f2c947?w=800&h=600&fit=crop'),
('Dojo Central', 'Escuela tradicional de artes marciales con linaje directo de maestros japoneses. Karate Shotokan, Judo Kodokan y Aikido Aikikai. Ambiente de respeto y desarrollo integral del practicante.', 'Sevilla', 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&h=600&fit=crop'),
('Power House Gym', 'Templo del culturismo y la fuerza. Equipamiento Hammer Strength, plataformas de powerlifting y zona de strongman. Donde entrenan los atletas más fuertes de la capital.', 'Madrid', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=600&fit=crop'),
('Thai Boxing Academy', 'La única academia en España con maestros tailandeses residentes. Metodología auténtica de los campos de Muay Thai de Bangkok. Organizamos viajes de entrenamiento a Tailandia.', 'Barcelona', 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=600&fit=crop'),
('FitBox Valencia', 'Centro de boxeo recreativo y fitness. Clases de cardio boxing, técnica de boxeo y preparación física. Ambiente motivador sin contacto, perfecto para ponerse en forma divirtiéndose.', 'Valencia', 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&h=600&fit=crop'),
('MMA Factory', 'Fábrica de luchadores profesionales. Equipo técnico con experiencia en UFC, Bellator y ONE Championship. Programa de desarrollo desde amateur hasta profesional con gestión de carreras.', 'Jerez de la Frontera', 'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&h=600&fit=crop'),
('Elite Training Center', 'Centro de entrenamiento para deportistas de élite y ejecutivos exigentes. Instalaciones exclusivas con aforo limitado. Programas de rendimiento, recuperación y nutrición personalizados.', 'Madrid', 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=800&h=600&fit=crop')
ON CONFLICT DO NOTHING;

-- ============================================
-- CLASES
-- ============================================

INSERT INTO clase (nombre, gimnasio_id, profesor_id, icono, dias_semana, hora_inicio, hora_fin) VALUES
-- Fitness Park (1)
('Karate', 1, 1, 'martial-arts', 'Lunes, Miércoles', '18:00', '19:30'),
('Muay Thai', 1, 2, 'boxing-glove', 'Martes, Jueves', '19:00', '20:30'),
('Jiu-Jitsu', 1, 3, 'wrestling', 'Viernes', '17:00', '18:30'),
-- Basic Fit (2)
('Full Contact', 2, 2, 'fist', 'Lunes, Miércoles, Viernes', '20:00', '21:30'),
('Defensa Personal', 2, 1, 'shield', 'Sábado', '10:00', '12:00'),
('Boxeo', 2, 3, 'boxing-glove', 'Martes, Jueves', '18:00', '19:30'),
-- Smart Fit (3)
('MMA', 3, 1, 'wrestling', 'Lunes, Miércoles', '19:00', '20:30'),
('Boxeo', 3, 2, 'boxing-glove', 'Martes, Jueves', '20:00', '21:00'),
('Kickboxing', 3, 3, 'kick', 'Viernes', '18:00', '19:30'),
-- Iron Gym (4)
('Crossfit', 4, 4, 'dumbbell', 'Lunes a Viernes', '07:00', '08:00'),
('Boxeo', 4, 1, 'boxing-glove', 'Martes, Jueves', '19:00', '20:30'),
('MMA', 4, 2, 'wrestling', 'Sábado', '11:00', '13:00'),
-- Fight Club Barcelona (5)
('Muay Thai', 5, 2, 'boxing-glove', 'Lunes, Miércoles', '20:00', '21:30'),
('BJJ', 5, 4, 'martial-arts', 'Martes, Jueves', '19:00', '20:30'),
('Wrestling', 5, 3, 'wrestling', 'Viernes', '18:00', '20:00'),
-- Warrior Gym (6)
('Kickboxing', 6, 4, 'kick', 'Lunes, Miércoles', '18:00', '19:30'),
('Muay Thai', 6, 2, 'boxing-glove', 'Martes, Jueves', '19:00', '20:30'),
('Boxeo', 6, 1, 'boxing-glove', 'Sábado', '10:00', '12:00'),
-- SynerGym (7)
('MMA', 7, 5, 'wrestling', 'Lunes, Miércoles, Viernes', '19:00', '21:00'),
('Judo', 7, 3, 'martial-arts', 'Martes, Jueves', '18:00', '19:30'),
-- GO! Fitness (8)
('Judo', 8, 3, 'martial-arts', 'Lunes, Miércoles', '17:00', '18:30'),
('Karate', 8, 1, 'martial-arts', 'Martes, Jueves', '18:00', '19:30'),
-- Enjoy! (9)
('Boxeo', 9, 2, 'boxing-glove', 'Lunes a Viernes', '19:00', '20:30'),
-- CrossFit Bahía (10)
('Crossfit', 10, 4, 'dumbbell', 'Lunes a Sábado', '07:00', '20:00'),
-- Dojo Central (11)
('Karate', 11, 1, 'martial-arts', 'Lunes, Miércoles', '18:00', '19:30'),
('Judo', 11, 3, 'martial-arts', 'Martes, Jueves', '19:00', '20:30'),
('Aikido', 11, 6, 'martial-arts', 'Viernes', '17:00', '19:00'),
-- Power House Gym (12)
('Powerlifting', 12, 4, 'barbell', 'Lunes, Miércoles, Viernes', '18:00', '20:00'),
-- Thai Boxing Academy (13)
('Muay Thai', 13, 5, 'boxing-glove', 'Lunes a Viernes', '18:00', '21:00'),
-- FitBox Valencia (14)
('Boxeo', 14, 6, 'boxing-glove', 'Martes, Jueves', '19:00', '20:30'),
('Cardio Boxing', 14, 6, 'boxing-glove', 'Lunes, Miércoles', '18:00', '19:00'),
-- MMA Factory (15)
('MMA', 15, 5, 'wrestling', 'Lunes, Miércoles, Viernes', '19:00', '21:00'),
('Striking', 15, 2, 'fist', 'Martes, Jueves', '20:00', '21:30'),
('Grappling', 15, 3, 'wrestling', 'Sábado', '10:00', '12:00'),
-- Elite Training Center (16)
('MMA', 16, 5, 'wrestling', 'Lunes a Viernes', '18:00', '20:00'),
('Boxeo', 16, 1, 'boxing-glove', 'Martes, Jueves', '20:00', '21:30'),
('Crossfit', 16, 4, 'dumbbell', 'Lunes, Miércoles, Viernes', '07:00', '08:00')
ON CONFLICT DO NOTHING;
