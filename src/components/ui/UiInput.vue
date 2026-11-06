<script setup lang="ts">
export interface UiInputProps {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: string
  hint?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

withDefaults(defineProps<UiInputProps>(), {
  modelValue: '',
  label: undefined,
  placeholder: '',
  type: 'text',
  hint: undefined,
  error: undefined,
  size: 'md',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <label class="flex flex-col gap-1.5 w-full">
    <span v-if="label" class="label-text">
      {{ label }}
    </span>
    <div class="relative flex items-center">
      <div
        v-if="$slots['icon-left']"
        class="pointer-events-none absolute left-3.5 text-base-content/45"
      >
        <slot name="icon-left" />
      </div>
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="input input-bordered"
        :class="[
          $slots['icon-left'] ? 'pl-10' : '',
          $slots['icon-right'] ? 'pr-10' : '',
          size === 'sm' ? 'input-sm' : '',
          size === 'lg' ? 'input-lg' : '',
          error ? 'input-error' : '',
        ]"
        @input="onInput"
      />
      <div
        v-if="$slots['icon-right']"
        class="absolute right-3.5 text-base-content/45"
      >
        <slot name="icon-right" />
      </div>
    </div>
    <span v-if="error" class="text-xs font-medium text-error">
      {{ error }}
    </span>
    <span v-else-if="hint" class="label-text-alt">
      {{ hint }}
    </span>
  </label>
</template>
