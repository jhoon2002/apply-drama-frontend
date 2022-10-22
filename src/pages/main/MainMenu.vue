<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const menus1 = [
    {
        name: '사업 등록',
        path: '/task/form',
        icon: 'las la-pen',
    },
    {
        name: '사업 조회',
        path: '/task/list',
        icon: 'las la-th-list',
    },
]
const menus2 = [
    {
        name: '개발 목록',
        path: '/dev/list',
        icon: 'las la-tasks',
    },
    {
        name: '스타일 가이드',
        path: '/dev/design',
        icon: 'las la-brush',
    },
]
// console.log('route', route.path)
const btnColor = 'cyan-8'
const activeColor = 'grey-2'
const inactiveColor = 'grey-9'
</script>
<template>
    <div class="row q-gutter-x-sm items-center">
        <!--<q-btn
            label="사업등록"
            unelevated
            color="blue-grey"
            text-color="grey-1"
            class="j-btn-md"
            size="1rem"
            @click="router.push('/task/form')"
        />-->
        <q-btn
            label="사업등록"
            :flat="route.path !== '/task/form'"
            :unelevated="route.path === '/task/form'"
            :color="btnColor"
            :text-color="route.path === '/task/form' ? activeColor : inactiveColor"
            size="1rem"
            class="j-btn-menu"
            @click="router.push('/task/form')"
        />
        <q-btn
            label="사업"
            :flat="route.path !== '/task/list'"
            :unelevated="route.path === '/task/list'"
            :color="btnColor"
            :text-color="route.path === '/task/list' ? activeColor : inactiveColor"
            size="1rem"
            class="j-btn-menu"
            @click="router.push('/task/list')"
        />
        <q-btn
            label="연구원"
            :flat="route.path !== '/task/staff'"
            :unelevated="route.path === '/task/staff'"
            :color="btnColor"
            :text-color="route.path === '/task/staff' ? activeColor : inactiveColor"
            size="1rem"
            class="j-btn-menu"
            @click="router.push('/task/staff')"
        />
        <q-btn
            label="산출물"
            :flat="route.path !== '/task/file'"
            :unelevated="route.path === '/task/file'"
            :color="btnColor"
            :text-color="route.path === '/task/file' ? activeColor : inactiveColor"
            size="1rem"
            class="j-btn-menu"
            @click="router.push('/task/file')"
        />
        <q-btn
            label="담당자"
            :flat="route.path !== '/task/manager'"
            :unelevated="route.path === '/task/manager'"
            :color="btnColor"
            :text-color="route.path === '/task/manager' ? activeColor : inactiveColor"
            size="1rem"
            class="j-btn-menu"
            @click="router.push('/task/manager')"
        />
        <q-separator vertical />
        <q-btn-dropdown
            label="관리자"
            :flat="route.path.indexOf('/admin/') < 0"
            :unelevated="route.path.indexOf('/admin/') >= 0"
            :color="btnColor"
            :text-color="route.path.indexOf('/admin/') >= 0 ? activeColor : inactiveColor"
            size="1rem"
            class="j-btn-dropdown-menu"
        >
            <q-list>
                <q-item clickable v-close-popup @click="router.push('/admin/user')">
                    <q-item-section>
                        <q-item-label>사용자</q-item-label>
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="router.push('/admin/sponsor')">
                    <q-item-section>
                        <q-item-label>지원기관</q-item-label>
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="router.push('/admin/code')">
                    <q-item-section>
                        <q-item-label>코드</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-btn-dropdown>
        <q-separator vertical />
        <q-btn-dropdown
            label="개발 관련"
            :flat="route.path.indexOf('/dev/') < 0"
            :unelevated="route.path.indexOf('/dev/') >= 0"
            :color="btnColor"
            :text-color="route.path.indexOf('/dev/') >= 0 ? activeColor : inactiveColor"
            size="1rem"
            class="j-btn-dropdown-menu"
        >
            <q-list>
                <q-item clickable v-close-popup @click="router.push('/dev/env')">
                    <q-item-section>
                        <q-item-label>개발 환경</q-item-label>
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="router.push('/dev/list')">
                    <q-item-section>
                        <q-item-label>개발 주요 내용</q-item-label>
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="router.push('/dev/design')">
                    <q-item-section>
                        <q-item-label>스타일 가이드</q-item-label>
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="router.push('/dev/main')">
                    <q-item-section>
                        <q-item-label>메인(개발)</q-item-label>
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="router.push('/dev/info')">
                    <q-item-section>
                        <q-item-label>프로그램 정보</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-btn-dropdown>
    </div>
</template>
