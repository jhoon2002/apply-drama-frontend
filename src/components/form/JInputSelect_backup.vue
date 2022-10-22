<script setup>
import VueSelect from '@/components/vue-select/VSelect.vue'
import { useField } from 'vee-validate'
import { ref } from 'vue'

defineEmits(['search'])
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    options: {
        type: Array,
        default: () => [],
        // required: true,
    },
    rules: {
        type: Object,
        required: true,
    },
})

const { value, errorMessage } = useField('selectValue', props.rules)
const isFocus = ref(false)
const Deselect = {
    render: () => null, //삭제(X) 아이콘 사용 안함
    // h(QIcon, { name: 'bi-x', size: 'sm', style: { position: 'absolute', right: 0, top: 0, }, }),
}
const OpenIndicator = {
    render: () => null, //화살표 목록 아이콘 사용 안함
}
// ['구글', '페이스북', '애플', '트위터', '아이러브스쿨', '카카오톡', '유투브']
</script>
<template>
    <div>
        <vue-select
            v-model="value"
            :options="props.options"
            :components="{ Deselect, OpenIndicator }"
            class="col-5"
            @search="$emit('search', $event)"
        >
            <template v-slot:search="{ attributes, events }">
                <div>
                    {{ $props.name }}
                </div>
                <input class="vs__search" v-bind="attributes" v-on="events" />
            </template>
            <template v-slot:selected-option-container="{ option }">
                <div style="display: flex; align-items: baseline; margin: 24px 0 0 9px; color: #212121">
                    {{ option.label }}
                </div>
            </template>
            <template #spinner="{ loading }">
                <q-spinner-hourglass v-if="loading" color="grey" size="1.5em" />
            </template>
            <template v-slot:no-options="{ search, searching }">
                <template v-if="searching"> '{{ search }}'에 해당하는 데이터가 없습니다. </template>
                <template v-else> 검색어(이름) 입력.. </template>
            </template>
        </vue-select>
        <div class="error-message">{{ errorMessage }}</div>
    </div>
</template>
