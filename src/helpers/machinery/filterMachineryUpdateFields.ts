import { MachineryForm } from "../../interfaces";

export const filterMachineryUpdateFields = (data: MachineryForm, originalData?: MachineryForm) => {
    const allowedFields = {
      brand: data.brand,
      description: data.description,
      id_padron: data.id_padron,
      insurance: data.insurance,
      maintenance_hours: data.maintenance_hours?.toString(),
      model: data.model,
      name: data.name,
      padron: data.padron,
      plate: data.plate,
      state: data.state,
      year_fabrication: data.year_fabrication?.toString(),
      year_purchase: data.year_purchase?.toString()
    };
  
    const filteredFields = Object.fromEntries(
      Object.entries(allowedFields).filter(([value]) => value != null)
    );
  
    if (originalData) {
      return Object.fromEntries(
        Object.entries(filteredFields).filter(([key, value]) => 
          originalData[key as keyof MachineryForm]?.toString() !== value
        )
      );
    }
  
    return filteredFields;
  };