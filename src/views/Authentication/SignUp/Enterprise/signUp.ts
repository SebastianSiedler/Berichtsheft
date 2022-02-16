import { _axios as $api } from 'boot/axios';
//import { AxiosResponse } from 'axios';

export interface SignUpEnterprise {
  mail: string;
  salutation: 1 | 2 | 3;
  firstName: string;
  lastName: string;
  password: string;
  passwordRepeat: string;
  companyName: string;
  terms: boolean;
  recaptchaToken: string;
}

interface CreateUserCompanyAPI {
  username: string;
  password: string;
  salutation: 1 | 2 | 3;
  first_name: string;
  last_name: string;
  company_name: string;
  token: string;
}

export const sendSignUp = async (obj: SignUpEnterprise) => {
  const payload: CreateUserCompanyAPI = {
    username: obj.mail,
    password: obj.password,
    salutation: obj.salutation,
    first_name: obj.firstName,
    last_name: obj.lastName,
    company_name: obj.companyName,
    token: obj.recaptchaToken,
  };

  await $api.post('/api/auth/create_user_company/', payload);
};
