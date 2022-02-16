import { Ref, ref } from 'vue';
import { _axios as $api } from 'boot/axios';
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
  AxiosInstance,
} from 'axios';

/**
 * Consume Data from API using Axios
 * https://github.com/vueuse/vueuse/blob/main/packages/integrations/useAxios/index.ts
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAxios<T = any>(
  url: string,
  config: AxiosRequestConfig = {},
  instance: AxiosInstance = $api
) {
  // Set Variables
  //const response = shallowRef<AxiosResponse<T>>();
  const data = ref<T>() as Ref<T>;
  const isFinished = ref(false);
  const isLoading = ref(true);
  const aborted = ref(false);
  const error = ref('');

  const cancelToken: CancelTokenSource = axios.CancelToken.source();
  const abort = (message?: string) => {
    if (isFinished.value || !isLoading.value) return;

    cancelToken.cancel(message);
    aborted.value = true;
    isLoading.value = false;
    isFinished.value = false;
  };

  const fetch = async () => {
    try {
      // Try fetch call
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const r: AxiosResponse<T> = await instance(url, {
        ...config,
        cancelToken: cancelToken.token,
      });
      //      response.value = r;
      data.value = r.data;
    } catch (e) {
      // Set Error
      error.value = e as string;
    } finally {
      // Loading finished
      isLoading.value = false;
      isFinished.value = true;
    }
  };
  fetch();

  return {
    //response,
    data,
    error,
    finished: isFinished,
    loading: isLoading,
    isFinished,
    isLoading,
    cancel: abort,
    canceled: aborted,
    aborted,
    abort,
    fetch,
    retry: fetch,
  };
}

/**
 * Usage Example
 
   useAxios<string>(`/api/admin/subject/${newName}/`, {
    method: 'PATCH',
    data: {
      name: newName,
    },
  });

 */
