<script>
export default {
    props: {
        compoVueColor: {
            type: String,
            default: '컴포넌트.props(.vue)',
        },
        compoVueSize: Number,
        compoVueFeatures: [String, Number],
    },
}
</script>
<template>
    <div>Props 제공을 위한 예시 컴포</div>
</template>
