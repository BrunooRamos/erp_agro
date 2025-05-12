import { Table, Checkbox, Tag, Tooltip, Select, Space } from 'antd';
import { InvoiceElement } from '../../../../interfaces';

interface SupplierInvoiceTableProps {
  invoices: InvoiceElement[];
  isInvoiceSelected: (id: string) => boolean;
  toggleInvoiceSelection: (invoice: InvoiceElement, currency: string) => void;
  getSelectedCurrency: (id: string) => string;
  availableCurrencies: string[];
}

export const SupplierInvoiceTable: React.FC<SupplierInvoiceTableProps> = ({
  invoices,
  isInvoiceSelected,
  toggleInvoiceSelection,
  getSelectedCurrency,
  availableCurrencies,
}) => {
  
  const getStatusTag = (status: string) => {
    let color = 'default';
    
    switch (status) {
      case 'PAID':
        color = 'success';
        break;
      case 'UNPAID':
        color = 'error';
        break;
      case 'LATE':
        color = 'warning';
        break;
      default:
        color = 'default';
    }
    
    return <Tag color={color}>{status}</Tag>;
  };
  
  const columns = [
    {
      title: 'Seleccionar',
      dataIndex: 'selection',
      key: 'selection',
      width: 180,
      render: (_: unknown, record: InvoiceElement) => {
        const isSelected = isInvoiceSelected(record.invoice.id);
        const currentCurrency = getSelectedCurrency(record.invoice.id);
        
        return (
          <Space>
            <Checkbox 
              checked={isSelected}
              onChange={() => toggleInvoiceSelection(record, currentCurrency)}
            />
            {isSelected && (
              <Select
                value={currentCurrency}
                onChange={(value) => toggleInvoiceSelection(record, value)}
                style={{ width: 90 }}
                disabled={!isSelected}
              >
                {availableCurrencies.map(currency => (
                  <Select.Option key={currency} value={currency}>
                    {currency}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Referencia',
      dataIndex: ['invoice', 'ref'],
      key: 'ref',
      render: (text: string, record: InvoiceElement) => (
        <Tooltip title={`Ref. proveedor: ${record.invoice.ref_supplier}`}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Proveedor',
      dataIndex: ['supplier', 'name'],
      key: 'supplierName',
      sorter: (a: InvoiceElement, b: InvoiceElement) => a.supplier.name.localeCompare(b.supplier.name),
    },
    {
      title: 'Fecha',
      dataIndex: ['invoice', 'date'],
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Vencimiento',
      dataIndex: ['invoice', 'due_date'],
      key: 'dueDate',
      sorter: (a: InvoiceElement, b: InvoiceElement) => new Date(a.invoice.due_date).getTime() - new Date(b.invoice.due_date).getTime(),
      render: (date: string, record: InvoiceElement) => (
        <Tooltip title={`Días restantes: ${record.invoice.days_remaining}`}>
          {new Date(date).toLocaleDateString()}
        </Tooltip>
      ),
    },
    {
      title: 'Monto USD',
      key: 'totalUSD',
      render: (record: InvoiceElement) => {
        const amount = record.invoice.currency.code === "USD" 
          ? record.invoice.currency.total_ttc
          : record.invoice.total_ttc;
        
        return `${amount.toFixed(2)} USD`;
      },
    },
    {
      title: 'Monto UYU',
      key: 'totalUYU',
      render: (record: InvoiceElement) => {
        const amount = record.invoice.currency.code === "UYU"
          ? record.invoice.currency.total_ttc
          : record.invoice.total_ttc;
        
        return `${amount.toFixed(2)} UYU`;
      },
    },
    {
      title: 'Cuenta',
      key: 'account',
      render: (record: InvoiceElement) => (
        record.bank_account.account_number || record.bank_account.iban || "-"
      ),
    },
    {
      title: 'Titular',
      key: 'owner',
      render: (record: InvoiceElement) => (
        record.bank_account.owner || "-"
      ),
    },
    {
      title: 'Estado',
      dataIndex: ['invoice', 'status'],
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
  ];

  return (
    <Table 
      dataSource={invoices} 
      columns={columns} 
      rowKey={(record) => record.invoice.id}
      pagination={{ pageSize: 10 }}
      scroll={{ x: 1500 }}
    />
  );
}; 