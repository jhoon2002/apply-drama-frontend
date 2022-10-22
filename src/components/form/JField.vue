<script setup></script>
<template>
    <q-field>
        <template #control="scope">
            <!--<pre>{{ scope }}</pre>
            <pre>{{ scope.emitValue }}</pre>
            <pre>{{ $attrs }}</pre>-->
            <input
                :value="scope.modelValue"
                @input="event => scope.emitValue(event.target.value)"
                class="q-field__native q-placeholder"
            />
        </template>
    </q-field>
</template>
