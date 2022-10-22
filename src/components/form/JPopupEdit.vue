<script setup>
import { ref, toRefs, watch } from 'vue'
import { useField, useForm } from 'vee-validate'
import JInput from '@/components/form/JInput.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const emit = defineEmits(['save', 'update:model-value'])

const props = defineProps({
    initialValue: {
        type: String,
        default: '',
    },
    label: {
        type: String,
        required: true,
    },
    rules: {
        type: Object,
        required: true,
    },
    requiredSign: {
        type: Boolean,
        default: false,
    },
    cover: {
        type: Boolean,
        default: false,
    },
    btnLabel: {
        type: String,
        default: '수정',
    },
    icon: {
        type: String,
    },
    offset: {
        type: Array,
        default: () => [0, 0],
    },
    autofocus: {
        type: Boolean,
        default: false,
    },
})
const iv = {
    value: props.initialValue,
}
const { handleSubmit, resetForm } = useForm({
    initialValues: iv,
})
const popupEditRef = ref(null)

const { value, errorMessage, setValue } = useField('value', props.rules, { initialValue: props.initialValue })

const { initialValue } = toRefs(props)
watch(initialValue, val => {
    setValue(val)
})

const onSubmit = handleSubmit(formValues => {
    //변경된 값이 없으면 저장 안함
    if (formValues.value === props.initialValue) {
        $q.notify({
            message: '변경된 값이 없습니다.',
            color: 'negative',
            position: 'top',
            timeout: 1000,
            icon: 'bi-bell-fill',
        })
        return
    }
    emit('save', formValues)
    resetForm()
    popupEditRef.value.hide()
})
</script>
<template>
    <div>
        <!--<q-btn flat round icon="las la-pen" size="xs" class="cursor-pointer" />-->
        <q-btn v-if="props.icon" :icon="props.icon" dense flat size="xs" color="grey-7" />
        <q-btn v-else outline :label="props.btnLabel" size="xs" color="grey-7" />
        <q-popup-edit
            ref="popupEditRef"
            :model-value="value"
            :cover="props.cover"
            :offset="props.offset"
            class="q-pt-md"
        >
            <form @submit="onSubmit">
                <j-input
                    :label="props.label"
                    v-model="value"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    no-error-icon
                    :required-sign="props.requiredSign"
                    :autofocus="props.autofocus"
                    @update:model-value="emit('update:model-value', $event)"
                />
                <div class="row justify-end">
                    <q-btn type="submit" flat label="저장" />
                    <q-btn flat label="닫기" @click="setValue(initialValue), resetForm(), $refs.popupEditRef.hide()" />
                </div>
            </form>
        </q-popup-edit>
    </div>
</template>
