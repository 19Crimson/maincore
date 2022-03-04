import { AxiosError, AxiosResponse } from 'axios';
import { Plugin } from '@nuxt/types';

const authKey = 'Authorization';

const axios: Plugin = (ctx) => {
  const {
    $axios, app, $toast,
  } = ctx;

  $axios.onResponse((response: any | AxiosResponse) => {
    const { headers } = response;

    return {
      data: response.data,
      success: true,
      message: response.data?.message,
      status: response.status,
      headers: response.headers,
      statusText: response.statusText,
      config: response.config,
    };
  });

  $axios.onError(async (error: any | AxiosError) => {
    const { status } = error.response;
    try {
      if (error.response.data?.message) {
        $toast.error(error.response.data?.message, { duration: 5000 });
      } else if (error.response.data?.errors) {
        Object.keys(error.response.data?.errors).forEach((key) => {
          $toast.error(error.response.data?.errors[key], { duration: 5000 });
        });
      }
      return { success: false, errors: error.response?.data?.errors };
    } catch (e) {
      return { success: false, errors: error.response?.data?.errors };
    }
  });
};
export default axios;
