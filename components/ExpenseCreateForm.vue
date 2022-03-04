<template>
  <v-app>
    <v-form
      ref="form"
      class="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-model="name"
        :counter="10"
        :rules="nameRules"
        label="Name"
        required
      />

      <v-text-field
        v-model="sum"
        :rules="sumRules"
        label="Sum"
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
            label="Picker in menu"
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
          @click:minute="$refs.timeMenu.save(time)"
        ></v-time-picker>
      </v-menu>

      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="onSubmit"
      >
        Submit
      </v-btn>

      <v-btn
        color="error"
        class="mr-4"
        @click="onReset"
      >
        Reset
      </v-btn>
    </v-form>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'ExpenseCreateForm',
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
  setup(props) {
    const form: any = ref(null);
    const valid = ref(true);
    const nameRules = [
      (v: string) => !!v || 'Name is required',
      (v: string) => (v && v.length <= 10) || 'Name must be less than 10 characters',
    ];

    const sumRules = [
      (v: number) => !!v || 'Sum is required',
      (v: number) => (v > 0) || 'Sum must be positive',
    ];

    const selectedDate = ref((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10));
    const isDateMenuOpened = ref(false);
    const dateRules = [
      (v: Date) => !!v || 'Date is required',
    ];

    const selectedTime = ref('00:00');
    const isTimeMenuOpened = ref(false);
    const timeRules = [
      (v: Date) => !!v || 'Time is required',
    ];


    const computedExpenseAt = computed(() => `${selectedDate.value} ${selectedTime.value}`)

    const onSubmit = () => form.value.validate();
    const onReset = () => form.value.reset();

    return {
      form,
      onSubmit,
      onReset,
      valid,
      nameRules,
      sumRules,
      selectedDate,
      isDateMenuOpened,
      dateRules,
      selectedTime,
      isTimeMenuOpened,
      timeRules,
      computedExpenseAt
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
}
</style>
