CREATE TABLE llx_vicentina_cusa (
    cod_laboreo VARCHAR(50) NOT NULL, -- Código único para identificar el laboreo (string)
    laboreo VARCHAR(255) NOT NULL, -- Descripción o nombre del laboreo
    precio_cusa DECIMAL(10, 2), -- Precio por unidad asociado al laboreo
    lts_ha DECIMAL(10, 2) NOT NULL, -- Litros por hectárea para este laboreo
    PRIMARY KEY (cod_laboreo) -- Clave primaria basada en cod_laboreo
);






INSERT INTO llx_vicentina_cusa (laboreo, cod_laboreo, precio_cusa, lts_ha)
VALUES 
('Cincel', 'Ci', 48.79, 15),
('Cosecha', 'Co', 87.97, 13),
('Disquera', 'Di', 31.53, 9),
('Fertilización', 'Fe', 13.09, 1),
('Fumigación', 'Fu', 10.64, 1),
('Fumigación-Fertilización', 'FF', 9.72, 1),
('Landplane', 'LP', 52.83, 12),
('Rastra', 'Ra', 15.99, 4),
('Resiembra', 'RS', NULL, 8),
('Rotativa', 'Rot.', 49.84, 1),
('Siembra', 'Si', 93.85, 8),
('Siembra Neumatica', 'SN', 93.85, 8),
('Vibro', 'Vb', NULL, 15);




