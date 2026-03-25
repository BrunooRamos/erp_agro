import { Button, Card, Col, DatePicker, Empty, Row, Select, Space, Spin, Table, Typography, message } from "antd";
import { useMemo, useState } from "react";
import { useSupplierDueReport } from "../../../../hooks";
import { SupplierDueReportInvoiceEntry } from "../../../../interfaces";
import dayjs from "dayjs";
import { generateSupplierDueReportPDF, generateSupplierDueReportExcel } from "../../../../actions/supplier/supplier_actions";

const { Title, Text } = Typography;

const formatDate = (iso?: string) => (iso ? dayjs(iso).format('DD/MM/YYYY') : '');
const formatMoney = (n?: number) => (typeof n === 'number' && n !== 0 ? n.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "");

type RowType = 'data' | 'supplierSubtotal' | 'monthSubtotal' | 'grandTotal';
type UiRow = { rowType: RowType; key: string } & Partial<SupplierDueReportInvoiceEntry> & {
  label?: string;
  amount_uyu?: number;
  amount_usd?: number;
  month?: string;
};

export const SupplierDueReport = () => {
  const { filters, updateFilters, clearFilters, accounts, report } = useSupplierDueReport();
  const [isExporting, setIsExporting] = useState(false);

  const onSearch = () => {
    if (!filters.account) {
      message.warning('Seleccione una cuenta');
      return;
    }
    if (filters.date_from > filters.date_to) {
      message.warning('La fecha Desde no puede ser mayor a Hasta');
      return;
    }
    report.refetch();
  };

  const onClear = () => {
    clearFilters();
  };

  const uniqueSuppliers = useMemo(() => {
    if (!report.data?.invoices) return [];
    const map = new Map<string, string>();
    for (const e of report.data.invoices) {
      if (!map.has(e.supplier.id)) map.set(e.supplier.id, e.supplier.name);
    }
    return Array.from(map.entries()).map(([id, name]) => ({ value: id, label: name })).sort((a, b) => a.label.localeCompare(b.label));
  }, [report.data]);

  const rows = useMemo(() => {
    if (!report.data) return [] as UiRow[];
    const data = report.data;
    let invoices = Array.isArray(data.invoices) ? data.invoices : [];
    if (invoices.length === 0) return [] as UiRow[];

    // Client-side filtering
    if (filters.supplier_id) {
      invoices = invoices.filter(e => e.supplier.id === filters.supplier_id);
    }
    if (filters.currency === 'UYU') {
      invoices = invoices.filter(e => (e.invoice.printable_amounts?.amount_uyu || 0) !== 0);
    } else if (filters.currency === 'USD') {
      invoices = invoices.filter(e => (e.invoice.printable_amounts?.amount_usd || 0) !== 0);
    }

    if (invoices.length === 0) return [] as UiRow[];
    // Recompute subtotals from filtered invoices
    const supplierSubtotalMap = new Map<string, { supplier_name: string; amount_uyu: number; amount_usd: number }>();
    const monthSubtotalMap = new Map<string, { amount_uyu: number; amount_usd: number }>();
    for (const e of invoices) {
      const sid = e.supplier.id;
      if (!supplierSubtotalMap.has(sid)) supplierSubtotalMap.set(sid, { supplier_name: e.supplier.name, amount_uyu: 0, amount_usd: 0 });
      const s = supplierSubtotalMap.get(sid)!;
      s.amount_uyu += e.invoice.printable_amounts?.amount_uyu || 0;
      s.amount_usd += e.invoice.printable_amounts?.amount_usd || 0;

      const month = e.invoice.month_year_due;
      if (!monthSubtotalMap.has(month)) monthSubtotalMap.set(month, { amount_uyu: 0, amount_usd: 0 });
      const m = monthSubtotalMap.get(month)!;
      m.amount_uyu += e.invoice.printable_amounts?.amount_uyu || 0;
      m.amount_usd += e.invoice.printable_amounts?.amount_usd || 0;
    }
    const supplierSubtotals = Array.from(supplierSubtotalMap.entries()).map(([id, v]) => ({ supplier_id: id, ...v }));
    const monthSubtotals = Array.from(monthSubtotalMap.entries()).map(([month_year_due, v]) => ({ month_year_due, ...v }));
    const sorted = [...invoices].sort((a, b) => {
      if (a.invoice.month_year_due !== b.invoice.month_year_due) return a.invoice.month_year_due.localeCompare(b.invoice.month_year_due);
      if (a.supplier.name !== b.supplier.name) return a.supplier.name.localeCompare(b.supplier.name);
      return a.invoice.due_date.localeCompare(b.invoice.due_date);
    });

    const output: UiRow[] = [];
    let currentMonth: string | null = null;
    let currentSupplierId: string | null = null;

    const pushSupplierSubtotal = (supplierId: string) => {
      const s = supplierSubtotals.find(x => x.supplier_id === supplierId);
      if (!s) return;
      output.push({
        rowType: 'supplierSubtotal',
        key: `supplier-subtotal-${supplierId}-${output.length}`,
        label: `Subtotal ${s.supplier_name}`,
        amount_uyu: s.amount_uyu,
        amount_usd: s.amount_usd,
      });
    };

    const pushMonthSubtotal = (month: string) => {
      const m = monthSubtotals.find(x => x.month_year_due === month);
      if (!m) return;
      output.push({
        rowType: 'monthSubtotal',
        key: `month-subtotal-${month}-${output.length}`,
        label: `Subtotal ${month}`,
        amount_uyu: m.amount_uyu,
        amount_usd: m.amount_usd,
        month,
      });
    };

    sorted.forEach((entry, idx) => {
      if (entry.invoice.month_year_due !== currentMonth) {
        if (currentSupplierId) {
          pushSupplierSubtotal(currentSupplierId);
          currentSupplierId = null;
        }
        if (currentMonth) pushMonthSubtotal(currentMonth);
        currentMonth = entry.invoice.month_year_due;
      }
      if (entry.supplier.id !== currentSupplierId) {
        if (currentSupplierId) pushSupplierSubtotal(currentSupplierId);
        currentSupplierId = entry.supplier.id;
      }

      output.push({ rowType: 'data', key: entry.invoice.id, ...entry });

      const next = sorted[idx + 1];
      if (!next || next.supplier.id !== currentSupplierId) {
        if (currentSupplierId) {
          pushSupplierSubtotal(currentSupplierId);
          currentSupplierId = null;
        }
      }
      if (!next || next.invoice.month_year_due !== currentMonth) {
        if (currentMonth) pushMonthSubtotal(currentMonth);
        currentMonth = next ? next.invoice.month_year_due : null;
      }
    });

    // Grand total from filtered invoices
    const grandUyu = invoices.reduce((acc, e) => acc + (e.invoice.printable_amounts?.amount_uyu || 0), 0);
    const grandUsd = invoices.reduce((acc, e) => acc + (e.invoice.printable_amounts?.amount_usd || 0), 0);
    output.push({
      rowType: 'grandTotal',
      key: `grand-total`,
      label: 'TOTAL GENERAL',
      amount_uyu: grandUyu,
      amount_usd: grandUsd,
    });

    return output;
  }, [report.data, filters.supplier_id, filters.currency]);

  const columns = [
    { title: 'M-A Vto.', dataIndex: ['invoice', 'month_year_due'], width: 100, render: (_: unknown, r: UiRow) => r.rowType === 'data' ? r.invoice?.month_year_due : '' },
    { title: 'Proveedor', dataIndex: ['supplier', 'name'], width: 280, render: (_: unknown, r: UiRow) => r.rowType === 'data' ? r.supplier?.name : (r.label || '') },
    { title: 'Fecha Vto.', dataIndex: ['invoice', 'due_date'], width: 110, render: (_: unknown, r: UiRow) => r.rowType === 'data' ? formatDate(r.invoice?.due_date) : '' },
    { title: 'Tipo Doc.', dataIndex: ['invoice', 'type_document'], width: 110, render: (_: unknown, r: UiRow) => r.rowType === 'data' ? r.invoice?.type_document : '' },
    { title: 'Fecha Doc.', dataIndex: ['invoice', 'date'], width: 110, render: (_: unknown, r: UiRow) => r.rowType === 'data' ? formatDate(r.invoice?.date) : '' },
    { title: 'N° Doc.', dataIndex: ['invoice', 'ref'], width: 140, render: (_: unknown, r: UiRow) => r.rowType === 'data' ? r.invoice?.ref : '' },
    { title: 'Fecha Orden de Pago', dataIndex: ['payments', '0', 'payment_order_date'], width: 150, render: (_: unknown, r: UiRow) => r.rowType === 'data' ? formatDate(r.payments?.[0]?.payment_order_date || undefined) : '' },
    { title: 'N° Orden de Pago', dataIndex: ['payments', '0', 'payment_order_ref'], width: 160, render: (_: unknown, r: UiRow) => r.rowType === 'data' ? (r.payments?.[0]?.payment_order_ref || '') : '' },
    { title: '$', dataIndex: ['invoice', 'printable_amounts', 'amount_uyu'], align: 'right' as const, width: 120, render: (_: unknown, r: UiRow) => filters.currency === 'USD' ? '' : (r.rowType === 'data' ? formatMoney(r.invoice?.printable_amounts?.amount_uyu) : formatMoney(r.amount_uyu)) },
    { title: 'U$S', dataIndex: ['invoice', 'printable_amounts', 'amount_usd'], align: 'right' as const, width: 120, render: (_: unknown, r: UiRow) => filters.currency === 'UYU' ? '' : (r.rowType === 'data' ? formatMoney(r.invoice?.printable_amounts?.amount_usd) : formatMoney(r.amount_usd)) },
  ];

  const onExportPDF = async () => {
    if (!report.data) return;
    try {
      setIsExporting(true);
      generateSupplierDueReportPDF(report.data);
    } finally {
      setIsExporting(false);
    }
  };

  const onExportExcel = () => {
    if (!report.data) return;
    generateSupplierDueReportExcel(report.data, { currency: filters.currency, supplier_id: filters.supplier_id });
  };

  const hasResults = Boolean(report.data && Array.isArray(report.data.invoices) && report.data.invoices.length > 0);

  return (
    <div className="p-6">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>VENCIMIENTOS (ESTUDIO)</Title>
        </Col>
        <Col span={24}>
          <Card>
            <Space wrap>
              <div>
                <Text strong>Cuenta</Text>
                <div>
                  <Select
                    placeholder="Seleccionar cuenta"
                    style={{ width: 240 }}
                    loading={accounts.isLoading}
                    value={filters.account || undefined}
                    onChange={(v) => updateFilters({ account: v })}
                    options={(accounts.data?.accounts || []).map(a => ({ value: a.cuenta, label: a.label }))}
                  />
                </div>
              </div>
              <div>
                <Text strong>Desde</Text>
                <div>
                  <DatePicker
                    value={filters.date_from ? dayjs(filters.date_from) : undefined}
                    onChange={(d) => updateFilters({ date_from: d ? d.format('YYYY-MM-DD') : '' })}
                    format="DD/MM/YYYY"
                  />
                </div>
              </div>
              <div>
                <Text strong>Hasta</Text>
                <div>
                  <DatePicker
                    value={filters.date_to ? dayjs(filters.date_to) : undefined}
                    onChange={(d) => updateFilters({ date_to: d ? d.format('YYYY-MM-DD') : '' })}
                    format="DD/MM/YYYY"
                  />
                </div>
              </div>
              <div>
                <Text strong>Proveedor</Text>
                <div>
                  <Select
                    placeholder="Todos"
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    style={{ width: 240 }}
                    value={filters.supplier_id || undefined}
                    onChange={(v) => updateFilters({ supplier_id: v || '' })}
                    options={uniqueSuppliers}
                  />
                </div>
              </div>
              <div>
                <Text strong>Moneda</Text>
                <div>
                  <Select
                    placeholder="Todas"
                    allowClear
                    style={{ width: 160 }}
                    value={filters.currency || undefined}
                    onChange={(v) => updateFilters({ currency: (v || '') as '' | 'UYU' | 'USD' })}
                    options={[
                      { value: 'UYU', label: 'Pesos (UYU)' },
                      { value: 'USD', label: 'Dólares (USD)' },
                    ]}
                  />
                </div>
              </div>
              <Space>
                <Button type="primary" onClick={onSearch} loading={report.isFetching}>Buscar</Button>
                <Button onClick={onClear}>Limpiar</Button>
                <Button onClick={onExportPDF} disabled={!hasResults} loading={isExporting}>Exportar PDF</Button>
                <Button onClick={onExportExcel} disabled={!hasResults}>Exportar Excel</Button>
              </Space>
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          {report.isLoading ? (
            <div className="flex justify-center items-center h-40"><Spin /></div>
          ) : !hasResults ? (
            <Card>
              <Empty description="Sin resultados para los filtros seleccionados" />
            </Card>
          ) : (
            <Card>
              <div className="mb-2 text-sm text-gray-600">
                <Text>
                  Cuenta: <b>{report.data?.report_header.account_label}</b> | Período: {formatDate(report.data!.report_header.date_from)} - {formatDate(report.data!.report_header.date_to)} | Generado: {dayjs(report.data!.report_header.generated_at).format('DD/MM/YYYY HH:mm')}
                </Text>
              </div>
              <Table
                dataSource={rows}
                columns={columns}
                size="small"
                rowKey={(r: UiRow) => r.key}
                pagination={{ pageSize: 50 }}
                bordered
                rowClassName={(r: UiRow, index) => {
                  if (r.rowType === 'grandTotal') return 'font-bold bg-gray-50';
                  if (r.rowType === 'monthSubtotal') return 'font-bold';
                  if (r.rowType === 'supplierSubtotal') return 'font-bold border-t';
                  return index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                }}
              />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};


