<script>
import RequiredSign from '@/components/form/RequiredSign.vue'
import { Field as VeeField, useField } from 'vee-validate'
import { onMounted, ref } from 'vue'
export default {
    name: 'TextInput',
    components: {
        VeeField,
        RequiredSign,
    },
    props: {
        name: {
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
        rules: {
            type: Object,
            required: true,
        },
        requiredIcon: {
            type: String,
            default: 'las la-asterisk',
        },
        isRequiredIcon: {
            type: Boolean,
            default: true,
        },
    },
    setup(props) {
        const { handleChange } = useField(props.name, props.rules)
        const inputRef = ref(null)

        onMounted(() => {
            const el = inputRef.value.getNativeElement()
            el.addEventListener('input', e => {
                handleChange(e, true)
            })
        })

        return {
            inputRef,
        }
    },
}
</script>
<template>
    <div style="min-height: 76px">
        <vee-field :name="$props.name" :rules="$props.rules" v-slot="{ field, errorMessage, errors }">
            <q-input
                ref="inputRef"
                :standout="$props.standout"
                :outlined="$props.outlined"
                :dense="$props.dense"
                :label="$props.name"
                :stack-label="$props.stackLabel"
                hide-bottom-space
                :maxlength="$props.maxlength"
                :type="$props.type"
                :error="errors.length > 0"
                :error-message="errorMessage"
                no-error-icon
                :model-value="field.value"
                :input-style="$props.inputStyle"
                :input-class="$props.inputClass"
                ><!--@update:model-value="handleChange"-->
                <template v-slot:label>
                    {{ name }}
                    <required-sign :name="$props.requiredIcon" v-if="rules.required && $props.isRequiredIcon" />
                </template>
                <template v-slot:append><slot name="append" /></template>
            </q-input>
        </vee-field>
    </div>
</template>
