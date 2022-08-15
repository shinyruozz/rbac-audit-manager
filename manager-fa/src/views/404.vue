<template>
    <div class="error-wrap">
        <h1 class="err-title">
            <strong>404</strong>找不到页面点击<el-button href="javascript:;" @click="$router.back()">返回</el-button>
        </h1>
    </div>
</template>

<style lang="scss" scoped>
.error-wrap {
    height: 100vh;


    .err-title {
        padding: 200px;
        text-align: center;
        font-size: 40px;

    }

    strong {
        font-weight: 600;
        font-size: 50px;
    }
}
</style>