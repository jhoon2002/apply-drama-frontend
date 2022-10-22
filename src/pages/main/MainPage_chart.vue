<script setup>
import { Scatter, Bar, Line, Bubble } from 'vue-chartjs'
import { onMounted, ref } from 'vue'
import LineChart from 'components/chart/LineChart.vue'
import BarChart from 'components/chart/BarChart.vue'
import pattern from 'patternomaly'

const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
const chartData = ref({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Contract EA',
            data: [],
            borderColor: 'rgba(104, 179, 200, 1)',
            borderWidth: 4,
            // pointStyle: 'circle',
            // pointRadius: 3,
            // pointHoverRadius: 10,
            // fill: true,
            // fillColor: 'rgba(104, 179, 200, 1)',
            tension: 0.4,
            backgroundColor: 'rgba(104, 179, 200, 1)',
        },
        {
            label: 'Contract EA',
            data: [],
            borderColor: 'rgb(255,170,60)',
            borderWidth: 4,
            tension: 0.4,
            backgroundColor: 'rgb(255,170,60)',
        },
    ],
})

const chartOptions = ref({
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            align: 'start',
            labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                boxHeight: 5,
                pointStyleWidth: 7,
                maxWidth: 50,
                font: {
                    family: 'muli',
                    size: 13,
                    weight: 200,
                },
            },
        },
    },
    scales: {
        x: {
            ticks: {
                font: {
                    family: 'muli',
                    size: 13,
                    weight: 200,
                },
                color: '#9a9a9a',
                padding: 15,
            },
            grid: {
                display: false,
                drawBorder: false,
                drawOnChartArea: false,
                drawTicks: false,
            },
        },
        y: {
            ticks: {
                // 스타일링: https://www.chartjs.org/docs/latest/axes/styling.html
                font: {
                    family: 'muli',
                    size: 13,
                    weight: 200,
                },
                color: '#9a9a9a',
                padding: 15,
            },
            grid: {
                // 스타일링: https://www.chartjs.org/docs/latest/axes/styling.html
                drawBorder: false, // ticks 옆에 세로선
                color: '#DDDDDD',
                borderDash: [4, 2],
                lineWidth: 0.7,
                drawTicks: false, // Tick 옆에 그려지는 작은 Grid, true 일 경우, dash 를 그릴때 지져분해 짐, tickColor 를 이용하면 바로 보임
            },
            suggestedMin: 10,
            suggestedMax: 15,
        },
    },
})

const makeDate = () => {
    const arr = []
    for (let i = 0; i < 12; i++) {
        arr.push(rand(300, 750))
    }
    chartData.value.datasets[0].data = arr
    const arr2 = []
    for (let i = 0; i < 12; i++) {
        arr2.push(rand(200, 500))
    }
    chartData.value.datasets[1].data = arr2
}
onMounted(() => {
    makeDate()
})
</script>
<template>
    <div class="row q-col-gutter-md">
        <div class="col-6">
            <q-card>
                <q-card-section>
                    <div class="text-h4 q-mb-lg text-grey-7">
                        <span class="text-weight-light">2022 간접비</span>
                        <q-btn label="Random" flat size="sm" @click="makeDate" />
                    </div>
                    <line-chart chart-id="linechart1" :chart-data="chartData" :chart-options="chartOptions" />
                </q-card-section>
            </q-card>
        </div>
        <div class="col-6">
            <q-card>
                <q-card-section> 2 </q-card-section>
            </q-card>
        </div>
    </div>
</template>
