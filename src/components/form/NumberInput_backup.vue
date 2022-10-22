<script>
import { numToKorean } from 'num-to-korean'
import RequiredSign from '@/components/form/RequiredSign.vue'
import { Field as VeeField } from 'vee-validate'
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
            // type: String,
            type: [String, Number],
            default: '0',
        },
        hintEnable: {
            type: Boolean,
            default: false,
        },
        hintAppend: {
            type: String,
            default: '',
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
            default: '',
        },
        valueWhenIsEmpty: {
            type: String,
            default: '', // "0" or "" or null
        },
        options: {
            type: Object,
            default: function () {
                return {
                    locale: 'ko',
                    prefix: '',
                    suffix: '원',
                    length: 17,
                    precision: 0,
                }
            },
        },
    },
    setup(props) {
        // const { handleChange } = useField()
        // const cmpValue = computed({
        //     get: function () {
        //         return props.value !== null && props.value !== ''
        //             ? humanFormat(props.value.toString())
        //             : props.valueWhenIsEmpty
        //     },
        //     set: function () {
        //         // this.$emit('input', machineFormat(newValue))
        //         emit('update:model-value', handleChange)
        //     },
        // })
        //
        // const humanFormat = function (number) {
        //     if (isNaN(number)) {
        //         number = ''
        //     } else {
        //         number = Number(number).toLocaleString(props.options.locale, {
        //             maximumFractionDigits: props.options.precision,
        //             minimumFractionDigits: props.options.precision,
        //         })
        //     }
        //     return number
        // }
        // const machineFormat = number => {
        //     if (number) {
        //         number = cleanNumber(number)
        //         // Ajustar quantidade de zeros à esquerda
        //         number = number.padStart(parseInt(props.options.precision) + 1, '0')
        //         // Incluir ponto na casa correta, conforme a precisão configurada
        //         number =
        //             number.substring(0, number.length - parseInt(props.options.precision)) +
        //             '.' +
        //             number.substring(number.length - parseInt(props.options.precision), number.length)
        //         if (isNaN(number)) {
        //             number = props.valueWhenIsEmpty
        //         }
        //     } else {
        //         number = props.valueWhenIsEmpty
        //     }
        //     if (props.options.precision === 0) {
        //         number = cleanNumber(number)
        //     }
        //     return number
        // }
        const keyPress = $event => {
            // console.log($event.keyCode); //keyCodes value
            let keyCode = $event.keyCode ? $event.keyCode : $event.which
            // if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
            if (keyCode < 48 || keyCode > 57) {
                // 46 is dot
                $event.preventDefault()
            }
            if (targetLength()) {
                $event.preventDefault()
            }
        }
        // Retira todos os caracteres não numéricos e zeros à esquerda
        const cleanNumber = function (value) {
            let result = ''
            if (value) {
                let flag = false
                let arrayValue = value.toString().split('')
                for (var i = 0; i < arrayValue.length; i++) {
                    if (isInteger(arrayValue[i])) {
                        if (!flag) {
                            // Retirar zeros à esquerda
                            if (arrayValue[i] !== '0') {
                                result = result + arrayValue[i]
                                flag = true
                            }
                        } else {
                            result = result + arrayValue[i]
                        }
                    }
                }
            }
            return result
        }
        const isInteger = value => {
            let result = false
            if (Number.isInteger(parseInt(value))) {
                result = true
            }
            return result
        }
        const targetLength = () => {
            if (Number(cleanNumber(props.value).length) >= Number(props.options.length)) {
                return true
            } else {
                return false
            }
        }
        const numKorean = number => {
            if (!number) number = '0'
            const n = number.replaceAll(',', '')
            if (!props.hintEnable) return ''
            return props.hintPrepend + numToKorean(Number(n), 'mixed') + props.hintAppend
        }

        return { keyPress, numKorean }
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
                hide-bottom-space
                :hint="numKorean(field.value)"
                :prefix="prefix"
                :suffix="suffix"
                :error="errors.length > 0"
                :error-message="errorMessage"
                no-error-icon
                :model-value="field.value"
                @update:model-value="handleChange"
                @keyup="keyPress"
                oninput="javascript:
                            try {
                                this.value = Number(this.value.replaceAll(',','')).toLocaleString('Ko-KR')
                            } catch {}"
            >
                <template v-slot:label> {{ name }} <required-sign v-if="rules.required" /> </template>
            </q-input>
        </vee-field>
    </div>
</template>
