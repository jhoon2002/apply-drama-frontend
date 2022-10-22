<script>
import RequiredSign from '@/components/form/RequiredSign.vue'
import { Field as VeeField } from 'vee-validate'

export default {
    name: 'DateInput',
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
        rules: {
            type: Object,
            required: true,
        },
    },
    setup() {
        return {}
    },
}
</script>

<template>
    <div style="min-height: 76px">
        <vee-field :name="$props.name" :rules="$props.rules" v-slot="{ field, handleChange, errorMessage, errors }">
            <q-input
                :standout="$props.standout"
                :outlined="$props.outlined"
                :dense="$props.dense"
                :label="$props.name"
                hide-bottom-space
                :error="errors.length > 0"
                :error-message="errorMessage"
                no-error-icon
                input-style="letter-spacing: 2px"
                :model-value="field.value"
                @update:model-value="handleChange"
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
                                :model-value="field.value"
                                @update:model-value="handleChange"
                            >
                                <div class="row items-center justify-end" style="margin-top: -40px">
                                    <q-btn v-close-popup label="닫기" color="primary" flat />
                                </div>
                            </q-date>
                        </q-popup-proxy>
                    </q-icon>
                </template>
                <template v-slot:label> {{ $props.name }} <required-sign v-if="rules.required" /> </template>
            </q-input>
        </vee-field>
    </div>
</template>
