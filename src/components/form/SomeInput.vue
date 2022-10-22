<script>
import RequiredSign from '@/components/form/RequiredSign.vue'
import { Field as VeeField } from 'vee-validate'
export default {
    name: 'SomeInput',
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
        },
        standout: {
            type: Boolean,
        },
        dense: {
            type: Boolean,
        },
        rules: {
            type: Object,
            required: true,
        },
    },
}
</script>
<template>
    <vee-field :name="$props.name" :rules="$props.rules" v-slot="{ field, handleChange, errorMessage, errors }">
        {{ field }}
        <q-input
            :standout="$props.standout"
            :outlined="$props.outlined"
            :dense="$props.dense"
            :label="$props.name"
            :error="errors.length > 0"
            :error-message="errorMessage"
            no-error-icon
            @update:model-value="handleChange"
            :model-value="field.value"
        >
            <template v-slot:label> {{ name }} <required-sign v-if="rules.required" /> </template>
        </q-input>
    </vee-field>
</template>
