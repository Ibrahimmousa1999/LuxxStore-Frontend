<template>
  <div class="lux-select-wrapper">
    <label v-if="label" class="lux-select-label">{{ label }}</label>
    <v-select
      v-model="internalValue"
      :options="options"
      :placeholder="placeholder"
      :searchable="searchable"
      :clearable="clearable"
      :multiple="multiple"
      :reduce="reduce"
      :label="optionLabel"
      :disabled="disabled"
      class="lux-select"
      :class="{ 'has-error': error }"
    >
      <template #open-indicator="{ attributes }">
        <span v-bind="attributes" class="select-arrow">▼</span>
      </template>
      <template #no-options>
        <span style="color:var(--text-muted);font-size:13px">No options available</span>
      </template>
    </v-select>
    <div v-if="error" class="lux-select-error">{{ error }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object, Array],
    default: null
  },
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select...'
  },
  searchable: {
    type: Boolean,
    default: true
  },
  clearable: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  reduce: {
    type: Function,
    default: (option) => option.value
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<style>
/* Vue Select Custom Styling */
.lux-select-wrapper {
  width: 100%;
}

.lux-select-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.lux-select .vs__dropdown-toggle {
  background: var(--surface);
  border: 1px solid var(--border-white);
  border-radius: 10px;
  padding: 8px 12px;
  min-height: 44px;
  transition: all 0.2s;
}

.lux-select.has-error .vs__dropdown-toggle {
  border-color: var(--danger);
}

.lux-select .vs__dropdown-toggle:hover {
  border-color: var(--gold);
}

.lux-select.vs--open .vs__dropdown-toggle {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.1);
}

.lux-select .vs__selected {
  color: var(--text);
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  padding: 0;
  border: none;
}

.lux-select .vs__search {
  color: var(--text);
  font-size: 14px;
  margin: 0;
  padding: 0;
}

.lux-select .vs__search::placeholder {
  color: var(--text-dim);
}

.lux-select .vs__actions {
  padding: 0;
}

.lux-select .select-arrow {
  font-size: 10px;
  color: var(--gold);
  transition: transform 0.2s;
}

.lux-select.vs--open .select-arrow {
  transform: rotate(180deg);
}

.lux-select .vs__clear {
  display: none;
}

.lux-select .vs__dropdown-menu {
  background: var(--surface2);
  border: 1px solid var(--border-gold);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  margin-top: 4px;
  padding: 4px;
  max-height: 250px;
  z-index: 9999;
  position: absolute;
}

.lux-select .vs__dropdown-option {
  color: var(--text-muted);
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  cursor: pointer;
}

.lux-select .vs__dropdown-option--highlight {
  background: rgba(201, 168, 76, 0.1);
  color: var(--gold);
}

.lux-select .vs__dropdown-option--selected {
  background: rgba(201, 168, 76, 0.15);
  color: var(--gold);
  font-weight: 600;
}

.lux-select .vs__no-options {
  padding: 12px;
  text-align: center;
}

/* Multiple select tags */
.lux-select .vs__selected-options {
  flex-wrap: wrap;
  gap: 4px;
}

.lux-select.vs--multiple .vs__selected {
  background: rgba(201, 168, 76, 0.15);
  border: 1px solid var(--border-gold);
  border-radius: 6px;
  padding: 4px 8px;
  margin: 2px;
  color: var(--gold);
  font-size: 12px;
}

.lux-select.vs--multiple .vs__deselect {
  fill: var(--gold);
  margin-left: 4px;
}

.lux-select-error {
  color: var(--danger);
  font-size: 12px;
  margin-top: 4px;
}

/* Disabled state */
.lux-select.vs--disabled .vs__dropdown-toggle {
  background: var(--surface3);
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading state */
.lux-select .vs__spinner {
  border-color: var(--gold) transparent transparent;
}
</style>
