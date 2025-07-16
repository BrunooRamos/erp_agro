import { Table, Checkbox, Tooltip, Select, Typography, Tag } from 'antd';
import { InvoiceElement } from '../../../../interfaces';

const { Text } = Typography;

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
  // Función helper para verificar si una cuenta bancaria es válida
  const hasValidBankAccount = (record: InvoiceElement) => {
    if (!record.bank_accounts || record.bank_accounts.length === 0) {
      return false;
    }
    
    // Verificar si al menos una cuenta tiene account_number o iban
    return record.bank_accounts.some(account => 
      (account.account_number && account.account_number.trim() !== '') || 
      (account.iban && account.iban.trim() !== '')
    );
  };

  const columns = [
    {
      title: 'Seleccionar',
      dataIndex: 'selection',
      key: 'selection',
      width: 500,
      render: (_: unknown, record: InvoiceElement) => {
        const isSelected = isInvoiceSelected(record.invoice.id);
        const currentCurrency = getSelectedCurrency(record.invoice.id);
        const currentBankAccount = getSelectedBankAccount(record.invoice.id);
        const hasValidAccount = hasValidBankAccount(record);
        
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={isSelected}
                onChange={() => toggleInvoiceSelection(record, currentCurrency, currentBankAccount)}
              />
              {isSelected && (
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
              )}
            </div>
            {isSelected && hasValidAccount && (
              <div className="ml-6">
                <Select
                  value={currentBankAccount}
                  onChange={(value) => toggleInvoiceSelection(record, currentCurrency, value)}
                  style={{ width: 350 }}
                  disabled={!isSelected}
                  placeholder="Seleccionar cuenta"
                >
                  {record.bank_accounts
                    .filter(account => 
                      (account.account_number && account.account_number.trim() !== '') || 
                      (account.iban && account.iban.trim() !== '')
                    )
                    .map(account => (
                    <Select.Option key={account.id} value={account.id}>
                      <div className="flex flex-col">
                        <Text strong>{account.label}</Text>
                        <Text type="secondary" className="text-xs">
                          {account.bank_name} - {account.account_number || account.iban}
                        </Text>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )}
            {isSelected && !hasValidAccount && (
              <div className="ml-6">
                <Tag color="warning">Sin cuenta bancaria</Tag>
              </div>
            )}
          </div>
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
        if (!hasValidBankAccount(record)) {
          return <Tag color="warning">Sin cuenta bancaria</Tag>;
        }
        
        const validAccounts = record.bank_accounts.filter(account => 
          (account.account_number && account.account_number.trim() !== '') || 
          (account.iban && account.iban.trim() !== '')
        );
        
        const selectedBankAccount = validAccounts.find(acc => acc.id === getSelectedBankAccount(record.invoice.id)) || 
                                  validAccounts.find(acc => acc.is_default) ||
                                  validAccounts[0];
        
        return selectedBankAccount ? (
          <Tooltip title={`${selectedBankAccount.bank_name} - ${selectedBankAccount.label}`}>
            <Text>
              {selectedBankAccount.account_number || selectedBankAccount.iban}
            </Text>
          </Tooltip>
        ) : "-";
      },
    },
    {
      title: 'Titular',
      key: 'owner',
      render: (record: InvoiceElement) => {
        if (!hasValidBankAccount(record)) {
          return "-";
        }
        
        const validAccounts = record.bank_accounts.filter(account => 
          (account.account_number && account.account_number.trim() !== '') || 
          (account.iban && account.iban.trim() !== '')
        );
        
        const selectedBankAccount = validAccounts.find(acc => acc.id === getSelectedBankAccount(record.invoice.id)) || 
                                  validAccounts.find(acc => acc.is_default) ||
                                  validAccounts[0];
        
        return selectedBankAccount?.owner || "-";
      },
    }
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