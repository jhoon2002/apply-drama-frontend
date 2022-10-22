<script>
export default {
    name: 'GlobalNav',
    inheritAttrs: false,
    customOptions: {},
    props: {
        items: {
            type: Array,
            required: true,
        },
    },
}
</script>
<template>
    <q-list>
        <template v-for="item in items">
            <q-expansion-item
                v-if="item.children"
                :key="item.path"
                :label="item.name"
                :content-inset-level="0.5"
                class="text-body1"
            >
                <template v-slot:header>
                    <q-item-section avatar style="min-width: 30px">
                        <q-icon :name="item.icon" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label
                            :class="
                                $route.matched.map(i => i.path).filter(i => i === item.path).length > 0
                                    ? 'expand-active'
                                    : null
                            "
                        >
                            {{ item.name }}
                        </q-item-label>
                    </q-item-section>
                </template>
                <global-nav :items="item.children.filter(i => !i.hidden)" />
            </q-expansion-item>
            <q-item v-else :key="item.path" :to="item.path ? item.path : '/'">
                <q-item-section v-if="item.icon" avatar style="min-width: 30px">
                    <q-icon :name="item.icon" />
                </q-item-section>
                <q-item-section>
                    <q-item-label class="text-body1">{{ item.name }}</q-item-label>
                </q-item-section>
            </q-item>
        </template>
    </q-list>
</template>

<style lang="scss" scoped>
.expand-active {
    color: $primary;
}
</style>
