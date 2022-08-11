<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(route,index) of router.matched" :key="route.path">
      <router-link :to="route.path" v-if="index !== router.matched.length - 1">{{route.meta.title}}</router-link>
      <span v-else>{{route.meta.title}}</span>
    </el-breadcrumb-item>

  </el-breadcrumb>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter().currentRoute;
console.log(router);



</script>

<style lang="scss" scoped>
</style>