import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { setupInterceptorsTo } from './axiosInterceptors';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: AxiosInstance;
  }
}

const _axios = setupInterceptorsTo(
  axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
  })
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  app.config.globalProperties.$api = _axios;
});

export { _axios };

// Tutorial: https://dev.to/charlintosh/setting-up-axios-interceptors-react-js-typescript-12k5
// https://stackoverflow.com/questions/60951579/using-axios-to-retry-request-after-refreshing-jwt-token-in-vuex-store
