<template>
  <div class="container">
    <div :class="formWrapperClass">
      <expense-form
        :mode="formMode"
        :id="expenseToEdit.id"
        :name="expenseToEdit.name"
        :sum="expenseToEdit.sum"
        :expense-at="expenseToEdit.expense_at"
        @submit="getExpenses"
        @reset="onReset"
      />
    </div>
    <div class="preloader" v-if="!isReady" />
    <v-app class="expense-list" v-if="isReady">
      <v-container fluid grid-list-xl>
        <v-layout wrap justify-space-around>
          <v-flex
            class="expense-item"
            v-for="item in expenses"
            :key="item.id"
          >
            <expense-card
              :id="item.id"
              :name="item.name"
              :sum="item.sum"
              :expenseAt="item.expense_at"
              @delete="onDelete(item.id)"
              @edit="onEdit(item.id)"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-app>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, onMounted, Ref, reactive, computed } from '@nuxtjs/composition-api';
import { ExpenseType } from '@/types/expense';
import { ExpenseFormModeType } from '@/components/ExpenseForm.vue';
import getExpense from '@/api/getExpense';
import gdeleteExpense from '@/api/deleteExpense';

export default defineComponent({
  name: 'ExpenseList',
  props: {
    id: {
      type: Number,
      default: undefined,
    },
    name: {
      type: String,
      default: '',
    },
    sum: {
      type: Number,
      default: 0,
    },
    expense_at: {
      type: Date,
      defalt: undefined,
    }
  },
  setup() {
    const expenses: Ref<ExpenseType[]> = ref([]);
    const expenseToEdit: ExpenseType = reactive({
      id: 0,
      name: '',
      sum: 0,
      expense_at: '',
    })
    const isReady = ref(false);
    const isEditMode = ref(false);

    const { $axios, $toast } = useContext();

    const getExpenses = async () => {
      const {success, data} = await getExpense($axios);
      if (success) {
        expenses.value = data;
        isReady.value = true;
      }
    }

    const formMode = computed((): ExpenseFormModeType => (
      isEditMode.value
        ? ExpenseFormModeType.edit
        : ExpenseFormModeType.create
    ));
    const formWrapperClass = computed((): Record<string, boolean> => ({
        'form-wrapper': true,
        'form-wrapper--edit': isEditMode.value,
    }));

    const findExpenseIndex = (id: number): number => {
      return expenses.value.findIndex(item => item.id === id)
    }

    onMounted(() => {
      getExpenses();
    });

    const onDelete = async (id: number) => {
      const { success } = await gdeleteExpense($axios, id);
      if (!success) {
        return;
      }
      $toast.success('Расход удалён')
      getExpenses();
    }

    const onEdit = (id: number) => {
      const index = findExpenseIndex(id);
      const expenseData = expenses.value[index];
      expenseToEdit.id = expenseData.id;
      expenseToEdit.name = expenseData.name;
      expenseToEdit.sum = expenseData.sum;
      expenseToEdit.expense_at = expenseData.expense_at;
      isEditMode.value = true;
      window.scrollTo(0, 0);
    }

    const onReset = () => isEditMode.value = false;

    return {
      formMode,
      formWrapperClass,
      getExpenses,
      expenses,
      expenseToEdit,
      isReady,
      isEditMode,
      onReset,
      onDelete,
      onEdit,
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  max-width: 1280px;
  width: 100%;
  height: 100vh;
  display: flex;

  @media (max-width: 920px) {
    flex-direction: column;
    align-items: center;
  }
}
.expense-list {
  margin-left: 40px;
  width: 100%;

  @media (max-width: 920px) {
    margin-left: 0;
    margin-top: 40px;
  }
}

.expense-item {
  max-height: 200px;
  margin-bottom: 40px;
}
.preloader {
  content: url('~/assets/images/preloader.gif');
  width: 64px;
  height: 64px;
  margin: 100px auto;
}
.form-wrapper {
  max-width: 400px;
  width: 100%;
  min-height: 452px;

  &--edit {
    min-height: 538px;
  }
}
</style>
