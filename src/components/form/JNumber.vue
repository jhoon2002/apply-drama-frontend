<script setup>
import { numToKorean } from 'num-to-korean'
import RequiredSign from '@/components/form/RequiredSign.vue'
import { computed, ref, toRefs, useAttrs, watch } from 'vue'

const attrs = useAttrs()

const props = defineProps({
    korean: {
        type: Boolean,
        default: true,
    },
    koreanPrepend: {
        type: String,
        default: '', //ex 금
    },
    koreanAppend: {
        type: String,
        default: '원',
    },
    requiredSign: {
        type: Boolean,
        default: false,
    },
    requiredIcon: {
        type: String,
        default: 'las la-asterisk',
    },
})

const numKorean = number => {
    if (!number) number = '0'
    const n = number.replaceAll(',', '')
    if (!props.korean) return ''
    return props.koreanPrepend + numToKorean(Number(n), 'mixed') + props.koreanAppend
}
const rmvComma = val => {
    if (!val) return ''
    return val.replace(/[^0-9]/g, '')
}
const addComma = val => {
    if (!val) return ''
    return Number(val.replace(/[^0-9]/g, '')).toLocaleString('ko-KR')
}

// const { modelValue } = toRefs(attrs)
// watch(modelValue, val => {
//     value.value = val
// })
const valueb = ref('')
const value = computed({
    get: () => {
        console.log('get 실행..')
        return addComma(valueb.value)
    },
    set: val => {
        console.log('set 실행..')
        return rmvComma(val)
    },
})
</script>
<template>
    <div>
        <!--value: {{ value }} $attrs: {{ $attrs }}-->
        <q-input
            v-bind="$attrs"
            :model-value="value"
            @update:model-value=";(valueb = $event), $emit('update:model-value', value)"
        >
            <template v-slot:label>
                {{ $attrs.label }}
                <required-sign :name="props.requiredIcon" v-if="props.requiredSign" />
            </template>
        </q-input>
    </div>
</template>
