-- ============================================
-- DATOS DE EJEMPLO - GYMUNITY
-- Script de inicialización para PostgreSQL
-- ============================================

-- ============================================
-- USUARIOS DE EJEMPLO
-- ============================================
-- Contraseña: "password123" encriptada con BCrypt
INSERT INTO usuario (nombre_usuario, email, contrasenia, rol, fecha_registro, ciudad)
VALUES 
  ('admin', 'admin@gymunity.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqPfXPVL8t.e.u/JVvbg1HTXSY4Gy', 'ADMIN', CURRENT_DATE, 'Madrid'),
  ('profesor_carlos', 'carlos@gymunity.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqPfXPVL8t.e.u/JVvbg1HTXSY4Gy', 'PROFESOR', CURRENT_DATE, 'Barcelona'),
  ('profesor_maria', 'maria@gymunity.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqPfXPVL8t.e.u/JVvbg1HTXSY4Gy', 'PROFESOR', CURRENT_DATE, 'Valencia'),
  ('alumno_juan', 'juan@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqPfXPVL8t.e.u/JVvbg1HTXSY4Gy', 'ALUMNO', CURRENT_DATE, 'Madrid'),
  ('alumno_ana', 'ana@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqPfXPVL8t.e.u/JVvbg1HTXSY4Gy', 'ALUMNO', CURRENT_DATE, 'Barcelona')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- GIMNASIOS DE EJEMPLO
-- ============================================
INSERT INTO gimnasio (nombre, descripcion, foto, ciudad)
VALUES 
  (
    'Fitness Park',
    'El gimnasio más completo de Madrid. Contamos con las mejores instalaciones, equipamiento de última generación y un equipo de profesionales dedicados a ayudarte a alcanzar tus objetivos. Más de 2000m² de instalaciones con zona de cardio, musculación, clases dirigidas y spa.',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    'Madrid'
  ),
  (
    'Basic Fit',
    'Tu gimnasio 24/7 en Barcelona. Acceso ilimitado a todas las instalaciones, clases grupales incluidas y app de entrenamiento personalizado. El mejor precio calidad del mercado con más de 50 máquinas de cardio y 100 de musculación.',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
    'Barcelona'
  ),
  (
    'Enjoy!',
    'Disfruta del fitness en Valencia. Un espacio moderno y acogedor donde entrenar se convierte en un placer. Clases de boxeo, crossfit, yoga y mucho más. Vestuarios de lujo y parking gratuito.',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    'Valencia'
  ),
  (
    'McFit',
    'La mayor cadena de gimnasios de Europa llega a Sevilla. Instalaciones premium, entrenadores certificados y un ambiente motivador. Abierto 24 horas los 365 días del año.',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    'Sevilla'
  ),
  (
    'Altafit',
    'Tu gimnasio de confianza en Bilbao. Más de 15 años de experiencia nos avalan. Programas de entrenamiento personalizados, nutricionista incluido y seguimiento de progreso.',
    'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800',
    'Bilbao'
  ),
  (
    'Vivagym',
    'El gimnasio low cost de Málaga sin renunciar a la calidad. Todas las máquinas que necesitas, duchas amplias y personal cualificado. Sin permanencia ni matrícula.',
    'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800',
    'Málaga'
  );

-- ============================================
-- CLASES DE EJEMPLO
-- ============================================
INSERT INTO clase (nombre, gimnasio_id, profesor_id, icono)
VALUES 
  -- Fitness Park (gimnasio 1)
  ('Boxeo', 1, 2, 'dumbbell'),
  ('Karate', 1, 2, 'trophy'),
  ('Yoga', 1, 3, 'heart'),
  ('Spinning', 1, 2, 'clock'),
  
  -- Basic Fit (gimnasio 2)
  ('Full Contact', 2, 3, 'trophy'),
  ('Pilates', 2, 3, 'heart'),
  ('Zumba', 2, 2, 'users'),
  
  -- Enjoy! (gimnasio 3)
  ('Boxeo', 3, 2, 'dumbbell'),
  ('CrossFit', 3, 2, 'trophy'),
  ('Meditación', 3, 3, 'heart'),
  
  -- McFit (gimnasio 4)
  ('HIIT', 4, 2, 'clock'),
  ('Body Combat', 4, 3, 'dumbbell'),
  
  -- Altafit (gimnasio 5)
  ('Funcional', 5, 2, 'trophy'),
  ('Stretching', 5, 3, 'heart'),
  
  -- Vivagym (gimnasio 6)
  ('GAP', 6, 3, 'users'),
  ('TRX', 6, 2, 'dumbbell');

-- ============================================
-- INTERACCIONES DE EJEMPLO (Reseñas y Apuntados)
-- ============================================
INSERT INTO interaccion (usuario_id, gimnasio_id, es_apuntado, resenia, fecha_interaccion, valoracion)
VALUES 
  -- Fitness Park
  (4, 1, true, 'Excelente gimnasio, muy completo y limpio. Los profesores son muy atentos.', CURRENT_DATE - 30, 5),
  (5, 1, true, 'Me encanta el ambiente y las clases de boxeo. Muy recomendable.', CURRENT_DATE - 25, 4),
  (4, 1, false, NULL, CURRENT_DATE - 20, NULL),
  
  -- Basic Fit
  (5, 2, true, 'Buen precio y abierto 24h. Perfecto para mis horarios.', CURRENT_DATE - 15, 4),
  (4, 2, true, 'Las máquinas están siempre disponibles. Gran variedad.', CURRENT_DATE - 10, 5),
  
  -- Enjoy!
  (4, 3, true, 'El mejor gimnasio de Valencia sin duda. El crossfit es brutal.', CURRENT_DATE - 8, 5),
  (5, 3, false, 'Instalaciones muy modernas pero algo caro.', CURRENT_DATE - 5, 3),
  
  -- McFit
  (5, 4, true, 'Muy buen gimnasio, siempre limpio y ordenado.', CURRENT_DATE - 3, 4),
  
  -- Altafit
  (4, 5, true, 'El seguimiento personalizado es genial. He mejorado mucho.', CURRENT_DATE - 2, 5),
  
  -- Vivagym
  (5, 6, true, 'Relación calidad-precio inmejorable.', CURRENT_DATE - 1, 4);