CREATE TABLE `llx_vicentina_maquinaria` (
  `rowid` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(128) NOT NULL,
  `name` varchar(255) NOT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `year_fabrication` int(4) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `year_purchase` int(4) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `plate` varchar(255) DEFAULT NULL,
  `labor` varchar(255) DEFAULT NULL,
  `cusa_cost` decimal(10, 2) DEFAULT NULL,
  `lts` decimal(10, 2) DEFAULT NULL,
  `maintenance_hours` int(11) DEFAULT NULL,
  `padron` varchar(255) DEFAULT NULL,
  `id_padron` varchar(255) DEFAULT NULL,
  `insurance` varchar(255) DEFAULT NULL,
  `date_creation` datetime DEFAULT NULL,
  `tms` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fk_user_creat` int(11) DEFAULT NULL,
  `fk_user_modif` int(11) DEFAULT NULL,
  `import_key` varchar(14) DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  PRIMARY KEY (`rowid`),
  KEY `idx_vicentina_maquinaria_code` (`code`),
  KEY `idx_vicentina_maquinaria_name` (`name`),
  KEY `idx_vicentina_maquinaria_rowid` (`rowid`),
  KEY `idx_vicentina_maquinaria_state` (`state`),
  KEY `idx_vicentina_maquinaria_status` (`status`),
  KEY `llx_vicentina_maquinaria_fk_user_creat` (`fk_user_creat`),
  KEY `llx_vicentina_maquinaria_fk_user_modif` (`fk_user_modif`),
  CONSTRAINT `llx_vicentina_maquinaria_fk_user_creat` FOREIGN KEY (`fk_user_creat`) REFERENCES `llx_user` (`rowid`),
  CONSTRAINT `llx_vicentina_maquinaria_fk_user_modif` FOREIGN KEY (`fk_user_modif`) REFERENCES `llx_user` (`rowid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


CREATE TABLE llx_vicentina_campo  (
    rowid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    area_real DECIMAL(10, 2),
    area_web DECIMAL(15, 8),
    rented BOOLEAN DEFAULT FALSE,
    fk_user_creat INT(11) DEFAULT NULL,
    fk_user_modif INT(11) DEFAULT NULL,
    status INT(11) DEFAULT 1,
    date_creation DATETIME DEFAULT NULL,
    period INT DEFAULT NULL,
    rent_cost DECIMAL(10,2) DEFAULT NULL,
    tms TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `llx_vicentina_field_fk_user_creat` FOREIGN KEY (`fk_user_creat`) REFERENCES `llx_user` (`rowid`),
    CONSTRAINT `llx_vicentina_field_fk_user_modif` FOREIGN KEY (`fk_user_modif`) REFERENCES `llx_user` (`rowid`),
);

CREATE TABLE llx_vicentina_campo_coordinates (
    rowid INT AUTO_INCREMENT PRIMARY KEY,
    field_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    FOREIGN KEY (field_id) REFERENCES llx_vicentina_campo(rowid) ON DELETE CASCADE
);


ALTER TABLE `llx_vicentina_lotes`
MODIFY COLUMN `codigo_campo` INT NOT NULL;

ALTER TABLE `llx_vicentina_lotes`
ADD CONSTRAINT `llx_vicentina_lotes_fk_codigo_campo`
FOREIGN KEY (`codigo_campo`) REFERENCES `llx_vicentina_campo` (`rowid`)
ON DELETE CASCADE ON UPDATE CASCADE;



-- Create lots table
CREATE TABLE llx_vicentina_lote (
    rowid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    fk_campo INT NOT NULL,
    area_real DECIMAL(10,2) DEFAULT 0,
    area_web DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    fk_user_creat INT,
    fk_user_modif INT,
    date_creation DATETIME,
    tms TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status SMALLINT DEFAULT 1,
    FOREIGN KEY (fk_campo) REFERENCES llx_vicentina_campo(rowid) ON DELETE CASCADE,
    FOREIGN KEY (fk_user_creat) REFERENCES llx_user(rowid),
    FOREIGN KEY (fk_user_modif) REFERENCES llx_user(rowid)
) ENGINE=InnoDB;

-- Create lot coordinates table
CREATE TABLE llx_vicentina_lote_coordinates (
    rowid INT AUTO_INCREMENT PRIMARY KEY,
    lot_id INT NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    FOREIGN KEY (lot_id) REFERENCES llx_vicentina_lote(rowid) ON DELETE CASCADE
) ENGINE=InnoDB;



CREATE TABLE llx_vicentina_cultivo_lote (
    rowid INT AUTO_INCREMENT PRIMARY KEY,
    fk_cultivo INT NOT NULL,                    -- ID del cultivo
    fk_lote INT NOT NULL,                       -- ID del lote
    area_utilizada DECIMAL(10,2) DEFAULT 0,     -- Área utilizada del lote en hectáreas
    date_creation DATETIME NOT NULL,            -- Fecha de creación
    tms TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Fecha de última modificación
    fk_user_creat INT NOT NULL,                 -- Usuario que creó el registro
    fk_user_modif INT,                          -- Usuario que modificó el registro
    status INT DEFAULT 1,                       -- Estado del registro (1=activo, 0=inactivo)
    UNIQUE KEY uk_cultivo_lote (fk_cultivo, fk_lote),  -- Un lote solo puede estar una vez por cultivo
    CONSTRAINT fk_cultivo_lote_cultivo FOREIGN KEY (fk_cultivo) REFERENCES llx_vicentina_cultivo(rowid) ON DELETE CASCADE,
    CONSTRAINT fk_cultivo_lote_lote FOREIGN KEY (fk_lote) REFERENCES llx_vicentina_lote(rowid) ON DELETE CASCADE,
    CONSTRAINT fk_cultivo_lote_user_creat FOREIGN KEY (fk_user_creat) REFERENCES llx_user(rowid),
    CONSTRAINT fk_cultivo_lote_user_modif FOREIGN KEY (fk_user_modif) REFERENCES llx_user(rowid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE llx_vicentina_cultivo_sublote (
    rowid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    fk_cultivo INT NOT NULL,
    fk_lote INT NOT NULL,
    area_utilizada DECIMAL(10,2) DEFAULT 0,
    date_creation DATETIME NOT NULL,
    tms TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fk_cultivo_lote INT NOT NULL,
    CONSTRAINT fk_cultivo_lote FOREIGN KEY (fk_cultivo_lote) REFERENCES llx_vicentina_cultivo_lote(rowid) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `llx_vicentina_raf` (
  `rowid` int(11) NOT NULL AUTO_INCREMENT,
  `crop_code` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `type` varchar(255) NOT NULL,
  `sub_type` varchar(255) NOT NULL,
  `total_area` decimal(10,2) DEFAULT 0.00,
  `description` text DEFAULT NULL,
  `fk_user_creat` int(11) DEFAULT NULL,
  `fk_user_modif` int(11) DEFAULT NULL,
  `date_creation` datetime DEFAULT NULL,
  `tms` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`rowid`),
  KEY `fk_user_creat` (`fk_user_creat`),
  KEY `fk_user_modif` (`fk_user_modif`),
  CONSTRAINT `llx_vicentina_raf_ibfk_1` FOREIGN KEY (`fk_user_creat`) REFERENCES `llx_user` (`rowid`),
  CONSTRAINT `llx_vicentina_raf_ibfk_2` FOREIGN KEY (`fk_user_modif`) REFERENCES `llx_user` (`rowid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


CREATE TABLE `llx_vicentina_seed_map` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `date` date NOT NULL,
    `crop_code` varchar(255) NOT NULL,
    `first_equipment` int(11),
    `second_equipment` int(11),
    `labor` varchar(50),
    `cusa_cost` decimal(10,2),
    `lts` decimal(10,2),
    `grooves` int(11),
    `fk_user_creat` int(11),
    `fk_user_modif` int(11),
    `date_creation` datetime DEFAULT NULL,
    `tms` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`rowid`),
    KEY `fk_first_equipment` (`first_equipment`),
    KEY `fk_second_equipment` (`second_equipment`),
    KEY `fk_user_creat` (`fk_user_creat`),
    KEY `fk_user_modif` (`fk_user_modif`),
    CONSTRAINT `llx_vicentina_seed_map_fk_first_equipment` FOREIGN KEY (`first_equipment`) REFERENCES `llx_vicentina_maquinaria` (`rowid`),
    CONSTRAINT `llx_vicentina_seed_map_fk_second_equipment` FOREIGN KEY (`second_equipment`) REFERENCES `llx_vicentina_maquinaria` (`rowid`),
    CONSTRAINT `llx_vicentina_seed_map_fk_user_creat` FOREIGN KEY (`fk_user_creat`) REFERENCES `llx_user` (`rowid`),
    CONSTRAINT `llx_vicentina_seed_map_fk_user_modif` FOREIGN KEY (`fk_user_modif`) REFERENCES `llx_user` (`rowid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;



-- Tabla compartida para lotes
CREATE TABLE `llx_vicentina_registers_lots` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `register_type` enum('raf','seed_map','irrigation') NOT NULL,
    `fk_register` int(11) NOT NULL,
    `fk_lote` int(11) NOT NULL,
    `area_utilizada` decimal(10,2) DEFAULT 0,
    PRIMARY KEY (`rowid`),
    KEY `idx_register_type_fk` (`register_type`, `fk_register`),
    KEY `fk_lote` (`fk_lote`),
    CONSTRAINT `llx_vicentina_registers_lots_fk_lote` FOREIGN KEY (`fk_lote`) REFERENCES `llx_vicentina_lote` (`rowid`)
) ENGINE=InnoDB;

ALTER TABLE llx_vicentina_registers_lots ADD COLUMN `fk_sublote` int(11);

ALTER TABLE llx_vicentina_registers_lots
ADD CONSTRAINT `llx_vicentina_registers_lots_fk_sublote` 
FOREIGN KEY (`fk_sublote`) 
REFERENCES `llx_vicentina_cultivo_sublote` (`rowid`);

ALTER TABLE llx_vicentina_registers_lots MODIFY COLUMN register_type enum('raf','seed_map','irrigation','labor','irrigation_hours') NOT NULL;

-- Tabla compartida para productos
CREATE TABLE `llx_vicentina_registers_products` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `register_type` enum('raf','seed_map','irrigation') NOT NULL,
    `fk_register` int(11) NOT NULL,
    `fk_product` int(11) NOT NULL,
    `quantity` decimal(10,2) DEFAULT 0,
    `warehouse_id` int(11),
    `type` varchar(50),
    `stock_used` decimal(10,2) DEFAULT 0,
    PRIMARY KEY (`rowid`),
    KEY `idx_register_type_fk` (`register_type`, `fk_register`),
    KEY `fk_product` (`fk_product`),
    CONSTRAINT `llx_vicentina_registers_products_fk_product` FOREIGN KEY (`fk_product`) REFERENCES `llx_product` (`rowid`)
) ENGINE=InnoDB;

ALTER TABLE llx_vicentina_registers_products ADD COLUMN unit varchar(255);
ALTER TABLE llx_vicentina_registers_products MODIFY COLUMN register_type enum('raf','seed_map','irrigation','labor','irrigation_hours') NOT NULL;

CREATE TABLE `llx_vicentina_labor` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `date` date NOT NULL,
    `crop_code` varchar(255) NOT NULL,
    `first_equipment` int(11),
    `second_equipment` int(11),
    `labor_code` varchar(50) NOT NULL,
    `labor` varchar(50),
    `cusa_cost` decimal(10,2),
    `lts` decimal(10,2),
    `fk_user_creat` int(11),
    `fk_user_modif` int(11),
    `date_creation` datetime DEFAULT NULL,
    `tms` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`rowid`),
    KEY `fk_first_equipment` (`first_equipment`),
    KEY `fk_second_equipment` (`second_equipment`),
    KEY `fk_user_creat` (`fk_user_creat`),
    KEY `fk_user_modif` (`fk_user_modif`),
    CONSTRAINT `llx_vicentina_labor_fk_first_equipment` FOREIGN KEY (`first_equipment`) REFERENCES `llx_vicentina_maquinaria` (`rowid`),
    CONSTRAINT `llx_vicentina_labor_fk_second_equipment` FOREIGN KEY (`second_equipment`) REFERENCES `llx_vicentina_maquinaria` (`rowid`),
    CONSTRAINT `llx_vicentina_labor_fk_user_creat` FOREIGN KEY (`fk_user_creat`) REFERENCES `llx_user` (`rowid`),
    CONSTRAINT `llx_vicentina_labor_fk_user_modif` FOREIGN KEY (`fk_user_modif`) REFERENCES `llx_user` (`rowid`),
    CONSTRAINT `llx_vicentina_labor_fk_labor_code` FOREIGN KEY (`labor_code`) REFERENCES `llx_vicentina_cusa` (`cod_laboreo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

ALTER TABLE llx_product ADD COLUMN pmp_dollar double(24,8) DEFAULT NULL AFTER pmp;



-- Agregar las nuevas columnas para precios en USD
ALTER TABLE llx_product_price_history 
ADD COLUMN usd_price_old double(24,8) DEFAULT NULL AFTER price_old,
ADD COLUMN usd_price_new double(24,8) DEFAULT NULL AFTER price_new,
ADD COLUMN usd_pmp_old double(24,8) DEFAULT NULL AFTER pmp_old,
ADD COLUMN usd_pmp_new double(24,8) DEFAULT NULL AFTER pmp_new;

ALTER TABLE `llx_vicentina_registers_products`
ADD COLUMN `total_price` decimal(24,8) DEFAULT 0.00000000 AFTER `stock_used`,
ADD COLUMN `total_price_usd` decimal(24,8) DEFAULT 0.00000000 AFTER `total_price`,
ADD COLUMN `date_creation` datetime DEFAULT CURRENT_TIMESTAMP AFTER `total_price_usd`;


CREATE TABLE `llx_vicentina_irrigation_costs` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `cost_mother_line` decimal(24,8) DEFAULT 0.00000000,
    `fuel_consumption_per_hour` decimal(24,8) DEFAULT 0.00000000,
    `maintenance_hours` decimal(24,8) DEFAULT 0.00000000,
    `maintenance_cost` decimal(24,8) DEFAULT 0.00000000,
    `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
    `tms` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`rowid`)
) ENGINE=InnoDB;



CREATE TABLE `llx_vicentina_irrigation` (
  `rowid` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `crop_code` varchar(255) NOT NULL,
  `first_equipment` int(11) DEFAULT NULL,
  `second_equipment` int(11) DEFAULT NULL,
  `fk_user_creat` int(11) DEFAULT NULL,
  `fk_user_modif` int(11) DEFAULT NULL,
  `date_creation` datetime DEFAULT NULL,
  `tms` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`rowid`),
  KEY `fk_first_equipment` (`first_equipment`),
  KEY `fk_second_equipment` (`second_equipment`),
  KEY `fk_user_creat` (`fk_user_creat`),
  KEY `fk_user_modif` (`fk_user_modif`),
  CONSTRAINT `llx_vicentina_irrigation_fk_first_equipment` FOREIGN KEY (`first_equipment`) REFERENCES `llx_vicentina_maquinaria` (`rowid`),
  CONSTRAINT `llx_vicentina_irrigation_fk_second_equipment` FOREIGN KEY (`second_equipment`) REFERENCES `llx_vicentina_maquinaria` (`rowid`),
  CONSTRAINT `llx_vicentina_irrigation_fk_user_creat` FOREIGN KEY (`fk_user_creat`) REFERENCES `llx_user` (`rowid`),
  CONSTRAINT `llx_vicentina_irrigation_fk_user_modif` FOREIGN KEY (`fk_user_modif`) REFERENCES `llx_user` (`rowid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


ALTER TABLE `llx_vicentina_irrigation`
ADD COLUMN `cost_mother_line` decimal(24,8) DEFAULT 0.00000000 AFTER `second_equipment`,
ADD COLUMN `meters_of_line_mother` decimal(24,8) DEFAULT 0.00000000 AFTER `cost_mother_line`;



CREATE TABLE `llx_vicentina_irrigation_hours` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `date` date NOT NULL,
    `crop_code` varchar(255) NOT NULL,
    `hours` decimal(24,8) DEFAULT 0.00000000,
    `fk_costs` int(11) DEFAULT NULL,
    `fk_user_creat` int(11) DEFAULT NULL,
    `fk_user_modif` int(11) DEFAULT NULL,
    `date_creation` datetime DEFAULT NULL,
    `tms` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`rowid`),
    KEY `fk_user_creat` (`fk_user_creat`),
    KEY `fk_user_modif` (`fk_user_modif`),
    CONSTRAINT `llx_vicentina_irrigation_hours_fk_user_creat` FOREIGN KEY (`fk_user_creat`) REFERENCES `llx_user` (`rowid`),
    CONSTRAINT `llx_vicentina_irrigation_hours_fk_user_modif` FOREIGN KEY (`fk_user_modif`) REFERENCES `llx_user` (`rowid`),
    CONSTRAINT `llx_vicentina_irrigation_hours_fk_costs` FOREIGN KEY (`fk_costs`) REFERENCES `llx_vicentina_irrigation_costs` (`rowid`)
) ENGINE=InnoDB;


ALTER TABLE `llx_vicentina_irrigation_hours` ADD COLUMN `fuel_price` decimal(24,8) DEFAULT 0.00000000 AFTER `hours`;


CREATE TABLE `llx_vicentina_irrigation_fertirriego` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `date` date NOT NULL,
    `crop_code` varchar(255) NOT NULL,
    `total_area` decimal(24,8) DEFAULT 0.00000000,
    `fk_user_creat` int(11) DEFAULT NULL,
    `fk_user_modif` int(11) DEFAULT NULL,
    `date_creation` datetime DEFAULT NULL,
    `tms` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`rowid`),
    KEY `fk_user_creat` (`fk_user_creat`),
    KEY `fk_user_modif` (`fk_user_modif`),
    CONSTRAINT `llx_vicentina_irrigation_fertirriego_fk_user_creat` FOREIGN KEY (`fk_user_creat`) REFERENCES `llx_user` (`rowid`),
    CONSTRAINT `llx_vicentina_irrigation_fertirriego_fk_user_modif` FOREIGN KEY (`fk_user_modif`) REFERENCES `llx_user` (`rowid`)
) ENGINE=InnoDB;



CREATE TABLE `llx_vicentina_fuels` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `date` date NOT NULL,
    `super` decimal(24,8) DEFAULT 0.00000000,
    `premium` decimal(24,8) DEFAULT 0.00000000,
    `gasoil10s` decimal(24,8) DEFAULT 0.00000000,
    `gasoil50s` decimal(24,8) DEFAULT 0.00000000,
    `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
    `tms` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`rowid`)
) ENGINE=InnoDB;


