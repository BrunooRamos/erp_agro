import { useSupplier } from "../../../../hooks";
import { Button, Card, Col, Row, Spin, Typography, Empty } from "antd";
import { SupplierInvoiceTable } from "../../../../ui/components";

const { Title, Text } = Typography;

export const SupplierInvoiceList = () => {
    const { 
        listSupplier, 
        selectedInvoices, 
        toggleInvoiceSelection,
        isInvoiceSelected,
        getSelectedCurrency,
        clearSelectedInvoices,
        generatePDF,
        availableCurrencies
    } = useSupplier();
    
    const { data: supplier, isLoading } = listSupplier;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spin size="large" />
            </div>
        );
    }

    console.log(JSON.stringify(supplier, null, 2));

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

    // Calcular las cantidades por moneda
    const uyuCount = selectedInvoices.filter(item => item.currency === "UYU").length;
    const usdCount = selectedInvoices.filter(item => item.currency === "USD").length;

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
                                    onClick={generatePDF}
                                    disabled={selectedInvoices.length === 0}
                                >
                                    Generar PDF
                                </Button>
                                {selectedInvoices.length > 0 && (
                                    <Button onClick={clearSelectedInvoices}>
                                        Limpiar selección
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <Text strong>
                                Total: {selectedInvoices.length} facturas seleccionadas 
                                ({uyuCount} en pesos, {usdCount} en dólares)
                            </Text>
                            <div className="mt-2 text-sm text-gray-500">
                                Seleccione las facturas y elija la moneda de pago para cada una
                            </div>
                        </div>

                        <SupplierInvoiceTable 
                            invoices={invoices}
                            isInvoiceSelected={isInvoiceSelected}
                            toggleInvoiceSelection={toggleInvoiceSelection}
                            getSelectedCurrency={getSelectedCurrency}
                            availableCurrencies={availableCurrencies}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
