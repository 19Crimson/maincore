
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { ExpenseType } from '~/types/expense';
import { ApiResponse } from '@/types/api';

const getExpense = ($axios: NuxtAxiosInstance): ApiResponse<any> => {
  return $axios.get('/expense');
};

export default getExpense;