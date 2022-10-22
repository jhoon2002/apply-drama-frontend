<template>
    <div>
        <vee-field :name="$props.name" :rules="$props.rules" v-slot="{ field, errorMessage, errors }">
            <!--본래 v-model="date" 이어야 하나 vee-validate의 values와 연계를 위해 이를 삭제하고 :model-value="$props.modelValue"를 넣음-->
            <q-input
                :standout="$props.standout"
                :outlined="$props.outlined"
                :dense="$props.dense"
                mask="####-##-##"
                :label="$props.name"
                :error="errors.length > 0"
                :error-message="errorMessage"
                no-error-icon
                v-bind="field"
                :model-value="$props.modelValue"
                @update:model-value="$emit('update:modelValue', $event)"
            >
                <template v-slot:append>
                    <!--<q-icon v-if="date" name="close" @click="date = ''" class="cursor-pointer j-fade-in" />-->
                    <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                            <q-date
                                mask="YYYY-MM-DD"
                                :title="$props.name"
                                subtitle="날짜 선택"
                                v-bind="field"
                                :model-value="$props.modelValue"
                                @update:model-value="$emit('update:modelValue', $event)"
                            >
                                <div class="row items-center justify-end">
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

<script>
import RequiredSign from '@/components/form/RequiredSign.vue'
// import { ref } from 'vue'
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
        modelValue: {
            type: String,
        },
    },
    // setup(props) {
    //     return {
    //         date: ref(props.modelValue),
    //     }
    // },
}
</script>
