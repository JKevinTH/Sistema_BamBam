USE proyectop;

-- 1) IDs automáticos (tus tablas no los tienen y el PHP los necesita)
SET FOREIGN_KEY_CHECKS = 0;
ALTER TABLE puntoventa MODIFY NumeroV INT NOT NULL AUTO_INCREMENT;
ALTER TABLE ventas     MODIFY IDventa INT NOT NULL AUTO_INCREMENT;
ALTER TABLE cortecaja  MODIFY idcorte INT NOT NULL AUTO_INCREMENT;
SET FOREIGN_KEY_CHECKS = 1;

-- 2) Tabla nueva para entradas/salidas del personal
CREATE TABLE IF NOT EXISTS asistencia (
  idasistencia INT NOT NULL AUTO_INCREMENT,
  ClaveE VARCHAR(10) NOT NULL,
  fecha DATE NOT NULL,
  entrada TIME NULL,
  salida TIME NULL,
  PRIMARY KEY (idasistencia),
  KEY fk_asistencia_empleados (ClaveE),
  CONSTRAINT fk_asistencia_empleados FOREIGN KEY (ClaveE)
    REFERENCES empleados (ClaveE) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
