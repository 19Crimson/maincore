<template>
  <div class="container">
    <div class="form-wrapper">
      <expense-create-form/>
    </div>
    <div class="preloader" v-if="!isReady" />
    <v-app class="expense-list" v-if="isReady">
      <expense-card
        v-for="item in expenses"
        :key="item.id"
        :id="item.id"
        :name="item.name"
        :sum="item.sum"
        :expense-at="item.expense_at"
      />
    </v-app>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, onMounted, Ref } from '@nuxtjs/composition-api';
import { ExpenseType } from '~/types/expense';

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
    const { $axios } = useContext();
    const getExpenses = async () => await $axios.get('/expense');
    const isReady = ref(false)

    onMounted(async () => {
      const response = await getExpenses();
      expenses.value = response.data;
      isReady.value = true;
    });

    return {
      getExpenses,
      expenses,
      isReady,
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

    @media (max-width: 768px) {
      flex-direction: column;
    }
}
.expense-list {
  margin: 40px;
  width: 100%;

  .v-application--wrap {
    flex-direction: row;
    // TODO Display cards, API, toaster
  }
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
    max-height: 356px;
}
</style>
