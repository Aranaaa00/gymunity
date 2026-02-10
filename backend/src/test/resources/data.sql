-- ============================================
-- CONSEJOS FITNESS
-- ============================================

CREATE TABLE IF NOT EXISTS consejo (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion VARCHAR(1000) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    icono VARCHAR(50) NOT NULL
);

INSERT INTO consejo (id, titulo, descripcion, categoria, icono) VALUES
(1, 'Hidratate antes de entrenar', 'Bebe al menos 500ml de agua 30 minutos antes de tu sesion de entrenamiento para mantener un rendimiento optimo.', 'nutricion', 'heart'),
(2, 'Calienta siempre', 'Dedica al menos 10 minutos al calentamiento antes de cualquier ejercicio intenso para evitar lesiones.', 'entrenamiento', 'flame'),
(3, 'Duerme 7-8 horas', 'El descanso es fundamental para la recuperacion muscular. Intenta dormir entre 7 y 8 horas cada noche.', 'descanso', 'clock'),
(4, 'Establece metas realistas', 'Define objetivos alcanzables a corto plazo que te mantengan motivado en tu camino fitness.', 'motivacion', 'target'),
(5, 'Proteina despues del gym', 'Consume proteina dentro de los 30 minutos posteriores al entrenamiento para favorecer la recuperacion muscular.', 'nutricion', 'zap'),
(6, 'Varia tus ejercicios', 'Cambia tu rutina cada 4-6 semanas para evitar estancamiento y trabajar diferentes grupos musculares.', 'entrenamiento', 'dumbbell'),
(7, 'Estira tras entrenar', 'Dedica 10 minutos a estiramientos al finalizar tu sesion para mejorar la flexibilidad y reducir agujetas.', 'descanso', 'activity'),
(8, 'Entrena con un companero', 'Tener un companero de entrenamiento aumenta la motivacion y te ayuda a mantener la constancia.', 'motivacion', 'users')
ON CONFLICT (id) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  descripcion = EXCLUDED.descripcion,
  categoria = EXCLUDED.categoria,
  icono = EXCLUDED.icono;

-- Actualizar secuencia de consejos
SELECT setval('consejo_id_seq', 8, true);