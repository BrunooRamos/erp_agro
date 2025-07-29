import { useMemo } from "react";
import { useSupplier } from "../../../../hooks";
import { Button, Card, Col, Row, Spin, Typography, Empty, Statistic } from "antd";
import { SupplierInvoiceTable, PaymentOrderModal } from "../../../../ui/components";

const { Title, Text } = Typography;

export const SupplierInvoiceList = () => {
    const { 
        listSupplier, 
        selectedInvoices, 
        toggleInvoiceSelection,
        isInvoiceSelected,
        getSelectedCurrency,
        getSelectedBankAccount,
        clearSelectedInvoices,
        generatePDF,
        showPaymentOrderModalHandler,
        closePaymentOrderModal,
        showPaymentOrderModal,
        getTotalsForModal,
        availableCurrencies
    } = useSupplier();
    
    const { data: supplier, isLoading } = listSupplier;

    // Calcular los totales por moneda y proveedor
    const totals = useMemo(() => {
        if (selectedInvoices.length === 0) {
            return { totalUSD: 0, totalUYU: 0, supplierTotals: [] };
        }
        return getTotalsForModal();
    }, [selectedInvoices, getTotalsForModal]);

    // Calcular las cantidades por moneda
    const uyuCount = selectedInvoices.filter(item => item.currency === "UYU").length;
    const usdCount = selectedInvoices.filter(item => item.currency === "USD").length;

    console.log(JSON.stringify(supplier, null, 2));

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spin size="large" />
            </div>
        );
    }

    if (!supplier || supplier.total_count === 0) {
        return (
            <Card>
                <Empty 
                    description="No hay facturas de proveedores pendientes" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                />
            </Card>
        );
    }

    const invoices = supplier.invoices;

    return (
        <div className="p-6">
            <Row gutter={[16, 24]}>
                <Col span={24}>
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <Title level={3}>Facturas de Proveedores</Title>
                            <div className="flex space-x-4">
                                <Button 
                                    type="primary" 
                                    onClick={showPaymentOrderModalHandler}
                                    disabled={selectedInvoices.length === 0}
                                >
                                    Generar Orden de Pago
                                </Button>
                                {selectedInvoices.length > 0 && (
                                    <Button onClick={clearSelectedInvoices}>
                                        Limpiar selección
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Tarjetas de totales por moneda */}
                        {selectedInvoices.length > 0 && (
                            <Row gutter={16} className="mb-6">
                                <Col xs={24} sm={8} md={6}>
                                    <Card>
                                        <Statistic
                                            title="Total Facturas"
                                            value={selectedInvoices.length}
                                            valueStyle={{ color: '#1890ff' }}
                                        />
                                    </Card>
                                </Col>
                                {totals.totalUSD > 0 && (
                                    <Col xs={24} sm={8} md={6}>
                                        <Card>
                                            <Statistic
                                                title="Total USD"
                                                value={totals.totalUSD}
                                                precision={2}
                                                valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                                                suffix="USD"
                                            />
                                        </Card>
                                    </Col>
                                )}
                                {totals.totalUYU > 0 && (
                                    <Col xs={24} sm={8} md={6}>
                                        <Card>
                                            <Statistic
                                                title="Total UYU"
                                                value={totals.totalUYU}
                                                precision={2}
                                                valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
                                                suffix="UYU"
                                            />
                                        </Card>
                                    </Col>
                                )}
                                <Col xs={24} sm={8} md={6}>
                                    <Card>
                                        <Statistic
                                            title="Proveedores"
                                            value={totals.supplierTotals.length}
                                            valueStyle={{ color: '#722ed1' }}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        )}

                        {/* Detalle por proveedor */}
                        {totals.supplierTotals.length > 0 && (
                            <Card title="Totales por Proveedor" className="mb-4">
                                <Row gutter={[16, 16]}>
                                    {totals.supplierTotals.map((supplier) => (
                                        <Col xs={24} sm={12} md={8} lg={6} key={supplier.supplierId}>
                                            <Card size="small">
                                                <div>
                                                    <Text strong className="block">{supplier.supplierName}</Text>
                                                    <Text className="text-gray-500">{supplier.invoicesCount} facturas</Text>
                                                </div>
                                                <div className="mt-2">
                                                    {supplier.totalUSD > 0 && (
                                                        <div className="text-blue-600 font-semibold">
                                                            ${supplier.totalUSD.toFixed(2)} USD
                                                        </div>
                                                    )}
                                                    {supplier.totalUYU > 0 && (
                                                        <div className="text-green-600 font-semibold">
                                                            ${supplier.totalUYU.toFixed(2)} UYU
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        )}

                        <div className="mb-4">
                            <Text strong>
                                {selectedInvoices.length > 0 
                                    ? `${selectedInvoices.length} facturas seleccionadas (${uyuCount} en pesos, ${usdCount} en dólares)`
                                    : 'Seleccione las facturas para generar una orden de pago'
                                }
                            </Text>
                            <div className="mt-2 text-sm text-gray-500">
                                Seleccione las facturas, elija la moneda de pago y la cuenta bancaria para cada una
                            </div>
                        </div>

                        <SupplierInvoiceTable 
                            invoices={invoices}
                            isInvoiceSelected={isInvoiceSelected}
                            toggleInvoiceSelection={toggleInvoiceSelection}
                            getSelectedCurrency={getSelectedCurrency}
                            getSelectedBankAccount={getSelectedBankAccount}
                            availableCurrencies={availableCurrencies}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Modal para número de orden de pago */}
            <PaymentOrderModal
                visible={showPaymentOrderModal}
                onCancel={closePaymentOrderModal}
                onConfirm={generatePDF}
                supplierTotals={totals.supplierTotals}
                totalUSD={totals.totalUSD}
                totalUYU={totals.totalUYU}
            />
        </div>
    );
};
