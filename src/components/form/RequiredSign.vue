<template>
    <q-icon :name="$props.name" color="pink-6" style="font-size: 0.8rem" class="q-mb-xs" />
</template>
<script>
export default {
    name: 'RequiredSign',
    props: {
        name: {
            type: String,
            default: 'las la-asterisk',
        },
    },
}
</script>
