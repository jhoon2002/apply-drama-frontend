<script setup>
import RequiredSign from '@/components/form/RequiredSign.vue'
import { onMounted, ref } from 'vue'
import { QInput } from 'quasar'

// console.log('QInput.props', QInput)

const emit = defineEmits(['update:model-value'])
const props = defineProps({
    requiredSign: {
        type: Boolean,
        default: false,
    },
    requiredIcon: {
        type: String,
        default: 'las la-asterisk',
    },
})

// console.log('this.props', props)
const inputRef = ref(null)

onMounted(() => {
    const el = inputRef.value.getNativeElement()
    el.addEventListener('input', e => {
        emit('update:model-value', e.target.value)
    })
})
</script>
<template>
    <q-input ref="inputRef" v-bind="$attrs">
        <template #label>
            {{ $attrs.label }}
            <required-sign :name="props.requiredIcon" v-if="props.requiredSign" />
        </template>
    </q-input>
</template>
