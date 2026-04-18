import React, { useState } from 'react';
import { Modal, Form, Input, Button, Typography, Divider, Row, Col, Statistic } from 'antd';
import { SupplierTotal } from '../../../../interfaces';

const { Title, Text } = Typography;

interface PaymentOrderModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (orderNumber: string, includeInvoiceDetail: boolean) => void;
  supplierTotals: SupplierTotal[];
  totalUSD: number;
  totalUYU: number;
  loading?: boolean;
}

export const PaymentOrderModal: React.FC<PaymentOrderModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  supplierTotals,
  totalUSD,
  totalUYU,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [orderNumber, setOrderNumber] = useState('');

  const handleGenerate = (withDetail: boolean) => {
    form.validateFields().then((values) => {
      onConfirm(values.orderNumber, withDetail);
      form.resetFields();
      setOrderNumber('');
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setOrderNumber('');
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <Title level={4} className="mb-0">
            Generar Orden de Pago
          </Title>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button
          key="resumen"
          loading={loading}
          onClick={() => handleGenerate(false)}
          disabled={!orderNumber.trim()}
        >
          PDF Resumen
        </Button>,
        <Button
          key="detalle"
          type="primary"
          loading={loading}
          onClick={() => handleGenerate(true)}
          disabled={!orderNumber.trim()}
        >
          PDF con Facturas
        </Button>
      ]}
      width={700}
    >
      <div className="space-y-4">
        {/* Formulario para número de orden */}
        <Form form={form} layout="vertical">
          <Form.Item
            name="orderNumber"
            label="Número de Orden de Pago"
            rules={[
              { required: true, message: 'El número de orden es requerido' },
              { min: 1, message: 'El número debe tener al menos 1 carácter' }
            ]}
          >
            <Input
              placeholder="Ej: 001, OP-2025-001, etc."
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              autoFocus
            />
          </Form.Item>
        </Form>

        <Divider />

        {/* Resumen de totales */}
        <div>
          <Title level={5}>Resumen de la Orden</Title>
          <Row gutter={16} className="mb-4">
            {totalUSD > 0 && (
              <Col span={12}>
                <Statistic
                  title="Total USD"
                  value={totalUSD}
                  precision={2}
                  valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                  suffix="USD"
                />
              </Col>
            )}
            {totalUYU > 0 && (
              <Col span={12}>
                <Statistic
                  title="Total UYU"
                  value={totalUYU}
                  precision={2}
                  valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
                  suffix="UYU"
                />
              </Col>
            )}
          </Row>
        </div>

        <Divider />

        {/* Detalle por proveedor */}
        <div>
          <Title level={5}>Detalle por Proveedor</Title>
          <div className="max-h-60 overflow-y-auto">
            {supplierTotals.map((supplier) => (
              <div key={supplier.supplierId} className="border rounded p-3 mb-2 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <Text strong className="text-base">{supplier.supplierName}</Text>
                    <Text className="block text-gray-600">
                      {supplier.invoicesCount} factura{supplier.invoicesCount !== 1 ? 's' : ''}
                    </Text>
                    {supplier.invoiceRefs && supplier.invoiceRefs.length > 0 && (
                      <div className="mt-1">
                        {supplier.invoiceRefs.map((ref, i) => (
                          <Text key={i} className="block text-xs text-gray-500">• {ref}</Text>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
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
                </div>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        <div className="text-center">
          <Text type="secondary">
            Se generará un PDF con la orden de pago completa incluyendo todos los detalles.
          </Text>
        </div>
      </div>
    </Modal>
  );
};