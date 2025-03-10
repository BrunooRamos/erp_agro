export interface TongProccesForm {
  date: string;
  number_of_bins: number;
  caliber: Caliber[];
  product_id: string;
}

export interface Caliber extends CreateCaliberForm {
  id: number;
  amount: number;
}

export interface CreateCaliberForm {
  name: string;
  description: string;
}
