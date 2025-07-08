import { Table, Checkbox, Tag, Tooltip, Select, Space } from 'antd';
import { InvoiceElement } from '../../../../interfaces';

interface SupplierInvoiceTableProps {
  invoices: InvoiceElement[];
  isInvoiceSelected: (id: string) => boolean;
  toggleInvoiceSelection: (invoice: InvoiceElement, currency: string, bankAccountId?: string) => void;
  getSelectedCurrency: (id: string) => string;
  getSelectedBankAccount: (id: string) => string;
  availableCurrencies: string[];
}

export const SupplierInvoiceTable: React.FC<SupplierInvoiceTableProps> = ({
  invoices,
  isInvoiceSelected,
  toggleInvoiceSelection,
  getSelectedCurrency,
  getSelectedBankAccount,
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
      width: 400,
      render: (_: unknown, record: InvoiceElement) => {
        const isSelected = isInvoiceSelected(record.invoice.id);
        const currentCurrency = getSelectedCurrency(record.invoice.id);
        const currentBankAccount = getSelectedBankAccount(record.invoice.id);
        
        return (
          <Space>
            <Checkbox 
              checked={isSelected}
              onChange={() => toggleInvoiceSelection(record, currentCurrency, currentBankAccount)}
            />
            {isSelected && (
              <>
                <Select
                  value={currentCurrency}
                  onChange={(value) => toggleInvoiceSelection(record, value, currentBankAccount)}
                  style={{ width: 90 }}
                  disabled={!isSelected}
                >
                  {availableCurrencies.map(currency => (
                    <Select.Option key={currency} value={currency}>
                      {currency}
                    </Select.Option>
                  ))}
                </Select>
                <Select
                  value={currentBankAccount}
                  onChange={(value) => toggleInvoiceSelection(record, currentCurrency, value)}
                  style={{ width: 200 }}
                  disabled={!isSelected}
                  placeholder="Seleccionar cuenta"
                >
                  {record.bank_accounts.map(account => (
                    <Select.Option key={account.id} value={account.id}>
                      {account.label} - {account.bank_name}
                    </Select.Option>
                  ))}
                </Select>
              </>
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
      render: (record: InvoiceElement) => {
        const selectedBankAccount = record.bank_accounts.find(acc => acc.id === getSelectedBankAccount(record.invoice.id)) || 
                                  record.bank_accounts.find(acc => acc.is_default) ||
                                  record.bank_accounts[0];
        
        return selectedBankAccount ? (
          <Tooltip title={`${selectedBankAccount.bank_name} - ${selectedBankAccount.label}`}>
            {selectedBankAccount.account_number || selectedBankAccount.iban || "-"}
          </Tooltip>
        ) : "-";
      },
    },
    {
      title: 'Titular',
      key: 'owner',
      render: (record: InvoiceElement) => {
        const selectedBankAccount = record.bank_accounts.find(acc => acc.id === getSelectedBankAccount(record.invoice.id)) || 
                                  record.bank_accounts.find(acc => acc.is_default) ||
                                  record.bank_accounts[0];
        
        return selectedBankAccount?.owner || "-";
      },
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