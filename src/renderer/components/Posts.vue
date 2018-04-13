<template>
    <div id="wrapper">
        <div class="header">
            <div class="left-group">
                <Input v-model="searchText" icon="search" placeholder="search tags" style="width: 200px"
                       clearable
                       @on-enter="search"
                       @on-click="search"/>
            </div>
            <div class="right-group">
                <span v-if="selectedPosts.length" class="selected-count">{{selectedPosts.length}}</span>

                <Button type="text" size="small" @click="selectAll">选择全部</Button>

                <Button class="btn-download" type="primary" @click="download" :disabled="downloading">
                    <Icon v-if="downloading" type="load-c" size="18" class="demo-spin-icon-load"></Icon>
                    <span v-else="!downloading">
                        <Icon class="tip-icon" type="archive"></Icon>
                        下载
                    </span>
                </Button>

                <Button class="btn-open-folder" type="primary" @click="openDownloadFolder">
                    <Icon class="tip-icon" type="ios-folder-outline"></Icon>
                    打开
                </Button>
            </div>
        </div>
        <div class="divider"></div>
        <div class="main">
            <div v-for="post in posts" class="image-wrapper" :class="isSelected(post)" @click="selectImage(post)">
                <img :src="post.preview_url"/>
                <div v-if="isSelected(post)" class="selected-icon">
                    <Icon type="checkmark"></Icon>
                </div>
            </div>
        </div>


        <div class="right-fixed-wrapper">
            <div @click="scrollToTop">
                <Icon class="right-fixed-icon" type="arrow-up-a"></Icon>
            </div>
            <div v-if="downloading" style="margin-top: 20px;">
                <Icon class="demo-spin-icon-load right-fixed-icon" type="load-c"></Icon>
            </div>
            <div v-else="!downloading" @click="download" style="margin-top: 20px;">
                <Icon class="right-fixed-icon" type="archive"></Icon>
            </div>
        </div>

        <div class="pagination-wrapper">
            <Pagination class="pagination" :page="currentPage" @change="addPosts"></Pagination>
        </div>
    </div>
</template>

<script>
    import Pagination from './Pagination.vue'
    import {downloadPackage, getPostJson, download} from '../../lib/spider'

    const path = require('path')
    const fs = require('fs')
    const {shell, remote} = require('electron')
    const {app} = remote

    export default {
        name: 'posts',
        data() {
            return {
                downloading: false,
                isAll: false,
                posts: [],
                selectedPosts: [],
                currentPage: 1,
                searchText: ''
            }
        },
        async created() {
            this.$Loading.start();
            this.posts = await getPostJson()
            this.$Loading.finish();
        },
        computed: {},
        methods: {
            isSelected(post) {
                return this.selectedPosts.find(selectedPost => post.md5 === selectedPost.md5) ?
                    'selected-post' : null
            },
            async download() {
                this.downloading = true
                await download(this.selectedPosts)
                this.downloading = false
                this.$Message.success('下载完成')

            },
            selectImage(post) {
                this.selectedPosts.find(selectedPost => post.md5 === selectedPost.md5) ?
                    this.selectedPosts = this.selectedPosts.filter(selectedPost => post.md5 !== selectedPost.md5) :
                    this.selectedPosts.push(post)
            },
            async addPosts(payload) {
                this.$Loading.start();
                this.currentPage = payload.page
                window.scrollTo(0, document.body.scrollHeight)
                let newPosts = await getPostJson(this.currentPage, this.searchText)
                this.posts = this.posts.filter(post => !newPosts.find(newPost => newPost.md5 === post.md5)).concat(newPosts)
                this.$Loading.finish();
            },
            scrollToTop() {
                window.scrollTo(0, 0)
            },
            openDownloadFolder() {
                let downloadPath = path.join(app.getAppPath(), '../..', 'downloads')
                try {
                    fs.accessSync(downloadPath)
                } catch (e) {
                    fs.mkdirSync(downloadPath)
                }
                shell.openExternal(downloadPath)
            },
            selectAll() {
                if (this.isAll) {
                    this.selectedPosts = []
                } else {
                    this.selectedPosts = this.posts
                }
                this.isAll = !this.isAll
            },
            async search(e) {
                this.$Loading.start();
                this.currentPage = 1
                this.posts = await getPostJson(1, this.searchText)
                this.$Loading.finish();
            }
        },
        components: {
            Pagination
        }
    }

</script>

<style scoped lang="scss">

    .header {
        position: relative;
        height: 35px;
    }

    .divider {
        height: 5px;
        border-top: 1px solid $extra-light-red;
    }

    .left-group {
        margin-left: 10%;
        display: inline-block;
    }

    .right-group {
        display: inline-block;
        position: absolute;
        right: 10%;
    }

    .btn-download {
        position: relative;
        margin-right: 20px;
        width: 70px;
    }

    .selected-count {
        display: inline-block;
        text-align: center;
        background: $extra-light-red;
        min-width: 30px;
        height: 18px;
        border-radius: 10px;
    }

    .btn-open-folder {
        margin-right: 20px;
        width: 70px;
    }

    .main {
        position: relative;
    }

    .image-wrapper {
        position: relative;
        display: inline-block;
    }

    .selected-post {
        box-shadow: 0 0 5px 2px $hover-red;
    }

    .selected-icon {
        position: absolute;
        right: 0;
        top: 0;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background: $hover-red;

        text-align: center;
        > i {
            margin-top: 4px;
            color: white;
        }
    }

    .pagination-wrapper {
        position: fixed;
        right: 10px;
        bottom: 10px;
    }

    .pagination {
        background: rgba(255, 255, 255, 0.8);
        display: inline-block;
        box-shadow: 0 0 10px 2px $extra-light-red;
        padding-right: 10px;
    }

    .right-fixed-icon {
        color: $hover-red;
        font-size: 42px;
        cursor: pointer;

        &:hover {
            color: $active-red;
        }
    }

    .right-fixed-wrapper {
        position: fixed;
        right: 20px;
        bottom: 20%;
    }

    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    @keyframes ani-demo-spin {
        from {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .tip-icon {
        padding-right: 5px
    }
</style>
