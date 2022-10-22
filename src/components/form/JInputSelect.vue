<script setup>
import VueSelect from '@/components/vue-select/VSelect.vue'
import { useField } from 'vee-validate'

defineEmits(['search'])
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    options: {
        type: Array,
        default: () => [],
        // required: true,
    },
    rules: {
        type: Object,
        required: true,
    },
})

const { value, errorMessage } = useField('selectValue', props.rules)
</script>
<template>
    <div>
        <vue-select
            outlined
            name="이름"
            v-model="value"
            :options="props.options"
            :error="!!errorMessage"
            :validate-error-message="errorMessage"
            :clearable="false"
            no-error-icon
            @search="$emit('search', $event)"
        />
    </div>
</template>
