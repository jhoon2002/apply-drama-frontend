<script setup>
/**
 * QSelect 의 use-input 사용 시, 한글 입력 문제점을 개선한 버전
 * <개선 내용>
 * (1) filter 검색 시, 자동으로 검색 결과 중 첫번째 아이템에 focus (부모 컴포넌트에서 제어)
 *   => (원인) quasar 는 원래 그럼
 *   => (해결) filter 함수의 update 에서 두번재 파라메터(함수)를 이용하여 검색 결과 중 원하는 아이템을 선택하도록 함
 * (2) 한글 조어 중에는 filter 가 작동하지 않음
 *   => (원인) quasar 는 중국어, 일본어, 한글 입력 경우, 조어가 종료되어야 작동
 *   => (해결) 해당 모듈 찾아서 한글 부분 주석 처리
 * (3) 한글 filter 시, input 를 탈출하기 위해 [↓아래 화살표]를 두번 눌러야 하든가, [↓아래 화살표] 누르면 검색 결과가 갱신(재요청) 되는 문제점 해결
 *   => (원인) 한글 조어 중, [↓아래 화살표]를 누르면 이유 없이 filter 함수를 한번 더 호출
 *   => (해결) filter 함수 내에서 [↓아래 화살표] 입력이 들어오는 경우, filter 함수의 update 에서 두번재 파라메터(함수)를 이용하여 원하는 아이템으로 이동
 */
import QSelect from './QSelect.js'
import { computed, ref, useAttrs } from 'vue'

const props = defineProps({
    ...QSelect.props,
})
const emit = defineEmits(['filter'])
const attrs = useAttrs()
/**
 * isArrowDown 설정
 *  - [↓화살표]를 누르는(down) 경우: TRUE, 떼면(up): FALSE
 *  - 그밖의 경우: FALSE
 */
const isArrowDown = ref(false)
const keydownHandler = e => {
    isArrowDown.value = e.key === 'ArrowDown'
}
const keyupHandler = e => {
    isArrowDown.value = false
}

const filterHandler = (inputValue, update, abort) => {
    /**
     * 본래 이 filter 함수는 input(q-select 에서 use-input) 사용 시, 문자의 입력이 있을 때 호출됨
     * 한편, input 를 [↓아래 화살표] down 하여 빠져나올 때,
     * (1)이때 조어 중인 문자가 한글인 경우는 이 filter 함수를 한번 더 호출하는 문제점
     * (2)영문인 경우는 이 filter 함수를 호출 안함
     *
     * 따라서 필터 함수 내에서 '[↓아래 화살표] down 상태' 로 확인된 경우(isArrowDown === TRUE)는
     * 한글 입력인 경우로 보고 두번째 아이템으로 이동하게 한다.
     */
    if (isArrowDown.value) {
        update(
            () => {}, // update 를 위한 검색을 실행하지 않고,
            ref => {
                ref.setOptionIndex(1) // 두번째 아이템
                ref.moveOptionSelection(0, true) //offset은 0
            },
        )
        return
    }
    // 그 외의 경우는 부모 filter 에서 처리하도록 함
    emit('filter', inputValue, update, abort)
}
const value = ref(null)
</script>
<template>
    <div>
        wind: {{ props.wind }} / windy: {{ props.windy }}
        <q-select
            v-model="value"
            v-bind="{
                ...attrs,
                onKeydown: keydownHandler,
                onKeyup: keyupHandler,
                onFilter: filterHandler,
            }"
        />
    </div>
</template>
