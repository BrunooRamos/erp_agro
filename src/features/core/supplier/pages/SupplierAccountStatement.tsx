import { useMemo } from 'react';
import { Card, Col, Row, Spin, Typography, Result, Statistic, Empty } from 'antd';
import { useSupplierAccountStatement } from '../../../../hooks/supplier/useSupplierAccountStatement';
import { AccountStatementFilters, AccountStatementTable } from '../../../../ui/components';
import { useThirdparties } from '../../../../hooks/supplier/useThirdparties';

const { Title } = Typography;

export const SupplierAccountStatement = () => {
  const { accountStatement, filters, updateFilters, clearFilters } = useSupplierAccountStatement();
  const { suppliers, isLoadingSuppliers } = useThirdparties();
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

  // Calculate summary data
  const summaryData = useMemo(() => {
    if (!data?.movements) return { totalDebit: 0, totalCredit: 0 };
    
    return data.movements.reduce((acc, movement) => ({
      totalDebit: acc.totalDebit + movement.debit,
      totalCredit: acc.totalCredit + movement.credit
    }), { totalDebit: 0, totalCredit: 0 });
  }, [data?.movements]);

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
                        value={data.current_balance}
                        precision={2}
                        valueStyle={{ 
                          color: data.current_balance >= 0 ? '#cf1322' : '#3f8600',
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
                        value={data.total_movements}
                        valueStyle={{ fontSize: '18px' }}
                      />
                    </Card>
                  </Col>
                </Row>

                {/* Movements Table */}
                <Card title="Detalle de Movimientos">
                  <AccountStatementTable
                    movements={data.movements}
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