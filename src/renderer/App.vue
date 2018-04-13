<template>
    <div id="app">
        <div class="header">
            <Nav></Nav>
        </div>
        <router-view></router-view>
    </div>

</template>

<script>
    import Nav from './components/Nav.vue'

    export default {
        name: 'yande',
        components: {
            Nav
        }
    }
</script>

<style lang="less">
    /*@import './iview-theme/index.less';*/

</style>
