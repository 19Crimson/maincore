<template>
  <v-app>
    <v-form
      ref="formRef"
      class="form"
      v-model="isFormValid"
      @submit.prevent="onSubmit"
      lazy-validation
    >

    <h3 class="form__title">
      {{ computedTitle }}
    </h3>

      <v-text-field
        v-if="isEditMode"
        v-model="idInput"
        class="form__input"
        label="ID"
        disabled
      />

      <v-text-field
        v-model="nameInput"
        :counter="10"
        :rules="nameRules"
        class="form__input"
        label="Name"
        required
      />

      <v-text-field
        v-model="sumInput"
        :rules="sumRules"
        class="form__input"
        label="Sum"
        type="number"
        required
      />

      <v-menu
        v-model="isDateMenuOpened"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="selectedDate"
            label="Expense date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            :rules="dateRules"
            required
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="selectedDate"
          @input="isDateMenuOpened = false"
        ></v-date-picker>
      </v-menu>

      <v-menu
        ref="timeMenu"
        v-model="isTimeMenuOpened"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="selectedTime"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="selectedTime"
            label="Expense time"
            prepend-icon="mdi-clock-time-four-outline"
            readonly
            v-bind="attrs"
            v-on="on"
            :rules="timeRules"
            required
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="isTimeMenuOpened"
          v-model="selectedTime"
          full-width
          @click:minute="$refs.timeMenu.save(selectedTime)"
        ></v-time-picker>
      </v-menu>
      <div class="form__buttons">
        <v-btn
          :disabled="!isFormValid"
          color="success"
          class="mr-4"
          type="submit"
        >
          Submit
        </v-btn>

        <v-btn
          color="error"
          class="mr-4"
          @click="resetForm"
        >
          Reset
        </v-btn>
      </div>
    </v-form>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, useContext, watch } from '@nuxtjs/composition-api';
import postExpense from '@/api/postExpense';
import patchExpense from '@/api/patchExpense';
import dayjs from 'dayjs';
import { ExpenseType } from '~/types/expense';

export enum ExpenseFormModeType {
  create = 'create',
  edit = 'edit',
}

export default defineComponent({
  name: 'ExpenseForm',
  props: {
    mode: {
      type: String as PropType<ExpenseFormModeType>,
      default: 'create'
    },
    id: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: '',
    },
    sum: {
      type: Number,
      default: 0,
    },
    expenseAt: {
      type: String,
      defalt: '2022-01-01 00:00',
    }
  },
  emits: ['submit', 'reset'],
  setup(props, { emit }) {
    const { $axios, $toast } = useContext();
    const formRef: any = ref(null);
    const isFormValid = ref(false);

    const idInput = ref(props.id);

    const nameInput = ref(props.name);
    const nameRules = [
      (v: string) => !!v || 'Name is required',
      (v: string) => (v && v.length <= 10) || 'Name must be less than 10 characters',
    ];

    const sumInput = ref(props.sum);
    const sumRules = [
      (v: number) => !!v || 'Sum is required',
      (v: number) => (v > 0) || 'Sum must be positive',
    ];

    const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
    const isDateMenuOpened = ref(false);
    const dateRules = [
      (v: Date) => !!v || 'Date is required',
    ];

    const selectedTime = ref(dayjs().format('hh:mm'));
    const isTimeMenuOpened = ref(false);
    const timeRules = [
      (v: Date) => !!v || 'Time is required',
    ];

    const isEditMode = computed(() => props.mode === ExpenseFormModeType.edit);
    const computedTitle = computed(() => isEditMode.value ? 'Измененить расход' : 'Добавить расход')
    const computedToastMsg = computed(() => isEditMode.value ? 'Позиция изменена' : 'Позиция добавлена')
    const computedExpenseAt = computed(() => `${selectedDate.value} ${selectedTime.value}`)

    const setFormData = () => {
      idInput.value = props.id;
      nameInput.value = props.name
      sumInput.value = props.sum
      selectedDate.value = dayjs(props.expenseAt).format('YYYY-MM-DD');
      selectedTime.value = dayjs(props.expenseAt).format('hh:mm');
      formRef.value.resetValidation();
    }

    watch(() => props.id, () => {
      if (!isEditMode.value) {
        return;
      }
      setFormData();
    });

    watch(() => isEditMode.value, () => {
      if (!isEditMode.value) {
        return;
      }
      setFormData();
    });

    const trimZeros = (value: any) => +(value.toString().trimEnd('0'));

    const onSubmit = async() => {
      await formRef.value.validate();
      if (!isFormValid.value) {
        return;
      }

      const payload = {
        name: nameInput.value,
        sum: trimZeros(sumInput.value),
        expense_at: computedExpenseAt.value,
      };

      const submitMap = {
        'create': async (payload: ExpenseType) => postExpense($axios, payload),
        'edit': async (payload: ExpenseType) => patchExpense($axios, props.id, payload),
      }

      const { success } = await submitMap[props.mode](payload);
      if (!success) {
        resetForm();
        return;
      }

      $toast.success(computedToastMsg.value)
      emit('submit');
      // resetForm();
    }
    const resetForm = () => {
      formRef.value.reset();
      emit('reset');
    }

    return {
      formRef,
      onSubmit,
      resetForm,
      isFormValid,
      idInput,
      nameInput,
      nameRules,
      sumInput,
      sumRules,
      selectedDate,
      isDateMenuOpened,
      dateRules,
      selectedTime,
      isTimeMenuOpened,
      timeRules,
      computedTitle,
      computedExpenseAt,
      isEditMode
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/mixins.scss";
.form {
  width: 100%;
  padding: 20px;
  border-radius: 8px;
  background: whitesmoke;
  @include box-shadow(0px 2px 4px rgba(0, 0, 0, 0.1));

  &__title {
    margin-bottom: 20px;
  }
  &__buttons {
    margin-top: 20px;
  }
  &__input {
    margin-bottom: 20px;
  }
}
</style>
