import { h } from 'vue'
// import { createComponent } from 'quasar/src/utils/private/create.js'

export default {
    props: {
        compoJsName: {
            type: String,
            default: '컴포넌트.props(.js)',
        },
        compoJsHeight: Number,
        compoJsWeight: [String, Number],
    },
    setup(props) {
        return h('div')
    },
}
