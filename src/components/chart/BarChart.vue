<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
    chartId: {
        type: String,
        default: 'bar-chart',
    },
    datasetIdKey: {
        type: String,
        default: 'label',
    },
    width: {
        type: Number,
        default: 400,
    },
    height: {
        type: Number,
        default: 250,
    },
    cssClasses: {
        default: '',
        type: String,
    },
    styles: {
        type: Object,
        default: () => {},
    },
    plugins: {
        type: Object,
        default: () => {},
    },
    chartData: {
        type: Object,
        default: () => ({
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{ data: [40, 39, 10, 40, 39, 80, 40] }],
        }),
    },
    chartOptions: {
        type: Object,
        default: () => ({
            responsive: true,
            maintainAspectRatio: true,
        }),
    },
})
</script>
<template>
    <Bar
        :chart-options="props.chartOptions"
        :chart-data="props.chartData"
        :chart-id="props.chartId"
        :dataset-id-key="props.datasetIdKey"
        :plugins="props.plugins"
        :css-classes="props.cssClasses"
        :styles="props.styles"
        :width="props.width"
        :height="props.height"
    />
</template>
