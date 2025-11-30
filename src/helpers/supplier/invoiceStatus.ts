import { InvoiceElement } from "../../interfaces";

export type InvoiceStatus = 'available' | 'in-payment-order' | 'paid';

export interface InvoiceStatusInfo {
  status: InvoiceStatus;
  label: string;
  className: string;
  badgeColor: 'default' | 'warning' | 'success';
  description: string;
}

/**
 * Determina el estado de una factura basado en los campos paye y in_payment_order
 * @param invoice - Elemento de factura
 * @returns Información del estado de la factura
 */
export const getInvoiceStatus = (invoice: InvoiceElement): InvoiceStatusInfo => {
  const { paye, in_payment_order } = invoice.invoice;

  // VERDE: Factura completamente pagada
  if (paye === '1') {
    return {
      status: 'paid',
      label: 'Pagada',
      className: 'invoice-status-paid',
      badgeColor: 'success',
      description: 'Factura completamente pagada'
    };
  }

  // AMARILLO: Factura en orden de pago pendiente (sin recibo confirmado)
  if (in_payment_order === 1) {
    return {
      status: 'in-payment-order',
      label: 'En orden de pago',
      className: 'invoice-status-in-payment-order',
      badgeColor: 'warning',
      description: 'Factura incluida en una orden de pago pendiente'
    };
  }

  // BLANCO: Factura disponible para pagar
  return {
    status: 'available',
    label: 'Disponible',
    className: 'invoice-status-available',
    badgeColor: 'default',
    description: 'Factura disponible para incluir en una orden de pago'
  };
};

/**
 * Verifica si una factura puede ser seleccionada para una orden de pago
 * @param invoice - Elemento de factura
 * @returns true si la factura puede ser seleccionada
 */
export const isInvoiceSelectable = (invoice: InvoiceElement): boolean => {
  const statusInfo = getInvoiceStatus(invoice);
  // Se pueden seleccionar facturas disponibles (blancas) y en orden de pago (amarillas)
  // Solo las pagadas (verdes) no se pueden seleccionar
  return statusInfo.status !== 'paid';
};

/**
 * Obtiene el mensaje de tooltip para facturas no seleccionables
 * @param invoice - Elemento de factura
 * @returns Mensaje de tooltip o undefined si es seleccionable
 */
export const getDisabledTooltip = (invoice: InvoiceElement): string | undefined => {
  const statusInfo = getInvoiceStatus(invoice);

  if (statusInfo.status === 'paid') {
    return 'Esta factura ya está completamente pagada';
  }

  return undefined;
};
