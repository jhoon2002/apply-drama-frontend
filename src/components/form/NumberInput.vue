<script>
import { numToKorean } from 'num-to-korean'
import RequiredSign from '@/components/form/RequiredSign.vue'
import { Field as VeeField } from 'vee-validate'
import { computed, ref } from 'vue'
export default {
    name: 'NumberInput',
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
        value: {
            type: [String, Number],
            default: '0',
        },
        hintEnable: {
            type: Boolean,
            default: true,
        },
        hintAppend: {
            type: String,
            default: '원',
        },
        hintPrepend: {
            type: String,
            default: '',
        },
        prefix: {
            type: String,
            default: '',
        },
        suffix: {
            type: String,
            default: '원',
        },
    },
    setup(props) {
        const numKorean = number => {
            if (!number) number = '0'
            const n = number.replaceAll(',', '')
            if (!props.hintEnable) return ''
            return props.hintPrepend + numToKorean(Number(n), 'mixed') + props.hintAppend
        }
        const rmvComma = val => {
            if (!val) return ''
            return val.replace(/[^0-9]/g, '')
        }
        const addComma = val => {
            if (!val) return ''
            return Number(val.replace(/[^0-9]/g, '')).toLocaleString('ko-KR')
        }

        // const handleKey = event => {
        //     let key = event.keyCode
        //     console.log('key', key)
        //     // if (
        //     //     !(
        //     //         key == 8 ||
        //     //         key == 9 ||
        //     //         key == 13 ||
        //     //         key == 46 ||
        //     //         key == 144 ||
        //     //         (key >= 48 && key <= 57) ||
        //     //         key == 110 ||
        //     //         key == 190 ||
        //     //         (key >= 96 && key <= 105)
        //     //     )
        //     // ) {
        //     //     event.preventDefault()
        //     // }
        // }

        // const limitKey = (event, aaa) => {
        //     console.log(event, aaa)
        // }

        return { numKorean, rmvComma, addComma }
    },
}
</script>
<template>
    <div>
        <vee-field :name="$props.name" :rules="$props.rules" v-slot="{ field, handleChange, errorMessage, errors }">
            <q-input
                :standout="$props.standout"
                :outlined="$props.outlined"
                :dense="$props.dense"
                :label="$props.name"
                maxlength="18"
                hide-bottom-space
                :hint="numKorean(field.value)"
                :prefix="prefix"
                :suffix="suffix"
                :error="errors.length > 0"
                :error-message="errorMessage"
                no-error-icon
                :model-value="addComma(field.value)"
                @update:model-value="handleChange(rmvComma($event))"
            >
                <template v-slot:label> {{ name }} <required-sign v-if="rules.required" /> </template>
            </q-input>
        </vee-field>
    </div>
</template>
