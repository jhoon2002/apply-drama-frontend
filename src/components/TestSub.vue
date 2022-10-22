<script setup>
import { ref, useAttrs, useSlots } from 'vue'

const name = ref('여종훈')
const phone = ref('010-7779-9790')
const height = ref('170cm')

console.log(useAttrs())
console.log(useSlots().value)

defineExpose({
    name,
    phone,
})
</script>
