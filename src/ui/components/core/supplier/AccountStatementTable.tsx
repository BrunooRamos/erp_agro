import React from 'react';
import { Table, Tag, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { AccountMovement } from '../../../../interfaces';

const { Text } = Typography;

interface AccountStatementTableProps {
  movements: AccountMovement[];
  currency: string;
  loading?: boolean;
}

export const AccountStatementTable: React.FC<AccountStatementTableProps> = ({
  movements,
  loading = false
}) => {
  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'document_date',
      key: 'document_date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a: AccountMovement, b: AccountMovement) => 
        dayjs(a.document_date).unix() - dayjs(b.document_date).unix(),
      width: 100,
    },
    {
      title: 'Tipo',
      dataIndex: 'document_type',
      key: 'document_type',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          'Factura': 'blue',
          'Nota Cr.': 'green',
          'Recibo': 'orange',
          'Ajuste': 'purple'
        };
        return <Tag color={colorMap[type] || 'default'}>{type}</Tag>;
      },
      width: 100,
    },
    {
      title: 'N° Documento',
      dataIndex: 'document_ref',
      key: 'document_ref',
      render: (ref: string, record: AccountMovement) => (
        <Tooltip title={`Ref. proveedor: ${record.document_ref_supplier || 'N/A'}`}>
          <Text>{ref}</Text>
        </Tooltip>
      ),
      width: 150,
    },
    {
      title: 'Cuenta',
      dataIndex: 'cuenta',
      key: 'cuenta',
      render: (cuenta: string) => cuenta || '-',
      width: 120,
    },
    {
      title: 'Debe',
      dataIndex: 'debit',
      key: 'debit',
      align: 'right' as const,
      render: (amount: number) => amount > 0 ? 
        <Text strong style={{ color: '#cf1322' }}>
          {amount.toLocaleString('es-UY', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </Text> : '-',
      width: 120,
    },
    {
      title: 'Haber',
      dataIndex: 'credit',
      key: 'credit',
      align: 'right' as const,
      render: (amount: number) => amount > 0 ? 
        <Text strong style={{ color: '#3f8600' }}>
          {amount.toLocaleString('es-UY', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </Text> : '-',
      width: 120,
    },
    {
      title: 'Saldo',
      dataIndex: 'balance',
      key: 'balance',
      align: 'right' as const,
      render: (amount: number) => (
        <Text strong style={{ 
          color: amount >= 0 ? '#cf1322' : '#3f8600' 
        }}>
          {amount.toLocaleString('es-UY', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </Text>
      ),
      width: 120,
    },
  ];

  return (
    <Table
      dataSource={movements}
      columns={columns}
      rowKey="document_id"
      loading={loading}
      pagination={{ 
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} de ${total} movimientos`
      }}
      scroll={{ x: 800 }}
      size="small"
    />
  );
};