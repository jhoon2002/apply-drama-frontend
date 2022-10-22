<script>
//Plain 컴포넌트(js 버전): 코드, 어시스트 작동
import PropsPlainCompoJs from '@/components/props-test/PropsPlainCompo'

//Plain 컴포넌트(vue 버전): 코드, 어시스트 작동
import PropsPlainCompoVue from '@/components/props-test/PropsPlainCompo.vue'

//일반 js 파일: 코드, 어시스트 작동
import propsFileObject from '@/components/props-test/props-file-object.js'

// 코드 내 오브젝트: 코드, 어시스트 작동
const inCodeProps = {
    inCodeAaa: {
        type: String,
        default: '코드 내 오브젝트',
    },
    inCodeBbb: [Array, Object],
    inCodeCcc: Number,
}

// 코드 내 함수: 코드는 작동 / 어시스트 작동 안함
const inCodeGetProps = () => {
    return {
        inCodeFnXxx: {
            type: String,
            default: '코드 내 함수',
        },
        inCodeFnYyy: [Array, Object],
        inCodeFnZzz: Number,
    }
}

// JSON 파일: 코드는 작동 / 어시스트 작동 안함
import { getPropsType } from '@/api/util'
import json from '@/components/props-test/PropsJson.json'
const PropsJson = {}
// console.log('json.kind >>>>', json)
PropsJson.jsonKind = json.jsonKind
PropsJson.jsonKind.type = getPropsType(json.jsonKind.type)
// zzz['behavior'].type = getPropsType(json.props['behavior'].type)
export default {}
</script>
<script setup>
const props = defineProps({
    ...PropsPlainCompoJs.props,
    ...PropsPlainCompoVue.props,
    ...propsFileObject,
    ...inCodeProps,
    ...inCodeGetProps(),
    ...PropsJson,
})
</script>
<template>
    <div>
        props:
        <pre>{{ props }}</pre>
    </div>
</template>
