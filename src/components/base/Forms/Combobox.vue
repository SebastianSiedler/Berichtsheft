<template>
  <q-select
    v-bind="$attrs"
    label="Template"
    :options="items"
    :option-value="props.optionValue"
    :option-label="props.optionLabel"
    map-options
    emit-value
    @filter="filterFn"
    input-debounce="0"
    lazy-rules
    :modelValue="modelValue"
    @update:modelValue="updateValue"
    use-chips
    ><template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> No results </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts" setup>
import { toRefs, ref } from 'vue';

const props = defineProps({
  items: {
    required: true,
    type: Array,
  },
  optionLabel: {
    required: true,
    type: String,
  },
  optionValue: {
    required: true,
    type: String,
  },

  // Für das v-model bzw. das Was aus dem Array alles selected Wurd
  modelValue: {
    required: true,
  },
});

const { items: originalItems } = toRefs(props);

const items = ref(originalItems.value);

/**
 * To Use Input Field for Search Menu
 */

type voidFn = () => void;
type doneFn = (a: voidFn) => void;

const filterFn = (val: string, update: doneFn) => {
  update(() => {
    if (val === '') {
      items.value = props.items;
    } else {
      const needle = val.toLowerCase();
      items.value = props.items.filter(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        (v) => v[props.optionValue].toLowerCase().indexOf(needle) > -1
      );
    }
  });
};

const emit = defineEmits(['update:modelValue']);

const updateValue = (e: string | Array<string>) => {
  emit('update:modelValue', e);
};
</script>
