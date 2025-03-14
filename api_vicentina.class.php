<?php

require_once DOL_DOCUMENT_ROOT . '/api/class/api.class.php';
require_once DOL_DOCUMENT_ROOT . '/includes/restler/framework/Luracast/Restler/RestException.php';

use Luracast\Restler\RestException;

/**
 * API class for Vicentina module
 *
 * @access protected
 * @class  DolibarrApiAccess {@requires user,external}
 */
class Vicentina extends DolibarrApi
{
    /**
     * Constructor
     */
    public function __construct()
    {
        global $db, $user;

        $this->db = $db;

        // Verificar si el usuario está autenticado y si el DOLAPIKEY es válido
        if (empty($user->id)) {
            throw new RestException(401, 'Unauthorized: Invalid or missing DOLAPIKEY');
        }
    }
    /**
     * Get all records from vicentina_cusa table
     *
     * @url GET /cusa
     * @return array List of records
     * @throws RestException 503 Error retrieving data
     */
    public function getCusa()
    {
        $sql = "SELECT * FROM " . MAIN_DB_PREFIX . "vicentina_cusa";
        $result = $this->db->query($sql);

        if ($result) {
            $records = array();
            while ($obj = $this->db->fetch_object($result)) {
                $records[] = $this->_cleanObjectDatas($obj);
            }
            return $records;
        } else {
            throw new RestException(503, 'Error retrieving data: ' . $this->db->lasterror());
        }
    }

    /**
     * Clean sensible object datas
     *
     * @param   Object  $object    Object to clean
     * @return  Object             Object with cleaned properties
     */
    protected function _cleanObjectDatas($object)
    {
        $object = parent::_cleanObjectDatas($object);
        return $object;
    }

    /**
     * Create new machinery record
     *
     * @url POST /machinery/create
     * @param array $request_data {
     *     @var string $brand Marca de la maquinaria
     *     @var string $code Código de la maquinaria
     *     @var float $cusa_cost Costo CUSA
     *     @var string $description Descripción
     *     @var string $id_padron ID del padrón
     *     @var string $insurance Seguro
     *     @var string $labor Labor
     *     @var string $lts Litros
     *     @var string $maintenance_hours Horas de mantenimiento
     *     @var string $model Modelo
     *     @var string $name Nombre
     *     @var string $padron Padrón
     *     @var string $plate Placa
     *     @var string $state Estado
     *     @var string $year_fabrication Año de fabricación
     *     @var string $year_purchase Año de compra
     * }
     * @return array Created machinery record
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function createMachinery($request_data)
    {
        global $user;

        // Validación básica
        if (empty($request_data['code']) || empty($request_data['name'])) {
            throw new RestException(400, 'Code and name are required fields');
        }

        // Verificar si ya existe una maquinaria con el mismo código
        $sql = "SELECT COUNT(*) as count FROM " . MAIN_DB_PREFIX . "vicentina_maquinaria WHERE code = '" . $this->db->escape($request_data['code']) . "'";
        $result = $this->db->query($sql);
        if ($result && ($obj = $this->db->fetch_object($result)) && $obj->count > 0) {
            throw new RestException(400, 'A machinery with this code already exists');
        }

        $fields = [];
        $values = [];

        $possible_fields = [
            'brand',
            'code',
            'cusa_cost',
            'description',
            'id_padron',
            'insurance',
            'labor',
            'lts',
            'maintenance_hours',
            'model',
            'name',
            'padron',
            'plate',
            'state',
            'year_fabrication',
            'year_purchase'
        ];

        foreach ($possible_fields as $field) {
            if (isset($request_data[$field]) && $request_data[$field] !== '') {
                $fields[] = $field;
                if ($field === 'cusa_cost') {
                    $values[] = (float) $request_data[$field];
                } else {
                    $values[] = "'" . $this->db->escape($request_data[$field]) . "'";
                }
            }
        }

        // Agregar fecha de creación y usuario creador
        $fields[] = 'date_creation';
        $values[] = "'" . $this->db->idate(dol_now()) . "'";

        $fields[] = 'fk_user_creat';
        $values[] = $user->id;

        $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_maquinaria (";
        $sql .= implode(", ", $fields);
        $sql .= ") VALUES (";
        $sql .= implode(", ", $values);
        $sql .= ")";

        $result = $this->db->query($sql);

        if ($result) {
            $id = $this->db->last_insert_id(MAIN_DB_PREFIX . 'vicentina_maquinaria');
            return array('id' => $id, 'message' => 'Machinery created successfully');
        } else {
            throw new RestException(500, 'Error creating machinery: ' . $this->db->lasterror());
        }
    }

    /**
     * Get all machinery records
     *
     * @url GET /machinery/list
     * @return array List of machinery records
     * @throws RestException 503 Error retrieving data
     */
    public function listMachinery()
    {
        $sql = "SELECT m.*, 
                      uc.login as user_creation,
                      um.login as user_modification
               FROM " . MAIN_DB_PREFIX . "vicentina_maquinaria as m
               LEFT JOIN " . MAIN_DB_PREFIX . "user as uc ON m.fk_user_creat = uc.rowid
               LEFT JOIN " . MAIN_DB_PREFIX . "user as um ON m.fk_user_modif = um.rowid
               ORDER BY m.date_creation DESC";

        $result = $this->db->query($sql);

        if ($result) {
            $records = array();
            while ($obj = $this->db->fetch_object($result)) {
                $records[] = $this->_cleanObjectDatas($obj);
            }
            return $records;
        } else {
            throw new RestException(503, 'Error retrieving machinery data: ' . $this->db->lasterror());
        }
    }

    /**
     * Get a machinery record by code
     * 
     * @url GET /machinery/get/{code}
     * @param string $code Code of the machinery record to get
     * @return array Machinery record
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function getMachinery($code)
    {
        $sql = "SELECT * FROM " . MAIN_DB_PREFIX . "vicentina_maquinaria WHERE code = '" . $code . "'";
        $result = $this->db->query($sql);
        if ($result) {
            return $this->_cleanObjectDatas($result);
        } else {
            throw new RestException(500, 'Error retrieving machinery: ' . $this->db->lasterror());
        }
    }

    /**
     * Delete a machinery record by code
     *
     * @url DELETE /machinery/delete/{code}
     * @param string $code Code of the machinery record to delete
     * @return array Deleted machinery record
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function deleteMachinery($code)
    {
        $sql = "DELETE FROM " . MAIN_DB_PREFIX . "vicentina_maquinaria WHERE code = '" . $code . "'";
        $result = $this->db->query($sql);
        if ($result) {
            return array('message' => 'Machinery deleted successfully');
        } else {
            throw new RestException(500, 'Error deleting machinery: ' . $this->db->lasterror());
        }
    }

    /**
     * Update a machinery record by code
     * 
     * @url PUT /machinery/update/{code}
     * @param string $code Code of the machinery record to update
     * @param array $request_data Updated machinery record data
     * @return array Updated machinery record
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function updateMachinery($code, $request_data)
    {
        global $user;

        if (empty($code)) {
            throw new RestException(400, 'Code is required');
        }

        // Verificar existencia
        $sql = "SELECT * FROM " . MAIN_DB_PREFIX . "vicentina_maquinaria WHERE code = '" . $this->db->escape($code) . "'";
        $result = $this->db->query($sql);
        if (!($obj = $this->db->fetch_object($result))) {
            throw new RestException(404, 'Machinery not found');
        }

        try {
            $sql_parts = array();

            // Mapeo de campos permitidos y sus tipos
            $fields_config = [
                'brand' => ['type' => 'string', 'nullable' => true],
                'model' => ['type' => 'string', 'nullable' => true],
                'year_fabrication' => ['type' => 'int', 'nullable' => true],
                'description' => ['type' => 'string', 'nullable' => true],
                'year_purchase' => ['type' => 'int', 'nullable' => true],
                'state' => ['type' => 'string', 'nullable' => true],
                'plate' => ['type' => 'string', 'nullable' => true],
                'labor' => ['type' => 'string', 'nullable' => true],
                'cusa_cost' => ['type' => 'decimal', 'nullable' => true],
                'lts' => ['type' => 'decimal', 'nullable' => true],
                'maintenance_hours' => ['type' => 'int', 'nullable' => true],
                'padron' => ['type' => 'string', 'nullable' => true],
                'id_padron' => ['type' => 'string', 'nullable' => true],
                'insurance' => ['type' => 'string', 'nullable' => true],
                'name' => ['type' => 'string', 'nullable' => false]
            ];

            // Procesar cada campo
            foreach ($request_data as $field => $value) {
                if (!isset($fields_config[$field])) {
                    continue; // Ignorar campos no permitidos
                }

                $config = $fields_config[$field];

                if ($value === null && $config['nullable']) {
                    $sql_parts[] = $field . " = NULL";
                } elseif ($value !== null) {
                    switch ($config['type']) {
                        case 'int':
                            $sql_parts[] = $field . " = " . intval($value);
                            break;
                        case 'decimal':
                            $value = str_replace(',', '.', $value);
                            $sql_parts[] = $field . " = " . floatval($value);
                            break;
                        case 'string':
                        default:
                            $sql_parts[] = $field . " = '" . $this->db->escape($value) . "'";
                            break;
                    }
                }
            }

            if (empty($sql_parts)) {
                throw new RestException(400, 'No valid fields to update');
            }

            // Agregar campos de auditoría
            $sql_parts[] = "fk_user_modif = " . (int) $user->id;

            // Construir y ejecutar la consulta
            $sql = "UPDATE " . MAIN_DB_PREFIX . "vicentina_maquinaria SET ";
            $sql .= implode(", ", $sql_parts);
            $sql .= " WHERE code = '" . $this->db->escape($code) . "'";

            $resql = $this->db->query($sql);
            if (!$resql) {
                throw new RestException(500, 'Database error: ' . $this->db->lasterror());
            }

            $num_rows_affected = $this->db->affected_rows($resql);

            // Verificar si hubo cambios reales en los datos
            if ($num_rows_affected >= 0) {
                return array(
                    'success' => true,
                    'message' => 'Machinery updated successfully',
                    'code' => $code,
                    'affected_rows' => $num_rows_affected,
                    'sql' => $sql  // Solo para debug, puedes removerlo en producción
                );
            } else {
                throw new RestException(500, 'Error updating machinery: ' . $sql);
            }

        } catch (Exception $e) {
            throw new RestException(500, 'Error updating machinery: ' . $sql);
        }
    }

    /**
     * Get current value of a field for a specific machinery code
     *
     * @param string $code Code of the machinery
     * @param string $field Field name to get value for
     * @return mixed Current value of the field
     */
    protected function getCurrentValue($code, $field)
    {
        $sql = "SELECT " . $field . " FROM " . MAIN_DB_PREFIX . "vicentina_maquinaria WHERE code = '" . $this->db->escape($code) . "'";
        $result = $this->db->query($sql);
        if ($result && ($obj = $this->db->fetch_object($result))) {
            return $obj->$field;
        }
        return null;
    }


    //!Crop requests
    /**
     * Create new field record
     *
     * @url POST /crop/create
     * @param array $request_data {
     *     @var string $code Reference of the field
     *     @var string $codigo_campo Field code
     *     @var string $cultivo Crop type
     *     @var string $periodo Period
     *     @var string $anio Year
     *     @var string $etapa Stage
     *     @var string $description Description
     *     @var string $sub_lot_name Sub lot name
     *     @var int $status Status
     *     @var array $lots Array of lot assignments {
     *         @var int $id_lote Lot ID
     *         @var float $area_utilizada Used area
     *     }
     * }
     * @return array Created field record
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function createCrop($request_data)
    {
        global $user;

        if (empty($request_data['code'])) {
            throw new RestException(400, 'Reference is a required field');
        }

        $this->db->begin();

        try {
            // Insert main crop record
            $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_cultivo (";
            $sql .= "code, codigo_campo, cultivo, periodo, anio, etapa, description, status, fk_user_creat, date_creation";
            $sql .= ") VALUES (";
            $sql .= "'" . $this->db->escape($request_data['code']) . "', ";
            $sql .= (int) $request_data['codigo_campo'] . ", ";
            $sql .= "'" . $this->db->escape($request_data['cultivo']) . "', ";
            $sql .= "'" . $this->db->escape($request_data['periodo']) . "', ";
            $sql .= (int) $request_data['anio'] . ", ";
            $sql .= "'" . $this->db->escape($request_data['etapa']) . "', ";
            $sql .= "'" . $this->db->escape($request_data['description']) . "', ";
            $sql .= (int) $request_data['status'] . ", ";
            $sql .= (int) $user->id . ", ";
            $sql .= "'" . $this->db->idate(dol_now()) . "'";
            $sql .= ")";

            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error creating crop: ' . $this->db->lasterror());
            }

            $crop_id = $this->db->last_insert_id(MAIN_DB_PREFIX . 'vicentina_cultivo');

            // Process lots if provided
            if (!empty($request_data['lots']) && is_array($request_data['lots'])) {
                foreach ($request_data['lots'] as $lot) {
                    if (empty($lot['id_lote']) || !isset($lot['area_utilizada'])) {
                        continue;
                    }

                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_cultivo_lote (";
                    $sql .= "fk_cultivo, fk_lote, area_utilizada, date_creation, fk_user_creat, status";
                    $sql .= ") VALUES (";
                    $sql .= (int) $crop_id . ", ";
                    $sql .= (int) $lot['id_lote'] . ", ";
                    $sql .= floatval($lot['area_utilizada']) . ", ";
                    $sql .= "'" . $this->db->idate(dol_now()) . "', ";
                    $sql .= (int) $user->id . ", ";
                    $sql .= "1)";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating crop-lot relationship: ' . $this->db->lasterror());
                    }
                }
            }

            // Process sub-lots if provided
            if (!empty($request_data['sub_lots']) && is_array($request_data['sub_lots'])) {
                foreach ($request_data['sub_lots'] as $sub_lot) {
                    if (empty($sub_lot['id_parent_lot']) || empty($sub_lot['name']) || !isset($sub_lot['area_utilizada'])) {
                        continue;
                    }

                    // Get the fk_cultivo_lote ID for the parent lot
                    $sql = "SELECT rowid FROM " . MAIN_DB_PREFIX . "vicentina_cultivo_lote 
                            WHERE fk_cultivo = " . (int) $crop_id . " AND fk_lote = " . (int) $sub_lot['id_parent_lot'];
                    $result = $this->db->query($sql);
                    $cultivo_lote = $this->db->fetch_object($result);
                    if (!$cultivo_lote) {
                        throw new Exception('Parent lot not found for sub-lot: ' . $this->db->lasterror());
                    }

                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_cultivo_sublote (";
                    $sql .= "name, fk_cultivo, fk_lote, area_utilizada, date_creation, fk_cultivo_lote";
                    $sql .= ") VALUES (";
                    $sql .= "'" . $this->db->escape($sub_lot['name']) . "', ";
                    $sql .= (int) $crop_id . ", ";
                    $sql .= (int) $sub_lot['id_parent_lot'] . ", ";
                    $sql .= floatval($sub_lot['area_utilizada']) . ", ";
                    $sql .= "'" . $this->db->idate(dol_now()) . "', ";
                    $sql .= (int) $cultivo_lote->rowid . ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating sub-lot: ' . $this->db->lasterror());
                    }
                }
            }

            $this->db->commit();

            return array(
                'id' => $crop_id,
                'message' => 'Crop created successfully'
            );

        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }


    /**
     * Get all field records
     *
     * @url GET /crop/list
     * @return array List of field records
     * @throws RestException 503 Error retrieving data
     */
    public function listCrop()
    {
        $sql = "SELECT f.*, 
                      uc.login as user_creation,
                      um.login as user_modification,
                      c.name as campo_name
               FROM " . MAIN_DB_PREFIX . "vicentina_cultivo as f
               LEFT JOIN " . MAIN_DB_PREFIX . "user as uc ON f.fk_user_creat = uc.rowid
               LEFT JOIN " . MAIN_DB_PREFIX . "user as um ON f.fk_user_modif = um.rowid
               LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_campo as c ON f.codigo_campo = c.rowid
               ORDER BY f.date_creation DESC";

        $result = $this->db->query($sql);

        if ($result) {
            $records = array();
            while ($obj = $this->db->fetch_object($result)) {
                $records[] = $this->_cleanObjectDatas($obj);
            }
            return $records;
        } else {
            throw new RestException(503, 'Error retrieving field data: ' . $this->db->lasterror());
        }
    }

