<template>
  <template v-for="item of menuList" >
    <el-sub-menu
      v-if="item.children && item.children.length > 0 && item.children[0].menuType == 1"
      :index="item.path"
      :key="item._id"
    >
      <template #title>
        <el-icon v-if="item.icon">
          <component :is="item.icon"></component>
        </el-icon>
        {{item.menuName}}
      </template>
      <menu-tree :menuList="item.children"></menu-tree>
    </el-sub-menu>
    <el-menu-item  :index="item.path" v-else-if="item.menuType==1">
      <el-icon v-if="item.icon">
          <component :is="item.icon"></component>
        </el-icon>
      {{item.menuName}}
    </el-menu-item>
  </template>
</template>

<script>

export default {
  name: "MenuTree",
  props: {
    menuList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style>
</style>