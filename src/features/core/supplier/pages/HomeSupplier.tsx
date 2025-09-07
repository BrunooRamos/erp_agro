import { OptionCard } from "../../../../ui/components/core/OptionCard";

export const HomeSupplier = () => {
  return (
    <div className="flex flex-col gap-4 h-full justify-center">
      <OptionCard
        visible={true}
        icon="fa-solid fa-file-invoice"
        title="Estado de cuenta"
        to="/supplier/account-statement"
        description="Estado de cuenta"
      />
      <OptionCard
        visible={true}
        icon="fa-solid fa-file-invoice"
        title="Ordenes de pago"
        to="/supplier/invoices"
        description="Ordenes de pago"
      />
    </div>
  );
};
