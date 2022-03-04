<template>
  <v-card
    class="mx-auto"
    width="200"
  >
    <v-card-text>
      <div class="card-field">
        <span>id:</span>
        <span>
          {{ id }}
        </span>
      </div>
      <div class="card-field">
        <span>name:</span>
        <span>
          {{ name }}
        </span>
      </div>
      <div class="card-field">
        <span>sum:</span>
        <span>
          {{ sum }}
        </span>
      </div>
      <div class="card-field--date">
        <div>expense_at:</div>
        <span>
          {{ computedDate }}
        </span>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        text
        color="deep-purple accent-4"
        @click="onClickEdit"
      >
        Edit
      </v-btn>

      <v-btn
        text
        color="red darken-2"
        @click="onClickDelete"
      >
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'ExpenseCard',
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
    expenseAt: {
      type: String,
      defalt: undefined,
    }
  },
  emits: ['delete'],
  setup(props, { emit }) {
    const onClickDelete = (): void => {
      emit('delete');
    };

    const onClickEdit = (): void => {
      emit('edit');
    };

    const computedDate = computed(() => {
      return dayjs(props.expenseAt).format('YYYY-MM-DD hh:mm')
    });
    return {
      onClickDelete,
      onClickEdit,
      computedDate,
    };
  },
});
</script>

<style lang="scss" scoped>
.card-field {
  display: flex;
  justify-content: space-between;
  width: 100%;

  &--date {
    flex-direction: column;
    text-align: center;
  }
}
</style>
