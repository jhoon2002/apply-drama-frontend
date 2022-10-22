<script>
import { Field as VeeField } from 'vee-validate'
export default {
    name: 'SwitchInput',
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
    },
}
</script>
<template>
    <vee-field :name="$props.name">
        <q-toggle v-for="item in items" :key="item.label" :label="item.label" />
    </vee-field>
</template>
