<script setup>
import { numToKorean } from 'num-to-korean'
import RequiredSign from '@/components/form/RequiredSign.vue'
import { ref } from 'vue'

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    outlined: {
        type: Boolean,
    },
    standout: {
        type: Boolean,
    },
    dense: {
        type: Boolean,
    },
    hintEnable: {
        type: Boolean,
        default: true,
    },
    hintAppend: {
        type: String,
        default: '원',
    },
    hintPrepend: {
        type: String,
        default: '',
    },
    prefix: {
        type: String,
        default: null,
    },
    suffix: {
        type: String,
        default: '원',
    },
    error: {
        type: Boolean,
        default: false,
    },
    errorMessage: {
        type: String,
    },
    requiredSign: {
        type: Boolean,
        default: false,
    },
    requiredIcon: {
        type: String,
        default: 'las la-asterisk',
    },
    noErrorIcon: {
        type: Boolean,
        default: false,
    },
})

const numKorean = number => {
    if (!number) number = '0'
    const n = number.replaceAll(',', '')
    if (!props.hintEnable) return ''
    return props.hintPrepend + numToKorean(Number(n), 'mixed') + props.hintAppend
}
const rmvComma = val => {
    if (!val) return ''
    return val.replace(/[^0-9]/g, '')
}
const addComma = val => {
    if (!val) return ''
    return Number(val.replace(/[^0-9]/g, '')).toLocaleString('ko-KR')
}

const modelValue = ref(null)
</script>
<template>
    <div>
        <q-input
            v-bind="$props"
            maxlength="18"
            :hint="numKorean(modelValue)"
            :model-value="addComma(modelValue)"
            @update:model-value=";(modelValue = $event), $emit('update:model-value', rmvComma($event))"
        >
            <template v-slot:label>
                {{ $props.label }}
                <required-sign :name="$props.requiredIcon" v-if="$props.requiredSign" />
            </template>
        </q-input>
    </div>
</template>
