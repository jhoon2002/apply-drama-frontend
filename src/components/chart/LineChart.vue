<script setup>
import { ref } from 'vue'
import { Line } from 'vue-chartjs'
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale)

const props = defineProps({
    chartId: {
        type: String,
        default: 'line-chart',
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
        type: Array,
        default: () => [],
    },
    chartData: {
        type: Object,
        default: () => ({
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Data One',
                    backgroundColor: '#f87979',
                    data: [40, 39, 10, 40, 39, 80, 40],
                },
            ],
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

// const chartData = ref({
//     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//     datasets: [
//         {
//             label: 'Data One',
//             backgroundColor: '#f87979',
//             data: [40, 39, 10, 40, 39, 80, 40],
//         },
//     ],
// })

// const chartOptions = ref({
//     responsive: true,
//     maintainAspectRatio: true,
// })
</script>
<template>
    <Line
        :chart-data="chartData"
        :chart-options="chartOptions"
        :chart-id="props.chartId"
        :width="props.width"
        :height="props.height"
        :cssClasses="props.cssClasses"
        :styles="props.styles"
        :plugins="props.plugins"
    />
</template>
