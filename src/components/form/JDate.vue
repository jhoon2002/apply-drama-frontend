<script>
import RequiredSign from '@/components/form/RequiredSign.vue'
import { ref } from 'vue'

export default {
    name: 'DateInput',
    components: {
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
        modelValue: {
            type: String,
        },
    },
    setup() {
        const value = ref()
        return {
            value,
        }
    },
}
</script>

<template>
    <div style="min-height: 76px">
        <q-input
            :standout="$props.standout"
            :outlined="$props.outlined"
            :dense="$props.dense"
            :label="$props.name"
            :error="!!$props.errorMessage"
            :error-message="$props.errorMessage"
            no-error-icon
            input-style="letter-spacing: 2px"
            :model-value="$props.modelValue"
            @update:model-value="$emit('update:model-value', $event)"
            oninput="javascript:
                            try {
                                this.value
                                    = this.value.replace(/[^0-9]/g,'')
                                        .replace(/(\d{4})(\d{2})(\d{2})(\d{0,100})/g, '$1-$2-$3')
                            } catch {}"
        >
            <!--($event === '____-__-__' ? '' : $event)-->
            <template v-slot:append>
                <!--<q-icon v-if="date" name="close" @click="date = ''" class="cursor-pointer j-fade-in" />-->
                <q-icon name="las la-calendar" class="cursor-pointer">
                    <q-popup-proxy
                        ref="qDateProxy"
                        cover
                        :breakpoint="600"
                        transition-show="scale"
                        transition-hide="scale"
                    >
                        <q-date
                            mask="YYYY-MM-DD"
                            :title="$props.name"
                            subtitle="날짜 선택"
                            :model-value="$props.modelValue"
                            @update:model-value="$emit('update:model-value', $event)"
                        >
                            <div class="row items-center justify-end" style="margin-top: -40px">
                                <q-btn v-close-popup label="닫기" color="primary" flat />
                            </div>
                        </q-date>
                    </q-popup-proxy>
                </q-icon>
            </template>
            <template v-slot:label>
                {{ $props.name }}
                <required-sign :name="$props.requiredIcon" v-if="$props.requiredSign" />
            </template>
        </q-input>
    </div>
</template>
