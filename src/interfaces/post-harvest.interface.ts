export interface TongProccesForm {
  date: string;
  number_of_bins: number;
  caliber: Caliber[];
}

export interface Caliber extends CreateCaliberForm {
  id: number;
  amount: number;
}

export interface CreateCaliberForm {
  name: string;
  description: string;
}
