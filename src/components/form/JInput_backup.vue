<script>
import RequiredSign from '@/components/form/RequiredSign.vue'
import { onMounted, ref } from 'vue'

export default {
    name: 'JInput',
    components: {
        RequiredSign,
    },
    /*props: {
        label: {
            type: String,
            required: true,
        },
        outlined: {
            type: Boolean,
            default: false,
        },
        standout: {
            type: Boolean,
        },
        filled: {
            type: Boolean,
        },
        dense: {
            type: Boolean,
        },
        maxlength: {
            type: String,
        },
        stackLabel: {
            type: Boolean,
        },
        type: {
            type: String,
        },
        inputStyle: {
            type: String,
        },
        inputClass: {
            type: String,
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
        disable: {
            type: Boolean,
            default: false,
        },
        modelValue: {
            type: String,
        },
        autofocus: {
            type: Boolean,
            default: false,
        },
    },*/
    setup(props, { emit }) {
        // const { value } = useField(props.label)
        const inputRef = ref(null)

        onMounted(() => {
            const el = inputRef.value.getNativeElement()
            el.addEventListener('input', e => {
                // handleChange(e, true)
                emit('update:model-value', e.target.value)
            })
        })

        return {
            inputRef,
            // value,
        }
    },
}
</script>
<template>
    <!--<div style="min-height: 76px">-->
    <q-input ref="inputRef" v-bind="$attrs">
        <!--
                hide-bottom-space
                no-error-icon
                :model-value="$props.modelValue"
                :autofocus="$props.autofocus"
                :error="!!$props.errorMessage"
                @update:model-value="$emit('update:model-value', $event)"
            -->
        <template v-slot:label>
            {{ $attrs.label }}
            <required-sign
                :name="$attrs.requiredIcon"
                v-if="$attrs['required-sign'] || $attrs['required-sign'] === ''"
            />
        </template>
        <template v-slot:append><slot name="append" /></template>
    </q-input>
    <!--</div>-->
</template>
