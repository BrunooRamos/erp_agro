import React from 'react';
import { Button, Card, Col, Row, Select, Checkbox, DatePicker } from "antd";
import { Supplier } from "../../../../interfaces";
import dayjs from "dayjs";
import { AccountStatementFilters as FilterInterface } from "../../../../interfaces/supplier.interface";

interface AccountStatementFiltersProps {
    filters: FilterInterface;
    onFiltersChange: (filters: Partial<FilterInterface>) => void;
    onClear: () => void;
    suppliers?: Supplier[];
    cuentas?: string[];
}

export const AccountStatementFilters: React.FC<AccountStatementFiltersProps> = ({
    filters,
    onFiltersChange,
    onClear,
    suppliers = [],
    cuentas = []
}) => {
    return (
      <Card title="Filtros" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Seleccionar proveedor"
              value={filters.supplier_id}
              onChange={(value) => onFiltersChange({ supplier_id: value })}
              showSearch
              filterOption={(input, option) =>
                !!option?.children?.toString().toLowerCase().includes(input.toLowerCase())
              }
              className="w-full"
            >
              {suppliers.map(supplier => (
                <Select.Option key={supplier.id} value={parseInt(supplier.id)}>
                  {supplier.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Moneda"
              value={filters.currency}
              onChange={(value) => onFiltersChange({ currency: value })}
              className="w-full"
            >
              <Select.Option value="USD">USD</Select.Option>
              <Select.Option value="UYU">UYU</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Cuenta"
              value={filters.cuenta}
              onChange={(value) => onFiltersChange({ cuenta: value })}
              className="w-full"
              allowClear
            >
              {cuentas.map(cuenta => (
                <Select.Option key={cuenta} value={cuenta}>
                  {cuenta}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <DatePicker.RangePicker
              value={filters.start_date && filters.end_date ? [
                dayjs(filters.start_date),
                dayjs(filters.end_date)
              ] : null}
              onChange={(dates) => {
                if (dates) {
                  onFiltersChange({
                    start_date: dates[0]?.format('YYYY-MM-DD'),
                    end_date: dates[1]?.format('YYYY-MM-DD')
                  });
                } else {
                  onFiltersChange({
                    start_date: undefined,
                    end_date: undefined
                  });
                }
              }}
              placeholder={['Fecha inicio', 'Fecha fin']}
              className="w-full"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Checkbox
              checked={filters.only_pending}
              onChange={(e) => onFiltersChange({ only_pending: e.target.checked })}
            >
              Solo pendientes
            </Checkbox>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Button type="primary" disabled={!filters.supplier_id}>
              Buscar
            </Button>
            <Button className="ml-2" onClick={onClear}>
              Limpiar
            </Button>
          </Col>
        </Row>
      </Card>
    );
};