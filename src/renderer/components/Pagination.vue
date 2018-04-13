<template>
    <div id="pagination">
        <div class="left">
            <div class="icon-wrapper" @click="changePageOne(-1)">
                <Icon class="icon" type="chevron-left"></Icon>
            </div>
            <Input title="" class="to-page" :value="currentPage" size="small" @on-enter="changePage"/>
            <div class="icon-wrapper" @click="changePageOne(1)">
                <Icon class="icon" type="chevron-right"></Icon>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'pagination',
        props: ['page'],
        computed: {
            currentPage() {
                return Number(this.page)
            }
        },
        methods: {

            changePage(e) {
                let currentPage = Number(e.target.value)
                this.$emit('change', {page: currentPage})
            },
            changePageOne(step) {
                let currentPage = this.currentPage + step
                this.$emit('change', {page: currentPage})
            }
        }
    }

</script>

<style scoped lang="scss">
    #pagination {
        height: 30px;
    }

    .left {
        display: inline-block;
        vertical-align: middle;
    }

    .right {
        display: inline-block;
        vertical-align: middle;
    }

    .icon {
        font-size: 14px;
        font-weight: lighter;
        color: #373737;
    }

    .icon-wrapper {
        display: inline-block;
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        &:hover {
            background: $hover-red
        }
    }

    .active {
        background: $active-red;
    }

    .number-wrapper {
        display: inline-block;
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        &:hover {
            background: $hover-red
        }
    }

    .to-page {
        margin-left: 5px;
        width: 50px;
    }
</style>
