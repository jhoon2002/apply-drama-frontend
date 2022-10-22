<script>
import { Field as VeeField } from 'vee-validate'
export default {
    name: 'RadioInput',
    components: {
        VeeField,
    },
    props: {
        name: {
            type: String,
            required: true,
        },
        items: {
            type: Array,
            required: true,
        },
        inline: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const options = props.items.map(item => ({
            ...item,
            checkedIcon: 'bi-check-circle-fill',
            uncheckedIcon: 'bi-circle',
            color: 'deep-orange',
        }))

        return {
            options,
        }
    },
}
</script>
<template>
    <vee-field :name="$props.name" :rules="$props.rules" v-slot="{ field, handleChange }">
        <q-option-group
            :options="options"
            :inline="$props.inline"
            :model-value="field.value"
            size="35px"
            @update:model-value="handleChange"
        >
            <template v-slot:label="opt">
                <span
                    class="text-body1"
                    :class="field.value === opt.value ? 'text-grey-8 text-weight-bold' : 'text-grey'"
                >
                    {{ opt.label }}
                </span>
            </template>
        </q-option-group>
    </vee-field>
</template>
