<script setup>
const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    menus: {
        type: Array,
    },
    width: {
        type: String,
    },
    to: {
        type: String,
    },
    icon: {
        type: String,
    },
})
</script>
<template>
    <q-btn
        flat
        :label="props.label"
        class="text-body1"
        @click="props.to ? $router.push(props.to) : null"
        style="border-radius: 0; height: 50px"
    >
        <q-menu>
            <q-list :style="{ minWidth: `${props.width}px` }">
                <template v-for="menu in props.menus" :key="menu.name">
                    <q-item clickable v-close-popup :to="menu.path">
                        <q-item-section v-if="menu.icon" avatar style="min-width: 30px">
                            <q-icon :name="menu.icon" />
                        </q-item-section>
                        <q-item-section class="text-body2">{{ menu.name }}</q-item-section>
                    </q-item>
                    <q-separator />
                </template>
            </q-list>
        </q-menu>
    </q-btn>
</template>