CREATE TABLE `llx_vicentina_dolar` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `date` date NOT NULL,
    `compra` decimal(24,8) DEFAULT 0.00000000,
    `venta` decimal(24,8) DEFAULT 0.00000000,
    `avg` decimal(24,8) DEFAULT 0.00000000,
    `moneda` varchar(255) NOT NULL,
    `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
    `tms` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`rowid`)
) ENGINE=InnoDB;


CREATE TABLE `llx_vicentina_logistic_cost` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `date` date NOT NULL,
    `kilometers` decimal(24,8) DEFAULT 0.00000000,
    `cost` decimal(24,8) DEFAULT 0.00000000,
    `origin` varchar(255) NOT NULL,
    `destination` varchar(255) DEFAULT NULL,
    `fk_user_creat` int(11) DEFAULT NULL,
    `fk_user_modif` int(11) DEFAULT NULL,
    `date_creation` datetime DEFAULT NULL,
    `tms` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`rowid`),
    KEY `fk_user_creat` (`fk_user_creat`),
    KEY `fk_user_modif` (`fk_user_modif`),
    CONSTRAINT `llx_vicentina_logistic_cost_fk_user_creat` FOREIGN KEY (`fk_user_creat`) REFERENCES `llx_user` (`rowid`),
    CONSTRAINT `llx_vicentina_logistic_cost_fk_user_modif` FOREIGN KEY (`fk_user_modif`) REFERENCES `llx_user` (`rowid`)
) ENGINE=InnoDB;


CREATE TABLE `llx_vicentina_caliber` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `description` text DEFAULT NULL,
    `fk_user_creat` int(11) DEFAULT NULL,
    `fk_user_modif` int(11) DEFAULT NULL,
    `date_creation` datetime DEFAULT NULL,
    `tms` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`rowid`),
    KEY `fk_user_creat` (`fk_user_creat`),
    KEY `fk_user_modif` (`fk_user_modif`),
    CONSTRAINT `llx_vicentina_caliber_fk_user_creat` FOREIGN KEY (`fk_user_creat`) REFERENCES `llx_user` (`rowid`),
    CONSTRAINT `llx_vicentina_caliber_fk_user_modif` FOREIGN KEY (`fk_user_modif`) REFERENCES `llx_user` (`rowid`)
) ENGINE=InnoDB;


CREATE TABLE `llx_vicentina_papa_cosecha` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `date` date NOT NULL,
    `crop` varchar(255) NOT NULL,
    `warehouse_id` int(11) NOT NULL,
    `logistic_cost` decimal(24,8) DEFAULT 0.00000000,
    `lot` int(11) NOT NULL,
    `variety` varchar(255) NOT NULL,
    `variety_code` varchar(255) NOT NULL,
    `type` varchar(255) NOT NULL,
    `quantity` decimal(24,8) DEFAULT 0.00000000,
    `fk_user_creat` int(11) DEFAULT NULL,
    `fk_user_modif` int(11) DEFAULT NULL,
    `date_creation` datetime DEFAULT NULL,
    `tms` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`rowid`),
    KEY `fk_user_creat` (`fk_user_creat`),
    KEY `fk_user_modif` (`fk_user_modif`),
    CONSTRAINT `llx_vicentina_harvest_fk_user_creat` FOREIGN KEY (`fk_user_creat`) REFERENCES `llx_user` (`rowid`),
    CONSTRAINT `llx_vicentina_harvest_fk_user_modif` FOREIGN KEY (`fk_user_modif`) REFERENCES `llx_user` (`rowid`)
) ENGINE=InnoDB;


ALTER TABLE `llx_vicentina_papa_cosecha` 
ADD COLUMN `product_id` int(11) DEFAULT NULL AFTER `quantity`,
ADD KEY `idx_vicentina_papa_cosecha_product_id` (`product_id`);

ALTER TABLE `llx_vicentina_papa_cosecha`
ADD CONSTRAINT `fk_vicentina_papa_cosecha_product` 
FOREIGN KEY (`product_id`) REFERENCES `llx_product` (`rowid`) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE `llx_vicentina_tong_proceso` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `date` date NOT NULL,
    `number_of_bins` int(11) DEFAULT 0,
    `potato_id` int(11) DEFAULT 0,
    `parent_potato_id` int(11) DEFAULT 0,
    `fk_user_creat` int(11) DEFAULT NULL,
    `fk_user_modif` int(11) DEFAULT NULL,
    PRIMARY KEY (`rowid`),
    KEY `fk_user_creat` (`fk_user_creat`),
    KEY `fk_user_modif` (`fk_user_modif`),
    CONSTRAINT `llx_vicentina_tong_proceso_fk_user_creat` FOREIGN KEY (`fk_user_creat`) REFERENCES `llx_user` (`rowid`),
    CONSTRAINT `llx_vicentina_tong_proceso_fk_user_modif` FOREIGN KEY (`fk_user_modif`) REFERENCES `llx_user` (`rowid`)
) ENGINE=InnoDB;


CREATE TABLE `llx_vicentina_tong_proceso_caliber` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `tong_process_id` int(11) DEFAULT 0,
    `caliber_id` int(11) DEFAULT 0,
    `bins` int(11) DEFAULT 0,
    `fk_user_creat` int(11) DEFAULT NULL,
    `fk_user_modif` int(11) DEFAULT NULL,
    PRIMARY KEY (`rowid`),
    KEY `fk_user_creat` (`fk_user_creat`),
    KEY `fk_user_modif` (`fk_user_modif`),
    CONSTRAINT `llx_vicentina_tong_proceso_caliber_fk_user_creat` FOREIGN KEY (`fk_user_creat`) REFERENCES `llx_user` (`rowid`),
    CONSTRAINT `llx_vicentina_tong_proceso_caliber_fk_user_modif` FOREIGN KEY (`fk_user_modif`) REFERENCES `llx_user` (`rowid`)
) ENGINE=InnoDB;


CREATE TABLE `llx_vicentina_tong_proceso_costo` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `date` date NOT NULL,
    `tong_process_id` int(11) DEFAULT 0,
    `fuel_liters` decimal(24,8) DEFAULT 0.00000000,
    `fuel_cost` decimal(24,8) DEFAULT 0.00000000,
    `lift_cost` decimal(24,8) DEFAULT 0.00000000,
    `gata_cost` decimal(24,8) DEFAULT 0.00000000,
    `fk_user_creat` int(11) DEFAULT NULL,
    `fk_user_modif` int(11) DEFAULT NULL,
    PRIMARY KEY (`rowid`),
    KEY `fk_user_creat` (`fk_user_creat`),
    KEY `fk_user_modif` (`fk_user_modif`),
    CONSTRAINT `llx_vicentina_tong_proceso_costo_fk_user_creat` FOREIGN KEY (`fk_user_creat`) REFERENCES `llx_user` (`rowid`),
    CONSTRAINT `llx_vicentina_tong_proceso_costo_fk_user_modif` FOREIGN KEY (`fk_user_modif`) REFERENCES `llx_user` (`rowid`)
) ENGINE=InnoDB;




CREATE TABLE `llx_vicentina_tong_costo` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `date` date NOT NULL,
    `max_bins` int(11) DEFAULT 1,
    `fuel_liters` decimal(24,8) DEFAULT 0.00000000,
    `fuel_cost` decimal(24,8) DEFAULT 0.00000000,
    `lift_cost` decimal(24,8) DEFAULT 0.00000000,
    `gata_cost` decimal(24,8) DEFAULT 0.00000000,
    `fk_user_creat` int(11) DEFAULT NULL,
    `fk_user_modif` int(11) DEFAULT NULL,
    PRIMARY KEY (`rowid`),
    KEY `fk_user_creat` (`fk_user_creat`),
    KEY `fk_user_modif` (`fk_user_modif`),
    CONSTRAINT `llx_vicentina_tong_costo_fk_user_creat` FOREIGN KEY (`fk_user_creat`) REFERENCES `llx_user` (`rowid`),
    CONSTRAINT `llx_vicentina_tong_costo_fk_user_modif` FOREIGN KEY (`fk_user_modif`) REFERENCES `llx_user` (`rowid`)
) ENGINE=InnoDB;


CREATE TABLE `llx_vicentina_wash_cost` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `date` date NOT NULL,
    `energy_cost` decimal(24,8) DEFAULT 0.00000000,
    `maintenance_cost` decimal(24,8) DEFAULT 0.00000000,
    `bag_cost` decimal(24,8) DEFAULT 0.00000000,
    `film_cost` decimal(24,8) DEFAULT 0.00000000,
    `thread_cost` decimal(24,8) DEFAULT 0.00000000,
    `pallet_cost` decimal(24,8) DEFAULT 0.00000000,
    `other_cost` decimal(24,8) DEFAULT 0.00000000,
    `fk_user_creat` int(11) DEFAULT NULL,
    `fk_user_modif` int(11) DEFAULT NULL,
    PRIMARY KEY (`rowid`),
    KEY `fk_user_creat` (`fk_user_creat`),
    KEY `fk_user_modif` (`fk_user_modif`),
    CONSTRAINT `llx_vicentina_wash_cost_fk_user_creat` FOREIGN KEY (`fk_user_creat`) REFERENCES `llx_user` (`rowid`),
    CONSTRAINT `llx_vicentina_wash_cost_fk_user_modif` FOREIGN KEY (`fk_user_modif`) REFERENCES `llx_user` (`rowid`)
) ENGINE=InnoDB;

ALTER TABLE `llx_vicentina_wash_cost`
ADD COLUMN `label_cost` decimal(24,8) DEFAULT 0.00000000 AFTER `other_cost`;

ALTER TABLE `llx_vicentina_wash_cost`
ADD COLUMN `lift_cost` decimal(24,8) DEFAULT 0.00000000 AFTER `label_cost`;



CREATE TABLE `llx_vicentina_wash_quality` (
    `rowid` int(11) NOT NULL AUTO_INCREMENT,
    `quality_name` varchar(255) NOT NULL,
    `quality_description` text DEFAULT NULL,
    `label_name` varchar(255) NOT NULL,
    `label_description` text DEFAULT NULL,
    `fk_user_creat` int(11) DEFAULT NULL,
    `fk_user_modif` int(11) DEFAULT NULL,
    PRIMARY KEY (`rowid`),
    KEY `fk_user_creat` (`fk_user_creat`),
    KEY `fk_user_modif` (`fk_user_modif`),
    CONSTRAINT `llx_vicentina_wash_quality_fk_user_creat` FOREIGN KEY (`fk_user_creat`) REFERENCES `llx_user` (`rowid`),
    CONSTRAINT `llx_vicentina_wash_quality_fk_user_modif` FOREIGN KEY (`fk_user_modif`) REFERENCES `llx_user` (`rowid`)
) ENGINE=InnoDB;