<script>
//Composition Function
//https://v3.ko.vuejs.org/guide/composition-api-introduction.html#%E1%84%83%E1%85%A9%E1%86%A8%E1%84%85%E1%85%B5%E1%86%B8%E1%84%92%E1%85%A7%E1%86%BC-computed-%E1%84%89%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A5%E1%86%BC
export default function doTime(user) {
    setTimeout(() => {
        user.name = '아무개'
    }, 3000)
}
</script>
