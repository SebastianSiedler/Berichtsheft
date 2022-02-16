export interface CompanyDataApi {
  id: number;
  name: string;
  country: string;
  street: string;
  hnr: string;
  hnrsuffix: string;
  zip_code: string;
  city: string;
  email: string;
  payment: true;
}

export interface CreditCardAPI {
  id: number;
  default: boolean;
  last4: string; // '4242'
  exp_month: number; // 1-12
  exp_year: number; // 2020
  brand: string; // visa
  country: string;
}
