import React from 'react';
import { Typography } from 'antd';
import './SupplierInvoiceTable.css';

const { Text } = Typography;

export const InvoiceStatusLegend: React.FC = () => {
  return (
    <div className="invoice-status-legend">
      <div className="invoice-status-legend-item">
        <div className="invoice-status-indicator available" />
        <Text>
          <Text strong>Disponible:</Text> Factura disponible para incluir en una orden de pago
        </Text>
      </div>
      <div className="invoice-status-legend-item">
        <div className="invoice-status-indicator in-payment-order" />
        <Text>
          <Text strong>En orden de pago:</Text> Factura incluida en una orden de pago pendiente (sin recibo confirmado)
        </Text>
      </div>
    </div>
  );
};
