
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { ApiResponse } from '@/types/api';
import { ExpenseType } from '~/types/expense';

const patchExpense = ($axios: NuxtAxiosInstance, id: number, expense: ExpenseType): ApiResponse<any> => {
  const { name, sum, expense_at } = expense;
  const payload = {
    name,
    sum,
    expense_at,
  }
  return $axios.patch(`/expense/${id}`, payload);
};

export default patchExpense;