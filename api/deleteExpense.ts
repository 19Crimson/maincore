
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { ApiResponse } from '@/types/api';

const deleteExpense = ($axios: NuxtAxiosInstance, id: number): ApiResponse<any> => {
  return $axios.delete(`/expense/${id}`);
};

export default deleteExpense;