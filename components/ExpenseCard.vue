<template>
  <v-card
    class="mx-auto"
    max-width="400"
  >
    <v-card-text>
      <div class="card-field">
        <span>id:</span>
        <span>
          {{id}}
        </span>
      </div>
      <div class="card-field">
        <span>name:</span>
        <span>
          {{name}}
        </span>
      </div>
      <div class="card-field">
        <span>sum:</span>
        <span>
          {{sum}}
        </span>
      </div>
      <div class="card-field">
        <span>expanse_at:</span>
        <span>
          {{expanseAt}}
        </span>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        text
        color="deep-purple accent-4"
      >
        Edit
      </v-btn>

      <v-btn
        text
        color="red darken-2"
      >
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'ExpenseCard',
  props: {
    id: {
      type: String,
      default: undefined,
    },
    name: {
      type: String,
      default: '',
    },
    sum: {
      type: String,
      default: 0,
    },
    expenseAt: {
      type: String,
      defalt: undefined,
    }
  },
  setup() {
    
    return {

    };
  },
});
</script>

<style lang="scss" scoped>
.card-field {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
