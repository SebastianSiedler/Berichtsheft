import { _axios as $api } from 'boot/axios';
import { CompanyDataApi, CreditCardAPI } from './types';
import { useAxios } from 'lib/utils/useAxios';

/**
 * Abrechnungsinformationen wie z.B. Rechnungsadresse
 * TODO: KOMPLETT VERALTET
 */
export const getCompanyAdress = async () => {
  const { data } = await $api.get<CompanyDataApi[]>('/api/admin/company/');
  const a = data[0];
  return a;
};

/* Kreditkarte - PaymentMethods */

/**
 * Alle Kreditkarten
 */
export const getCreditCardsAPI = () => {
  return useAxios<CreditCardAPI[]>('/payments/card/', { method: 'GET' });
};

/**
 * Eine Kreditkarte mithilfe eines Stripe Tokens
 * hinzufügen
 */
export const addCreditCardAPI = async (token: string) => {
  const { data } = await $api.post<CreditCardAPI>('/payments/card/', {
    token,
  });
  return data;
};

/**
 * Eine Kreditkarte löschen
 */
export const deleteCreditCardAPI = async (card_id: number) => {
  return await $api.delete(`/payments/card/${card_id}`);
};

/**
 * Eine Kreditkarte zum Standard machen
 */
export const setDefaultCardAPI = async (card_id: number) => {
  return await $api.post('/payments/set_default_card/', { card: card_id });
};
