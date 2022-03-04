
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { ExpenseType } from '~/types/expense';
import { ApiResponse } from '@/types/api';

const postExpense = ($axios: NuxtAxiosInstance, payload: ExpenseType): ApiResponse<any> => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return $axios.post('/expense', payload, config);
};

export default postExpense;