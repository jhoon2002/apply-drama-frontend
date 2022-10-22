<script setup>
import JSelect from '@/components/form/select/JSelect.vue'
import QSelect from '@/components/form/select/QSelect.js'
import { ref } from 'vue'
import http from 'src/api/http'
import RequiredSign from '@/components/form/RequiredSign.vue'
const staff = ref(null)
const staffs = ref([])
const isArrowDown = ref(false)
const keydownHandler = e => {
    isArrowDown.value = e.key === 'ArrowDown'
}
const keyupHandler = e => {
    isArrowDown.value = false
}
async function getUsers(val, update, abort) {
    /*
     * 한글 조어 중인 경우, input 를 [↓화살표]로 빠져나올때 filter 함수를 다시 호출하는 문제점 발생
     * 즉, 필터 함수 내 + isArrowDown 이라면 한글 입력 상태를 의미
     */
    if (isArrowDown.value) {
        update(
            () => {},
            ref => {
                ref.setOptionIndex(0)
                ref.moveOptionSelection(1, true) //첫번째 아이템으로 커서 이동
            },
        )
        return
    }

    try {
        const { data: items } = await http.get('/api/users/login-id_name/' + val)
        staffs.value = items.map(item => ({
            userId: item.userId,
            nameAndBirthday: item.name + '(' + item.birthday.substring(2, 4) + item.birthday.substring(5, 7) + ')',
        }))
        update(
            () => {
                if (val === '') {
                    staffs.value = []
                }
            },
            ref => {
                ref.setOptionIndex(-1)
                ref.moveOptionSelection(1, true) //첫번재 아이템으로 커서 이동
            },
        )
    } catch (e) {
        abort()
    }
}
</script>
<template>
    <div class="row q-col-gutter-lg">
        <div class="col-6">
            <q-card>
                <q-card-section>
                    <j-select
                        ref="sponsorsRef"
                        filled
                        label="사용자"
                        hint="검색어 입력 시, 자동 검색"
                        v-model="staff"
                        :options="staffs"
                        :option-value="item => item.userId"
                        :option-label="item => item.nameAndBirthday"
                        use-input
                        :input-debounce="0"
                        hide-dropdown-icon
                        no-error-icon
                        @keydown="keydownHandler"
                        @keyup="keyupHandler"
                        @filter="getUsers"
                    />
                </q-card-section>
            </q-card>
        </div>
        <div class="col-6">
            <q-card>
                <q-card-section>
                    <!--<q-select label="목록" :options="options" v-model="value" />-->
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>
