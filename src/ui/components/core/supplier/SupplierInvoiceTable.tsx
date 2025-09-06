import { Table, Checkbox, Tooltip, Select, Typography, Tag, Input, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import { InvoiceElement } from '../../../../interfaces';
import type { InputRef, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import './SupplierInvoiceTable.css';

const { Text } = Typography;

interface SupplierInvoiceTableProps {
  invoices: InvoiceElement[];
  isInvoiceSelected: (id: string) => boolean;
  toggleInvoiceSelection: (invoice: InvoiceElement, currency: string, bankAccountId?: string) => void;
  getSelectedCurrency: (id: string) => string;
  getSelectedBankAccount: (id: string) => string;
  availableCurrencies: string[];
}

type DataIndex = ['invoice', 'cuenta'] | ['supplier', 'name'];

export const SupplierInvoiceTable: React.FC<SupplierInvoiceTableProps> = ({
  invoices,
  isInvoiceSelected,
  toggleInvoiceSelection,
  getSelectedCurrency,
  getSelectedBankAccount,
  availableCurrencies,
}) => {
  const searchInput = useRef<InputRef>(null);

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

  const handleSearch = (
    _: string[],
    confirm: FilterDropdownProps['confirm'],
  ) => {
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<InvoiceElement> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div className="filter-dropdown-container" onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Buscar ${Array.isArray(dataIndex) ? dataIndex[1] : dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
          className="filter-input"
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm)}
            icon={<SearchOutlined />}
            size="small"
            className="filter-button"
          >
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            className="filter-button"
          >
            Limpiar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Cerrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      const [key1, key2] = dataIndex;
      // Acceso seguro a propiedades anidadas
      const nestedObject = (record as unknown as Record<string, unknown>)[key1];
      const fieldValue = (nestedObject as Record<string, string>)[key2];
      return fieldValue
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()) || false;
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

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
                  style={{ width: 160 }}
                  disabled={!isSelected}
                >
                  {availableCurrencies.map(currency => (
                    <Select.Option key={currency} value={currency}>
                      {currency === 'EFECTIVO_UYU' ? 'Efectivo UYU'
                        : currency === 'EFECTIVO_USD' ? 'Efectivo USD'
                        : currency}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </div>
            {isSelected && hasValidAccount && currentCurrency !== 'EFECTIVO_UYU' && currentCurrency !== 'EFECTIVO_USD' && (
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
      title: 'Ref. Dolibarr',
      dataIndex: ['invoice', 'ref'],
      key: 'ref',
      render: (text: string) => text,
    },
    {
      title: 'Ref. Proveedor',
      dataIndex: ['invoice', 'ref_supplier'],
      key: 'ref_supplier',
      render: (text: string) => text || '-',
    },
    {
      title: 'Proveedor',
      dataIndex: ['supplier', 'name'],
      key: 'supplierName',
      sorter: (a: InvoiceElement, b: InvoiceElement) => a.supplier.name.localeCompare(b.supplier.name),
      ...getColumnSearchProps(['supplier', 'name']),
    },
    {
      title: 'Cuenta',
      dataIndex: ['invoice', 'cuenta'],
      key: 'cuenta',
      render: (cuenta: string) => cuenta || '-',
      ...getColumnSearchProps(['invoice', 'cuenta']),
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
      title: 'Monto Pendiente',
      key: 'pendingAmount',
      sorter: (a: InvoiceElement, b: InvoiceElement) => {
        const amountA = a.invoice.pending_amount || a.invoice.total_ttc || a.invoice.currency?.total_ttc || 0;
        const amountB = b.invoice.pending_amount || b.invoice.total_ttc || b.invoice.currency?.total_ttc || 0;
        return amountA - amountB;
      },
      render: (record: InvoiceElement) => {
        const pendingAmount = record.invoice.pending_amount || record.invoice.total_ttc || record.invoice.currency?.total_ttc || 0;
        const totalAmount = record.invoice.original_amount || 0;
        const totalPaid = record.invoice.total_paid || 0;
        
        return (
          <div>
            <Text strong style={{ fontSize: '14px' }}>
              ${pendingAmount.toLocaleString('es-UY', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </Text>
            {totalPaid > 0 && (
              <div>
                <Text style={{ color: '#666', fontSize: '11px' }}>
                  Total: ${totalAmount.toFixed(2)} | Pagado: ${totalPaid.toFixed(2)}
                </Text>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Moneda',
      key: 'currency',
      filters: [
        { text: 'USD', value: 'USD' },
        { text: 'UYU', value: 'UYU' },
      ],
      onFilter: (value: unknown, record: InvoiceElement) => {
        const currency = record.invoice.currency?.code || 'UYU';
        return currency === value;
      },
      render: (record: InvoiceElement) => {
        const currency = record.invoice.currency?.code || 'UYU';
        const color = currency === 'USD' ? 'blue' : 'green';
        return <Tag color={color}>{currency}</Tag>;
      },
    },
    {
      title: 'Cuenta Bancaria',
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