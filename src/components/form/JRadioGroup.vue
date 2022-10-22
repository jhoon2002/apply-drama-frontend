<script setup>
import { ref } from 'vue'

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    items: {
        type: Array,
        required: true,
        default: () => [],
    },
    inline: {
        type: Boolean,
        default: false,
    },
    checkedIcon: {
        type: String,
        default: 'bi-check-circle',
    },
    uncheckedIcon: {
        type: String,
        default: 'bi-circle',
    },
    color: {
        type: String,
        default: 'primary',
    },
    modelValue: {},
})
const options = ref(
    props.items.map(item => ({
        ...item,
        checkedIcon: props.checkedIcon,
        uncheckedIcon: props.uncheckedIcon,
        color: props.color,
    })),
)
const value = ref(props.modelValue)
</script>
<template>
    <q-option-group
        :options="options"
        :inline="$props.inline"
        v-model="value"
        size="35px"
        @update:model-value="$emit('update:model-value', $event)"
    >
        <template v-slot:label="opt">
            <span class="text-body1" :class="value === opt.value ? 'text-grey-8 text-weight-bold' : 'text-grey'">
                {{ opt.label }}
            </span>
        </template>
    </q-option-group>
</template>
