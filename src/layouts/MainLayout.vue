<template>
    <q-layout view="lHh LpR lff">
        <q-header bordered style="background-color: #aaaaaa9a; backdrop-filter: blur(3px)">
            <!--backdrop-filter: blur(5px);-->
            <q-toolbar>
                <q-toolbar-title class="row justify-between" :class="$q.dark.mode ? 'text-white' : 'text-black'">
                    <div class="row items-center">
                        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
                        <main-menu class="q-ml-md" />
                    </div>
                    <div class="flex j-mt-2">
                        <div class="j-mr-3">
                            <!--<q-btn flat dense label="하이웍스 로그인" @click="hlogin" />
                            <q-btn flat dense label="마이페이지" />-->
                            <q-btn flat dense label="로그아웃" @click="logout" />
                        </div>
                        <div>
                            <q-btn
                                dense
                                flat
                                round
                                :icon="$q.dark.mode ? 'las la-moon' : 'las la-sun'"
                                @click="$q.dark.toggle()"
                            />
                        </div>
                    </div>
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer :width="230" show-if-above v-model="leftDrawerOpen" side="left" bordered>
            <q-scroll-area
                :thumb-style="{ right: '0px', borderRadius: '2px', background: 'black', width: '5px', opacity: 0.2 }"
                class="fit"
            >
                <div
                    v-ripple:grey-7
                    class="q-px-md q-pt-md q-pb-sm relative-position cursor-pointer"
                    @click="$router.push({ name: 'main' })"
                >
                    <transition appear enter-active-class="animated bounceInDown slower">
                        <q-icon
                            name="bi-bar-chart-fill"
                            color="grey-9"
                            style="font-size: 0.9rem; top: 1rem; left: 11.9rem"
                            class="absolute text-grey animate__animated animate__animated animate__bounceInDown"
                        />
                    </transition>
                    <div class="j-ml-1">
                        <div
                            style="
                                font-family: LeferiPoint-BlackA, sans-serif;
                                font-size: 0.8rem;
                                padding-left: 0.1rem;
                                animation-delay: 0.2s;
                            "
                            class="text-grey-7 animate__animated animate__flipInX"
                        >
                            한국예술종합학교 산학협력단
                        </div>
                        <div
                            style="
                                font-family: LeferiPoint-BlackA, sans-serif;
                                font-size: 1.7rem;
                                animation-delay: 0.2s;
                            "
                            class="animate__animated animate__flipInX"
                        >
                            <span class="text-cyan">사업</span>
                            <span class="text-green-3">정보</span>
                            <span class="text-orange">시스템</span>
                        </div>
                    </div>
                </div>
            </q-scroll-area>
        </q-drawer>

        <q-page-container>
            <q-page class="q-pa-lg bg-grey-4">
                <!-- class="animate__animated animate__fadeIn animate__faster" -->

                <router-view v-slot="{ Component }">
                    <transition appear enter-active-class="animated fadeIn">
                        <component :is="Component" />
                    </transition>
                </router-view>

                <!--<transition appear enter-active-class="animated fadeIn">
                    <router-view />
                </transition>-->
            </q-page>
        </q-page-container>

        <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
            <q-btn round icon="keyboard_arrow_up" color="pink" />
        </q-page-scroller>
        <q-footer class="bg-grey-9 column items-center q-pa-md text-light">
            <span style="font-size: 1rem; color: #ffffff9a" class="text-body1 q-mb-xs text-weight-regular">
                한국예술종합학교 산학협력단
            </span>
            <span style="color: #ffffff9a" class="text-caption">
                <q-icon name="las la-map-marker" style="font-size: 0.8rem" />
                서울특별시 성북구 화랑로 32길 146-37
            </span>
        </q-footer>
    </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import MainMenu from '../pages/main/MainMenu.vue'

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
}
const logout = () => {
    console.log('~~')
}
</script>
