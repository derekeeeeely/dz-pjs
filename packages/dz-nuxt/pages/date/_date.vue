<template>
    <div></div>
</template>

<script>
    export default{
        validate ({ params }) {
            return !Object.is(new Date(params.date).toString(), 'Invalid Date')
        },
        async data() {
            return {
            }
        }
    }
</script>
