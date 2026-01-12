-- Migración: Añadir columna fecha_clase a la tabla alumno_clase
-- Ejecutar este script en la base de datos de DigitalOcean

ALTER TABLE alumno_clase 
ADD COLUMN IF NOT EXISTS fecha_clase TIMESTAMP NOT NULL DEFAULT NOW();

-- Actualizar las filas existentes con la fecha de la clase asociada
UPDATE alumno_clase ac
SET fecha_clase = c.horario_inicio
FROM clase c
WHERE ac.clase_id = c.id
AND ac.fecha_clase = NOW();

-- Nota: Si no tienes datos existentes, puedes omitir el UPDATE