    /**
     * Delete a field record by code
     *
     * @url DELETE /crop/delete/{code}
     * @param string $code Code of the field record to delete
     * @return array Response message
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function deleteCrop($code)
    {
        if (empty($code)) {
            throw new RestException(400, 'Code is required');
        }

        $sql = "DELETE FROM " . MAIN_DB_PREFIX . "vicentina_cultivo WHERE code = '" . $this->db->escape($code) . "'";
        $result = $this->db->query($sql);

        if ($result) {
            return array('message' => 'Field deleted successfully');
        } else {
            throw new RestException(500, 'Error deleting field: ' . $this->db->lasterror());
        }
    }


    /**
     * Update a field record by code
     * 
     * @url PUT /crop/update/{code}
     * @param string $code Code of the field to update
     * @param array $request_data Updated field record data
     * @return array Updated field record
     * @throws RestException 400 Bad Request
     * @throws RestException 404 Not Found
     * @throws RestException 500 Internal Server Error
     */
    public function updateCrop($code, $request_data)
    {
        global $user;

        if (empty($code)) {
            throw new RestException(400, 'Code is required');
        }

        // Iniciar transacción
        $this->db->begin();

        try {
            // Obtener el ID del cultivo actual
            $sql = "SELECT rowid FROM " . MAIN_DB_PREFIX . "vicentina_cultivo WHERE code = '" . $this->db->escape($code) . "'";
            $result = $this->db->query($sql);
            if (!($obj = $this->db->fetch_object($result))) {
                throw new RestException(404, 'Field not found');
            }
            $cultivo_id = $obj->rowid;

            $sql_parts = array();

            // Mapeo de campos permitidos y sus tipos
            $fields_config = [
                'codigo_campo' => ['type' => 'string', 'nullable' => true],
                'cultivo' => ['type' => 'string', 'nullable' => true],
                'periodo' => ['type' => 'string', 'nullable' => true],
                'anio' => ['type' => 'string', 'nullable' => true],
                'etapa' => ['type' => 'string', 'nullable' => true],
                'description' => ['type' => 'string', 'nullable' => true],
                'status' => ['type' => 'int', 'nullable' => false],
                'code' => ['type' => 'string', 'nullable' => false]
            ];

            // Procesar cada campo
            foreach ($request_data as $field => $value) {
                if (!isset($fields_config[$field])) {
                    continue;
                }

                $config = $fields_config[$field];

                if ($value === null && $config['nullable']) {
                    $sql_parts[] = $field . " = NULL";
                } elseif ($value !== null) {
                    switch ($config['type']) {
                        case 'int':
                            $sql_parts[] = $field . " = " . intval($value);
                            break;
                        case 'string':
                        default:
                            $sql_parts[] = $field . " = '" . $this->db->escape($value) . "'";
                            break;
                    }
                }
            }

            if (!empty($sql_parts)) {
                // Agregar campos de auditoría
                $sql_parts[] = "fk_user_modif = " . (int) $user->id;
                $sql_parts[] = "tms = '" . $this->db->idate(dol_now()) . "'";

                // Actualizar la tabla principal
                $sql = "UPDATE " . MAIN_DB_PREFIX . "vicentina_cultivo SET ";
                $sql .= implode(", ", $sql_parts);
                $sql .= " WHERE code = '" . $this->db->escape($code) . "'";

                $resql = $this->db->query($sql);
                if (!$resql) {
                    throw new Exception('Database error: ' . $this->db->lasterror());
                }
            }

            // Manejar la actualización de lotes
            if (isset($request_data['lots']) && is_array($request_data['lots'])) {
                // Primero, eliminar todas las asignaciones existentes
                $sql = "DELETE FROM " . MAIN_DB_PREFIX . "vicentina_cultivo_lote WHERE fk_cultivo = " . (int) $cultivo_id;
                $this->db->query($sql);

                // Insertar las nuevas asignaciones de lotes
                foreach ($request_data['lots'] as $lot) {
                    if (empty($lot['id_lote']) || !isset($lot['area_utilizada'])) {
                        continue;
                    }

                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_cultivo_lote (";
                    $sql .= "fk_cultivo, fk_lote, area_utilizada, ";
                    $sql .= "date_creation, fk_user_creat, status";
                    $sql .= ") VALUES (";
                    $sql .= (int) $cultivo_id . ", ";
                    $sql .= (int) $lot['id_lote'] . ", ";
                    $sql .= floatval($lot['area_utilizada']) . ", ";
                    $sql .= "'" . $this->db->idate(dol_now()) . "', ";
                    $sql .= (int) $user->id . ", ";
                    $sql .= "1)";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating crop-lot relationship: ' . $this->db->lasterror());
                    }
                }
            }

            // Manejar la actualización de sub-lotes
            if (isset($request_data['sub_lots']) && is_array($request_data['sub_lots'])) {
                // Primero, eliminar todas las asignaciones existentes
                $sql = "DELETE FROM " . MAIN_DB_PREFIX . "vicentina_cultivo_sublote WHERE fk_cultivo = " . (int) $cultivo_id;
                $this->db->query($sql);

                // Insertar las nuevas asignaciones de sub-lotes
                foreach ($request_data['sub_lots'] as $sub_lot) {
                    if (empty($sub_lot['id_parent_lot']) || empty($sub_lot['name']) || !isset($sub_lot['area_utilizada'])) {
                        continue;
                    }

                    // Get the fk_cultivo_lote ID for the parent lot
                    $sql = "SELECT rowid FROM " . MAIN_DB_PREFIX . "vicentina_cultivo_lote 
                            WHERE fk_cultivo = " . (int) $cultivo_id . " AND fk_lote = " . (int) $sub_lot['id_parent_lot'];
                    $result = $this->db->query($sql);
                    $cultivo_lote = $this->db->fetch_object($result);
                    if (!$cultivo_lote) {
                        throw new Exception('Parent lot not found for sub-lot: ' . $this->db->lasterror());
                    }

                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_cultivo_sublote (";
                    $sql .= "name, fk_cultivo, fk_lote, area_utilizada, date_creation, fk_cultivo_lote";
                    $sql .= ") VALUES (";
                    $sql .= "'" . $this->db->escape($sub_lot['name']) . "', ";
                    $sql .= (int) $cultivo_id . ", ";
                    $sql .= (int) $sub_lot['id_parent_lot'] . ", ";
                    $sql .= floatval($sub_lot['area_utilizada']) . ", ";
                    $sql .= "'" . $this->db->idate(dol_now()) . "', ";
                    $sql .= (int) $cultivo_lote->rowid . ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating sub-lot: ' . $this->db->lasterror());
                    }
                }
            }

            $this->db->commit();

            return array(
                'success' => true,
                'message' => 'Field updated successfully',
                'code' => isset($request_data['code']) ? $request_data['code'] : $code
            );

        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, 'Error updating field: ' . $e->getMessage());
        }
    }

    /**
     * Get a field record by code
     * 
     * @url GET /crop/get/{code}
     * @param string $code Code of the field to retrieve
     * @return array Field record with coordinates
     * @throws RestException 400 Bad Request
     * @throws RestException 404 Not Found
     * @throws RestException 500 Internal Server Error
     */
    public function getCrop($code)
    {
        if (empty($code)) {
            throw new RestException(400, 'Code is required');
        }

        // Get crop data with associated lots
        $sql = "SELECT f.rowid, f.code, f.codigo_campo, f.cultivo, f.periodo, f.anio, 
                       f.etapa, f.description, f.status, f.date_creation, f.tms,
                       uc.login as user_creation,
                       um.login as user_modification,
                       cl.fk_lote as id_lote,
                       cl.area_utilizada,
                       l.name as lot_name,
                       l.area_web as lot_area,
                       c.name as campo_name
               FROM " . MAIN_DB_PREFIX . "vicentina_cultivo as f
               LEFT JOIN " . MAIN_DB_PREFIX . "user as uc ON f.fk_user_creat = uc.rowid
               LEFT JOIN " . MAIN_DB_PREFIX . "user as um ON f.fk_user_modif = um.rowid
               LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_cultivo_lote as cl ON f.rowid = cl.fk_cultivo
               LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_lote as l ON cl.fk_lote = l.rowid
               LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_campo as c ON l.fk_campo = c.rowid
               WHERE f.code = '" . $this->db->escape($code) . "'";

        $result = $this->db->query($sql);

        if ($result) {
            $crop = null;
            $lots = array();

            while ($obj = $this->db->fetch_object($result)) {
                if (!$crop) {
                    // Initialize crop data (only once)
                    $crop = array(
                        'rowid' => $obj->rowid,
                        'code' => $obj->code,
                        'codigo_campo' => $obj->codigo_campo,
                        'cultivo' => $obj->cultivo,
                        'periodo' => $obj->periodo,
                        'anio' => $obj->anio,
                        'etapa' => $obj->etapa,
                        'description' => $obj->description,
                        'status' => $obj->status,
                        'date_creation' => $this->db->jdate($obj->date_creation),
                        'tms' => $this->db->jdate($obj->tms),
                        'user_creation' => $obj->user_creation,
                        'user_modification' => $obj->user_modification
                    );
                }

                // Add lot data if exists
                if ($obj->id_lote) {
                    $lots[] = array(
                        'id_lote' => (int) $obj->id_lote,
                        'name' => $obj->lot_name,
                        'area_total' => floatval($obj->lot_area),
                        'area_utilizada' => floatval($obj->area_utilizada),
                        'campo_name' => $obj->campo_name
                    );
                }
            }

            if (!$crop) {
                throw new RestException(404, 'Crop not found');
            }

            // Agregar los lotes al resultado
            $crop['lots'] = $lots;

            return $crop;
        } else {
            throw new RestException(500, 'Error retrieving crop: ' . $this->db->lasterror());
        }
    }

    //!Field requests

    /**
     * Create new field record with coordinates
     *
     * @url POST /field/create
     * @param array $request_data {
     *     @var string $name Field name
     *     @var string $description Field description
     *     @var string $location Field location
     *     @var float $area_real Real area
     *     @var float $area_web Web area
     *     @var boolean $rented Rented status
     *     @var int $period Rental period in months (optional)
     *     @var float $rent_cost Monthly rental cost (optional)
     *     @var array $coordinates Array of [latitude, longitude] coordinates
     * }
     * @return array Created field record
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function createField($request_data)
    {
        global $user;

        if (empty($request_data['name'])) {
            throw new RestException(400, 'Name is required');
        }

        $this->db->begin();

        try {
            // Insert main field record
            $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_campo (";
            $sql .= "name, description, location, area_real, area_web, rented, ";
            $sql .= "period, rent_cost, ";  // Add new fields
            $sql .= "fk_user_creat, date_creation, status";
            $sql .= ") VALUES (";
            $sql .= "'" . $this->db->escape($request_data['name']) . "', ";
            $sql .= "'" . $this->db->escape($request_data['description']) . "', ";
            $sql .= "'" . $this->db->escape($request_data['location']) . "', ";
            $sql .= floatval($request_data['area_real']) . ", ";
            $sql .= floatval($request_data['area_web']) . ", ";
            $sql .= ($request_data['rented'] === 'true' ? "1" : "0") . ", ";
            $sql .= (isset($request_data['period']) ? (int) $request_data['period'] : "NULL") . ", ";
            $sql .= (isset($request_data['rent_cost']) ? floatval($request_data['rent_cost']) : "NULL") . ", ";
            $sql .= (int) $user->id . ", ";
            $sql .= "'" . $this->db->idate(dol_now()) . "', ";
            $sql .= "1)";

            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error creating field: ' . $this->db->lasterror());
            }

            $field_id = $this->db->last_insert_id(MAIN_DB_PREFIX . 'vicentina_campo');

            // Insert coordinates
            if (!empty($request_data['coordinates'])) {
                foreach ($request_data['coordinates'] as $coord) {
                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_campo_coordinates (";
                    $sql .= "field_id, latitude, longitude";
                    $sql .= ") VALUES (";
                    $sql .= $field_id . ", ";
                    $sql .= floatval($coord[0]) . ", ";
                    $sql .= floatval($coord[1]) . ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating coordinates: ' . $this->db->lasterror());
                    }
                }
            }

            $this->db->commit();

            return array(
                'id' => $field_id,
                'message' => 'Field created successfully'
            );

        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }


    /**
     * Update a field record
     * 
     * @url PUT /field/update/{id}
     * @param int $id ID of the field to update
     * @param array $request_data {
     *     @var string $name Field name
     *     @var string $description Field description
     *     @var string $location Field location
     *     @var float $area_real Real area
     *     @var float $area_web Web area
     *     @var boolean $rented Rented status
     *     @var int $period Rental period in months (optional)
     *     @var float $rent_cost Monthly rental cost (optional)
     *     @var array $coordinates Array of [latitude, longitude] coordinates (optional)
     * }
     * @return array Updated field record
     * @throws RestException 400 Bad Request
     * @throws RestException 404 Not Found
     * @throws RestException 500 Internal Server Error
     */
    public function updateField($id, $request_data)
    {
        global $user;

        if (empty($id)) {
            throw new RestException(400, 'ID is required');
        }

        // Verify field exists
        $sql = "SELECT rowid FROM " . MAIN_DB_PREFIX . "vicentina_campo WHERE rowid = " . (int) $id;
        $result = $this->db->query($sql);
        if (!$this->db->fetch_object($result)) {
            throw new RestException(404, 'Field not found');
        }

        $this->db->begin();

        try {
            $updateFields = array();

            // Map of fields and their validation/conversion rules
            $fieldMap = [
                'name' => ['type' => 'string', 'required' => true],
                'description' => ['type' => 'string', 'required' => false],
                'location' => ['type' => 'string', 'required' => false],
                'area_real' => ['type' => 'float', 'required' => false],
                'area_web' => ['type' => 'float', 'required' => false],
                'rented' => ['type' => 'boolean', 'required' => false],
                'period' => ['type' => 'int', 'required' => false, 'nullable' => true],
                'rent_cost' => ['type' => 'float', 'required' => false, 'nullable' => true]
            ];

            // Process each field according to its rules
            foreach ($fieldMap as $field => $rules) {
                if (array_key_exists($field, $request_data)) {
                    $value = $request_data[$field];

                    // Handle nullable fields
                    if (isset($rules['nullable']) && $rules['nullable'] && $value === null) {
                        $updateFields[] = "$field = NULL";
                        continue;
                    }

                    // Skip empty required fields
                    if ($rules['required'] && empty($value)) {
                        throw new RestException(400, ucfirst($field) . ' is required');
                    }

                    // Convert and validate according to type
                    switch ($rules['type']) {
                        case 'string':
                            $updateFields[] = "$field = '" . $this->db->escape($value) . "'";
                            break;
                        case 'float':
                            $updateFields[] = "$field = " . floatval($value);
                            break;
                        case 'int':
                            $updateFields[] = "$field = " . intval($value);
                            break;
                        case 'boolean':
                            $updateFields[] = "$field = " . ($value ? "1" : "0");
                            break;
                    }
                }
            }

            if (!empty($updateFields)) {
                // Add audit fields
                $updateFields[] = "fk_user_modif = " . (int) $user->id;
                $updateFields[] = "tms = '" . $this->db->idate(dol_now()) . "'";

                // Build and execute update query
                $sql = "UPDATE " . MAIN_DB_PREFIX . "vicentina_campo SET ";
                $sql .= implode(", ", $updateFields);
                $sql .= " WHERE rowid = " . (int) $id;

                $result = $this->db->query($sql);
                if (!$result) {
                    throw new Exception('Error updating field: ' . $this->db->lasterror());
                }
            }

            // Handle coordinates update if provided
            if (isset($request_data['coordinates'])) {
                // Delete existing coordinates
                $sql = "DELETE FROM " . MAIN_DB_PREFIX . "vicentina_campo_coordinates WHERE field_id = " . (int) $id;
                $this->db->query($sql);

                // Insert new coordinates
                foreach ($request_data['coordinates'] as $coord) {
                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_campo_coordinates (";
                    $sql .= "field_id, latitude, longitude";
                    $sql .= ") VALUES (";
                    $sql .= (int) $id . ", ";
                    $sql .= floatval($coord[0]) . ", ";
                    $sql .= floatval($coord[1]) . ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error updating coordinates: ' . $this->db->lasterror());
                    }
                }
            }

            $this->db->commit();

            // Return updated field data
            return array(
                'id' => $id,
                'message' => 'Field updated successfully',
                'updated_data' => $request_data
            );

        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * Get all fields
     *
     * @url GET /field/list
     * @return array List of fields
     * @throws RestException 503 Error retrieving data
     */
    public function listFields()
    {
        $sql = "SELECT f.*, 
                      uc.login as user_creation,
                      um.login as user_modification
               FROM " . MAIN_DB_PREFIX . "vicentina_campo as f
               LEFT JOIN " . MAIN_DB_PREFIX . "user as uc ON f.fk_user_creat = uc.rowid
               LEFT JOIN " . MAIN_DB_PREFIX . "user as um ON f.fk_user_modif = um.rowid
               ORDER BY f.date_creation DESC";

        $result = $this->db->query($sql);

        if ($result) {
            $records = array();
            while ($obj = $this->db->fetch_object($result)) {
                $records[] = $this->_cleanObjectDatas($obj);
            }
            return $records;
        } else {
            throw new RestException(503, 'Error retrieving fields data: ' . $this->db->lasterror());
        }
    }

    /**
     * Delete a field record by ID
     *
     * @url DELETE /field/delete/{id}
     * @param int $id ID of the field to delete
     * @return array Response message
     * @throws RestException 400 Bad Request
     * @throws RestException 404 Not Found
     * @throws RestException 500 Internal Server Error
     */
    public function deleteField($id)
    {
        if (empty($id)) {
            throw new RestException(400, 'ID is required');
        }

        // Check if field exists
        $sql = "SELECT rowid FROM " . MAIN_DB_PREFIX . "vicentina_campo WHERE rowid = " . (int) $id;
        $result = $this->db->query($sql);
        if (!$this->db->fetch_object($result)) {
            throw new RestException(404, 'Field not found');
        }

        // Delete the field (coordinates will be deleted automatically due to CASCADE)
        $sql = "DELETE FROM " . MAIN_DB_PREFIX . "vicentina_campo WHERE rowid = " . (int) $id;
        $result = $this->db->query($sql);

        if ($result) {
            return array('message' => 'Field deleted successfully');
        } else {
            throw new RestException(500, 'Error deleting field: ' . $this->db->lasterror());
        }
    }

    /**
     * Get a field record by ID with its coordinates
     * 
     * @url GET /field/get/{id}
     * @param int $id ID of the field to retrieve
     * @return array Field record with coordinates
     * @throws RestException 400 Bad Request
     * @throws RestException 404 Not Found
     * @throws RestException 500 Internal Server Error
     */
    public function getField($id)
    {
        if (empty($id)) {
            throw new RestException(400, 'ID is required');
        }

        // Get field data
        $sql = "SELECT f.*, 
                      uc.login as user_creation,
                      um.login as user_modification
               FROM " . MAIN_DB_PREFIX . "vicentina_campo as f
               LEFT JOIN " . MAIN_DB_PREFIX . "user as uc ON f.fk_user_creat = uc.rowid
               LEFT JOIN " . MAIN_DB_PREFIX . "user as um ON f.fk_user_modif = um.rowid
               WHERE f.rowid = " . (int) $id;

        $result = $this->db->query($sql);

        if ($result) {
            if ($field = $this->db->fetch_object($result)) {
                return $this->_cleanObjectDatas($field);
            } else {
                throw new RestException(404, 'Field not found');
            }
        } else {
            throw new RestException(500, 'Error retrieving field: ' . $this->db->lasterror());
        }
    }

    /**
     * Get simplified list of fields with coordinates
     *
     * @url GET /field/map
     * @return array List of fields with coordinates
     * @throws RestException 503 Error retrieving data
     */
    public function getSimplifiedFields()
    {
        $sql = "SELECT f.rowid as id, f.name, f.area_web 
               FROM " . MAIN_DB_PREFIX . "vicentina_campo as f 
               ORDER BY f.name";

        $result = $this->db->query($sql);

        if ($result) {
            $records = array();
            while ($field = $this->db->fetch_object($result)) {
                // Get coordinates for each field
                $coordSql = "SELECT latitude, longitude 
                           FROM " . MAIN_DB_PREFIX . "vicentina_campo_coordinates 
                           WHERE field_id = " . (int) $field->id .
                    " ORDER BY rowid";

                $coordResult = $this->db->query($coordSql);

                $coordinates = array();
                if ($coordResult) {
                    while ($coord = $this->db->fetch_object($coordResult)) {
                        $coordinates[] = [
                            floatval($coord->latitude),
                            floatval($coord->longitude)
                        ];
                    }
                }

                $records[] = array(
                    'id' => (int) $field->id,
                    'name' => $field->name,
                    'area_web' => floatval($field->area_web),
                    'coordinates' => $coordinates
                );
            }
            return $records;
        } else {
            throw new RestException(503, 'Error retrieving fields data: ' . $this->db->lasterror());
        }
    }

    //!Lot requests
    /**
     * Create new lot record with coordinates
     *
     * @url POST /lot/create
     * @param array $request_data {
     *     @var string $name Lot name
     *     @var int $codigo_campo Field ID (foreign key to vicentina_campo)
     *     @var float $area_real Real area
     *     @var float $area_web Web area
     *     @var string $description Lot description
     *     @var array $coordinates Array of [latitude, longitude] coordinates
     * }
     * @return array Created lot record
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function createLot($request_data)
    {
        global $user;

        // Basic validation
        if (empty($request_data['name']) || empty($request_data['codigo_campo'])) {
            throw new RestException(400, 'Name and Field ID are required');
        }

        // Verify if field exists
        $sql = "SELECT rowid FROM " . MAIN_DB_PREFIX . "vicentina_campo WHERE rowid = " . (int) $request_data['codigo_campo'];
        $result = $this->db->query($sql);
        if (!$this->db->fetch_object($result)) {
            throw new RestException(400, 'Field ID does not exist');
        }

        $this->db->begin();

        try {
            // Insert main lot record
            $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_lote (";
            $sql .= "name, fk_campo, area_real, area_web, description, ";
            $sql .= "fk_user_creat, date_creation, status";
            $sql .= ") VALUES (";
            $sql .= "'" . $this->db->escape($request_data['name']) . "', ";
            $sql .= (int) $request_data['codigo_campo'] . ", ";
            $sql .= floatval($request_data['area_real']) . ", ";
            $sql .= floatval($request_data['area_web']) . ", ";
            $sql .= "'" . $this->db->escape($request_data['description'] ?? '') . "', ";
            $sql .= (int) $user->id . ", ";
            $sql .= "'" . $this->db->idate(dol_now()) . "', ";
            $sql .= "1)";

            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error creating lot: ' . $this->db->lasterror());
            }

            $lot_id = $this->db->last_insert_id(MAIN_DB_PREFIX . 'vicentina_lote');

            // Insert coordinates if provided
            if (!empty($request_data['coordinates'])) {
                foreach ($request_data['coordinates'] as $coord) {
                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_lote_coordinates (";
                    $sql .= "lot_id, latitude, longitude";
                    $sql .= ") VALUES (";
                    $sql .= $lot_id . ", ";
                    $sql .= floatval($coord[0]) . ", ";
                    $sql .= floatval($coord[1]) . ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating coordinates: ' . $this->db->lasterror());
                    }
                }
            }

            $this->db->commit();

            return array(
                'id' => $lot_id,
                'message' => 'Lot created successfully'
            );

        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * Get all lots with their coordinates
     *
     * @url GET /lot/list
     * @return array List of lots with coordinates
     * @throws RestException 503 Error retrieving data
     */
    public function listLots()
    {
        $sql = "SELECT l.*, 
                      c.name as campo_name,
                      uc.login as user_creation,
                      um.login as user_modification
               FROM " . MAIN_DB_PREFIX . "vicentina_lote as l
               LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_campo as c ON l.fk_campo = c.rowid
               LEFT JOIN " . MAIN_DB_PREFIX . "user as uc ON l.fk_user_creat = uc.rowid
               LEFT JOIN " . MAIN_DB_PREFIX . "user as um ON l.fk_user_modif = um.rowid
               ORDER BY l.date_creation DESC";

        $result = $this->db->query($sql);

        if ($result) {
            $records = array();
            while ($lot = $this->db->fetch_object($result)) {
                // Get coordinates for each lot
                $coordSql = "SELECT latitude, longitude 
                           FROM " . MAIN_DB_PREFIX . "vicentina_lote_coordinates 
                           WHERE lot_id = " . (int) $lot->rowid .
                    " ORDER BY rowid";

                $coordResult = $this->db->query($coordSql);

                $coordinates = array();
                if ($coordResult) {
                    while ($coord = $this->db->fetch_object($coordResult)) {
                        $coordinates[] = [
                            floatval($coord->latitude),
                            floatval($coord->longitude)
                        ];
                    }
                }

                $lotData = $this->_cleanObjectDatas($lot);
                $lotData->coordinates = $coordinates;
                $records[] = $lotData;
            }
            return $records;
        } else {
            throw new RestException(503, 'Error retrieving lots data: ' . $this->db->lasterror());
        }
    }

    /**
     * Get a lot by ID with its coordinates
     * 
     * @url GET /lot/get/{id}
     * @param int $id ID of the lot to retrieve
     * @return array Lot record with coordinates
     * @throws RestException 400 Bad Request
     * @throws RestException 404 Not Found
     * @throws RestException 500 Internal Server Error
     */
    public function getLot($id)
    {
        if (empty($id)) {
            throw new RestException(400, 'ID is required');
        }

        $sql = "SELECT l.*, 
                      c.name as campo_name,
                      uc.login as user_creation,
                      um.login as user_modification
               FROM " . MAIN_DB_PREFIX . "vicentina_lote as l
               LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_campo as c ON l.fk_campo = c.rowid
               LEFT JOIN " . MAIN_DB_PREFIX . "user as uc ON l.fk_user_creat = uc.rowid
               LEFT JOIN " . MAIN_DB_PREFIX . "user as um ON l.fk_user_modif = um.rowid
               WHERE l.rowid = " . (int) $id;

        $result = $this->db->query($sql);

        if ($result) {
            if ($lot = $this->db->fetch_object($result)) {
                $lotData = $this->_cleanObjectDatas($lot);

                // Get coordinates
                $coordSql = "SELECT latitude, longitude 
                           FROM " . MAIN_DB_PREFIX . "vicentina_lote_coordinates 
                           WHERE lot_id = " . (int) $id .
                    " ORDER BY rowid";

                $coordResult = $this->db->query($coordSql);

                $coordinates = array();
                if ($coordResult) {
                    while ($coord = $this->db->fetch_object($coordResult)) {
                        $coordinates[] = [
                            floatval($coord->latitude),
                            floatval($coord->longitude)
                        ];
                    }
                }

                return array(
                    'lot' => $lotData,
                    'coordinates' => $coordinates
                );
            } else {
                throw new RestException(404, 'Lot not found');
            }
        } else {
            throw new RestException(500, 'Error retrieving lot: ' . $this->db->lasterror());
        }
    }

    /**
     * Update a lot record
     * 
     * @url PUT /lot/update/{id}
     * @param int $id ID of the lot to update
     * @param array $request_data Updated lot data
     * @return array Updated lot record
     * @throws RestException 400 Bad Request
     * @throws RestException 404 Not Found
     * @throws RestException 500 Internal Server Error
     */
    public function updateLot($id, $request_data)
    {
        global $user;

        if (empty($id)) {
            throw new RestException(400, 'ID is required');
        }

        // Verify lot exists
        $sql = "SELECT rowid FROM " . MAIN_DB_PREFIX . "vicentina_lote WHERE rowid = " . (int) $id;
        $result = $this->db->query($sql);
        if (!$this->db->fetch_object($result)) {
            throw new RestException(404, 'Lot not found');
        }

        // If campo_id is provided, verify it exists
        if (!empty($request_data['codigo_campo'])) {
            $sql = "SELECT rowid FROM " . MAIN_DB_PREFIX . "vicentina_campo WHERE rowid = " . (int) $request_data['codigo_campo'];
            $result = $this->db->query($sql);
            if (!$this->db->fetch_object($result)) {
                throw new RestException(400, 'Field ID does not exist');
            }
        }

        $this->db->begin();

        try {
            $updateFields = array();

            // Build update fields
            if (isset($request_data['name'])) {
                $updateFields[] = "name = '" . $this->db->escape($request_data['name']) . "'";
            }
            if (isset($request_data['codigo_campo'])) {
                $updateFields[] = "fk_campo = " . (int) $request_data['codigo_campo'];
            }
            if (isset($request_data['area_real'])) {
                $updateFields[] = "area_real = " . floatval($request_data['area_real']);
            }
            if (isset($request_data['area_web'])) {
                $updateFields[] = "area_web = " . floatval($request_data['area_web']);
            }
            if (isset($request_data['description'])) {
                $updateFields[] = "description = '" . $this->db->escape($request_data['description']) . "'";
            }

            // Add audit fields
            $updateFields[] = "fk_user_modif = " . (int) $user->id;
            $updateFields[] = "tms = '" . $this->db->idate(dol_now()) . "'";

            if (!empty($updateFields)) {
                $sql = "UPDATE " . MAIN_DB_PREFIX . "vicentina_lote SET ";
                $sql .= implode(", ", $updateFields);
                $sql .= " WHERE rowid = " . (int) $id;

                $result = $this->db->query($sql);
                if (!$result) {
                    throw new Exception('Error updating lot: ' . $this->db->lasterror());
                }
            }

            // Update coordinates if provided
            if (isset($request_data['coordinates'])) {
                // Delete existing coordinates
                $sql = "DELETE FROM " . MAIN_DB_PREFIX . "vicentina_lote_coordinates WHERE lot_id = " . (int) $id;
                $this->db->query($sql);

                // Insert new coordinates
                foreach ($request_data['coordinates'] as $coord) {
                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_lote_coordinates (";
                    $sql .= "lot_id, latitude, longitude";
                    $sql .= ") VALUES (";
                    $sql .= $id . ", ";
                    $sql .= floatval($coord[0]) . ", ";
                    $sql .= floatval($coord[1]) . ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error updating coordinates: ' . $this->db->lasterror());
                    }
                }
            }

            $this->db->commit();

            return array(
                'id' => $id,
                'message' => 'Lot updated successfully'
            );

        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * Delete a lot record
     *
     * @url DELETE /lot/delete/{id}
     * @param int $id ID of the lot to delete
     * @return array Response message
     * @throws RestException 400 Bad Request
     * @throws RestException 404 Not Found
     * @throws RestException 500 Internal Server Error
     */
    public function deleteLot($id)
    {
        if (empty($id)) {
            throw new RestException(400, 'ID is required');
        }

        // Verify lot exists
        $sql = "SELECT rowid FROM " . MAIN_DB_PREFIX . "vicentina_lote WHERE rowid = " . (int) $id;
        $result = $this->db->query($sql);
        if (!$this->db->fetch_object($result)) {
            throw new RestException(404, 'Lot not found');
        }

        // Delete lot (coordinates will be deleted automatically due to CASCADE)
        $sql = "DELETE FROM " . MAIN_DB_PREFIX . "vicentina_lote WHERE rowid = " . (int) $id;
        $result = $this->db->query($sql);

        if ($result) {
            return array('message' => 'Lot deleted successfully');
        } else {
            throw new RestException(500, 'Error deleting lot: ' . $this->db->lasterror());
        }
    }

    /**
     * Get simplified list of lots with coordinates
     *
     * @url GET /lot/map
     * @return array List of lots with coordinates
     * @throws RestException 503 Error retrieving data
     */
    public function getSimplifiedLots()
    {
        $sql = "SELECT l.rowid as id, l.name, l.area_web, c.name as campo_name 
               FROM " . MAIN_DB_PREFIX . "vicentina_lote as l 
               LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_campo as c ON l.fk_campo = c.rowid
               ORDER BY l.name";

        $result = $this->db->query($sql);

        if ($result) {
            $records = array();
            while ($lot = $this->db->fetch_object($result)) {
                // Get coordinates for each lot
                $coordSql = "SELECT latitude, longitude 
                           FROM " . MAIN_DB_PREFIX . "vicentina_lote_coordinates 
                           WHERE lot_id = " . (int) $lot->id .
                    " ORDER BY rowid";

                $coordResult = $this->db->query($coordSql);

                $coordinates = array();
                if ($coordResult) {
                    while ($coord = $this->db->fetch_object($coordResult)) {
                        $coordinates[] = [
                            floatval($coord->latitude),
                            floatval($coord->longitude)
                        ];
                    }
                }

                $records[] = array(
                    'id' => (int) $lot->id,
                    'name' => $lot->name,
                    'campo_name' => $lot->campo_name,
                    'area_web' => floatval($lot->area_web),
                    'coordinates' => $coordinates
                );
            }
            return $records;
        } else {
            throw new RestException(503, 'Error retrieving lots data: ' . $this->db->lasterror());
        }
    }

    /**
     * Get lots associated with a specific field
     *
     * @url GET /field/{field_id}/lots
     * @param int $field_id ID of the field
     * @return array List of lots associated with the field
     * @throws RestException 400 Bad Request
     * @throws RestException 404 Not Found
     * @throws RestException 503 Error retrieving data
     */
    public function getFieldLots($field_id)
    {
        if (empty($field_id)) {
            throw new RestException(400, 'Field ID is required');
        }

        // Verify field exists
        $sql = "SELECT rowid FROM " . MAIN_DB_PREFIX . "vicentina_campo WHERE rowid = " . (int) $field_id;
        $result = $this->db->query($sql);
        if (!$this->db->fetch_object($result)) {
            throw new RestException(404, 'Field not found');
        }

        // Get lots associated with the field
        $sql = "SELECT l.*, 
                      uc.login as user_creation,
                      um.login as user_modification
               FROM " . MAIN_DB_PREFIX . "vicentina_lote as l
               LEFT JOIN " . MAIN_DB_PREFIX . "user as uc ON l.fk_user_creat = uc.rowid
               LEFT JOIN " . MAIN_DB_PREFIX . "user as um ON l.fk_user_modif = um.rowid
               WHERE l.fk_campo = " . (int) $field_id .
            " ORDER BY l.name";

        $result = $this->db->query($sql);

        if ($result) {
            $records = array();
            while ($lot = $this->db->fetch_object($result)) {
                // Get coordinates for each lot
                $coordSql = "SELECT latitude, longitude 
                           FROM " . MAIN_DB_PREFIX . "vicentina_lote_coordinates 
                           WHERE lot_id = " . (int) $lot->rowid .
                    " ORDER BY rowid";

                $coordResult = $this->db->query($coordSql);

                $coordinates = array();
                if ($coordResult) {
                    while ($coord = $this->db->fetch_object($coordResult)) {
                        $coordinates[] = [
                            floatval($coord->latitude),
                            floatval($coord->longitude)
                        ];
                    }
                }

                $lotData = $this->_cleanObjectDatas($lot);
                $lotData->coordinates = $coordinates;
                $records[] = $lotData;
            }
            return $records;
        } else {
            throw new RestException(503, 'Error retrieving lots data: ' . $this->db->lasterror());
        }
    }

    /**
     * Get lots associated with a specific crop
     *
     * @url GET /crop/{crop_id}/lots
     * @param int $crop_id ID of the crop
     * @return array List of lots associated with the crop
     * @throws RestException 400 Bad Request
     * @throws RestException 404 Not Found
     * @throws RestException 503 Error retrieving data
     */
    public function getCropLots($crop_id)
    {
        if (empty($crop_id)) {
            throw new RestException(400, 'Crop ID is required');
        }

        // Verify crop exists
        $sql = "SELECT rowid FROM " . MAIN_DB_PREFIX . "vicentina_cultivo WHERE rowid = " . (int) $crop_id;
        $result = $this->db->query($sql);
        if (!$this->db->fetch_object($result)) {
            throw new RestException(404, 'Crop not found');
        }

        // Get lots associated with the crop
        $sql = "SELECT l.*, 
                      cl.area_utilizada,
                      c.name as campo_name,
                      uc.login as user_creation,
                      um.login as user_modification
               FROM " . MAIN_DB_PREFIX . "vicentina_cultivo_lote as cl
               LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_lote as l ON cl.fk_lote = l.rowid
               LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_campo as c ON l.fk_campo = c.rowid
               LEFT JOIN " . MAIN_DB_PREFIX . "user as uc ON l.fk_user_creat = uc.rowid
               LEFT JOIN " . MAIN_DB_PREFIX . "user as um ON l.fk_user_modif = um.rowid
               WHERE cl.fk_cultivo = " . (int) $crop_id .
            " ORDER BY l.name";

        $result = $this->db->query($sql);

        if ($result) {
            $records = array();
            while ($lot = $this->db->fetch_object($result)) {
                // Get sub-lots associated with the current lot
                $subLotSql = "SELECT sl.*, 
                                 cl.area_utilizada as sub_area_utilizada
                          FROM " . MAIN_DB_PREFIX . "vicentina_cultivo_sublote as sl
                          LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_cultivo_lote as cl ON sl.fk_cultivo_lote = cl.rowid
                          WHERE cl.fk_cultivo = " . (int) $crop_id;

                $subLotResult = $this->db->query($subLotSql);
                $subLots = array();
                if ($subLotResult) {
                    while ($subLot = $this->db->fetch_object($subLotResult)) {
                        $subLots[] = [
                            'rowid' => $subLot->rowid,
                            'name' => $subLot->name,
                            'lot_id' => $subLot->fk_lote,
                            'area_utilizada' => floatval($subLot->area_utilizada),
                        ];
                    }
                }

                $lotData = $this->_cleanObjectDatas($lot);
                $lotData->sublots = $subLots; // Add sub-lots to the lot data
                $records[] = $lotData;
            }
            return $records;
        } else {
            throw new RestException(503, 'Error retrieving lots data: ' . $this->db->lasterror());
        }
    }




    /**
     * Create new Seed Map
     *
     * @url POST register/seedmap/create
     * @param array $request_data {
     *     @var string $crop_code Crop reference code
     *     @var string $date Activity date
     *     @var int $first_equipment First equipment ID
     *     @var int $second_equipment Second equipment ID (optional)
     *     @var string $labor Labor type
     *     @var float $cusa_cost CUSA cost
     *     @var float $lts Liters
     *     @var int $grooves Number of grooves
     *     @var array $selectedLots Array of selected lots {
     *         @var int $id_lote Lot ID
     *         @var float $area_utilizada Used area
     *     }
     *     @var array $selectedSublots Array of selected sublots {
     *         @var int $id_sub_lote Sublot ID
     *         @var float $area_utilizada Used area
     *         @var int $id_parent_lote Parent lot ID
     *         @var string $name Sublot name
     *     }
     *     @var array $selectedProducts Array of selected products
     * }
     * @return array Created Seed Map record
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function createSeedMap($request_data)
    {
        global $user;

        if (empty($request_data['crop_code']) || empty($request_data['date'])) {
            throw new RestException(400, 'Crop code and date are required fields');
        }

        $this->db->begin();

        try {
            // Insert main Seed Map record
            $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_seed_map (";
            $sql .= "crop_code, date, first_equipment, second_equipment, labor, ";
            $sql .= "cusa_cost, lts, grooves, fk_user_creat, date_creation";
            $sql .= ") VALUES (";
            $sql .= "'" . $this->db->escape($request_data['crop_code']) . "', ";
            $sql .= "'" . $this->db->escape($request_data['date']) . "', ";
            $sql .= ($request_data['first_equipment'] ? (int) $request_data['first_equipment'] : "NULL") . ", ";
            $sql .= ($request_data['second_equipment'] ? (int) $request_data['second_equipment'] : "NULL") . ", ";
            $sql .= "'" . $this->db->escape($request_data['labor']) . "', ";
            $sql .= floatval($request_data['cusa_cost']) . ", ";
            $sql .= floatval($request_data['lts']) . ", ";
            $sql .= (int) $request_data['grooves'] . ", ";
            $sql .= (int) $user->id . ", ";
            $sql .= "'" . $this->db->idate(dol_now()) . "'";
            $sql .= ")";

            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error creating Seed Map: ' . $this->db->lasterror());
            }

            $seedmap_id = $this->db->last_insert_id(MAIN_DB_PREFIX . 'vicentina_seed_map');

            // Insert lots (without sublots)
            if (!empty($request_data['selectedLots'])) {
                foreach ($request_data['selectedLots'] as $lot) {
                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_registers_lots (";
                    $sql .= "register_type, fk_register, fk_lote, area_utilizada, fk_sublote";
                    $sql .= ") VALUES (";
                    $sql .= "'seed_map', ";
                    $sql .= (int) $seedmap_id . ", ";
                    $sql .= (int) $lot['id_lote'] . ", ";
                    $sql .= floatval($lot['area_utilizada']) . ", ";
                    $sql .= "NULL";  // No sublot for these entries
                    $sql .= ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating Seed Map-lot relationship: ' . $this->db->lasterror());
                    }
                }
            }

            // Insert sublots
            if (!empty($request_data['selectedSublots'])) {
                foreach ($request_data['selectedSublots'] as $sublot) {
                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_registers_lots (";
                    $sql .= "register_type, fk_register, fk_lote, area_utilizada, fk_sublote";
                    $sql .= ") VALUES (";
                    $sql .= "'seed_map', ";
                    $sql .= (int) $seedmap_id . ", ";
                    $sql .= (int) $sublot['id_parent_lote'] . ", ";
                    $sql .= floatval($sublot['area_utilizada']) . ", ";
                    $sql .= (int) $sublot['id_sub_lote'];
                    $sql .= ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating Seed Map-sublot relationship: ' . $this->db->lasterror());
                    }
                }
            }

            // Process seeds
            if (!empty($request_data['selectedSeeds'])) {
                foreach ($request_data['selectedSeeds'] as $product) {
                    $stock_used = $product['quantity'];

                    // Get PMP from product table
                    $sql = "SELECT pmp, pmp_dollar FROM " . MAIN_DB_PREFIX . "product WHERE rowid = " . (int) $product['id'];
                    $pmp_result = $this->db->query($sql);
                    $pmp_obj = $this->db->fetch_object($pmp_result);
                    $pmp = $pmp_obj && $pmp_obj->pmp ? $pmp_obj->pmp : 0;
                    $pmp_dollar = $pmp_obj && $pmp_obj->pmp_dollar ? $pmp_obj->pmp_dollar : 0;

                    // Calculate total prices
                    $total_price = $stock_used * $pmp;
                    $total_price_usd = $stock_used * $pmp_dollar;

                    // Insert seed record
                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_registers_products (";
                    $sql .= "register_type, fk_register, fk_product, quantity, warehouse_id, type, stock_used, ";
                    $sql .= "total_price, total_price_usd, unit";
                    $sql .= ") VALUES (";
                    $sql .= "'seed_map', ";
                    $sql .= (int) $seedmap_id . ", ";
                    $sql .= (int) $product['id'] . ", ";
                    $sql .= floatval($product['quantity']) . ", ";
                    $sql .= (int) $product['warehouse_id'] . ", ";
                    $sql .= "'" . $this->db->escape($product['type']) . "', ";
                    $sql .= floatval($stock_used) . ", ";
                    $sql .= floatval($total_price) . ", ";
                    $sql .= floatval($total_price_usd) . ", ";
                    $sql .= "'" . $this->db->escape($product['unit']) . "'";
                    $sql .= ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating Seed Map-seed relationship: ' . $this->db->lasterror());
                    }

                    // Update stock movement
                    require_once DOL_DOCUMENT_ROOT . '/product/stock/class/mouvementstock.class.php';
                    $movement = new MouvementStock($this->db);
                    $result = $movement->livraison(
                        $user,
                        $product['id'],
                        $product['warehouse_id'],
                        $stock_used,
                        0,
                        'Seed Map Creation - ' . $request_data['crop_code'],
                        '',
                        '',
                        '',
                        0,
                        0
                    );

                    if ($result < 0) {
                        throw new Exception('Error updating stock: ' . $movement->error);
                    }
                }
            }

            // Process chemicals
            if (!empty($request_data['selectedChemicals'])) {
                foreach ($request_data['selectedChemicals'] as $product) {
                    $stock_used = $product['quantity'];

                    // Get PMP from product table
                    $sql = "SELECT pmp, pmp_dollar FROM " . MAIN_DB_PREFIX . "product WHERE rowid = " . (int) $product['id'];
                    $pmp_result = $this->db->query($sql);
                    $pmp_obj = $this->db->fetch_object($pmp_result);
                    $pmp = $pmp_obj && $pmp_obj->pmp ? $pmp_obj->pmp : 0;
                    $pmp_dollar = $pmp_obj && $pmp_obj->pmp_dollar ? $pmp_obj->pmp_dollar : 0;

                    // Calculate total prices
                    $total_price = $stock_used * $pmp;
                    $total_price_usd = $stock_used * $pmp_dollar;

                    // Insert chemical record
                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_registers_products (";
                    $sql .= "register_type, fk_register, fk_product, quantity, warehouse_id, type, stock_used, ";
                    $sql .= "total_price, total_price_usd";  // Added product_category
                    $sql .= ") VALUES (";
                    $sql .= "'seed_map', ";
                    $sql .= (int) $seedmap_id . ", ";
                    $sql .= (int) $product['id'] . ", ";
                    $sql .= floatval($product['quantity']) . ", ";
                    $sql .= (int) $product['warehouse_id'] . ", ";
                    $sql .= "'" . $this->db->escape($product['type']) . "', ";
                    $sql .= floatval($stock_used) . ", ";
                    $sql .= floatval($total_price) . ", ";
                    $sql .= floatval($total_price_usd);
                    $sql .= ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating Seed Map-chemical relationship: ' . $this->db->lasterror());
                    }

                    // Update stock movement
                    require_once DOL_DOCUMENT_ROOT . '/product/stock/class/mouvementstock.class.php';
                    $movement = new MouvementStock($this->db);
                    $result = $movement->livraison(
                        $user,
                        $product['id'],
                        $product['warehouse_id'],
                        $stock_used,
                        0,
                        'Seed Map Creation - ' . $request_data['crop_code'],
                        '',
                        '',
                        '',
                        0,
                        0
                    );

                    if ($result < 0) {
                        throw new Exception('Error updating stock: ' . $movement->error);
                    }
                }
            }

            $this->db->commit();

            return array(
                'id' => $seedmap_id,
                'message' => 'Seed Map created successfully'
            );

        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * Create new Labor record
     *
     * @url POST register/general-labor/create
     * @param array $request_data {
     *     @var string $crop_code Crop reference code
     *     @var string $date Activity date
     *     @var string|int $first_equipment First equipment ID
     *     @var string|int $second_equipment Second equipment ID (optional)
     *     @var string $labor_code Labor code reference
     *     @var float $cusa_cost CUSA cost
     *     @var string|float $lts Liters
     *     @var array $selectedLots Array of selected lots {
     *         @var string|int $id_lote Lot ID
     *         @var float $area_utilizada Used area
     *     }
     *     @var array $selectedSublots Array of selected sublots {
     *         @var string|int $id_sub_lote Sublot ID
     *         @var float $area_utilizada Used area
     *         @var string|int $id_parent_lote Parent lot ID
     *         @var string $name Sublot name
     *     }
     * }
     * @return array Created Labor record
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function createLabor($request_data)
    {
        global $user;

        if (empty($request_data['crop_code']) || empty($request_data['date']) || empty($request_data['labor_code'])) {
            throw new RestException(400, 'Crop code, date and labor code are required fields');
        }

        $this->db->begin();

        try {
            // Insert main Labor record
            $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_labor (";
            $sql .= "crop_code, date, first_equipment, second_equipment, labor_code, ";
            $sql .= "cusa_cost, lts, fk_user_creat, date_creation";
            $sql .= ") VALUES (";
            $sql .= "'" . $this->db->escape($request_data['crop_code']) . "', ";
            $sql .= "'" . $this->db->escape($request_data['date']) . "', ";
            $sql .= (!empty($request_data['first_equipment']) ? (int) $request_data['first_equipment'] : "NULL") . ", ";
            $sql .= (!empty($request_data['second_equipment']) ? (int) $request_data['second_equipment'] : "NULL") . ", ";
            $sql .= "'" . $this->db->escape($request_data['labor_code']) . "', ";
            $sql .= (!empty($request_data['cusa_cost']) ? floatval($request_data['cusa_cost']) : "NULL") . ", ";
            $sql .= (!empty($request_data['lts']) ? floatval($request_data['lts']) : "NULL") . ", ";
            $sql .= (int) $user->id . ", ";
            $sql .= "'" . $this->db->idate(dol_now()) . "'";
            $sql .= ")";

            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error creating Labor: ' . $this->db->lasterror());
            }

            $labor_id = $this->db->last_insert_id(MAIN_DB_PREFIX . 'vicentina_labor');

            // Insert lots (without sublots)
            if (!empty($request_data['selectedLots'])) {
                foreach ($request_data['selectedLots'] as $lot) {
                    if (empty($lot['area_utilizada'])) {
                        continue; // Skip lots with area_utilizada = 0
                    }

                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_registers_lots (";
                    $sql .= "register_type, fk_register, fk_lote, area_utilizada, fk_sublote";
                    $sql .= ") VALUES (";
                    $sql .= "'labor', ";
                    $sql .= (int) $labor_id . ", ";
                    $sql .= (int) $lot['id_lote'] . ", ";
                    $sql .= floatval($lot['area_utilizada']) . ", ";
                    $sql .= "NULL";  // No sublot for these entries
                    $sql .= ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating Labor-lot relationship: ' . $this->db->lasterror());
                    }
                }
            }

            // Insert sublots
            if (!empty($request_data['selectedSublots'])) {
                foreach ($request_data['selectedSublots'] as $sublot) {
                    if (empty($sublot['area_utilizada'])) {
                        continue; // Skip sublots with area_utilizada = 0
                    }

                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_registers_lots (";
                    $sql .= "register_type, fk_register, fk_lote, area_utilizada, fk_sublote";
                    $sql .= ") VALUES (";
                    $sql .= "'labor', ";
                    $sql .= (int) $labor_id . ", ";
                    $sql .= (int) $sublot['id_parent_lote'] . ", ";
                    $sql .= floatval($sublot['area_utilizada']) . ", ";
                    $sql .= (int) $sublot['id_sub_lote'];
                    $sql .= ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating Labor-sublot relationship: ' . $this->db->lasterror());
                    }
                }
            }

            $this->db->commit();

            return array(
                'id' => $labor_id,
                'message' => 'Labor created successfully'
            );

        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * Get all Labor records
     *
     * @url GET /register/general-labor/list
     * @return array List of Labor records
     * @throws RestException 503 Error retrieving data
     */
    public function listLabors()
    {
        // Get Labor records with related information
        $sql = "SELECT l.*, 
                  e1.rowid as first_equipment_rowid,
                  e1.name as first_equipment_name,
                  e1.brand as first_equipment_brand,
                  e1.model as first_equipment_model,
                  e2.rowid as second_equipment_rowid,
                  e2.name as second_equipment_name,
                  e2.brand as second_equipment_brand,
                  e2.model as second_equipment_model
           FROM " . MAIN_DB_PREFIX . "vicentina_labor as l
           LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_maquinaria as e1 ON l.first_equipment = e1.rowid
           LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_maquinaria as e2 ON l.second_equipment = e2.rowid
           ORDER BY l.date DESC";

        $result = $this->db->query($sql);

        if ($result) {
            $records = array();
            while ($labor = $this->db->fetch_object($result)) {
                // Process machinery data
                $machinaryUsed = array();

                // Add first equipment if exists
                if ($labor->first_equipment_rowid) {
                    $machinaryUsed[] = array(
                        'rowid' => (string) $labor->first_equipment_rowid,
                        'name' => $labor->first_equipment_name,
                        'brand' => $labor->first_equipment_brand,
                        'model' => $labor->first_equipment_model
                    );
                }

                // Add second equipment if exists
                if ($labor->second_equipment_rowid) {
                    $machinaryUsed[] = array(
                        'rowid' => (string) $labor->second_equipment_rowid,
                        'name' => $labor->second_equipment_name,
                        'brand' => $labor->second_equipment_brand,
                        'model' => $labor->second_equipment_model
                    );
                }

                // Get lots and sublots for this Labor
                $lotsSql = "SELECT l.rowid, l.name, rl.area_utilizada, rl.fk_sublote,
                              c.name as campo_name,
                              sl.name as sublot_name
                       FROM " . MAIN_DB_PREFIX . "vicentina_registers_lots as rl
                       LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_lote as l ON rl.fk_lote = l.rowid
                       LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_campo as c ON l.fk_campo = c.rowid
                       LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_cultivo_sublote as sl ON rl.fk_sublote = sl.rowid
                       WHERE rl.register_type = 'labor' 
                       AND rl.fk_register = " . (int) $labor->rowid;

                $lotsResult = $this->db->query($lotsSql);
                $lots = array();
                $sublots = array();
                $parentLots = array(); // Track parent lots of sublots

                while ($lot = $this->db->fetch_object($lotsResult)) {
                    if ($lot->fk_sublote) {
                        // This is a sublot
                        $sublots[] = array(
                            'id_sub_lote' => (string) $lot->fk_sublote,
                            'id_parent_lote' => (string) $lot->rowid,
                            'name' => $lot->sublot_name,
                            'area_utilizada' => floatval($lot->area_utilizada)
                        );

                        // Add parent lot if not already added
                        $parentLotKey = $lot->rowid;
                        if (!isset($parentLots[$parentLotKey])) {
                            $parentLots[$parentLotKey] = array(
                                'rowid' => (string) $lot->rowid,
                                'name' => $lot->name,
                                'campo_name' => $lot->campo_name,
                                'area_utilizada' => 0 // Parent lot's area is not used when there are sublots
                            );
                        }
                    } else {
                        // This is a main lot without sublots
                        $lots[] = array(
                            'rowid' => (string) $lot->rowid,
                            'name' => $lot->name,
                            'campo_name' => $lot->campo_name,
                            'area_utilizada' => floatval($lot->area_utilizada)
                        );
                    }
                }

                // Merge regular lots with parent lots
                $allLots = array_merge($lots, array_values($parentLots));

                // Structure the response according to GeneralLaborResponse interface
                $records[] = array(
                    'date' => $labor->date,
                    'labor_code' => $labor->labor_code,
                    'cusa_cost' => floatval($labor->cusa_cost),
                    'lts' => floatval($labor->lts),
                    'first_equipment' => $labor->first_equipment_rowid ? (string) $labor->first_equipment_rowid : null,
                    'second_equipment' => $labor->second_equipment_rowid ? (string) $labor->second_equipment_rowid : null,
                    'crop_code' => $labor->crop_code,
                    'selectedSublots' => $sublots,
                    'selectedLots' => $allLots,
                    'machinaryUsed' => $machinaryUsed
                );
            }
            return $records;
        } else {
            throw new RestException(503, 'Error retrieving Labor records: ' . $this->db->lasterror());
        }
    }

    /**
     * Get Labor records for a specific crop
     *
     * @url GET /register/general-labor/crop/{cropId}
     * @param string $cropId Crop code to get Labor records for
     * @return array List of Labor records for the crop
     * @throws RestException 400 Bad Request
     * @throws RestException 404 Not Found
     * @throws RestException 503 Error retrieving data
     */
    public function getCropLabors($cropId)
    {
        if (empty($cropId)) {
            throw new RestException(400, 'Crop ID is required');
        }

        // Get Labor records for the crop with related information
        $sql = "SELECT l.*, 
                  uc.login as user_creation,
                  um.login as user_modification
           FROM " . MAIN_DB_PREFIX . "vicentina_labor as l
           LEFT JOIN " . MAIN_DB_PREFIX . "user as uc ON l.fk_user_creat = uc.rowid
           LEFT JOIN " . MAIN_DB_PREFIX . "user as um ON l.fk_user_modif = um.rowid
           WHERE l.crop_code = '" . $this->db->escape($cropId) . "'
           ORDER BY l.date DESC";

        $result = $this->db->query($sql);

        if ($result) {
            $records = array();
            while ($labor = $this->db->fetch_object($result)) {
                // Filter Labor fields
                $laborData = array(
                    'rowid' => $labor->rowid,
                    'crop_code' => $labor->crop_code,
                    'date' => $labor->date,
                    'first_equipment' => $labor->first_equipment,
                    'second_equipment' => $labor->second_equipment,
                    'labor_code' => $labor->labor_code,
                    'cusa_cost' => floatval($labor->cusa_cost),
                    'lts' => floatval($labor->lts),
                    'date_creation' => $labor->date_creation,
                    'date_modification' => $labor->date_modification,
                    'user_creation' => $labor->user_creation,
                    'user_modification' => $labor->user_modification
                );

                // Get lots and sublots for this Labor
                $lotsSql = "SELECT l.*, rl.area_utilizada, rl.fk_sublote,
                              c.name as campo_name,
                              sl.name as sublot_name
                       FROM " . MAIN_DB_PREFIX . "vicentina_registers_lots as rl
                       LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_lote as l ON rl.fk_lote = l.rowid
                       LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_campo as c ON l.fk_campo = c.rowid
                       LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_cultivo_sublote as sl ON rl.fk_sublote = sl.rowid
                       WHERE rl.register_type = 'labor' 
                       AND rl.fk_register = " . (int) $labor->rowid;

                $lotsResult = $this->db->query($lotsSql);
                $lots = array();
                $sublots = array();

                while ($lot = $this->db->fetch_object($lotsResult)) {
                    if ($lot->fk_sublote) {
                        // This is a sublot
                        $sublots[] = array(
                            'id_sub_lote' => $lot->fk_sublote,
                            'name' => $lot->sublot_name,
                            'id_parent_lote' => $lot->rowid,
                            'area_utilizada' => floatval($lot->area_utilizada)
                        );
                    } else {
                        // This is a main lot
                        $lots[] = array(
                            'id_lote' => $lot->rowid,
                            'area_utilizada' => floatval($lot->area_utilizada)
                        );
                    }
                }

                // Structure the response with three main sections
                $records[] = array(
                    'labor' => $laborData,
                    'lots' => $lots,
                    'sublots' => $sublots
                );
            }
            return $records;
        } else {
            throw new RestException(503, 'Error retrieving Labor records: ' . $this->db->lasterror());
        }
    }

    /**
     * Create new RAF record
     *
     * @url POST register/raf/create
     * @param array $request_data {
     *     @var string $crop_code Crop reference code
     *     @var string $date Activity date
     *     @var string $type RAF type
     *     @var string $sub_type RAF sub-type
     *     @var array $selectedLots Array of selected lots {
     *         @var int $id_lote Lot ID
     *         @var float $area_utilizada Used area
     *     }
     *     @var array $selectedProducts Array of selected products {
     *         @var int $id Product ID
     *         @var float $quantity Quantity
     *         @var int $warehouse_id Warehouse ID
     *         @var string $type Product type
     *         @var float $presentation Product presentation size
     *     }
     * }
     * @return array Created RAF record
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function createRAF($request_data)
    {
        global $user;

        // Basic validation
        if (
            empty($request_data['crop_code']) || empty($request_data['date']) ||
            empty($request_data['type']) || empty($request_data['sub_type'])
        ) {
            throw new RestException(400, 'Crop code, date, type and sub-type are required fields');
        }

        $this->db->begin();

        try {
            // Calculate total area from selected lots
            $total_area = 0;
            foreach ($request_data['selectedLots'] as $lot) {
                $total_area += floatval($lot['area_utilizada']);
            }

            // Insert main RAF record
            $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_raf (";
            $sql .= "crop_code, date, type, sub_type, total_area, ";
            $sql .= "fk_user_creat, date_creation";
            $sql .= ") VALUES (";
            $sql .= "'" . $this->db->escape($request_data['crop_code']) . "', ";
            $sql .= "'" . $this->db->escape($request_data['date']) . "', ";
            $sql .= "'" . $this->db->escape($request_data['type']) . "', ";
            $sql .= "'" . $this->db->escape($request_data['sub_type']) . "', ";
            $sql .= floatval($total_area) . ", ";
            $sql .= (int) $user->id . ", ";
            $sql .= "'" . $this->db->idate(dol_now()) . "'";
            $sql .= ")";

            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error creating RAF: ' . $this->db->lasterror());
            }

            $raf_id = $this->db->last_insert_id(MAIN_DB_PREFIX . 'vicentina_raf');

            // Insert lots
            foreach ($request_data['selectedLots'] as $lot) {
                $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_registers_lots (";
                $sql .= "register_type, fk_register, fk_lote, area_utilizada";
                $sql .= ") VALUES (";
                $sql .= "'raf', ";
                $sql .= (int) $raf_id . ", ";
                $sql .= (int) $lot['id_lote'] . ", ";
                $sql .= floatval($lot['area_utilizada']);
                $sql .= ")";

                $result = $this->db->query($sql);
                if (!$result) {
                    throw new Exception('Error creating RAF-lot relationship: ' . $this->db->lasterror());
                }
            }

            // Process products and update stock
            if (!empty($request_data['selectedProducts'])) {
                foreach ($request_data['selectedProducts'] as $product) {
                    $stock_used = $product['quantity'];

                    // Get PMP from product table
                    $sql = "SELECT pmp FROM " . MAIN_DB_PREFIX . "product WHERE rowid = " . (int) $product['id'];
                    $pmp_result = $this->db->query($sql);
                    $pmp_obj = $this->db->fetch_object($pmp_result);
                    $pmp = $pmp_obj && $pmp_obj->pmp ? $pmp_obj->pmp : 0;

                    // Calculate total price
                    $total_price = $stock_used * $pmp;


                    // Get PMP from product table
                    $sql = "SELECT pmp_dollar FROM " . MAIN_DB_PREFIX . "product WHERE rowid = " . (int) $product['id'];
                    $pmp_result = $this->db->query($sql);
                    $pmp_obj = $this->db->fetch_object($pmp_result);
                    $pmp_dollar = $pmp_obj && $pmp_obj->pmp_dollar ? $pmp_obj->pmp_dollar : 0;

                    // Calculate total price
                    $total_price_usd = $stock_used * $pmp_dollar;

                    // Insert product record
                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_registers_products (";
                    $sql .= "register_type, fk_register, fk_product, quantity, warehouse_id, type, stock_used, ";
                    $sql .= "total_price, total_price_usd";
                    $sql .= ") VALUES (";
                    $sql .= "'raf', ";
                    $sql .= (int) $raf_id . ", ";
                    $sql .= (int) $product['id'] . ", ";
                    $sql .= floatval($product['quantity']) . ", ";
                    $sql .= (int) $product['warehouse_id'] . ", ";
                    $sql .= "'" . $this->db->escape($product['type']) . "', ";
                    $sql .= floatval($stock_used) . ", ";
                    $sql .= floatval($total_price) . ", ";
                    $sql .= floatval($total_price_usd);
                    $sql .= ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating RAF-product relationship: ' . $this->db->lasterror());
                    }

                    // Update stock movement
                    require_once DOL_DOCUMENT_ROOT . '/product/stock/class/mouvementstock.class.php';
                    $movement = new MouvementStock($this->db);
                    $result = $movement->livraison(
                        $user,
                        $product['id'],
                        $product['warehouse_id'],
                        $stock_used,
                        0,
                        'RAF Creation - ' . $request_data['crop_code'],
                        '',
                        '',
                        '',
                        0,
                        0
                    );

                    if ($result < 0) {
                        throw new Exception('Error updating stock: ' . $movement->error);
                    }
                }
            }

            $this->db->commit();

            return array(
                'id' => $raf_id,
                'message' => 'RAF created successfully'
            );

        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * Get RAF records for a specific crop
     *
     * @url GET /register/raf/crop/{cropId}
     * @param string $cropId Crop code to get RAF records for
     * @return array List of RAF records for the crop
     * @throws RestException 400 Bad Request
     * @throws RestException 404 Not Found
     * @throws RestException 503 Error retrieving data
     */
    public function getCropRAFs($cropId)
    {
        if (empty($cropId)) {
            throw new RestException(400, 'Crop ID is required');
        }

        // Get RAF records for the crop with related information
        $sql = "SELECT r.*, 
                  uc.login as user_creation,
                  um.login as user_modification
           FROM " . MAIN_DB_PREFIX . "vicentina_raf as r
           LEFT JOIN " . MAIN_DB_PREFIX . "user as uc ON r.fk_user_creat = uc.rowid
           LEFT JOIN " . MAIN_DB_PREFIX . "user as um ON r.fk_user_modif = um.rowid
           WHERE r.crop_code = '" . $this->db->escape($cropId) . "'
           ORDER BY r.date DESC";

        $result = $this->db->query($sql);

        if ($result) {
            $records = array();
            while ($raf = $this->db->fetch_object($result)) {
                // Filter RAF fields
                $rafData = array(
                    'rowid' => $raf->rowid,
                    'crop_code' => $raf->crop_code,
                    'date' => $raf->date,
                    'type' => $raf->type,
                    'sub_type' => $raf->sub_type,
                    'total_area' => $raf->total_area,
                    'description' => $raf->description
                );

                // Get lots for this RAF
                $lotsSql = "SELECT l.*, rl.area_utilizada, c.name as campo_name
                           FROM " . MAIN_DB_PREFIX . "vicentina_registers_lots as rl
                           LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_lote as l ON rl.fk_lote = l.rowid
                           LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_campo as c ON l.fk_campo = c.rowid
                           WHERE rl.register_type = 'raf' 
                           AND rl.fk_register = " . (int) $raf->rowid;

                $lotsResult = $this->db->query($lotsSql);
                $lots = array();
                while ($lot = $this->db->fetch_object($lotsResult)) {
                    // Filter lot fields
                    $lots[] = array(
                        'rowid' => $lot->rowid,
                        'name' => $lot->name,
                        'area_utilizada' => $lot->area_utilizada,
                        'description' => $lot->description
                    );
                }

                // Get products for this RAF
                $productsSql = "SELECT p.label as product_name, p.ref as product_ref, 
                                      rp.*, e.ref as warehouse_name,
                                      pef.tipo_presentacion, pef.presentacion, 
                                      pef.medida, pef.dosisha, pef.variedad
                               FROM " . MAIN_DB_PREFIX . "vicentina_registers_products as rp
                               LEFT JOIN " . MAIN_DB_PREFIX . "product as p ON rp.fk_product = p.rowid
                               LEFT JOIN " . MAIN_DB_PREFIX . "entrepot as e ON rp.warehouse_id = e.rowid
                               LEFT JOIN " . MAIN_DB_PREFIX . "product_extrafields as pef ON p.rowid = pef.fk_object
                               WHERE rp.register_type = 'raf' 
                               AND rp.fk_register = " . (int) $raf->rowid;

                $productsResult = $this->db->query($productsSql);
                $products = array();
                while ($product = $this->db->fetch_object($productsResult)) {
                    $products[] = array(
                        'product_name' => $product->product_name,
                        'product_ref' => $product->product_ref,
                        'rowid' => $product->rowid,
                        'register_type' => $product->register_type,
                        'fk_register' => $product->fk_register,
                        'fk_product' => $product->fk_product,
                        'quantity' => floatval($product->quantity),
                        'warehouse_id' => $product->warehouse_id,
                        'type' => $product->type,
                        'stock_used' => floatval($product->stock_used),
                        'total_price' => floatval($product->total_price),
                        'total_price_usd' => floatval($product->total_price_usd),
                        'date_creation' => $product->date_creation,
                        'warehouse_name' => $product->warehouse_name,
                        // Add extrafields
                        'tipo_presentacion' => $product->tipo_presentacion,
                        'presentacion' => floatval($product->presentacion),
                        'medida' => $product->medida,
                        'dosisha' => floatval($product->dosisha),
                        'variedad' => $product->variedad
                    );
                }

                // Structure the response with three main sections
                $records[] = array(
                    'raf' => $rafData,
                    'lots' => $lots,
                    'products' => $products
                );
            }
            return $records;
        } else {
            throw new RestException(503, 'Error retrieving RAF records: ' . $this->db->lasterror());
        }
    }

    /**
     * Get all RAF records
     *
     * @url GET /register/raf/list
     * @return array List of RAF records
     * @throws RestException 503 Error retrieving data
     */
    public function listRAFs()
    {
        // Get RAF records with related information
        $sql = "SELECT r.*, 
                  uc.login as user_creation,
                  um.login as user_modification
           FROM " . MAIN_DB_PREFIX . "vicentina_raf as r
           LEFT JOIN " . MAIN_DB_PREFIX . "user as uc ON r.fk_user_creat = uc.rowid
           LEFT JOIN " . MAIN_DB_PREFIX . "user as um ON r.fk_user_modif = um.rowid
           ORDER BY r.date DESC";

        $result = $this->db->query($sql);

        if ($result) {
            $records = array();
            while ($raf = $this->db->fetch_object($result)) {
                // Filter RAF fields
                $rafData = array(
                    'rowid' => $raf->rowid,
                    'crop_code' => $raf->crop_code,
                    'date' => $raf->date,
                    'type' => $raf->type,
                    'sub_type' => $raf->sub_type,
                    'total_area' => $raf->total_area,
                    'description' => $raf->description
                );

                // Get lots for this RAF
                $lotsSql = "SELECT l.*, rl.area_utilizada, c.name as campo_name
                       FROM " . MAIN_DB_PREFIX . "vicentina_registers_lots as rl
                       LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_lote as l ON rl.fk_lote = l.rowid
                       LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_campo as c ON l.fk_campo = c.rowid
                       WHERE rl.register_type = 'raf' 
                       AND rl.fk_register = " . (int) $raf->rowid;

                $lotsResult = $this->db->query($lotsSql);
                $lots = array();
                while ($lot = $this->db->fetch_object($lotsResult)) {
                    // Filter lot fields
                    $lots[] = array(
                        'rowid' => $lot->rowid,
                        'name' => $lot->name,
                        'campo_name' => $lot->campo_name,
                        'area_utilizada' => floatval($lot->area_utilizada),
                        'description' => $lot->description
                    );
                }

                // Get products for this RAF
                $productsSql = "SELECT p.label as product_name, p.ref as product_ref, 
                        rp.*, e.ref as warehouse_name,
                        pef.tipo_presentacion, pef.presentacion, 
                        pef.medida, pef.dosisha, pef.variedad
                FROM " . MAIN_DB_PREFIX . "vicentina_registers_products as rp
                LEFT JOIN " . MAIN_DB_PREFIX . "product as p ON rp.fk_product = p.rowid
                LEFT JOIN " . MAIN_DB_PREFIX . "entrepot as e ON rp.warehouse_id = e.rowid
                LEFT JOIN " . MAIN_DB_PREFIX . "product_extrafields as pef ON p.rowid = pef.fk_object
                WHERE rp.register_type = 'raf' 
                AND rp.fk_register = " . (int) $raf->rowid;

                $productsResult = $this->db->query($productsSql);
                $products = array();
                while ($product = $this->db->fetch_object($productsResult)) {
                    $products[] = array(
                        'product_name' => $product->product_name,
                        'product_ref' => $product->product_ref,
                        'rowid' => $product->rowid,
                        'register_type' => $product->register_type,
                        'fk_register' => $product->fk_register,
                        'fk_product' => $product->fk_product,
                        'quantity' => floatval($product->quantity),
                        'warehouse_id' => $product->warehouse_id,
                        'type' => $product->type,
                        'stock_used' => floatval($product->stock_used),
                        'total_price' => floatval($product->total_price),
                        'total_price_usd' => floatval($product->total_price_usd),
                        'date_creation' => $product->date_creation,
                        'warehouse_name' => $product->warehouse_name,
                        // Add extrafields
                        'tipo_presentacion' => $product->tipo_presentacion,
                        'presentacion' => floatval($product->presentacion),
                        'medida' => $product->medida,
                        'dosisha' => floatval($product->dosisha),
                        'variedad' => $product->variedad
                    );
                }

                // Structure the response with three main sections
                $records[] = array(
                    'raf' => $rafData,
                    'lots' => $lots,
                    'products' => $products
                );
            }
            return $records;
        } else {
            throw new RestException(503, 'Error retrieving RAF records: ' . $this->db->lasterror());
        }
    }


    /**
     * Get all Seed Map records
     *
     * @url GET /register/seed-map/list
     * @return array List of Seed Map records
     * @throws RestException 503 Error retrieving data
     */
    public function listSeedMaps()
    {
        // Get Seed Map records with related information
        $sql = "SELECT sm.*, 
                  uc.login as user_creation,
                  um.login as user_modification,
                  e1.rowid as first_equipment_id,
                  e2.rowid as second_equipment_id
           FROM " . MAIN_DB_PREFIX . "vicentina_seed_map as sm
           LEFT JOIN " . MAIN_DB_PREFIX . "user as uc ON sm.fk_user_creat = uc.rowid
           LEFT JOIN " . MAIN_DB_PREFIX . "user as um ON sm.fk_user_modif = um.rowid
           LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_maquinaria as e1 ON sm.first_equipment = e1.rowid
           LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_maquinaria as e2 ON sm.second_equipment = e2.rowid
           ORDER BY sm.date DESC";

        $result = $this->db->query($sql);

        if ($result) {
            $records = array();
            while ($seedmap = $this->db->fetch_object($result)) {
                // Get lots for this Seed Map
                $lotsSql = "SELECT l.*, rl.area_utilizada, c.name as campo_name
                       FROM " . MAIN_DB_PREFIX . "vicentina_registers_lots as rl
                       LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_lote as l ON rl.fk_lote = l.rowid
                       LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_campo as c ON l.fk_campo = c.rowid
                       WHERE rl.register_type = 'seed_map' 
                       AND rl.fk_register = " . (int) $seedmap->rowid;

                $lotsResult = $this->db->query($lotsSql);
                $lots = array();
                while ($lot = $this->db->fetch_object($lotsResult)) {
                    $lots[] = array(
                        'rowid' => $lot->rowid,
                        'name' => $lot->name,
                        'campo_name' => $lot->campo_name,
                        'area_utilizada' => floatval($lot->area_utilizada)
                    );
                }

                // Get products for this Seed Map
                $productsSql = "SELECT p.label as product_name, p.ref as product_ref, 
                               rp.*, e.ref as warehouse_name
                        FROM " . MAIN_DB_PREFIX . "vicentina_registers_products as rp
                        LEFT JOIN " . MAIN_DB_PREFIX . "product as p ON rp.fk_product = p.rowid
                        LEFT JOIN " . MAIN_DB_PREFIX . "entrepot as e ON rp.warehouse_id = e.rowid
                        WHERE rp.register_type = 'seed_map' 
                        AND rp.fk_register = " . (int) $seedmap->rowid;

                $productResults = $this->db->query($productsSql);
                $products = array();
                while ($product = $this->db->fetch_object($productResults)) {
                    $products[] = array(
                        'product_name' => $product->product_name,
                        'product_ref' => $product->product_ref,
                        'quantity' => floatval($product->quantity),
                        'type' => $product->type,
                        'unit' => $product->unit,
                        'warehouse_name' => $product->warehouse_name,
                        'total_price' => floatval($product->total_price),
                        'total_price_usd' => floatval($product->total_price_usd)
                    );
                }

                // Structure the response
                $records[] = array(
                    'seed_map' => array(
                        'rowid' => $seedmap->rowid,
                        'crop_code' => $seedmap->crop_code,
                        'date' => $seedmap->date,
                        'first_equipment' => array(
                            'id' => $seedmap->first_equipment,
                            'ref' => $seedmap->first_machinery_ref
                        ),
                        'second_equipment' => array(
                            'id' => $seedmap->second_equipment,
                            'ref' => $seedmap->second_machinery_ref
                        ),
                        'labor' => $seedmap->labor,
                        'cusa_cost' => floatval($seedmap->cusa_cost),
                        'lts' => floatval($seedmap->lts),
                        'grooves' => (int) $seedmap->grooves,
                        'date_creation' => $this->db->jdate($seedmap->date_creation),
                        'date_modification' => $seedmap->tms ? $this->db->jdate($seedmap->tms) : null,
                        'user_creation' => $seedmap->user_creation,
                        'user_modification' => $seedmap->user_modification
                    ),
                    'lots' => $lots,
                    'products' => $products
                );
            }
            return $records;
        } else {
            throw new RestException(503, 'Error retrieving Seed Map records: ' . $this->db->lasterror());
        }
    }

    /**
     * Create new Irrigation record
     *
     * @url POST irrigation/create
     * @param array $request_data {
     *     @var string $crop_code Crop reference code
     *     @var string $date Activity date
     *     @var int $first_equipment First equipment ID
     *     @var int $second_equipment Second equipment ID (optional)
     *     @var array $selectedLots Array of selected lots {
     *         @var int $id_lote Lot ID
     *         @var float $area_utilizada Used area
     *     }
     *     @var array $selectedMaterials Array of selected materials {
     *         @var int $id Product ID
     *         @var float $quantity Quantity
     *         @var int $warehouse_id Warehouse ID
     *         @var string $type Product type
     *         @var float $presentation Product presentation size
     *     }
     * }
     * @return array Created Irrigation record
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function createIrrigation($request_data)
    {
        global $user;

        if (empty($request_data['crop_code']) || empty($request_data['date'])) {
            throw new RestException(400, 'Crop code and date are required fields');
        }

        $this->db->begin();

        try {
            // Insert main Irrigation record
            $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_irrigation (";
            $sql .= "crop_code, date, first_equipment, second_equipment, meters_of_line_mother, cost_mother_line, ";
            $sql .= "fk_user_creat, date_creation";
            $sql .= ") VALUES (";
            $sql .= "'" . $this->db->escape($request_data['crop_code']) . "', ";
            $sql .= "'" . $this->db->escape($request_data['date']) . "', ";
            $sql .= ($request_data['first_equipment'] ? (int) $request_data['first_equipment'] : "NULL") . ", ";
            $sql .= ($request_data['second_equipment'] ? (int) $request_data['second_equipment'] : "NULL") . ", ";
            $sql .= (float) $request_data['meters_of_line_mother'] . ", ";
            $sql .= (float) $request_data['cost_mother_line'] . ", ";
            $sql .= (int) $user->id . ", ";
            $sql .= "'" . $this->db->idate(dol_now()) . "'";
            $sql .= ")";

            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error creating Irrigation record: ' . $this->db->lasterror());
            }

            $irrigation_id = $this->db->last_insert_id(MAIN_DB_PREFIX . 'vicentina_irrigation');

            // Insert lots (without sublots)
            if (!empty($request_data['selectedLots'])) {
                foreach ($request_data['selectedLots'] as $lot) {
                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_registers_lots (";
                    $sql .= "register_type, fk_register, fk_lote, area_utilizada, fk_sublote";
                    $sql .= ") VALUES (";
                    $sql .= "'irrigation', ";
                    $sql .= (int) $irrigation_id . ", ";
                    $sql .= (int) $lot['id_lote'] . ", ";
                    $sql .= floatval($lot['area_utilizada']) . ", ";
                    $sql .= "NULL";  // No sublot for these entries
                    $sql .= ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating Seed Map-lot relationship: ' . $this->db->lasterror());
                    }
                }
            }

            // Insert sublots
            if (!empty($request_data['selectedSublots'])) {
                foreach ($request_data['selectedSublots'] as $sublot) {
                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_registers_lots (";
                    $sql .= "register_type, fk_register, fk_lote, area_utilizada, fk_sublote";
                    $sql .= ") VALUES (";
                    $sql .= "'irrigation', ";
                    $sql .= (int) $irrigation_id . ", ";
                    $sql .= (int) $sublot['id_parent_lote'] . ", ";
                    $sql .= floatval($sublot['area_utilizada']) . ", ";
                    $sql .= (int) $sublot['id_sub_lote'];
                    $sql .= ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating Seed Map-sublot relationship: ' . $this->db->lasterror());
                    }
                }
            }

            // Process materials and update stock
            if (!empty($request_data['selectedMaterials'])) {
                foreach ($request_data['selectedMaterials'] as $product) {
                    $stock_used = $product['quantity'];

                    // Get PMP from product table
                    $sql = "SELECT pmp, pmp_dollar FROM " . MAIN_DB_PREFIX . "product WHERE rowid = " . (int) $product['id'];
                    $pmp_result = $this->db->query($sql);
                    $pmp_obj = $this->db->fetch_object($pmp_result);
                    $pmp = $pmp_obj && $pmp_obj->pmp ? $pmp_obj->pmp : 0;
                    $pmp_dollar = $pmp_obj && $pmp_obj->pmp_dollar ? $pmp_obj->pmp_dollar : 0;

                    // Calculate total prices
                    $total_price = $stock_used * $pmp;
                    $total_price_usd = $stock_used * $pmp_dollar;

                    // Insert product record
                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_registers_products (";
                    $sql .= "register_type, fk_register, fk_product, quantity, warehouse_id, type, stock_used, ";
                    $sql .= "total_price, total_price_usd";
                    $sql .= ") VALUES (";
                    $sql .= "'irrigation', ";
                    $sql .= (int) $irrigation_id . ", ";
                    $sql .= (int) $product['id'] . ", ";
                    $sql .= floatval($product['quantity']) . ", ";
                    $sql .= (int) $product['warehouse_id'] . ", ";
                    $sql .= "'" . $this->db->escape($product['type']) . "', ";
                    $sql .= floatval($stock_used) . ", ";
                    $sql .= floatval($total_price) . ", ";
                    $sql .= floatval($total_price_usd);
                    $sql .= ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating Irrigation-product relationship: ' . $this->db->lasterror());
                    }

                    // Update stock movement
                    require_once DOL_DOCUMENT_ROOT . '/product/stock/class/mouvementstock.class.php';
                    $movement = new MouvementStock($this->db);
                    $result = $movement->livraison(
                        $user,
                        $product['id'],
                        $product['warehouse_id'],
                        $stock_used,
                        0,
                        'Irrigation Creation - ' . $request_data['crop_code'],
                        '',
                        '',
                        '',
                        0,
                        0
                    );

                    if ($result < 0) {
                        throw new Exception('Error updating stock: ' . $movement->error);
                    }
                }
            }

            $this->db->commit();

            return array(
                'id' => $irrigation_id,
                'message' => 'Irrigation record created successfully'
            );

        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * Get all irrigation records
     *
     * @url GET /irrigation/list
     * @return array List of irrigation records with related data
     * @throws RestException 503 Error retrieving data
     */
    public function listIrrigations()
    {
        // Get irrigation records with related information
        $sql = "SELECT i.*, 
                    uc.login as user_creation,
                    um.login as user_modification,
                    e1.rowid as first_equipment_id,
                    e2.rowid as second_equipment_id
            FROM " . MAIN_DB_PREFIX . "vicentina_irrigation as i
            LEFT JOIN " . MAIN_DB_PREFIX . "user as uc ON i.fk_user_creat = uc.rowid
            LEFT JOIN " . MAIN_DB_PREFIX . "user as um ON i.fk_user_modif = um.rowid
            LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_maquinaria as e1 ON i.first_equipment = e1.rowid
            LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_maquinaria as e2 ON i.second_equipment = e2.rowid
            ORDER BY i.date DESC";

        $result = $this->db->query($sql);

        if ($result) {
            $records = array();
            while ($irrigation = $this->db->fetch_object($result)) {
                // Get lots and sublots for this irrigation
                $lotsSql = "SELECT l.rowid, l.name, rl.area_utilizada, rl.fk_sublote,
                              c.name as campo_name,
                              sl.name as sublot_name
                       FROM " . MAIN_DB_PREFIX . "vicentina_registers_lots as rl
                       LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_lote as l ON rl.fk_lote = l.rowid
                       LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_campo as c ON l.fk_campo = c.rowid
                       LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_cultivo_sublote as sl ON rl.fk_sublote = sl.rowid
                       WHERE rl.register_type = 'irrigation' 
                       AND rl.fk_register = " . (int) $irrigation->rowid;

                $lotsResult = $this->db->query($lotsSql);
                $lots = array();
                $sublots = array();
                $parentLots = array(); // Track parent lots of sublots

                while ($lot = $this->db->fetch_object($lotsResult)) {
                    if ($lot->fk_sublote) {
                        // This is a sublot
                        $sublots[] = array(
                            'id_sub_lote' => (string) $lot->fk_sublote,
                            'id_parent_lote' => (string) $lot->rowid,
                            'name' => $lot->sublot_name,
                            'area_utilizada' => floatval($lot->area_utilizada)
                        );

                        // Add parent lot if not already added
                        $parentLotKey = $lot->rowid;
                        if (!isset($parentLots[$parentLotKey])) {
                            $parentLots[$parentLotKey] = array(
                                'rowid' => (string) $lot->rowid,
                                'name' => $lot->name,
                                'campo_name' => $lot->campo_name,
                                'area_utilizada' => 0 // Parent lot's area is not used when there are sublots
                            );
                        }
                    } else {
                        // This is a main lot without sublots
                        $lots[] = array(
                            'rowid' => (string) $lot->rowid,
                            'name' => $lot->name,
                            'campo_name' => $lot->campo_name,
                            'area_utilizada' => floatval($lot->area_utilizada)
                        );
                    }
                }

                // Merge regular lots with parent lots
                $allLots = array_merge($lots, array_values($parentLots));

                // Get products/materials for this irrigation
                $productsSql = "SELECT p.label as product_name, p.ref as product_ref, 
                                    rp.*, e.ref as warehouse_name
                             FROM " . MAIN_DB_PREFIX . "vicentina_registers_products as rp
                             LEFT JOIN " . MAIN_DB_PREFIX . "product as p ON rp.fk_product = p.rowid
                             LEFT JOIN " . MAIN_DB_PREFIX . "entrepot as e ON rp.warehouse_id = e.rowid
                             WHERE rp.register_type = 'irrigation' 
                             AND rp.fk_register = " . (int) $irrigation->rowid;

                $productsResult = $this->db->query($productsSql);
                $products = array();
                while ($product = $this->db->fetch_object($productsResult)) {
                    $products[] = array(
                        'product_name' => $product->product_name,
                        'product_ref' => $product->product_ref,
                        'quantity' => floatval($product->quantity),
                        'type' => $product->type,
                        'warehouse_name' => $product->warehouse_name,
                        'total_price' => floatval($product->total_price),
                        'total_price_usd' => floatval($product->total_price_usd)
                    );
                }

                // Structure the response
                $records[] = array(
                    'irrigation' => array(
                        'rowid' => $irrigation->rowid,
                        'crop_code' => $irrigation->crop_code,
                        'date' => $irrigation->date,
                        'meters_of_line_mother' => $irrigation->meters_of_line_mother,
                        'cost_mother_line' => $irrigation->cost_mother_line,
                        'first_equipment' => array(
                            'id' => $irrigation->first_equipment_id,
                            'ref' => $irrigation->first_machinery_ref
                        ),
                        'second_equipment' => array(
                            'id' => $irrigation->second_equipment_id,
                            'ref' => $irrigation->second_machinery_ref
                        ),
                        'date_creation' => $this->db->jdate($irrigation->date_creation),
                        'date_modification' => $irrigation->tms ? $this->db->jdate($irrigation->tms) : null,
                        'user_creation' => $irrigation->user_creation,
                        'user_modification' => $irrigation->user_modification
                    ),
                    'selectedLots' => $allLots,
                    'selectedSublots' => $sublots,
                    'materials' => $products
                );
            }
            return $records;
        } else {
            throw new RestException(503, 'Error retrieving irrigation records: ' . $this->db->lasterror());
        }
    }

    /**
     * Get warehouses grouped by category
     *
     * @url GET /warehouses/by-category
     * @return array List of categories with their warehouses
     * @throws RestException 503 Error retrieving data
     */
    public function getWarehousesByCategory()
    {
        // Primero, verifiquemos qué tipos de categorías existen
        $debugSql = "SELECT DISTINCT type, COUNT(*) as count 
                     FROM " . MAIN_DB_PREFIX . "categorie 
                     WHERE rowid IN (
                         SELECT DISTINCT fk_categorie 
                         FROM " . MAIN_DB_PREFIX . "categorie_warehouse
                     )
                     GROUP BY type";

        $debugResult = $this->db->query($debugSql);
        $categoryTypes = array();
        while ($type = $this->db->fetch_object($debugResult)) {
            $categoryTypes[] = array(
                'type' => $type->type,
                'count' => $type->count
            );
        }

        // Obtener las categorías que tienen almacenes asociados
        $sql = "SELECT c.rowid as category_id, c.label as category_name, c.type
                FROM " . MAIN_DB_PREFIX . "categorie as c
                INNER JOIN " . MAIN_DB_PREFIX . "categorie_warehouse as cw 
                    ON c.rowid = cw.fk_categorie
                GROUP BY c.rowid
                ORDER BY c.label";

        $result = $this->db->query($sql);

        if (!$result) {
            throw new RestException(503, 'Error querying categories: ' . $this->db->lasterror());
        }

        $categories = array();

        while ($cat = $this->db->fetch_object($result)) {
            // Para cada categoría, buscar sus almacenes
            $warehouseSql = "SELECT e.rowid as warehouse_id, e.ref as warehouse_ref, 
                                    e.lieu as warehouse_location, e.description as warehouse_description,
                                    e.statut
                             FROM " . MAIN_DB_PREFIX . "entrepot as e
                             INNER JOIN " . MAIN_DB_PREFIX . "categorie_warehouse as cw 
                                 ON e.rowid = cw.fk_warehouse
                             WHERE cw.fk_categorie = " . (int) $cat->category_id . "
                             AND e.statut = 1
                             ORDER BY e.ref";

            $warehouseResult = $this->db->query($warehouseSql);

            if (!$warehouseResult) {
                throw new RestException(503, 'Error querying warehouses: ' . $this->db->lasterror());
            }

            $warehouses = array();
            while ($warehouse = $this->db->fetch_object($warehouseResult)) {
                $warehouses[] = array(
                    'id' => $warehouse->warehouse_id,
                    'ref' => $warehouse->warehouse_ref,
                    'location' => $warehouse->warehouse_location,
                    'description' => $warehouse->warehouse_description
                );
            }

            // Solo agregar la categoría si tiene almacenes asociados
            if (!empty($warehouses)) {
                $categories[] = array(
                    'id' => $cat->category_id,
                    'name' => $cat->category_name,
                    'type' => $cat->type,
                    'warehouses' => $warehouses
                );
            }
        }

        // Si no hay resultados, mostrar información de depuración
        if (empty($categories)) {
            return array(
                'debug_info' => array(
                    'category_types' => $categoryTypes,
                    'message' => 'Se encontraron categorías con los siguientes tipos',
                    'note' => 'Estos son los tipos de categorías que tienen almacenes asociados'
                )
            );
        }

        return $categories;
    }



    /**
     * Get potato varieties from seed map products
     *
     * @url GET /crop/{crop_code}/potato-varieties
     * @param string $crop_code Crop reference code
     * @return array List of varieties
     * @throws RestException 400 Bad Request
     * @throws RestException 404 Not Found
     * @throws RestException 503 Error retrieving data
     */
    public function getPotatoVarieties($crop_code)
    {
        if (empty($crop_code)) {
            throw new RestException(400, 'Crop code is required');
        }

        // First check if the crop is potato
        $sql = "SELECT rowid, cultivo 
            FROM " . MAIN_DB_PREFIX . "vicentina_cultivo 
            WHERE code = '" . $this->db->escape($crop_code) . "'";

        $result = $this->db->query($sql);
        if (!$result) {
            throw new RestException(503, 'Error checking crop: ' . $this->db->lasterror());
        }

        $crop = $this->db->fetch_object($result);
        if (!$crop) {
            throw new RestException(404, 'Crop not found');
        }

        if (strtolower($crop->cultivo) !== 'papa') {
            return array(); // Return empty array if not potato
        }

        // Get seed map products with variety extrafield
        $sql = "SELECT DISTINCT p.rowid, ef.variedad as name, " . $crop->rowid . " as fk_crop, 
                   p.description
            FROM " . MAIN_DB_PREFIX . "vicentina_seed_map as sm
            INNER JOIN " . MAIN_DB_PREFIX . "vicentina_registers_products as rp 
                ON sm.rowid = rp.fk_register AND rp.register_type = 'seed_map'
            INNER JOIN " . MAIN_DB_PREFIX . "product as p 
                ON rp.fk_product = p.rowid
            INNER JOIN " . MAIN_DB_PREFIX . "product_extrafields as ef 
                ON p.rowid = ef.fk_object
            WHERE sm.crop_code = '" . $this->db->escape($crop_code) . "'
            AND ef.variedad IS NOT NULL AND ef.variedad != ''";

        $result = $this->db->query($sql);
        if (!$result) {
            throw new RestException(503, 'Error retrieving varieties: ' . $this->db->lasterror());
        }

        $varieties = array();
        while ($variety = $this->db->fetch_object($result)) {
            $varieties[] = array(
                'rowid' => $variety->rowid,
                'name' => $variety->name,  // Ahora esto contendrá el valor del campo variedad
                'fk_crop' => $variety->fk_crop,
                'description' => $variety->description
            );
        }

        return $varieties;
    }

    /**
     * Create product and variant with stock movement
     *
     * @url POST /product/create-potato-variant
     * @param array $request_data {
     *     @var string $crop Crop code
     *     @var int $warehouse_id Warehouse ID
     *     @var string $date Date
     *     @var string $lot Lot number
     *     @var string $variety Variety name
     *     @var string $type Type (semilla, consumo)
     *     @var float $quantity Quantity
     *     @var string $variety_code Variety code
     *     @var float $logistic_cost Logistic cost
     * }
     * @return array Created product info
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function createPotatoVariant($request_data)
    {
        global $user, $db;

        if (
            empty($request_data['crop']) || empty($request_data['warehouse_id']) ||
            empty($request_data['variety']) || empty($request_data['quantity']) ||
            empty($request_data['type']) || empty($request_data['variety_code'])
        ) {
            throw new RestException(400, 'Missing required fields');
        }

        // Validate type is either 'semilla' or 'consumo'
        if ($request_data['type'] !== 'semilla' && $request_data['type'] !== 'consumo') {
            throw new RestException(400, 'Type must be either "semilla" or "consumo"');
        }

        $this->db->begin();

        try {
            require_once DOL_DOCUMENT_ROOT . '/product/class/product.class.php';
            require_once DOL_DOCUMENT_ROOT . '/product/stock/class/mouvementstock.class.php';
            require_once DOL_DOCUMENT_ROOT . '/categories/class/categorie.class.php';

            // ID de la categoría "Papa" (29 según los datos proporcionados)
            $papa_category_id = 29;

            // Create main product if it doesn't exist
            // New naming convention: crop_variety_code
            $mainProductRef = $request_data['crop'] . '_' . $request_data['variety_code'];
            $mainProduct = new Product($this->db);
            $result = $mainProduct->fetch(null, $mainProductRef);

            if ($result <= 0) {
                $mainProduct->ref = $mainProductRef;
                $mainProduct->label = $mainProductRef;
                $mainProduct->type = 0; // Product type
                $mainProduct->status = 1;
                $mainProduct->tosell = 0; // Not for sale
                $mainProduct->tobuy = 0; // Not for purchase
                $mainProduct->stock = 0;

                $result = $mainProduct->create($user);
                if ($result < 0) {
                    throw new Exception('Error creating main product: ' . $mainProduct->error);
                }

                // Add extrafields to main product
                $mainProduct->array_options['options_tipo_presentacion'] = 'Bin';
                $result = $mainProduct->insertExtraFields();
                if ($result < 0) {
                    throw new Exception('Error adding extrafields to main product: ' . $mainProduct->error);
                }

                // Agregar el producto a la categoría "Papa"
                $category = new Categorie($this->db);
                $category->fetch($papa_category_id);
                $result = $category->add_type($mainProduct, 'product');
                if ($result < 0) {
                    throw new Exception('Error adding main product to Papa category: ' . $category->error);
                }
            }

            // Determine which variant to use based on type
            $variantType = ($request_data['type'] === 'semilla') ? 'S' : 'C';
            $variantRef = $request_data['variety_code'] . '_' . $variantType . '_SP';
            
            // Create variant product
            $variantProduct = new Product($this->db);
            $result = $variantProduct->fetch(null, $variantRef);

            if ($result <= 0) {
                $variantProduct->ref = $variantRef;
                $variantProduct->label = $variantRef;
                $variantProduct->type = 0;
                $variantProduct->status = 1;
                $variantProduct->tosell = 0; // Not for sale
                $variantProduct->tobuy = 0; // Not for purchase
                $variantProduct->stock = 0;
                $variantProduct->fk_parent = $mainProduct->id;

                $result = $variantProduct->create($user);
                if ($result < 0) {
                    throw new Exception('Error creating variant product: ' . $variantProduct->error);
                }

                // Add extrafields to variant
                $variantProduct->array_options['options_variedad'] = $request_data['variety'];
                $variantProduct->array_options['options_tipo_presentacion'] = 'Bin';
                $variantProduct->array_options['options_tipo'] = 'SP';
                $result = $variantProduct->insertExtraFields();
                if ($result < 0) {
                    throw new Exception('Error adding extrafields to variant: ' . $variantProduct->error);
                }

                // Agregar la variante a la categoría "Papa"
                $category = new Categorie($this->db);
                $category->fetch($papa_category_id);
                $result = $category->add_type($variantProduct, 'product');
                if ($result < 0) {
                    throw new Exception('Error adding variant product to Papa category: ' . $category->error);
                }

                // Add product combination
                $sql = "INSERT INTO " . MAIN_DB_PREFIX . "product_attribute_combination (";
                $sql .= "fk_product_parent, fk_product_child, variation_price, variation_weight, entity";
                $sql .= ") VALUES (";
                $sql .= (int) $mainProduct->id . ", ";
                $sql .= (int) $variantProduct->id . ", ";
                $sql .= "0, "; // variation_price
                $sql .= "0, "; // variation_weight
                $sql .= "1"; // entity
                $sql .= ")";

                $result = $this->db->query($sql);
                if (!$result) {
                    throw new Exception('Error creating product combination: ' . $this->db->lasterror());
                }
            }

            // Update stock
            $movement = new MouvementStock($this->db);
            $result = $movement->reception(
                $user,
                $variantProduct->id,
                $request_data['warehouse_id'],
                $request_data['quantity'],
                0, // price
                'Initial stock entry',
                $request_data['date']
            );

            if ($result < 0) {
                throw new Exception('Error updating stock: ' . $movement->error);
            }

            // Add variety and lot to stock movement extrafields
            $sql = "INSERT INTO " . MAIN_DB_PREFIX . "stock_mouvement_extrafields (";
            $sql .= "fk_object, variedad, lote, precio";
            $sql .= ") VALUES (";
            $sql .= $movement->id . ", ";
            $sql .= "'" . $this->db->escape($request_data['variety']) . "', ";
            $sql .= "'" . $this->db->escape($request_data['lot']) . "', ";
            $sql .= "'" . $this->db->escape($request_data['logistic_cost']) . "'";
            $sql .= ")";

            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error adding variety and lot to stock movement: ' . $this->db->lasterror());
            }

            // Add new code to save to llx_vicentina_papa_cosecha
            $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_papa_cosecha (";
            $sql .= "date, crop, warehouse_id, logistic_cost, lot, variety, variety_code, type, quantity, ";
            $sql .= "product_id, fk_user_creat, date_creation";  // Added product_id here
            $sql .= ") VALUES (";
            $sql .= "'" . $this->db->escape($request_data['date']) . "', ";
            $sql .= "'" . $this->db->escape($request_data['crop']) . "', ";
            $sql .= (int) $request_data['warehouse_id'] . ", ";
            $sql .= (isset($request_data['logistic_cost']) ? floatval($request_data['logistic_cost']) : 0) . ", ";
            $sql .= "'" . $this->db->escape($request_data['lot']) . "', ";
            $sql .= "'" . $this->db->escape($request_data['variety']) . "', ";
            $sql .= "'" . $this->db->escape($request_data['variety_code']) . "', ";
            $sql .= "'" . $this->db->escape($request_data['type']) . "', ";
            $sql .= floatval($request_data['quantity']) . ", ";
            $sql .= (int) $variantProduct->id . ", ";  // Store the variant product ID
            $sql .= (int) $user->id . ", ";
            $sql .= "'" . $this->db->idate(dol_now()) . "'";
            $sql .= ")";

            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error inserting into vicentina_papa_cosecha: ' . $this->db->lasterror());
            }

            $harvest_id = $this->db->last_insert_id(MAIN_DB_PREFIX . 'vicentina_papa_cosecha');
            
            $this->db->commit();
            
            return array(
                'main_product_id' => $mainProduct->id,
                'variant_product_id' => $variantProduct->id,
                'movement_id' => $movement->id,
                'message' => 'Products and stock movement created successfully',
                'harvest_id' => $harvest_id
            );
        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * Get all potato harvest records
     *
     * @url GET potato/harvest/list
     * @return array List of potato harvest records
     * @throws RestException 503 Error retrieving data
     */
    public function listPotatoHarvest()
    {
        $sql = "SELECT h.rowid, h.date, h.crop, h.warehouse_id, h.logistic_cost, ";
        $sql .= "h.lot, h.variety, h.variety_code, h.type, h.quantity, ";
        $sql .= "h.date_creation, h.fk_user_creat, ";
        $sql .= "w.ref as warehouse_ref, w.lieu as warehouse_name ";
        $sql .= "FROM " . MAIN_DB_PREFIX . "vicentina_papa_cosecha as h ";
        $sql .= "LEFT JOIN " . MAIN_DB_PREFIX . "entrepot as w ON h.warehouse_id = w.rowid ";
        $sql .= "ORDER BY h.date DESC, h.rowid DESC";

        $result = $this->db->query($sql);
        if (!$result) {
            throw new RestException(503, 'Error retrieving potato harvest records: ' . $this->db->lasterror());
        }

        $harvests = array();
        while ($obj = $this->db->fetch_object($result)) {
            $harvests[] = array(
                'id' => (int) $obj->rowid,
                'date' => $obj->date,
                'crop' => $obj->crop,
                'warehouse_id' => (int) $obj->warehouse_id,
                'warehouse_ref' => $obj->warehouse_ref,
                'logistic_cost' => (float) $obj->logistic_cost,
                'lot' => $obj->lot,
                'variety' => $obj->variety,
                'variety_code' => $obj->variety_code,
                'type' => $obj->type,
                'quantity' => (float) $obj->quantity,
                'date_creation' => $obj->date_creation,
                'user_created' => (int) $obj->fk_user_creat
            );
        }

        return $harvests;
    }

    /**
     * Create new Irrigation Cost record
     *
     * @url POST irrigation/cost/create
     * @param array $request_data {
     *     @var float $cost_mother_line Cost of mother line
     *     @var float $fuel_consumption_per_hour Fuel consumption per hour
     *     @var float $maintenance_hours Maintenance hours
     *     @var float $maintenance_cost Maintenance cost
     * }
     * @return array Created Irrigation Cost record
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function createIrrigationCost($request_data)
    {
        if (empty($request_data)) {
            throw new RestException(400, 'Request data is required');
        }

        $this->db->begin();

        try {
            $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_irrigation_costs (";
            $sql .= "cost_mother_line, fuel_consumption_per_hour, maintenance_hours, maintenance_cost";
            $sql .= ") VALUES (";
            $sql .= floatval($request_data['cost_mother_line']) . ", ";
            $sql .= floatval($request_data['fuel_consumption_per_hour']) . ", ";
            $sql .= floatval($request_data['maintenance_hours']) . ", ";
            $sql .= floatval($request_data['maintenance_cost']);
            $sql .= ")";

            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error creating irrigation cost record: ' . $this->db->lasterror());
            }

            $id = $this->db->last_insert_id(MAIN_DB_PREFIX . 'vicentina_irrigation_costs');

            $this->db->commit();

            return array(
                'id' => $id,
                'message' => 'Irrigation cost record created successfully'
            );

        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * Get all irrigation cost records
     *
     * @url GET irrigation/cost/list
     * @return array List of irrigation cost records
     * @throws RestException 503 Error retrieving data
     */
    public function listIrrigationCosts()
    {
        $sql = "SELECT rowid, 
                       cost_mother_line,
                       fuel_consumption_per_hour,
                       maintenance_hours,
                       maintenance_cost,
                       date_creation,
                       tms as date_modification
                FROM " . MAIN_DB_PREFIX . "vicentina_irrigation_costs
                ORDER BY date_creation DESC";

        $result = $this->db->query($sql);

        if ($result) {
            $records = array();
            while ($cost = $this->db->fetch_object($result)) {
                $records[] = array(
                    'id' => $cost->rowid,
                    'cost_mother_line' => floatval($cost->cost_mother_line),
                    'fuel_consumption_per_hour' => floatval($cost->fuel_consumption_per_hour),
                    'maintenance_hours' => floatval($cost->maintenance_hours),
                    'maintenance_cost' => floatval($cost->maintenance_cost),
                    'date_creation' => $cost->date_creation,
                    'date_modification' => $cost->date_modification
                );
            }
            return $records;
        } else {
            throw new RestException(503, 'Error retrieving irrigation cost records: ' . $this->db->lasterror());
        }
    }

    /**
     * Create irrigation hours record
     *
     * @url POST irrigation/hours/create
     * @param array $request_data {
     *     @var string $date Date of irrigation
     *     @var float $hours Hours of irrigation
     *     @var string $crop_code Crop reference code
     *     @var array $lots_irrigated Array of irrigated lots {
     *         @var int $id_lote Lot ID
     *         @var float $area_utilizada Used area
     *     }
     *     @var array $sublots_irrigated Array of irrigated sublots {
     *         @var int $id_sub_lote Sublot ID
     *         @var float $area_utilizada Used area
     *         @var int $id_parent_lote Parent lot ID
     *         @var string $name Sublot name
     *     }
     * }
     * @return array Created irrigation hours record
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function createIrrigationHours($request_data)
    {
        global $user;

        if (empty($request_data['date']) || empty($request_data['hours']) || empty($request_data['crop_code'])) {
            throw new RestException(400, 'Date, hours and crop code are required fields');
        }

        $this->db->begin();

        try {
            // Get latest irrigation cost record with fuel consumption per hour
            $sql = "SELECT rowid, fuel_consumption_per_hour FROM " . MAIN_DB_PREFIX . "vicentina_irrigation_costs 
                    ORDER BY date_creation DESC LIMIT 1";
            $result = $this->db->query($sql);
            $latest_cost = $this->db->fetch_object($result);

            if (!$latest_cost) {
                throw new Exception('No irrigation costs found in the system');
            }

            // Get fuel price (gasoil50s) for the date
            $fuelPrice = 0;
            $fuelData = $this->getFuelPriceForDate($request_data['date']);
            if ($fuelData && isset($fuelData['gasoil50s'])) {
                $fuelPrice = $fuelData['gasoil50s'];
            }

            // Get dollar price for the date
            $dollarAvg = 1; // Default value if no dollar price is found
            $sql = "SELECT avg FROM " . MAIN_DB_PREFIX . "vicentina_dolar 
                    WHERE date = '" . $this->db->escape($request_data['date']) . "'";
            $result = $this->db->query($sql);
            if ($result && $this->db->num_rows($result) > 0) {
                $dollarRow = $this->db->fetch_object($result);
                $dollarAvg = $dollarRow->avg > 0 ? $dollarRow->avg : 1;
            }

            // Calculate total fuel consumption in liters (hours × fuel_consumption_per_hour)
            $totalFuelConsumption = floatval($request_data['hours']) * floatval($latest_cost->fuel_consumption_per_hour);
            
            // Calculate total fuel cost in local currency (total consumption × fuel price)
            $totalFuelCostLocal = $totalFuelConsumption * $fuelPrice;
            
            // Calculate total fuel cost in USD
            $totalFuelCostUSD = $totalFuelCostLocal / $dollarAvg;

            // Insert irrigation hours record with fuel price in USD
            $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_irrigation_hours (";
            $sql .= "date, hours, crop_code, fk_costs, fuel_price, fk_user_creat, date_creation";
            $sql .= ") VALUES (";
            $sql .= "'" . $this->db->escape($request_data['date']) . "', ";
            $sql .= floatval($request_data['hours']) . ", ";
            $sql .= "'" . $this->db->escape($request_data['crop_code']) . "', ";
            $sql .= (int) $latest_cost->rowid . ", ";
            $sql .= floatval($totalFuelCostUSD) . ", ";
            $sql .= (int) $user->id . ", ";
            $sql .= "'" . $this->db->idate(dol_now()) . "'";
            $sql .= ")";

            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error creating irrigation hours record: ' . $this->db->lasterror());
            }

            $irrigation_hours_id = $this->db->last_insert_id(MAIN_DB_PREFIX . 'vicentina_irrigation_hours');

            // Insert lots (without sublots) - only if area_utilizada > 0
            if (!empty($request_data['lots_irrigated'])) {
                foreach ($request_data['lots_irrigated'] as $lot) {
                    if ($lot['area_utilizada'] > 0) {  // Only insert if area is greater than 0
                        $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_registers_lots (";
                        $sql .= "register_type, fk_register, fk_lote, area_utilizada, fk_sublote";
                        $sql .= ") VALUES (";
                        $sql .= "'irrigation_hours', ";
                        $sql .= (int) $irrigation_hours_id . ", ";
                        $sql .= (int) $lot['id_lote'] . ", ";
                        $sql .= floatval($lot['area_utilizada']) . ", ";
                        $sql .= "NULL";  // No sublot for these entries
                        $sql .= ")";

                        $result = $this->db->query($sql);
                        if (!$result) {
                            throw new Exception('Error creating irrigation hours-lot relationship: ' . $this->db->lasterror());
                        }
                    }
                }
            }

            // Insert sublots
            if (!empty($request_data['sublots_irrigated'])) {
                foreach ($request_data['sublots_irrigated'] as $sublot) {
                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_registers_lots (";
                    $sql .= "register_type, fk_register, fk_lote, area_utilizada, fk_sublote";
                    $sql .= ") VALUES (";
                    $sql .= "'irrigation_hours', ";
                    $sql .= (int) $irrigation_hours_id . ", ";
                    $sql .= (int) $sublot['id_parent_lote'] . ", ";
                    $sql .= floatval($sublot['area_utilizada']) . ", ";
                    $sql .= (int) $sublot['id_sub_lote'];
                    $sql .= ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating irrigation hours-sublot relationship: ' . $this->db->lasterror());
                    }
                }
            }

            $this->db->commit();

            return array(
                'id' => $irrigation_hours_id,
                'message' => 'Irrigation hours record created successfully',
                'fk_costs' => $latest_cost->rowid,
                'fuel_consumption_per_hour' => floatval($latest_cost->fuel_consumption_per_hour),
                'total_fuel_consumption' => $totalFuelConsumption,
                'fuel_price_per_liter' => $fuelPrice,
                'dollar_avg' => $dollarAvg,
                'total_fuel_cost_local' => $totalFuelCostLocal,
                'total_fuel_cost_usd' => $totalFuelCostUSD
            );

        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * Create new Fertirriego record
     *
     * @url POST irrigation/fertirriego/create
     * @param array $request_data {
     *     @var string $crop_code Crop reference code
     *     @var string $date Activity date
     *     @var array $selectedLots Array of selected lots {
     *         @var int $id_lote Lot ID
     *         @var float $area_utilizada Used area
     *     }
     *     @var array $selectedSublots Array of selected sublots {
     *         @var int $id_sub_lote Sublot ID
     *         @var float $area_utilizada Used area
     *         @var int $id_parent_lote Parent lot ID
     *         @var string $name Sublot name
     *     }
     *     @var array $selectedMaterials Array of selected materials {
     *         @var int $id Product ID
     *         @var float $quantity Quantity
     *         @var int $warehouse_id Warehouse ID
     *         @var string $type Product type
     *         @var float $presentation Product presentation size
     *     }
     * }
     * @return array Created Fertirriego record
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function createFertirriego($request_data)
    {
        global $user;

        if (empty($request_data['crop_code']) || empty($request_data['date'])) {
            throw new RestException(400, 'Crop code and date are required fields');
        }

        $this->db->begin();

        try {
            // Calculate total area from sublots
            $total_area = 0;
            if (!empty($request_data['selectedSublots'])) {
                foreach ($request_data['selectedSublots'] as $sublot) {
                    $total_area += floatval($sublot['area_utilizada']);
                }
            }

            // Insert main Fertirriego record
            $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_irrigation_fertirriego (";
            $sql .= "crop_code, date, total_area, fk_user_creat, date_creation";
            $sql .= ") VALUES (";
            $sql .= "'" . $this->db->escape($request_data['crop_code']) . "', ";
            $sql .= "'" . $this->db->escape($request_data['date']) . "', ";
            $sql .= floatval($total_area) . ", ";
            $sql .= (int) $user->id . ", ";
            $sql .= "'" . $this->db->idate(dol_now()) . "'";
            $sql .= ")";

            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error creating Fertirriego record: ' . $this->db->lasterror());
            }

            $fertirriego_id = $this->db->last_insert_id(MAIN_DB_PREFIX . 'vicentina_irrigation_fertirriego');

            // Insert lots (without sublots) - only if area_utilizada > 0
            if (!empty($request_data['selectedLots'])) {
                foreach ($request_data['selectedLots'] as $lot) {
                    if ($lot['area_utilizada'] > 0) {
                        $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_registers_lots (";
                        $sql .= "register_type, fk_register, fk_lote, area_utilizada, fk_sublote";
                        $sql .= ") VALUES (";
                        $sql .= "'fertirriego', ";
                        $sql .= (int) $fertirriego_id . ", ";
                        $sql .= (int) $lot['id_lote'] . ", ";
                        $sql .= floatval($lot['area_utilizada']) . ", ";
                        $sql .= "NULL";  // No sublot for these entries
                        $sql .= ")";

                        $result = $this->db->query($sql);
                        if (!$result) {
                            throw new Exception('Error creating Fertirriego-lot relationship: ' . $this->db->lasterror());
                        }
                    }
                }
            }

            // Insert sublots
            if (!empty($request_data['selectedSublots'])) {
                foreach ($request_data['selectedSublots'] as $sublot) {
                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_registers_lots (";
                    $sql .= "register_type, fk_register, fk_lote, area_utilizada, fk_sublote";
                    $sql .= ") VALUES (";
                    $sql .= "'fertirriego', ";
                    $sql .= (int) $fertirriego_id . ", ";
                    $sql .= (int) $sublot['id_parent_lote'] . ", ";
                    $sql .= floatval($sublot['area_utilizada']) . ", ";
                    $sql .= (int) $sublot['id_sub_lote'];
                    $sql .= ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating Fertirriego-sublot relationship: ' . $this->db->lasterror());
                    }
                }
            }

            // Process materials and update stock
            if (!empty($request_data['selectedMaterials'])) {
                foreach ($request_data['selectedMaterials'] as $product) {
                    $stock_used = $product['quantity'];

                    // Get PMP from product table
                    $sql = "SELECT pmp, pmp_dollar FROM " . MAIN_DB_PREFIX . "product WHERE rowid = " . (int) $product['id'];
                    $pmp_result = $this->db->query($sql);
                    $pmp_obj = $this->db->fetch_object($pmp_result);
                    $pmp = $pmp_obj && $pmp_obj->pmp ? $pmp_obj->pmp : 0;
                    $pmp_dollar = $pmp_obj && $pmp_obj->pmp_dollar ? $pmp_obj->pmp_dollar : 0;

                    // Calculate total prices
                    $total_price = $stock_used * $pmp;
                    $total_price_usd = $stock_used * $pmp_dollar;

                    // Insert product record
                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_registers_products (";
                    $sql .= "register_type, fk_register, fk_product, quantity, warehouse_id, type, stock_used, ";
                    $sql .= "total_price, total_price_usd";
                    $sql .= ") VALUES (";
                    $sql .= "'fertirriego', ";
                    $sql .= (int) $fertirriego_id . ", ";
                    $sql .= (int) $product['id'] . ", ";
                    $sql .= floatval($product['quantity']) . ", ";
                    $sql .= (int) $product['warehouse_id'] . ", ";
                    $sql .= "'" . $this->db->escape($product['type']) . "', ";
                    $sql .= floatval($stock_used) . ", ";
                    $sql .= floatval($total_price) . ", ";
                    $sql .= floatval($total_price_usd);
                    $sql .= ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating Fertirriego-product relationship: ' . $this->db->lasterror());
                    }

                    // Update stock movement
                    require_once DOL_DOCUMENT_ROOT . '/product/stock/class/mouvementstock.class.php';
                    $movement = new MouvementStock($this->db);
                    $result = $movement->livraison(
                        $user,
                        $product['id'],
                        $product['warehouse_id'],
                        $stock_used,
                        0,
                        'Fertirriego Creation - ' . $request_data['crop_code'],
                        '',
                        '',
                        '',
                        0,
                        0
                    );

                    if ($result < 0) {
                        throw new Exception('Error updating stock: ' . $movement->error);
                    }
                }
            }

            $this->db->commit();

            return array(
                'id' => $fertirriego_id,
                'message' => 'Fertirriego record created successfully'
            );

        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * Get irrigation record by ID with all related information
     *
     * @url GET /irrigation/{id}
     * @param int $id ID of the irrigation record
     * @return array Irrigation record with all related data
     * @throws RestException 404 Not Found
     * @throws RestException 503 Error retrieving data
     */
    public function getIrrigationById($id)
    {
        if (empty($id)) {
            throw new RestException(400, 'Irrigation ID is required');
        }

        // Get main irrigation record with related information
        $sql = "SELECT i.*, 
                uc.login as user_creation,
                um.login as user_modification,
                e1.rowid as first_equipment_id,
                e1.name as first_equipment_name,
                e1.code as first_equipment_code,
                e1.brand as first_equipment_brand,
                e1.model as first_equipment_model,
                e2.rowid as second_equipment_id,
                e2.name as second_equipment_name,
                e2.code as second_equipment_code,
                e2.brand as second_equipment_brand,
                e2.model as second_equipment_model
            FROM " . MAIN_DB_PREFIX . "vicentina_irrigation as i
            LEFT JOIN " . MAIN_DB_PREFIX . "user as uc ON i.fk_user_creat = uc.rowid
            LEFT JOIN " . MAIN_DB_PREFIX . "user as um ON i.fk_user_modif = um.rowid
            LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_maquinaria as e1 ON i.first_equipment = e1.rowid
            LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_maquinaria as e2 ON i.second_equipment = e2.rowid
            WHERE i.rowid = " . (int) $id;

        $result = $this->db->query($sql);

        if (!$result || $this->db->num_rows($result) == 0) {
            throw new RestException(404, 'Irrigation record not found');
        }

        $irrigation = $this->db->fetch_object($result);

        // Get lots and sublots for this irrigation
        $lotsSql = "SELECT l.rowid, l.name, rl.area_utilizada, rl.fk_sublote,
                    c.name as campo_name,
                    sl.name as sublot_name
                FROM " . MAIN_DB_PREFIX . "vicentina_registers_lots as rl
                LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_lote as l ON rl.fk_lote = l.rowid
                LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_campo as c ON l.fk_campo = c.rowid
                LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_cultivo_sublote as sl ON rl.fk_sublote = sl.rowid
                WHERE rl.register_type = 'irrigation' 
                AND rl.fk_register = " . (int) $id;

        $lotsResult = $this->db->query($lotsSql);
        $lots = array();
        $sublots = array();
        $parentLots = array(); // Track parent lots of sublots

        while ($lot = $this->db->fetch_object($lotsResult)) {
            if ($lot->fk_sublote) {
                // This is a sublot
                $sublots[] = array(
                    'id_sub_lote' => (string) $lot->fk_sublote,
                    'id_parent_lote' => (string) $lot->rowid,
                    'name' => $lot->sublot_name,
                    'area_utilizada' => floatval($lot->area_utilizada)
                );

                // Add parent lot if not already added
                $parentLotKey = $lot->rowid;
                if (!isset($parentLots[$parentLotKey])) {
                    $parentLots[$parentLotKey] = array(
                        'rowid' => (string) $lot->rowid,
                        'name' => $lot->name,
                        'campo_name' => $lot->campo_name,
                        'area_utilizada' => 0 // Parent lot's area is not used when there are sublots
                    );
                }
            } else {
                // This is a main lot without sublots
                $lots[] = array(
                    'rowid' => (string) $lot->rowid,
                    'name' => $lot->name,
                    'campo_name' => $lot->campo_name,
                    'area_utilizada' => floatval($lot->area_utilizada)
                );
            }
        }

        // Merge regular lots with parent lots
        $allLots = array_merge($lots, array_values($parentLots));

        // Get products/materials for this irrigation
        $productsSql = "SELECT p.label as product_name, p.ref as product_ref, 
                        rp.*, e.ref as warehouse_name
                    FROM " . MAIN_DB_PREFIX . "vicentina_registers_products as rp
                    LEFT JOIN " . MAIN_DB_PREFIX . "product as p ON rp.fk_product = p.rowid
                    LEFT JOIN " . MAIN_DB_PREFIX . "entrepot as e ON rp.warehouse_id = e.rowid
                    WHERE rp.register_type = 'irrigation' 
                    AND rp.fk_register = " . (int) $id;

        $productsResult = $this->db->query($productsSql);
        $products = array();
        while ($product = $this->db->fetch_object($productsResult)) {
            $products[] = array(
                'rowid' => $product->rowid,
                'product_name' => $product->product_name,
                'product_ref' => $product->product_ref,
                'quantity' => floatval($product->quantity),
                'type' => $product->type,
                'warehouse_name' => $product->warehouse_name,
                'total_price' => floatval($product->total_price),
                'total_price_usd' => floatval($product->total_price_usd)
            );
        }

        // Get irrigation hours records related to this irrigation
        $hoursSql = "SELECT ih.*, ic.fuel_consumption_per_hour, ic.maintenance_hours, ic.maintenance_cost
                FROM " . MAIN_DB_PREFIX . "vicentina_irrigation_hours as ih
                LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_irrigation_costs as ic ON ih.fk_costs = ic.rowid
                WHERE ih.crop_code = '" . $this->db->escape($irrigation->crop_code) . "'
                ORDER BY ih.date DESC";

        $hoursResult = $this->db->query($hoursSql);
        $hours = array();
        while ($hour = $this->db->fetch_object($hoursResult)) {
            $hours[] = array(
                'rowid' => $hour->rowid,
                'date' => $hour->date,
                'hours' => floatval($hour->hours),
                'fk_costs' => $hour->fk_costs,
                'fuel_consumption_per_hour' => floatval($hour->fuel_consumption_per_hour),
                'maintenance_hours' => floatval($hour->maintenance_hours),
                'maintenance_cost' => floatval($hour->maintenance_cost),
                'fuel_price' => floatval($hour->fuel_price), // Total fuel cost stored in the database
            );
        }

        // Get fertirriego records related to this irrigation
        $fertirrigoSql = "SELECT f.*
                    FROM " . MAIN_DB_PREFIX . "vicentina_irrigation_fertirriego as f
                    WHERE f.crop_code = '" . $this->db->escape($irrigation->crop_code) . "'
                    ORDER BY f.date DESC";

        $fertirrigoResult = $this->db->query($fertirrigoSql);
        $fertirriego = array();

        while ($fert = $this->db->fetch_object($fertirrigoResult)) {
            // Get products for this fertirriego
            $fertProductsSql = "SELECT p.label as product_name, p.ref as product_ref, 
                            rp.*, e.ref as warehouse_name
                        FROM " . MAIN_DB_PREFIX . "vicentina_registers_products as rp
                        LEFT JOIN " . MAIN_DB_PREFIX . "product as p ON rp.fk_product = p.rowid
                        LEFT JOIN " . MAIN_DB_PREFIX . "entrepot as e ON rp.warehouse_id = e.rowid
                        WHERE rp.register_type = 'fertirriego' 
                        AND rp.fk_register = " . (int) $fert->rowid;

            $fertProductsResult = $this->db->query($fertProductsSql);
            $fertProducts = array();
            $totalCost = 0;

            while ($product = $this->db->fetch_object($fertProductsResult)) {
                $fertProducts[] = array(
                    'rowid' => $product->rowid,
                    'product_name' => $product->product_name,
                    'product_ref' => $product->product_ref,
                    'quantity' => floatval($product->quantity),
                    'type' => $product->type,
                    'warehouse_name' => $product->warehouse_name,
                    'total_price' => floatval($product->total_price),
                    'total_price_usd' => floatval($product->total_price_usd)
                );

                $totalCost += floatval($product->total_price);
            }

            // Get lots for this fertirriego
            $fertLotsSql = "SELECT l.rowid, l.name, rl.area_utilizada, rl.fk_sublote,
                        c.name as campo_name,
                        sl.name as sublot_name
                    FROM " . MAIN_DB_PREFIX . "vicentina_registers_lots as rl
                    LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_lote as l ON rl.fk_lote = l.rowid
                    LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_campo as c ON l.fk_campo = c.rowid
                    LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_cultivo_sublote as sl ON rl.fk_sublote = sl.rowid
                    WHERE rl.register_type = 'fertirriego' 
                    AND rl.fk_register = " . (int) $fert->rowid;

            $fertLotsResult = $this->db->query($fertLotsSql);
            $fertLots = array();
            $fertSublots = array();

            while ($lot = $this->db->fetch_object($fertLotsResult)) {
                if ($lot->fk_sublote) {
                    // This is a sublot
                    $fertSublots[] = array(
                        'id_sub_lote' => (string) $lot->fk_sublote,
                        'id_parent_lote' => (string) $lot->rowid,
                        'name' => $lot->sublot_name,
                        'area_utilizada' => floatval($lot->area_utilizada)
                    );
                } else {
                    // This is a main lot without sublots
                    $fertLots[] = array(
                        'rowid' => (string) $lot->rowid,
                        'name' => $lot->name,
                        'campo_name' => $lot->campo_name,
                        'area_utilizada' => floatval($lot->area_utilizada)
                    );
                }
            }

            $fertirriego[] = array(
                'rowid' => $fert->rowid,
                'date' => $fert->date,
                'total_area' => floatval($fert->total_area),
                'product_count' => count($fertProducts),
                'total_cost' => $totalCost,
                'products' => $fertProducts,
                'lots' => $fertLots,
                'sublots' => $fertSublots
            );
        }

        // Structure the response
        $response = array(
            'irrigation' => array(
                'rowid' => $irrigation->rowid,
                'crop_code' => $irrigation->crop_code,
                'date' => $irrigation->date,
                'meters_of_line_mother' => floatval($irrigation->meters_of_line_mother),
                'cost_mother_line' => floatval($irrigation->cost_mother_line),
                'first_equipment' => array(
                    'id' => $irrigation->first_equipment_id,
                    'name' => $irrigation->first_equipment_name,
                    'code' => $irrigation->first_equipment_code,
                    'brand' => $irrigation->first_equipment_brand,
                    'model' => $irrigation->first_equipment_model,
                ),
                'second_equipment' => array(
                    'id' => $irrigation->second_equipment_id,
                    'name' => $irrigation->second_equipment_name,
                    'code' => $irrigation->second_equipment_code,
                    'brand' => $irrigation->second_equipment_brand,
                    'model' => $irrigation->second_equipment_model,
                ),
                'date_creation' => $this->db->jdate($irrigation->date_creation),
                'date_modification' => $irrigation->tms ? $this->db->jdate($irrigation->tms) : null,
                'user_creation' => $irrigation->user_creation,
                'user_modification' => $irrigation->user_modification
            ),
            'selectedLots' => $allLots,
            'selectedSublots' => $sublots,
            'materials' => $products,
            'hours' => $hours,
            'fertirriego' => $fertirriego
        );

        return $response;
    }

    /**
     * Delete irrigation hours record
     *
     * @url DELETE /irrigation/hours/{id}
     * @param int $id ID of the irrigation hours record to delete
     * @return array Result of the deletion
     * @throws RestException 400 Bad Request
     * @throws RestException 404 Not Found
     * @throws RestException 500 Internal Server Error
     */
    public function deleteIrrigationHours($id)
    {
        global $user;

        if (empty($id)) {
            throw new RestException(400, 'Irrigation hours ID is required');
        }

        // First check if the record exists
        $sql = "SELECT rowid FROM " . MAIN_DB_PREFIX . "vicentina_irrigation_hours WHERE rowid = " . (int) $id;
        $result = $this->db->query($sql);

        if (!$result || $this->db->num_rows($result) == 0) {
            throw new RestException(404, 'Irrigation hours record not found');
        }

        $this->db->begin();

        try {
            // Delete associated lots records first
            $sql = "DELETE FROM " . MAIN_DB_PREFIX . "vicentina_registers_lots 
                WHERE register_type = 'irrigation_hours' AND fk_register = " . (int) $id;
            $result = $this->db->query($sql);

            if (!$result) {
                throw new Exception('Error deleting associated lots: ' . $this->db->lasterror());
            }

            // Now delete the main record
            $sql = "DELETE FROM " . MAIN_DB_PREFIX . "vicentina_irrigation_hours WHERE rowid = " . (int) $id;
            $result = $this->db->query($sql);

            if (!$result) {
                throw new Exception('Error deleting irrigation hours record: ' . $this->db->lasterror());
            }

            $this->db->commit();

            return array(
                'success' => true,
                'message' => 'Irrigation hours record deleted successfully'
            );

        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * Delete irrigation product and correct stock
     *
     * @url DELETE /irrigation/product/{id}
     * @param int $id ID of the product record to delete
     * @return array Result of the deletion
     * @throws RestException 400 Bad Request
     * @throws RestException 404 Not Found
     * @throws RestException 500 Internal Server Error
     */
    public function deleteIrrigationProduct($id)
    {
        global $user;

        if (empty($id)) {
            throw new RestException(400, 'Product record ID is required');
        }

        // First get the product record to know what to restore in stock
        $sql = "SELECT * FROM " . MAIN_DB_PREFIX . "vicentina_registers_products 
            WHERE rowid = " . (int) $id;
        $result = $this->db->query($sql);

        if (!$result || $this->db->num_rows($result) == 0) {
            throw new RestException(404, 'Product record not found');
        }

        $product_record = $this->db->fetch_object($result);

        $this->db->begin();

        try {
            // Restore stock - we need to add back the quantity that was removed
            require_once DOL_DOCUMENT_ROOT . '/product/stock/class/mouvementstock.class.php';
            $movement = new MouvementStock($this->db);

            // Use reception to add stock back (opposite of livraison which removes stock)
            $result = $movement->reception(
                $user,
                $product_record->fk_product,
                $product_record->warehouse_id,
                $product_record->stock_used,
                0, // Price is not needed for stock correction
                'Deletion of irrigation product record - Stock correction',
                '', // Lot
                '', // Origin
                '', // Origin ID
                0,  // fk_projet
                0   // eatby
            );

            if ($result < 0) {
                throw new Exception('Error correcting stock: ' . $movement->error);
            }

            // Now delete the product record
            $sql = "DELETE FROM " . MAIN_DB_PREFIX . "vicentina_registers_products WHERE rowid = " . (int) $id;
            $result = $this->db->query($sql);

            if (!$result) {
                throw new Exception('Error deleting product record: ' . $this->db->lasterror());
            }

            $this->db->commit();

            return array(
                'success' => true,
                'message' => 'Product record deleted and stock corrected successfully',
                'product_id' => $product_record->fk_product,
                'quantity_restored' => $product_record->stock_used,
                'warehouse_id' => $product_record->warehouse_id
            );

        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * Save prices for dollar and fuels
     *
     * @url POST /prices/save
     * @param array $request_data {
     *     @var array $dolar {
     *         @var float $compra Purchase price
     *         @var float $venta Sale price
     *         @var string $moneda Currency name
     *     }
     *     @var array $fuels Array of fuel prices {
     *         @var string $fuel Fuel type
     *         @var float $price Fuel price
     *     }
     * }
     * @return array Response message
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function savePrices($request_data)
    {
        if (empty($request_data['dolar']) || empty($request_data['fuels'])) {
            throw new RestException(400, 'Dolar and fuels data are required');
        }

        $this->db->begin();

        try {
            // Check if dollar prices were already updated today
            $checkSql = "SELECT COUNT(*) as count FROM " . MAIN_DB_PREFIX . "vicentina_dolar 
                         WHERE DATE(date) = CURDATE()";
            $checkResult = $this->db->query($checkSql);
            $dollarUpdatedToday = false;
            
            if ($checkResult) {
                $row = $this->db->fetch_object($checkResult);
                $dollarUpdatedToday = ($row->count > 0);
            }

            // Save dollar prices if not already updated today
            if (!$dollarUpdatedToday) {
                $dolar = $request_data['dolar'];
                $compra = floatval($dolar['compra']);
                $venta = floatval($dolar['venta']);
                $moneda = $this->db->escape($dolar['moneda']);
                $avg = ($compra + $venta) / 2;

                $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_dolar (date, compra, venta, moneda, avg) 
                    VALUES (CURDATE(), " . $compra . ", " . $venta . ", '" . $moneda . "', " . $avg . ")";

                $result = $this->db->query($sql);
                if (!$result) {
                    throw new Exception('Error saving dollar prices: ' . $this->db->lasterror());
                }
            }

            // Check if fuel prices were already updated today
            $checkFuelSql = "SELECT COUNT(*) as count FROM " . MAIN_DB_PREFIX . "vicentina_fuels 
                             WHERE DATE(date) = CURDATE()";
            $checkFuelResult = $this->db->query($checkFuelSql);
            $fuelsUpdatedToday = false;
            
            if ($checkFuelResult) {
                $row = $this->db->fetch_object($checkFuelResult);
                $fuelsUpdatedToday = ($row->count > 0);
            }

            // Save fuel prices if not already updated today
            if (!$fuelsUpdatedToday) {
                // Process fuel prices into a structured array
                $fuelData = [
                    'super' => 0,
                    'premium' => 0,
                    'gasoil10s' => 0,
                    'gasoil50s' => 0
                ];

                foreach ($request_data['fuels'] as $fuel) {
                    $fuelType = $fuel['fuel'];
                    $price = floatval($fuel['price']);

                    // Map the fuel type to the corresponding column
                    if ($fuelType == 'super95') {
                        $fuelData['super'] = $price;
                    } elseif ($fuelType == 'premium97') {
                        $fuelData['premium'] = $price;
                    } elseif ($fuelType == 'gasoil10s') {
                        $fuelData['gasoil10s'] = $price;
                    } elseif ($fuelType == 'gasoil50s') {
                        $fuelData['gasoil50s'] = $price;
                    }
                }

                // Insert fuel prices into the table
                $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_fuels 
                    (date, super, premium, gasoil10s, gasoil50s) 
                    VALUES (
                        CURDATE(), 
                        " . $fuelData['super'] . ", 
                        " . $fuelData['premium'] . ", 
                        " . $fuelData['gasoil10s'] . ", 
                        " . $fuelData['gasoil50s'] . "
                    )";

                $result = $this->db->query($sql);
                if (!$result) {
                    throw new Exception('Error saving fuel prices: ' . $this->db->lasterror());
                }
            }

            $this->db->commit();

            return array(
                'message' => 'Prices saved successfully',
                'dollar_updated' => !$dollarUpdatedToday,
                'fuels_updated' => !$fuelsUpdatedToday
            );
        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, 'Error saving prices: ' . $e->getMessage());
        }
    }

    /**
     * Get historical prices for fuels and dollar for the last year
     *
     * @url GET /prices/historic
     * @return array Historical prices for fuels and dollar
     * @throws RestException 503 Error retrieving data
     */
    public function getHistoricalPrices()
    {
        try {
            // Get dollar prices for the last year
            $sql = "SELECT rowid, date, compra, venta, avg, moneda 
                    FROM " . MAIN_DB_PREFIX . "vicentina_dolar 
                    WHERE date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) 
                    ORDER BY date DESC";
                    
            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error retrieving dollar prices: ' . $this->db->lasterror());
            }
            
            $dollarPrices = array();
            while ($row = $this->db->fetch_object($result)) {
                $dollarPrices[] = array(
                    'id' => $row->rowid,
                    'date' => $row->date,
                    'compra' => floatval($row->compra),
                    'venta' => floatval($row->venta),
                    'avg' => floatval($row->avg),
                    'moneda' => $row->moneda
                );
            }
            
            // Get fuel prices for the last year
            $sql = "SELECT rowid, date, super, premium, gasoil10s, gasoil50s 
                    FROM " . MAIN_DB_PREFIX . "vicentina_fuels 
                    WHERE date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) 
                    ORDER BY date DESC";
                    
            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error retrieving fuel prices: ' . $this->db->lasterror());
            }
            
            $fuelPrices = array();
            while ($row = $this->db->fetch_object($result)) {
                $fuelPrices[] = array(
                    'id' => $row->rowid,
                    'date' => $row->date,
                    'super95' => floatval($row->super),
                    'premium97' => floatval($row->premium),
                    'gasoil10s' => floatval($row->gasoil10s),
                    'gasoil50s' => floatval($row->gasoil50s)
                );
            }
            
            // Return combined results
            return array(
                'dollar' => $dollarPrices,
                'fuels' => $fuelPrices
            );
            
        } catch (Exception $e) {
            throw new RestException(503, 'Error retrieving historical prices: ' . $e->getMessage());
        }
    }

    /**
     * Get fuel price for a specific date
     *
     * @param string $date Date in YYYY-MM-DD format
     * @return array Fuel prices for the given date
     * @throws RestException 503 Error retrieving data
     */
    public function getFuelPriceForDate($date)
    {
        try {
            // Get fuel prices for the given date
            $sql = "SELECT super, premium, gasoil10s, gasoil50s 
                    FROM " . MAIN_DB_PREFIX . "vicentina_fuels 
                    WHERE date = '" . $this->db->escape($date) . "'";
            
            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error retrieving fuel prices: ' . $this->db->lasterror());
            }
            
            $fuelPrices = array();
            while ($row = $this->db->fetch_object($result)) {
                $fuelPrices['super'] = floatval($row->super);
                $fuelPrices['premium'] = floatval($row->premium);
                $fuelPrices['gasoil10s'] = floatval($row->gasoil10s);
                $fuelPrices['gasoil50s'] = floatval($row->gasoil50s);
            }
            
            return $fuelPrices;
        } catch (Exception $e) {
            throw new RestException(503, 'Error retrieving fuel prices: ' . $e->getMessage());
        }
    }

    /**
     * Create a new logistic cost record
     *
     * @param array $request_data {
     *     @var string $origin       Origin location
     *     @var string $destination  Destination location (optional)
     *     @var string $date         Date in Y-m-d format
     *     @var string $kilometeres  Distance in kilometers
     *     @var string $cost         Cost amount
     * }
     * @return array Created logistic cost record
     *
     * @url POST logistic-cost/create
     */
    public function createLogisticCost($request_data)
    {
        global $user;

        // Check mandatory fields
        if (empty($request_data['origin'])) {
            throw new RestException(400, 'Origin location is mandatory');
        }
        if (empty($request_data['date'])) {
            throw new RestException(400, 'Date is mandatory');
        }
        if (!isset($request_data['kilometeres'])) {
            throw new RestException(400, 'Kilometers is mandatory');
        }
        if (!isset($request_data['cost'])) {
            throw new RestException(400, 'Cost is mandatory');
        }

        $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_logistic_cost (";
        $sql .= "date, kilometers, cost, origin, destination, ";
        $sql .= "fk_user_creat, date_creation";
        $sql .= ") VALUES (";
        $sql .= "'" . $this->db->escape($request_data['date']) . "', ";
        $sql .= floatval($request_data['kilometeres']) . ", ";
        $sql .= floatval($request_data['cost']) . ", ";
        $sql .= "'" . $this->db->escape($request_data['origin']) . "', ";
        $sql .= !empty($request_data['destination']) ? "'" . $this->db->escape($request_data['destination']) . "', " : "NULL, ";
        $sql .= (int) $user->id . ", ";
        $sql .= "'" . $this->db->idate(dol_now()) . "'";
        $sql .= ")";

        $result = $this->db->query($sql);
        if (!$result) {
            throw new RestException(500, 'Error creating logistic cost record');
        }

        return array(
            'success' => true,
            'id' => $this->db->last_insert_id(MAIN_DB_PREFIX . 'vicentina_logistic_cost')
        );
    }

    /**
     * Get list of logistic costs
     *
     * @return array Array of logistic cost records
     *
     * @url GET logistic-cost/list
     */
    public function listLogisticCosts()
    {
        global $user;

        $sql = "SELECT l.rowid, l.date, l.kilometers, l.cost, ";
        $sql .= "l.origin, l.destination, ";
        $sql .= "l.date_creation, l.fk_user_creat ";
        $sql .= "FROM " . MAIN_DB_PREFIX . "vicentina_logistic_cost as l ";
        $sql .= "ORDER BY l.date DESC";

        $result = $this->db->query($sql);
        if (!$result) {
            throw new RestException(503, 'Error retrieving logistic cost records');
        }

        $costs = array();
        while ($obj = $this->db->fetch_object($result)) {
            $costs[] = array(
                'id' => (int) $obj->rowid,
                'date' => $obj->date,
                'kilometers' => (float) $obj->kilometers,
                'cost' => (float) $obj->cost,
                'origin' => $obj->origin,
                'destination' => $obj->destination,
                'date_creation' => $obj->date_creation,
                'user_created' => (int) $obj->fk_user_creat
            );
        }

        return $costs;
    }

    /**
     * Create a new caliber
     *
     * @param array $request_data {
     *     @var string $name        Name of the caliber
     *     @var string $description Description (optional)
     * }
     * @return array Created caliber record
     *
     * @url POST tong/caliber
     */
    public function createCaliber($request_data)
    {
        global $user;
        if (empty($request_data['name'])) {
            throw new RestException(400, 'Caliber name is mandatory');
        }

        $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_caliber (";
        $sql .= "name, description, fk_user_creat, date_creation";
        $sql .= ") VALUES (";
        $sql .= "'" . $this->db->escape($request_data['name']) . "', ";
        $sql .= !empty($request_data['description']) ? "'" . $this->db->escape($request_data['description']) . "', " : "NULL, ";
        $sql .= (int) $user->id . ", ";
        $sql .= "'" . $this->db->idate(dol_now()) . "'";
        $sql .= ")";

        $result = $this->db->query($sql);
        if (!$result) {
            throw new RestException(500, 'Error creating caliber');
        }

        return array(
            'id' => $this->db->last_insert_id(MAIN_DB_PREFIX . 'vicentina_caliber'),
            'name' => $request_data['name']
        );
    }

    /**
     * Get list of calibers
     *
     * @return array Array of caliber records
     *
     * @url GET tong/caliber
     */
    public function listCalibers()
    {
        $sql = "SELECT c.rowid, c.name, c.description, ";
        $sql .= "c.date_creation, c.fk_user_creat ";
        $sql .= "FROM " . MAIN_DB_PREFIX . "vicentina_caliber as c ";
        $sql .= "ORDER BY c.name";

        $result = $this->db->query($sql);
        if (!$result) {
            throw new RestException(503, 'Error retrieving calibers');
        }

        $calibers = array();
        while ($obj = $this->db->fetch_object($result)) {
            $calibers[] = array(
                'id' => (int) $obj->rowid,
                'name' => $obj->name,
                'description' => $obj->description,
                'date_creation' => $obj->date_creation,
                'user_created' => (int) $obj->fk_user_creat
            );
        }

        return $calibers;
    }

    /**
     * Update a caliber
     *
     * @param int   $id           ID of caliber to update
     * @param array $request_data {
     *     @var string $name        Name of the caliber
     *     @var string $description Description (optional)
     * }
     * @return array Updated caliber record
     *
     * @url PUT post-harvest/caliber/{id}
     */
    public function updateCaliber($id, $request_data)
    {
        global $user;

        if (!DolibarrApiAccess::$user->rights->vicentina->write) {
            throw new RestException(401);
        }

        $sql = "UPDATE " . MAIN_DB_PREFIX . "vicentina_caliber SET ";
        if (isset($request_data['name'])) {
            $sql .= "name = '" . $this->db->escape($request_data['name']) . "', ";
        }
        if (isset($request_data['description'])) {
            $sql .= "description = " . (!empty($request_data['description']) ? "'" . $this->db->escape($request_data['description']) . "'" : "NULL") . ", ";
        }
        $sql .= "fk_user_modif = " . (int) $user->id . " ";
        $sql .= "WHERE rowid = " . (int) $id;

        $result = $this->db->query($sql);
        if (!$result) {
            throw new RestException(500, 'Error updating caliber');
        }

        return array(
            'id' => (int) $id,
            'message' => 'Caliber updated successfully'
        );
    }

    /**
     * Create tong cost record
     *
     * @url POST tong/cost/create
     */
    public function createTongCost($request_data)
    {
        global $user;

        if (empty($request_data['date'])) {
            throw new RestException(400, 'Date is a required field');
        }

        $this->db->begin();

        try {
            // Get fuel price for the date
            $fuelData = $this->getFuelPriceForDate($request_data['date']);
            if (!$fuelData || !isset($fuelData['gasoil50s'])) {
                throw new RestException(400, 'No fuel price found for the specified date');
            }

            // Calculate fuel cost based on liters and current price
            $fuelLiters = isset($request_data['fuel_liters']) ? floatval($request_data['fuel_liters']) : 0;
            $fuelCost = $fuelLiters * floatval($fuelData['gasoil50s']);

            $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_tong_costo (";
            $sql .= "date, max_bins, fuel_liters, fuel_cost, lift_cost, gata_cost, ";
            $sql .= "fk_user_creat, fk_user_modif";
            $sql .= ") VALUES (";
            $sql .= "'" . $this->db->escape($request_data['date']) . "', ";
            $sql .= (isset($request_data['max_bins']) ? intval($request_data['max_bins']) : 1) . ", ";
            $sql .= $fuelLiters . ", ";
            $sql .= $fuelCost . ", ";  // Calculated fuel cost
            $sql .= (isset($request_data['lift_cost']) ? floatval($request_data['lift_cost']) : 0) . ", ";
            $sql .= (isset($request_data['gata_cost']) ? floatval($request_data['gata_cost']) : 0) . ", ";
            $sql .= (int) $user->id . ", ";  // fk_user_creat
            $sql .= (int) $user->id;         // fk_user_modif
            $sql .= ")";

            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error creating tong cost record: ' . $this->db->lasterror());
            }

            $id = $this->db->last_insert_id(MAIN_DB_PREFIX . 'vicentina_tong_costo');

            $this->db->commit();

            return array(
                'id' => $id,
                'message' => 'Tong cost record created successfully',
                'date' => $request_data['date'],
                'max_bins' => isset($request_data['max_bins']) ? intval($request_data['max_bins']) : 1,
                'fuel_liters' => $fuelLiters,
                'fuel_price' => floatval($fuelData['gasoil50s']),
                'fuel_cost' => $fuelCost,
                'lift_cost' => isset($request_data['lift_cost']) ? floatval($request_data['lift_cost']) : 0,
                'gata_cost' => isset($request_data['gata_cost']) ? floatval($request_data['gata_cost']) : 0
            );

        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * List all tong costs
     *
     * @url GET tong/costs
     * @return array List of tong costs
     * @throws RestException 500 Internal Server Error
     */
    public function listTongCosts()
    {
        global $user;

        try {
            $sql = "SELECT t.rowid, t.date, t.max_bins, ";
            $sql .= "t.fuel_liters, t.fuel_cost, t.lift_cost, t.gata_cost, ";
            $sql .= "t.fk_user_creat, t.fk_user_modif, ";
            $sql .= "uc.firstname as user_creat_firstname, uc.lastname as user_creat_lastname, ";
            $sql .= "um.firstname as user_modif_firstname, um.lastname as user_modif_lastname ";
            $sql .= "FROM " . MAIN_DB_PREFIX . "vicentina_tong_costo as t ";
            $sql .= "LEFT JOIN " . MAIN_DB_PREFIX . "user as uc ON t.fk_user_creat = uc.rowid ";
            $sql .= "LEFT JOIN " . MAIN_DB_PREFIX . "user as um ON t.fk_user_modif = um.rowid ";
            $sql .= "ORDER BY t.date DESC";

            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error fetching tong costs: ' . $this->db->lasterror());
            }

            $tong_costs = array();
            while ($obj = $this->db->fetch_object($result)) {
                $tong_costs[] = array(
                    'id' => (int) $obj->rowid,
                    'date' => $obj->date,
                    'max_bins' => (int) $obj->max_bins,
                    'fuel_liters' => floatval($obj->fuel_liters),
                    'fuel_cost' => floatval($obj->fuel_cost),
                    'lift_cost' => floatval($obj->lift_cost),
                    'gata_cost' => floatval($obj->gata_cost),
                    'created_by' => array(
                        'id' => (int) $obj->fk_user_creat,
                        'name' => $obj->user_creat_firstname . ' ' . $obj->user_creat_lastname
                    ),
                    'modified_by' => array(
                        'id' => (int) $obj->fk_user_modif,
                        'name' => $obj->user_modif_firstname . ' ' . $obj->user_modif_lastname
                    )
                );
            }

            return $tong_costs;

        } catch (Exception $e) {
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * Delete tong cost record
     *
     * @url DELETE tong/cost/delete/{id}
     * @param int $id ID of the tong cost record to delete
     * @return array Result of the deletion
     * @throws RestException 400 Bad Request
     * @throws RestException 404 Not Found
     * @throws RestException 500 Internal Server Error
     */
    public function deleteTongCost($id)
    {
        global $user;

        if (empty($id)) {
            throw new RestException(400, 'ID is required');
        }

        $this->db->begin();

        try {
            // Check if record exists
            $sql = "SELECT rowid FROM " . MAIN_DB_PREFIX . "vicentina_tong_costo WHERE rowid = " . (int) $id;
            $result = $this->db->query($sql);
            if (!$result || $this->db->num_rows($result) == 0) {
                throw new RestException(404, 'Tong cost record not found');
            }

            // Delete the record
            $sql = "DELETE FROM " . MAIN_DB_PREFIX . "vicentina_tong_costo WHERE rowid = " . (int) $id;
            $result = $this->db->query($sql);
            
            if (!$result) {
                throw new Exception('Error deleting tong cost record: ' . $this->db->lasterror());
            }

            $this->db->commit();

            return array(
                'id' => (int) $id,
                'message' => 'Tong cost record deleted successfully'
            );

        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * Create tong process
     *
     * @url POST /tong/process/create
     * @param array $request_data {
     *     @var array $caliber_outputs Array of caliber outputs with caliber_id and bins
     *     @var int $warehouse_id Warehouse ID
     *     @var string $date Date
     *     @var int $parent_potato_id Parent potato product ID
     *     @var int $potato_id Potato variant product ID
     *     @var int $number_of_bins Number of bins
     *     @var float $fuel_cost Fuel cost
     *     @var float $gata_cost Gata cost
     *     @var float $lift_cost Lift cost
     *     @var float $fuel_liters Fuel liters
     * }
     * @return array Created tong process info
     * @throws RestException 400 Bad Request
     * @throws RestException 500 Internal Server Error
     */
    public function createTongProcess($request_data)
    {
        global $user, $db;

        if (
            empty($request_data['caliber_outputs']) || empty($request_data['warehouse_id']) ||
            empty($request_data['date']) || empty($request_data['parent_potato_id']) ||
            empty($request_data['potato_id']) || empty($request_data['number_of_bins'])
        ) {
            throw new RestException(400, 'Missing required fields');
        }

        $this->db->begin();

        try {
            require_once DOL_DOCUMENT_ROOT . '/product/class/product.class.php';
            require_once DOL_DOCUMENT_ROOT . '/product/stock/class/mouvementstock.class.php';
            require_once DOL_DOCUMENT_ROOT . '/categories/class/categorie.class.php';

            // ID de la categoría "Papa"
            $papa_category_id = 29;

            // Fetch the source potato product
            $sourceProduct = new Product($this->db);
            $result = $sourceProduct->fetch($request_data['potato_id']);
            if ($result <= 0) {
                throw new Exception('Error fetching source potato product');
            }

            // Fetch the parent product
            $parentProduct = new Product($this->db);
            $result = $parentProduct->fetch($request_data['parent_potato_id']);
            if ($result <= 0) {
                throw new Exception('Error fetching parent potato product');
            }

            // Check if the source product ref ends with SP
            if (substr($sourceProduct->ref, -3) !== '_SP') {
                throw new Exception('Source product reference must end with _SP');
            }

            // Base reference without SP
            $baseRef = substr($sourceProduct->ref, 0, -3);

            // Insert into llx_vicentina_tong_proceso
            $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_tong_proceso (";
            $sql .= "date, number_of_bins, potato_id, parent_potato_id, fk_user_creat";
            $sql .= ") VALUES (";
            $sql .= "'" . $this->db->escape($request_data['date']) . "', ";
            $sql .= (int) $request_data['number_of_bins'] . ", ";
            $sql .= (int) $request_data['potato_id'] . ", ";
            $sql .= (int) $request_data['parent_potato_id'] . ", ";
            $sql .= (int) $user->id;
            $sql .= ")";

            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error inserting into vicentina_tong_proceso: ' . $this->db->lasterror());
            }

            $tong_process_id = $this->db->last_insert_id(MAIN_DB_PREFIX . 'vicentina_tong_proceso');

            // Insert costs
            $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_tong_proceso_costo (";
            $sql .= "date, tong_process_id, fuel_liters, fuel_cost, lift_cost, gata_cost, fk_user_creat";
            $sql .= ") VALUES (";
            $sql .= "'" . $this->db->escape($request_data['date']) . "', ";
            $sql .= (int) $tong_process_id . ", ";
            $sql .= floatval($request_data['fuel_liters']) . ", ";
            $sql .= floatval($request_data['fuel_cost']) . ", ";
            $sql .= floatval($request_data['lift_cost']) . ", ";
            $sql .= floatval($request_data['gata_cost']) . ", ";
            $sql .= (int) $user->id;
            $sql .= ")";

            $result = $this->db->query($sql);
            if (!$result) {
                throw new Exception('Error inserting into vicentina_tong_proceso_costo: ' . $this->db->lasterror());
            }

            // Decrease stock of source product
            $movement = new MouvementStock($this->db);
            $result = $movement->livraison(
                $user,
                $sourceProduct->id,
                $request_data['warehouse_id'],
                $request_data['number_of_bins'],
                0, // price
                'Tong process output',
                $request_data['date']
            );

            if ($result < 0) {
                throw new Exception('Error decreasing source product stock: ' . $movement->error);
            }

            $caliber_products = [];

            // Process each caliber output
            foreach ($request_data['caliber_outputs'] as $caliber_output) {
                // Insert into llx_vicentina_tong_proceso_caliber
                $sql = "INSERT INTO " . MAIN_DB_PREFIX . "vicentina_tong_proceso_caliber (";
                $sql .= "tong_process_id, caliber_id, bins, fk_user_creat";
                $sql .= ") VALUES (";
                $sql .= (int) $tong_process_id . ", ";
                $sql .= (int) $caliber_output['caliber_id'] . ", ";
                $sql .= (int) $caliber_output['bins'] . ", ";
                $sql .= (int) $user->id;
                $sql .= ")";

                $result = $this->db->query($sql);
                if (!$result) {
                    throw new Exception('Error inserting into vicentina_tong_proceso_caliber: ' . $this->db->lasterror());
                }

                // Get caliber name
                $sql = "SELECT name FROM " . MAIN_DB_PREFIX . "vicentina_caliber WHERE rowid = " . (int) $caliber_output['caliber_id'];
                $res = $this->db->query($sql);
                if (!$res) {
                    throw new Exception('Error fetching caliber name: ' . $this->db->lasterror());
                }
                
                $obj = $this->db->fetch_object($res);
                if (!$obj) {
                    throw new Exception('Caliber not found with ID: ' . $caliber_output['caliber_id']);
                }
                
                $caliber_name = $obj->name;

                // Create new variant with caliber name
                $variantRef = $baseRef . '_' . $caliber_name;
                
                // Check if variant already exists
                $variantProduct = new Product($this->db);
                $result = $variantProduct->fetch(null, $variantRef);

                if ($result <= 0) {
                    // Create new variant
                    $variantProduct->ref = $variantRef;
                    $variantProduct->label = $variantRef;
                    $variantProduct->type = 0;
                    $variantProduct->status = 1;
                    $variantProduct->tosell = 0; // Not for sale
                    $variantProduct->tobuy = 0; // Not for purchase
                    $variantProduct->stock = 0;
                    $variantProduct->fk_parent = $parentProduct->id;

                    $result = $variantProduct->create($user);
                    if ($result < 0) {
                        throw new Exception('Error creating variant product: ' . $variantProduct->error);
                    }

                    // Copy extrafields from source product
                    $sql = "SELECT * FROM " . MAIN_DB_PREFIX . "product_extrafields WHERE fk_object = " . (int) $sourceProduct->id;
                    $res = $this->db->query($sql);
                    if ($res) {
                        $extrafields = $this->db->fetch_object($res);
                        if ($extrafields) {
                            // Prepare extrafields for the new variant
                            $variantProduct->array_options = [];
                            foreach ($extrafields as $key => $value) {
                                if ($key != 'rowid' && $key != 'fk_object' && $key != 'tms') {
                                    $variantProduct->array_options['options_' . $key] = $value;
                                }
                            }
                            
                            // Update tipo to caliber name
                            $variantProduct->array_options['options_tipo'] = $caliber_name;
                            
                            $result = $variantProduct->insertExtraFields();
                            if ($result < 0) {
                                throw new Exception('Error adding extrafields to variant: ' . $variantProduct->error);
                            }
                        }
                    }

                    // Add the variant to the "Papa" category
                    $category = new Categorie($this->db);
                    $category->fetch($papa_category_id);
                    $result = $category->add_type($variantProduct, 'product');
                    if ($result < 0) {
                        throw new Exception('Error adding variant product to Papa category: ' . $category->error);
                    }

                    // Add product combination
                    $sql = "INSERT INTO " . MAIN_DB_PREFIX . "product_attribute_combination (";
                    $sql .= "fk_product_parent, fk_product_child, variation_price, variation_weight, entity";
                    $sql .= ") VALUES (";
                    $sql .= (int) $parentProduct->id . ", ";
                    $sql .= (int) $variantProduct->id . ", ";
                    $sql .= "0, "; // variation_price
                    $sql .= "0, "; // variation_weight
                    $sql .= "1"; // entity
                    $sql .= ")";

                    $result = $this->db->query($sql);
                    if (!$result) {
                        throw new Exception('Error creating product combination: ' . $this->db->lasterror());
                    }
                }

                // Increase stock of caliber variant
                $movement = new MouvementStock($this->db);
                $result = $movement->reception(
                    $user,
                    $variantProduct->id,
                    $request_data['warehouse_id'],
                    $caliber_output['bins'],
                    0, // price
                    'Tong process input',
                    $request_data['date']
                );

                if ($result < 0) {
                    throw new Exception('Error increasing variant product stock: ' . $movement->error);
                }

                $caliber_products[] = [
                    'caliber_id' => $caliber_output['caliber_id'],
                    'caliber_name' => $caliber_name,
                    'product_id' => $variantProduct->id,
                    'bins' => $caliber_output['bins']
                ];
            }

            $this->db->commit();
            
            return [
                'tong_process_id' => $tong_process_id,
                'source_product_id' => $sourceProduct->id,
                'parent_product_id' => $parentProduct->id,
                'caliber_products' => $caliber_products,
                'message' => 'Tong process created successfully'
            ];
        } catch (Exception $e) {
            $this->db->rollback();
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * Get tong process details
     *
     * @url GET /tong/process/{id}
     * @param int $id ID of tong process
     * @return array Tong process details
     * @throws RestException 404 Not found
     * @throws RestException 500 Internal Server Error
     */
    public function getTongProcess($id)
    {
        global $db;

        if (empty($id)) {
            throw new RestException(400, 'Missing tong process ID');
        }

        try {
            // Get main process data
            $sql = "SELECT p.*, u.login as user_created";
            $sql .= " FROM " . MAIN_DB_PREFIX . "vicentina_tong_proceso as p";
            $sql .= " LEFT JOIN " . MAIN_DB_PREFIX . "user as u ON p.fk_user_creat = u.rowid";
            $sql .= " WHERE p.rowid = " . (int) $id;

            $result = $this->db->query($sql);
            if (!$result || $this->db->num_rows($result) == 0) {
                throw new RestException(404, 'Tong process not found');
            }

            $process = $this->db->fetch_object($result);
            
            // Get cost data
            $sql = "SELECT * FROM " . MAIN_DB_PREFIX . "vicentina_tong_proceso_costo";
            $sql .= " WHERE tong_process_id = " . (int) $id;
            
            $result = $this->db->query($sql);
            if (!$result) {
                throw new RestException(500, 'Error retrieving tong process costs: ' . $this->db->lasterror());
            }
            
            $costs = [];
            while ($cost = $this->db->fetch_object($result)) {
                $costs[] = [
                    'rowid' => $cost->rowid,
                    'date' => $cost->date,
                    'fuel_liters' => $cost->fuel_liters,
                    'fuel_cost' => $cost->fuel_cost,
                    'lift_cost' => $cost->lift_cost,
                    'gata_cost' => $cost->gata_cost
                ];
            }
            
            // Get caliber outputs
            $sql = "SELECT c.*, cal.name as caliber_name";
            $sql .= " FROM " . MAIN_DB_PREFIX . "vicentina_tong_proceso_caliber as c";
            $sql .= " LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_caliber as cal ON c.caliber_id = cal.rowid";
            $sql .= " WHERE c.tong_process_id = " . (int) $id;
            
            $result = $this->db->query($sql);
            if (!$result) {
                throw new RestException(500, 'Error retrieving tong process calibers: ' . $this->db->lasterror());
            }
            
            $calibers = [];
            while ($caliber = $this->db->fetch_object($result)) {
                $calibers[] = [
                    'rowid' => $caliber->rowid,
                    'caliber_id' => $caliber->caliber_id,
                    'caliber_name' => $caliber->caliber_name,
                    'bins' => $caliber->bins
                ];
            }
            
            // Get product information
            require_once DOL_DOCUMENT_ROOT . '/product/class/product.class.php';
            
            $sourceProduct = new Product($this->db);
            $sourceProduct->fetch($process->potato_id);
            
            $parentProduct = new Product($this->db);
            $parentProduct->fetch($process->parent_potato_id);
            
            // Build response
            $response = [
                'rowid' => $process->rowid,
                'date' => $process->date,
                'number_of_bins' => $process->number_of_bins,
                'potato_id' => $process->potato_id,
                'potato_ref' => $sourceProduct->ref,
                'potato_label' => $sourceProduct->label,
                'parent_potato_id' => $process->parent_potato_id,
                'parent_potato_ref' => $parentProduct->ref,
                'parent_potato_label' => $parentProduct->label,
                'user_created' => $process->user_created,
                'date_creation' => $process->date_creation,
                'costs' => $costs,
                'caliber_outputs' => $calibers
            ];
            
            return $response;
            
        } catch (Exception $e) {
            throw new RestException(500, $e->getMessage());
        }
    }

    /**
     * List all tong processes
     *
     * @url GET /tong/processes
     * @return array List of tong processes
     * @throws RestException 500 Internal Server Error
     */
    public function listTongProcesses()
    {
        global $db;

        try {
            $sql = "SELECT p.*, u.login as user_created";
            $sql .= " FROM " . MAIN_DB_PREFIX . "vicentina_tong_proceso as p";
            $sql .= " LEFT JOIN " . MAIN_DB_PREFIX . "user as u ON p.fk_user_creat = u.rowid";
            $sql .= " ORDER BY p.date DESC";
            
            $result = $this->db->query($sql);
            if (!$result) {
                throw new RestException(500, 'Error retrieving tong processes: ' . $this->db->lasterror());
            }
            
            $processes = [];
            while ($process = $this->db->fetch_object($result)) {
                // Get source and parent product info
                require_once DOL_DOCUMENT_ROOT . '/product/class/product.class.php';
                
                $sourceProduct = new Product($this->db);
                $sourceProduct->fetch($process->potato_id);
                
                $parentProduct = new Product($this->db);
                $parentProduct->fetch($process->parent_potato_id);
                
                // Get source product variety from extrafields
                $sql_extra = "SELECT variedad FROM " . MAIN_DB_PREFIX . "product_extrafields WHERE fk_object = " . (int) $process->potato_id;
                $res_extra = $this->db->query($sql_extra);
                $variety = "";
                if ($res_extra && $obj_extra = $this->db->fetch_object($res_extra)) {
                    $variety = $obj_extra->variedad;
                }
                
                // Get costs
                $sql2 = "SELECT * FROM " . MAIN_DB_PREFIX . "vicentina_tong_proceso_costo";
                $sql2 .= " WHERE tong_process_id = " . (int) $process->rowid;
                
                $costResult = $this->db->query($sql2);
                $costs = [];
                if ($costResult) {
                    while ($cost = $this->db->fetch_object($costResult)) {
                        $costs[] = [
                            'rowid' => $cost->rowid,
                            'date' => $cost->date,
                            'fuel_liters' => $cost->fuel_liters,
                            'fuel_cost' => $cost->fuel_cost,
                            'lift_cost' => $cost->lift_cost,
                            'gata_cost' => $cost->gata_cost,
                            'total_cost' => floatval($cost->fuel_cost) + floatval($cost->lift_cost) + floatval($cost->gata_cost)
                        ];
                    }
                }
                
                // Get caliber outputs
                $sql3 = "SELECT c.*, cal.name as caliber_name";
                $sql3 .= " FROM " . MAIN_DB_PREFIX . "vicentina_tong_proceso_caliber as c";
                $sql3 .= " LEFT JOIN " . MAIN_DB_PREFIX . "vicentina_caliber as cal ON c.caliber_id = cal.rowid";
                $sql3 .= " WHERE c.tong_process_id = " . (int) $process->rowid;
                
                $caliberResult = $this->db->query($sql3);
                $calibers = [];
                $totalOutputBins = 0;
                if ($caliberResult) {
                    while ($caliber = $this->db->fetch_object($caliberResult)) {
                        $calibers[] = [
                            'rowid' => $caliber->rowid,
                            'caliber_id' => $caliber->caliber_id,
                            'caliber_name' => $caliber->caliber_name,
                            'bins' => $caliber->bins
                        ];
                        $totalOutputBins += intval($caliber->bins);
                    }
                }
                
                $processes[] = [
                    'rowid' => $process->rowid,
                    'date' => $process->date,
                    'input_bins' => $process->number_of_bins,
                    'potato_id' => $process->potato_id,
                    'potato_name' => $sourceProduct->label,
                    'potato_variety' => $variety,
                    'parent_potato_id' => $process->parent_potato_id,
                    'parent_potato_name' => $parentProduct->label,
                    'user_created' => $process->user_created,
                    'date_creation' => $process->date_creation,
                    'costs' => $costs,
                    'caliber_outputs' => $calibers
                ];
            }
            
            return $processes;
            
        } catch (Exception $e) {
            throw new RestException(500, $e->getMessage());
        }
    }
}