import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Card, Col, Row, Spin, Typography, Result, Statistic, Empty } from 'antd';
import { useSupplierAccountStatement } from '../../../../hooks/supplier/useSupplierAccountStatement';
import { AccountStatementFilters, AccountStatementTable } from '../../../../ui/components';
import { useThirdparties } from '../../../../hooks/supplier/useThirdparties';

const { Title } = Typography;

export const SupplierAccountStatement = () => {
  const { accountStatement, filters, updateFilters, clearFilters } = useSupplierAccountStatement();
  const { suppliers } = useThirdparties();
  const { data, isLoading, error } = accountStatement;

  console.log(JSON.stringify(data, null, 2));

  // Convert Thirdparty to Supplier format for compatibility
  const mappedSuppliers = useMemo(() => {
    return suppliers.map(thirdparty => ({
      id: thirdparty.id,
      name: thirdparty.name,
      address: thirdparty.address || '',
      zip: thirdparty.zip || '',
      town: thirdparty.town || '',
      phone: thirdparty.phone || '',
      email: thirdparty.email || '',
      vat_number: thirdparty.vat_number || ''
    }));
  }, [suppliers]);

  // Filter movements by selected cuenta (if any)
  const filteredMovements = useMemo(() => {
    const movements = data?.movements ?? [];
    const byCuenta = !filters.cuenta
      ? movements
      : movements.filter(movement => movement.cuenta === filters.cuenta);
    const byDocType = (filters.document_types && filters.document_types.length > 0)
      ? byCuenta.filter(m => filters.document_types!.includes(m.document_type))
      : byCuenta;
    return byDocType;
  }, [data, filters.cuenta, filters.document_types]);

  // Calculate summary data (based on filtered movements)
  const summaryData = useMemo(() => {
    if (!filteredMovements || filteredMovements.length === 0) {
      return { totalDebit: 0, totalCredit: 0 };
    }
    return filteredMovements.reduce((acc, movement) => ({
      totalDebit: acc.totalDebit + movement.debit,
      totalCredit: acc.totalCredit + movement.credit
    }), { totalDebit: 0, totalCredit: 0 });
  }, [filteredMovements]);

  // Recompute running balance based only on filtered movements (per cuenta)
  const recomputedMovements = useMemo(() => {
    const sorted = [...filteredMovements].sort((a, b) =>
      dayjs(a.document_date).valueOf() - dayjs(b.document_date).valueOf()
    );
    let running = 0;
    return sorted.map(m => {
      running = running + m.debit - m.credit;
      return { ...m, balance: running };
    });
  }, [filteredMovements]);

  // Current balance based on recomputed movements
  const currentBalanceByCuenta = useMemo(() => {
    if (recomputedMovements.length === 0) return 0;
    return recomputedMovements[recomputedMovements.length - 1].balance;
  }, [recomputedMovements]);

  // Extract unique cuentas from movements
  const availableCuentas = useMemo(() => {
    const movements = data?.movements ?? [];
    const uniqueCuentas = Array.from(
      new Set(movements.map(movement => movement.cuenta).filter(Boolean))
    );
    return uniqueCuentas.sort();
  }, [data]);

  // Extract unique document types from movements
  const availableDocumentTypes = useMemo(() => {
    const movements = data?.movements ?? [];
    const unique = Array.from(new Set(movements.map(m => m.document_type).filter(Boolean)));
    return unique.sort();
  }, [data]);

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <Result
            status="error"
            title="Error al cargar el estado de cuenta"
            subTitle="Por favor, intente nuevamente o contacte al administrador"
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Card>
            <Title level={3}>Estado de Cuenta de Proveedores</Title>
            
            <AccountStatementFilters
              filters={filters}
              onFiltersChange={updateFilters}
              onClear={clearFilters}
              suppliers={mappedSuppliers}
              cuentas={availableCuentas}
              documentTypes={availableDocumentTypes}
            />

            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <Spin size="large" />
              </div>
            )}

            {!isLoading && (!data || !data.supplier?.id) && filters.supplier_id && (
              <Card>
                <Empty 
                  description="No se encontraron movimientos para los filtros seleccionados" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE} 
                />
              </Card>
            )}

            {!isLoading && !filters.supplier_id && (
              <Card>
                <Empty 
                  description="Seleccione un proveedor para ver su estado de cuenta" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE} 
                />
              </Card>
            )}

            {data && data.supplier?.id && (
              <>
                {/* Summary Cards */}
                <Row gutter={16} className="mb-6">
                  <Col xs={24} sm={12} lg={6}>
                    <Card>
                      <Statistic
                        title="Proveedor"
                        value={data.supplier?.name || 'Sin datos'}
                        valueStyle={{ fontSize: '16px' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card>
                      <Statistic
                        title="Saldo Actual"
                        value={currentBalanceByCuenta}
                        precision={2}
                        valueStyle={{ 
                          color: currentBalanceByCuenta >= 0 ? '#cf1322' : '#3f8600',
                          fontWeight: 'bold'
                        }}
                        suffix={data.currency}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card>
                      <Statistic
                        title="Total Debe"
                        value={summaryData.totalDebit}
                        precision={2}
                        valueStyle={{ color: '#cf1322' }}
                        suffix={data.currency}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card>
                      <Statistic
                        title="Total Haber"
                        value={summaryData.totalCredit}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        suffix={data.currency}
                      />
                    </Card>
                  </Col>
                </Row>

                <Row gutter={16} className="mb-4">
                  <Col span={24}>
                    <Card>
                      <Statistic
                        title="Total de Movimientos"
                        value={filteredMovements.length}
                        valueStyle={{ fontSize: '18px' }}
                      />
                    </Card>
                  </Col>
                </Row>

                {/* Movements Table */}
                <Card title="Detalle de Movimientos">
                  <AccountStatementTable
                    movements={recomputedMovements}
                    currency={data.currency}
                    loading={isLoading}
                  />
                </Card>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};