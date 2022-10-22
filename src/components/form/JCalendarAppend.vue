<script setup>
import { ref } from 'vue'

const props = defineProps({
    title: {
        type: String,
        required: true,
        default: '',
    },
})
const value = ref(null)
</script>
<template>
    <q-icon name="las la-calendar" class="cursor-pointer">
        <q-popup-proxy ref="qDateProxy" :breakpoint="600" transition-show="scale" transition-hide="scale">
            <q-date
                mask="YYYY-MM-DD"
                :title="props.title"
                subtitle="날짜 선택"
                v-model="value"
                @update:model-value="$emit('update:model-value', $event)"
            >
                <div class="row items-center justify-end" style="margin-top: -40px">
                    <q-btn v-close-popup label="닫기" color="primary" flat />
                </div>
            </q-date>
        </q-popup-proxy>
    </q-icon>
</template>
